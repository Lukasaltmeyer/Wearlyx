/**
 * Real canvas-based photo enhancement.
 * Applies subtle, natural-looking improvements:
 *   - Adaptive brightness lift (shadows only, preserves highlights)
 *   - Gentle contrast boost
 *   - Slight saturation enhancement
 *   - Unsharp mask for natural sharpness
 *   - Mild noise reduction (bilateral-style blur on uniform areas)
 *
 * Goal: improve quality while keeping the photo realistic.
 */

export interface EnhanceOptions {
  brightness: number;   // 0–100, default 30
  contrast: number;     // 0–100, default 25
  saturation: number;   // 0–100, default 20
  sharpness: number;    // 0–100, default 40
  denoise: number;      // 0–100, default 20
}

export const DEFAULT_OPTIONS: EnhanceOptions = {
  brightness: 30,
  contrast: 25,
  saturation: 20,
  sharpness: 40,
  denoise: 20,
};

/** Load a File/Blob into an HTMLImageElement */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/** Clamp value to [0, 255] */
const clamp = (v: number) => Math.max(0, Math.min(255, v));

/** Apply 3×3 convolution kernel to a single channel */
function convolve(
  src: Uint8ClampedArray,
  dst: Uint8ClampedArray,
  w: number,
  h: number,
  kernel: number[],
  channel: number,
  divisor = 1,
  offset = 0
) {
  const stride = 4;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let sum = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const px = ((y + ky) * w + (x + kx)) * stride + channel;
          sum += src[px] * kernel[(ky + 1) * 3 + (kx + 1)];
        }
      }
      const idx = (y * w + x) * stride + channel;
      dst[idx] = clamp(sum / divisor + offset);
    }
  }
}

/** Gaussian blur 3×3 for denoising */
const GAUSSIAN: number[] = [1, 2, 1, 2, 4, 2, 1, 2, 1];

/** Unsharp mask: sharpen = original + amount*(original - blurred) */
function unsharpMask(
  original: Uint8ClampedArray,
  blurred: Uint8ClampedArray,
  out: Uint8ClampedArray,
  len: number,
  amount: number // 0.0–1.0
) {
  for (let i = 0; i < len; i += 4) {
    for (let c = 0; c < 3; c++) {
      const diff = original[i + c] - blurred[i + c];
      out[i + c] = clamp(original[i + c] + amount * diff);
    }
    out[i + 3] = original[i + 3]; // preserve alpha
  }
}

/** RGB → HSL */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, s, l];
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

/** HSL → RGB */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1/3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1/3) * 255),
  ];
}

/** Main enhancement function — returns a data URL of the enhanced image */
export async function enhancePhoto(
  file: File,
  opts: EnhanceOptions = DEFAULT_OPTIONS,
  onProgress?: (pct: number) => void
): Promise<string> {
  onProgress?.(5);
  const img = await loadImage(file);
  onProgress?.(15);

  // Work at max 1200px to keep it fast on mobile
  const MAX = 1200;
  const scale = Math.min(1, MAX / Math.max(img.width, img.height));
  const W = Math.round(img.width * scale);
  const H = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, W, H);
  URL.revokeObjectURL(img.src);

  const imageData = ctx.getImageData(0, 0, W, H);
  const data = imageData.data;
  const total = data.length;
  onProgress?.(25);

  // ── 1. Brightness / Contrast / Saturation (pixel pass) ──────────────────
  const brightnessAmt = (opts.brightness / 100) * 35;   // max +35 px lift
  const contrastAmt   = 1 + (opts.contrast / 100) * 0.25; // max ×1.25
  const satAmt        = 1 + (opts.saturation / 100) * 0.35; // max ×1.35

  for (let i = 0; i < total; i += 4) {
    let r = data[i], g = data[i + 1], b = data[i + 2];

    // Adaptive brightness: lift shadows more than highlights
    const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    const shadowBoost = brightnessAmt * (1 - lum) * 0.8; // less boost on bright areas
    r = clamp(r + shadowBoost);
    g = clamp(g + shadowBoost);
    b = clamp(b + shadowBoost);

    // Contrast (S-curve approximation)
    r = clamp((r - 128) * contrastAmt + 128);
    g = clamp((g - 128) * contrastAmt + 128);
    b = clamp((b - 128) * contrastAmt + 128);

    // Saturation via HSL
    if (satAmt !== 1) {
      const [h, s, l] = rgbToHsl(r, g, b);
      const newS = Math.min(1, s * satAmt);
      [r, g, b] = hslToRgb(h, newS, l);
    }

    data[i] = r; data[i + 1] = g; data[i + 2] = b;
  }
  onProgress?.(50);

  // ── 2. Denoise: gaussian blur on a copy ──────────────────────────────────
  const denoiseStrength = opts.denoise / 100;
  let workData = new Uint8ClampedArray(data);

  if (denoiseStrength > 0) {
    const blurred = new Uint8ClampedArray(data);
    for (let c = 0; c < 3; c++) {
      convolve(data, blurred, W, H, GAUSSIAN, c, 16);
    }
    // Blend: only denoise in flat/uniform areas (small local variance)
    // Simplified: just mix original + blurred by denoise strength * 0.4 (subtle)
    const blendAmt = denoiseStrength * 0.4;
    for (let i = 0; i < total; i += 4) {
      for (let c = 0; c < 3; c++) {
        workData[i + c] = clamp(data[i + c] * (1 - blendAmt) + blurred[i + c] * blendAmt);
      }
    }
  }
  onProgress?.(70);

  // ── 3. Unsharp mask for natural sharpness ────────────────────────────────
  const sharpAmt = (opts.sharpness / 100) * 0.7; // max 0.7 (subtle)
  if (sharpAmt > 0) {
    // Blur the denoised version
    const blurredForSharp = new Uint8ClampedArray(workData);
    for (let c = 0; c < 3; c++) {
      convolve(workData, blurredForSharp, W, H, GAUSSIAN, c, 16);
    }
    const sharpened = new Uint8ClampedArray(workData);
    unsharpMask(workData, blurredForSharp, sharpened, total, sharpAmt);
    workData = sharpened;
  }
  onProgress?.(90);

  // Write back
  for (let i = 0; i < total; i++) {
    imageData.data[i] = workData[i];
  }
  ctx.putImageData(imageData, 0, 0);
  onProgress?.(100);

  return canvas.toDataURL("image/jpeg", 0.93);
}
