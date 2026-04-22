"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Upload, Sparkles, Download, RefreshCw, Sliders, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { BeforeAfterSlider } from "@/components/ai/BeforeAfterSlider";
import { UsageCounter } from "@/components/ai/UsageCounter";
import { UpgradePopup } from "@/components/ai/UpgradePopup";
import { enhancePhoto, DEFAULT_OPTIONS, type EnhanceOptions } from "@/lib/enhance-photo";
import { canEnhance, recordEnhancement, type UsageData } from "@/lib/usage";

// ─── Upload zone ──────────────────────────────────────────────────────────────
function UploadZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handle = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files)
      .filter((f) => f.type === "image/jpeg" || f.type === "image/png")
      .slice(0, 5);
    if (valid.length) onFiles(valid);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200 ${
        dragging ? "border-[#6C63FF] bg-[#6C63FF]/10 scale-[0.99]" : "border-white/12 bg-white/4 hover:border-white/22 hover:bg-white/6"
      }`}
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6C63FF]/20 to-[#C084FC]/20 border border-[#6C63FF]/25 flex items-center justify-center">
        <Upload className="w-7 h-7 text-[#a78bfa]" />
      </div>
      <div className="text-center">
        <p className="text-[15px] font-bold text-white">Clique ou glisse tes photos</p>
        <p className="text-[12px] text-white/35 mt-1">JPG, PNG · jusqu&apos;à 5 photos</p>
      </div>
      <div className="flex gap-2 text-[11px] text-white/30">
        <span className="px-2.5 py-1 rounded-full border border-white/8 bg-white/4">Luminosité</span>
        <span className="px-2.5 py-1 rounded-full border border-white/8 bg-white/4">Netteté</span>
        <span className="px-2.5 py-1 rounded-full border border-white/8 bg-white/4">Couleurs</span>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" multiple className="hidden"
        onChange={(e) => handle(e.target.files)} />
    </div>
  );
}

// ─── Option slider ────────────────────────────────────────────────────────────
function OptionSlider({ label, value, onChange, icon }: {
  label: string; value: number; onChange: (v: number) => void; icon: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-6 text-center flex-shrink-0">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-[12px] text-white/60 font-medium">{label}</span>
          <span className="text-[12px] text-[#a78bfa] font-semibold">{value}%</span>
        </div>
        <input
          type="range" min={0} max={100} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6C63FF ${value}%, rgba(255,255,255,0.1) ${value}%)`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ pct }: { pct: number }) {
  const steps = ["Analyse…", "Luminosité…", "Contraste…", "Netteté…", "Finition…"];
  const stepIdx = Math.min(Math.floor(pct / 20), steps.length - 1);

  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-[#6C63FF]/15 animate-pulse" />
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="40" cy="40" r="34" fill="none" stroke="url(#grad)" strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6C63FF" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[13px] font-bold text-white">{pct}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[14px] font-semibold text-white">Amélioration en cours</p>
        <p className="text-[12px] text-[#a78bfa] mt-1">{steps[stepIdx]}</p>
      </div>
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────
interface ResultItem {
  file: File;
  original: string;
  enhanced: string;
}

function ResultCard({ item, onReenhance }: { item: ResultItem; onReenhance: () => void }) {
  const download = () => {
    const a = document.createElement("a");
    a.href = item.enhanced;
    a.download = `wearlyx-enhanced-${item.file.name}`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-3">
      <BeforeAfterSlider before={item.original} after={item.enhanced} />
      <div className="flex gap-2">
        <button onClick={onReenhance}
          className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl border border-white/10 bg-white/5 text-[13px] text-white/60 hover:bg-white/8 transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Refaire
        </button>
        <button onClick={download}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#6C63FF] text-[14px] font-semibold text-white shadow-lg shadow-[#6C63FF]/25 transition-all active:scale-[0.98]">
          <Download className="w-4 h-4" /> Télécharger
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function EnhancePage() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [opts, setOpts] = useState<EnhanceOptions>(DEFAULT_OPTIONS);
  const [showOpts, setShowOpts] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const setOpt = (key: keyof EnhanceOptions, val: number) =>
    setOpts((o) => ({ ...o, [key]: val }));

  const enhance = useCallback(async (files?: File[]) => {
    const targets = files ?? photos;
    if (!targets.length) return;

    // Check usage limit
    const { allowed, usage: currentUsage } = await canEnhance();
    if (currentUsage) setUsage(currentUsage);
    if (!allowed) { setShowUpgrade(true); return; }

    setProcessing(true);
    setProgress(0);
    setError("");
    setResults([]);

    try {
      const newResults: ResultItem[] = [];
      for (let i = 0; i < targets.length; i++) {
        const file = targets[i];
        const originalUrl = URL.createObjectURL(file);
        const enhancedUrl = await enhancePhoto(file, opts, (pct) => {
          setProgress(Math.round((i / targets.length) * 100 + pct / targets.length));
        });
        newResults.push({ file, original: originalUrl, enhanced: enhancedUrl });
        setResults([...newResults]);
        // Record each enhancement
        await recordEnhancement(1);
      }
      setProgress(100);
      // Refresh usage after
      const { usage: newUsage } = await canEnhance();
      if (newUsage) setUsage(newUsage);
    } catch (e: any) {
      setError("Erreur lors de l'amélioration. Réessaie.");
    } finally {
      setProcessing(false);
    }
  }, [photos, opts]);

  const reset = () => {
    setPhotos([]); setResults([]); setProgress(0); setError("");
  };

  const hasResults = results.length > 0;

  return (
    <div className="min-h-[100dvh] bg-[#0A0A10] flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <Link href="/sell"
          className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#C084FC] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-[17px] font-black text-white">Amélioration Photo IA</h1>
          </div>
          <p className="text-[12px] text-white/35 mt-0.5">Améliore tes photos sans perdre le réalisme</p>
        </div>
        {/* Plan badge */}
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#6C63FF]/15 text-[#a78bfa] border border-[#6C63FF]/25 flex-shrink-0">
          🆓 5/mois
        </span>
      </div>

      {/* Upgrade popup */}
      {showUpgrade && usage && (
        <UpgradePopup currentPlan={usage.plan} onClose={() => setShowUpgrade(false)} />
      )}

      <div className="flex-1 px-4 flex flex-col gap-4">

        {/* Usage counter */}
        <UsageCounter onUsageLoaded={setUsage} />

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* No photos yet */}
        {!photos.length && !hasResults && (
          <>
            <UploadZone onFiles={(f) => { setPhotos(f); setResults([]); }} />

            {/* What it does */}
            <div className="rounded-2xl border border-white/6 bg-white/3 p-4 flex flex-col gap-3">
              <p className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Ce que l&apos;IA améliore</p>
              {[
                ["☀️", "Luminosité adaptative", "Éclaircit les zones sombres sans brûler les hautes lumières"],
                ["🎨", "Correction des couleurs", "Renforce légèrement les teintes sans les dénaturer"],
                ["🔍", "Netteté naturelle", "Affine les détails du tissu sans effet artificiel"],
                ["🌫️", "Réduction du bruit", "Lisse les grains de capteur en gardant les textures"],
              ].map(([icon, title, desc]) => (
                <div key={title} className="flex gap-3">
                  <span className="text-base flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-white/80">{title}</p>
                    <p className="text-[11px] text-white/35 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Photos selected, not yet processing */}
        {photos.length > 0 && !processing && !hasResults && (
          <>
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {photos.map((f, i) => (
                <div key={i} onClick={() => setSelectedIdx(i)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedIdx === i ? "border-[#6C63FF]" : "border-white/10"
                  }`}>
                  <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="" />
                  {selectedIdx === i && (
                    <div className="absolute inset-0 bg-[#6C63FF]/20 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">✓</span>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={reset}
                className="flex-shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed border-white/12 bg-white/4 flex items-center justify-center text-white/30 hover:border-white/20 transition-all">
                <span className="text-2xl">+</span>
              </button>
            </div>

            {/* Options */}
            <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden">
              <button
                onClick={() => setShowOpts((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-white/40" />
                  <span className="text-[13px] font-semibold text-white/70">Paramètres d&apos;amélioration</span>
                </div>
                {showOpts ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
              </button>
              {showOpts && (
                <div className="px-4 pb-4 flex flex-col gap-4 border-t border-white/6 pt-3">
                  <OptionSlider label="Luminosité" value={opts.brightness} onChange={(v) => setOpt("brightness", v)} icon="☀️" />
                  <OptionSlider label="Contraste"  value={opts.contrast}   onChange={(v) => setOpt("contrast", v)}   icon="◑" />
                  <OptionSlider label="Saturation" value={opts.saturation} onChange={(v) => setOpt("saturation", v)} icon="🎨" />
                  <OptionSlider label="Netteté"    value={opts.sharpness}  onChange={(v) => setOpt("sharpness", v)}  icon="🔍" />
                  <OptionSlider label="Débruitage" value={opts.denoise}    onChange={(v) => setOpt("denoise", v)}    icon="🌫️" />
                  <button onClick={() => setOpts(DEFAULT_OPTIONS)}
                    className="self-end text-[12px] text-white/30 hover:text-white/60 transition-colors">
                    Réinitialiser
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => enhance()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#C084FC] text-[15px] font-bold text-white shadow-lg shadow-[#6C63FF]/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Améliorer {photos.length > 1 ? `${photos.length} photos` : "la photo"}
            </button>
          </>
        )}

        {/* Processing */}
        {processing && <ProgressBar pct={progress} />}

        {/* Results */}
        {hasResults && !processing && (
          <>
            {/* Tab selector if multiple */}
            {results.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {results.map((r, i) => (
                  <button key={i} onClick={() => setSelectedIdx(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedIdx === i ? "border-[#6C63FF]" : "border-white/10 opacity-60"
                    }`}>
                    <img src={r.enhanced} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}

            {results[selectedIdx] && (
              <ResultCard
                item={results[selectedIdx]}
                onReenhance={() => enhance([results[selectedIdx].file])}
              />
            )}

            <button onClick={reset}
              className="w-full py-3.5 rounded-2xl border border-white/10 bg-white/5 text-[14px] font-semibold text-white/60 transition-all hover:bg-white/8">
              ← Améliorer d&apos;autres photos
            </button>
          </>
        )}
      </div>
    </div>
  );
}
