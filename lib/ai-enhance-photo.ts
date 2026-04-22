"use client";

export const STYLE_COLORS: Record<string, string> = {
  fond_blanc:  "#FFFFFF",
  rose_pastel: "#F9D0DF",
  noir_luxe:   "#0D0D14",
  bleu_ciel:   "#D6EEF8",
  lavande:     "#E8E0F5",
  sable:       "#EDE0CC",
};

const SHADOW_COLORS: Record<string, string> = {
  fond_blanc:  "rgba(0,0,0,0.18)",
  rose_pastel: "rgba(180,80,100,0.22)",
  noir_luxe:   "rgba(0,0,0,0.85)",
  bleu_ciel:   "rgba(50,120,180,0.2)",
  lavande:     "rgba(100,70,160,0.22)",
  sable:       "rgba(120,90,50,0.22)",
};

// Step 1 : upscale + débruitage via Replicate (server-side)
async function upscaleWithReplicate(file: File): Promise<File> {
  const fd = new FormData();
  fd.append("photo", file);
  const res = await fetch("/api/enhance-photo", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Replicate error");
  const data = await res.json();
  if (data.error) throw new Error(data.error);

  // data.image est un data URL base64
  const fetchRes = await fetch(data.image);
  const blob = await fetchRes.blob();
  return new File([blob], file.name.replace(/\.[^.]+$/, ".png"), { type: "image/png" });
}

// Step 2 : suppression fond + composition sur fond stylé (client-side)
export async function enhanceWithBackground(file: File, style: string): Promise<File> {
  // 1. Upscale & quality boost via Replicate
  let enhanced = file;
  try {
    enhanced = await upscaleWithReplicate(file);
  } catch {
    // Si Replicate échoue, on continue avec l'original
  }

  // 2. Suppression du fond
  const { removeBackground } = await import("@imgly/background-removal");
  const blob = await removeBackground(enhanced, {
    output: { format: "image/png", quality: 1.0 },
  });

  // 3. Composition sur fond stylé
  const result = await composeOnBackground(blob, style);
  return new File([result], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
}

async function composeOnBackground(foreground: Blob, style: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const SIZE = 1200;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d")!;

      const bgColor = STYLE_COLORS[style] ?? "#FFFFFF";
      const shadowColor = SHADOW_COLORS[style] ?? "rgba(0,0,0,0.18)";

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Studio light
      const studioLight = ctx.createRadialGradient(SIZE / 2, SIZE * 0.1, 0, SIZE / 2, SIZE / 2, SIZE * 0.8);
      studioLight.addColorStop(0, "rgba(255,255,255,0.22)");
      studioLight.addColorStop(0.6, "rgba(255,255,255,0.04)");
      studioLight.addColorStop(1, "rgba(0,0,0,0.07)");
      ctx.fillStyle = studioLight;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Scale and center
      const padding = SIZE * 0.1;
      const scale = Math.min((SIZE - padding * 2) / img.width, (SIZE - padding * 2) / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (SIZE - w) / 2;
      const y = (SIZE - h) / 2 - SIZE * 0.025;

      // Drop shadow
      ctx.save();
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = 70;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 25;
      ctx.globalAlpha = 0.6;
      ctx.drawImage(img, x, y, w, h);
      ctx.restore();

      // Garment
      ctx.drawImage(img, x, y, w, h);

      // Floor shadow
      const cx = SIZE / 2;
      const cy = y + h + SIZE * 0.012;
      const rx = w * 0.35;
      const ry = SIZE * 0.018;
      const floorGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      const shadowAlpha = shadowColor.includes("0.8") ? "0.45" : "0.22";
      floorGrad.addColorStop(0, shadowColor.replace(/[\d.]+\)$/, `${shadowAlpha})`));
      floorGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.scale(1, ry / rx);
      ctx.fillStyle = floorGrad;
      ctx.beginPath();
      ctx.arc(cx, cy * (rx / ry), rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Vignette
      const vignette = ctx.createRadialGradient(SIZE / 2, SIZE / 2, SIZE * 0.3, SIZE / 2, SIZE / 2, SIZE * 0.76);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.08)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, SIZE, SIZE);

      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Canvas error"))),
        "image/jpeg",
        0.96
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(foreground);
  });
}
