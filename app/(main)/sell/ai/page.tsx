"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Sparkles, Zap, RefreshCw, Check, ChevronRight,
  ImagePlus, X, Upload, Edit3, Package, Tag
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { enhanceWithBackground } from "@/lib/ai-enhance-photo";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AIResult {
  title: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  size: string;
  tags: string[];
}

// ─── Styles disponibles ───────────────────────────────────────────────────────

const STYLES = [
  { id: "fond_blanc",    label: "Fond blanc",    color: "#F0F0F0", emoji: "🩶", desc: "E-commerce" },
  { id: "rose_pastel",   label: "Rose pastel",   color: "#F4A7C0", emoji: "🩷", desc: "Girly" },
  { id: "noir_luxe",     label: "Noir luxe",     color: "#1A1A2E", emoji: "🖤", desc: "Premium" },
  { id: "bleu_ciel",     label: "Bleu ciel",     color: "#7EC8E3", emoji: "💙", desc: "Frais" },
  { id: "lavande",       label: "Lavande",        color: "#A48FD4", emoji: "💜", desc: "Élégant" },
  { id: "sable",         label: "Sable",          color: "#C4A882", emoji: "🤎", desc: "Naturel" },
];

// ─── Progress steps ───────────────────────────────────────────────────────────

const STEPS = ["Photo", "Style", "Génération", "Édition", "Publication"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 px-4 py-3">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
              i < current ? "bg-[#8B5CF6] text-white" :
              i === current ? "bg-[#8B5CF6]/20 border-2 border-[#8B5CF6] text-[#A78BFA]" :
              "bg-white/8 text-white/20"
            }`}>
              {i < current ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            <span className={`text-[9px] font-semibold mt-1 whitespace-nowrap ${
              i === current ? "text-[#A78BFA]" : i < current ? "text-white/50" : "text-white/15"
            }`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-1 mb-4 ${i < current ? "bg-[#8B5CF6]/60" : "bg-white/8"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Generating screen ────────────────────────────────────────────────────────

function GeneratingScreen({ phase }: { phase: "photo" | "listing" }) {
  const steps = phase === "photo"
    ? ["Analyse de la photo…", "Amélioration lumière…", "Netteté & couleurs…", "Optimisation finale…"]
    : ["Détection de la marque…", "Estimation du prix marché…", "Rédaction du titre…", "Génération description…", "Finalisation…"];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 gap-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-[#8B5CF6]/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-[#8B5CF6]/30 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/40">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-[18px] font-black text-white">
          {phase === "photo" ? "Amélioration photo IA" : "Génération annonce IA"}
        </p>
        <p className="text-[13px] text-white/40 mt-1">Quelques secondes…</p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[240px]">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#8B5CF6]/30 border border-[#8B5CF6]/50 flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse" />
            </div>
            <p className="text-[12px] text-white/50">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Field editor ─────────────────────────────────────────────────────────────

function Field({ label, value, onChange, multiline, onRegenerate, regenerating }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; onRegenerate?: () => void; regenerating?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-white/35 uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button onClick={onRegenerate} disabled={regenerating}
              className="flex items-center gap-1 text-[10px] font-semibold text-[#A78BFA]/70 hover:text-[#A78BFA] transition-colors disabled:opacity-40">
              <RefreshCw className={`w-3 h-3 ${regenerating ? "animate-spin" : ""}`} />
              Regénérer
            </button>
          )}
          <button onClick={() => setEditing(!editing)}
            className="text-white/25 hover:text-[#A78BFA] transition-colors">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {editing ? (
        <div className="flex flex-col gap-2">
          {multiline ? (
            <textarea value={value} onChange={e => onChange(e.target.value)} rows={4}
              className="w-full bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#8B5CF6]/50 resize-none" />
          ) : (
            <input value={value} onChange={e => onChange(e.target.value)}
              className="w-full bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#8B5CF6]/50" />
          )}
          <button onClick={() => setEditing(false)}
            className="self-end text-[11px] font-bold text-[#A78BFA]">Sauvegarder ✓</button>
        </div>
      ) : (
        <p className={`text-[13px] text-white/80 leading-relaxed ${!multiline && "font-semibold"}`}>{value}</p>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AISellerPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [enhancedPhotos, setEnhancedPhotos] = useState<File[]>([]);
  const [style, setStyle] = useState("fond_blanc");
  const [result, setResult] = useState<AIResult | null>(null);
  const [price, setPrice] = useState("");
  const [, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<"photo" | "listing">("photo");
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [regenField, setRegenField] = useState<string | null>(null);

  // ── Photo upload ──────────────────────────────────────────────────────────

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files)
      .filter(f => f.type === "image/jpeg" || f.type === "image/png")
      .slice(0, 5 - photos.length);
    setPhotos(prev => [...prev, ...valid]);
  };

  // ── Step 1 → 2: enhance photos then go to style ──────────────────────────

  const goToStyle = async () => {
    if (!photos.length) return;
    setLoading(true);
    setLoadingPhase("photo");
    setStep(2); // loading screen
    try {
      // On garde les originaux pour l'instant, on améliorera avec le fond choisi
      setEnhancedPhotos(photos);
      setStep(1); // style selection
    } catch {
      setEnhancedPhotos(photos);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2 → 3: generate listing ─────────────────────────────────────────

  const generate = async () => {
    if (!photos.length) return;
    setLoading(true);
    setLoadingPhase("listing");
    setStep(2);
    setError("");
    try {
      // Amélioration IA : suppression fond + fond style choisi
      let processedPhotos = photos;
      try {
        const enhanced = await Promise.all(
          photos.map(f => enhanceWithBackground(f, style).catch(() => f))
        );
        setEnhancedPhotos(enhanced);
        processedPhotos = enhanced;
      } catch { /* garde les originaux */ }

      const fd = new FormData();
      fd.append("photo", processedPhotos[0]);
      fd.append("style", style);
      const res = await fetch("/api/analyze-photo", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? `Erreur HTTP ${res.status}`);
      setResult({
        title: data.title ?? "",
        brand: data.brand ?? "",
        description: data.description ?? "",
        price: data.price ?? 0,
        category: data.category ?? "",
        condition: data.condition ?? "bon état",
        size: data.size ?? "",
        tags: data.tags ?? [],
      });
      setPrice(String(data.price ?? ""));
      setStep(3);
    } catch (e: any) {
      setError(e.message ?? "Erreur lors de la génération.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // ── Regenerate a specific field ───────────────────────────────────────────

  const regenerateField = async (field: string) => {
    const photosToUse = enhancedPhotos.length ? enhancedPhotos : photos;
    if (!photosToUse.length || !result) return;
    setRegenField(field);
    try {
      const fd = new FormData();
      fd.append("photo", photosToUse[0]);
      fd.append("style", style);
      const res = await fetch("/api/analyze-photo", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) return;
      setResult(prev => prev ? { ...prev, [field]: data[field] ?? prev[field as keyof AIResult] } : prev);
      if (field === "price") setPrice(String(data.price ?? price));
    } finally {
      setRegenField(null);
    }
  };

  // ── Publish ───────────────────────────────────────────────────────────────

  const publish = async () => {
    if (!result) return;
    setPublishing(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      const photosToUpload = enhancedPhotos.length ? enhancedPhotos : photos;
      const imageUrls: string[] = [];
      for (const photo of photosToUpload) {
        const ext = photo.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("products").upload(path, photo);
        if (!upErr) {
          const { data: urlData } = supabase.storage.from("products").getPublicUrl(path);
          imageUrls.push(urlData.publicUrl);
        }
      }

      const { data: product, error: insertErr } = await supabase.from("products").insert({
        seller_id: user.id,
        title: result.title,
        description: result.description,
        price: parseFloat(price) || result.price,
        category: result.category,
        condition: "good",
        images: imageUrls,
        status: "active",
      }).select().single();

      if (insertErr) throw insertErr;

      await supabase.from("ai_generations").insert({
        user_id: user.id, style,
        generated_title: result.title,
        generated_description: result.description,
        generated_price: parseFloat(price) || result.price,
      }).maybeSingle();

      router.push(product?.id ? `/products/${product.id}` : "/");
    } catch (e: any) {
      setError(e.message ?? "Erreur lors de la publication.");
    } finally {
      setPublishing(false);
    }
  };

  const photosToShow = enhancedPhotos.length ? enhancedPhotos : photos;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[100dvh] bg-[#07070A] flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#07070A]/95 backdrop-blur-sm border-b border-white/[0.06]">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => step > 0 && step !== 2 ? setStep(step - 1) : router.push("/sell")}
            className="w-9 h-9 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="text-[15px] font-black text-white">Vendre avec l'IA</span>
          </div>
          {step !== 2 && <span className="text-[11px] text-white/30 font-semibold">{step + 1}/{STEPS.length}</span>}
        </div>
        {step !== 2 && <StepBar current={step} />}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-3 flex items-center gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3">
          <span className="text-red-400 text-[13px]">{error}</span>
          <button onClick={() => setError("")} className="ml-auto text-red-400/50 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Step 0: Upload photo ──────────────────────────────────────────── */}
        {step === 0 && (
          <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
            <div>
              <p className="text-[18px] font-black text-white mb-1">📷 Ajoute tes photos</p>
              <p className="text-[13px] text-white/40">L'IA améliorera automatiquement tes photos</p>
            </div>

            {/* Drop zone */}
            {photos.length < 5 && (
              <div onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-white/12 bg-white/3 p-10 cursor-pointer hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/5 transition-all active:scale-[0.98]">
                <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/12 border border-[#8B5CF6]/20 flex items-center justify-center">
                  <ImagePlus className="w-6 h-6 text-[#A78BFA]" />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-bold text-white">Clique pour ajouter</p>
                  <p className="text-[12px] text-white/35 mt-0.5">JPG, PNG · max 5 photos</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/15">
                  <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                  <span className="text-[11px] font-semibold text-[#A78BFA]">Amélioration IA automatique</span>
                </div>
                <input ref={inputRef} type="file" accept="image/jpeg,image/png" multiple className="hidden"
                  onChange={e => addPhotos(e.target.files)} />
              </div>
            )}

            {/* Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((f, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-white" />
                    </button>
                    {i === 0 && <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-[#8B5CF6] text-[9px] font-bold text-white">Principale</div>}
                  </div>
                ))}
                {photos.length < 5 && (
                  <button onClick={() => inputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center hover:border-white/25 transition-all">
                    <Upload className="w-5 h-5 text-white/20" />
                  </button>
                )}
              </div>
            )}

            {photos.length > 0 && (
              <button onClick={goToStyle}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-[15px] font-black text-white shadow-lg shadow-[#8B5CF6]/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Améliorer avec l'IA
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* ── Step 1: Style ─────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
            <div>
              <p className="text-[18px] font-black text-white mb-1">🎨 Choisis le style</p>
              <p className="text-[13px] text-white/40">Fond utilisé pour ta photo de produit</p>
            </div>

            {/* Before/After */}
            {enhancedPhotos.length > 0 && photos.length > 0 && (
              <div className="rounded-2xl border border-white/8 overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img src={URL.createObjectURL(photos[0])} alt="Avant" className="w-full aspect-square object-cover opacity-70" />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-white/60">AVANT</div>
                  </div>
                  <div className="relative">
                    <img src={URL.createObjectURL(enhancedPhotos[0])} alt="Après" className="w-full aspect-square object-cover" />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-[#8B5CF6]/80 text-[10px] font-bold text-white">✨ APRÈS IA</div>
                  </div>
                </div>
              </div>
            )}

            {/* Style grid */}
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map(s => {
                return (
                  <button key={s.id} onClick={() => setStyle(s.id)}
                    className={`relative rounded-2xl overflow-hidden border transition-all active:scale-[0.97] ${
                      style === s.id ? "border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20" : "border-white/8"
                    }`}>
                    <div className="h-16 flex items-center justify-center" style={{ backgroundColor: s.color }}>
                      <span className="text-2xl">{s.emoji}</span>
                      {style === s.id && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className={`px-2 py-1.5 ${style === s.id ? "bg-[#8B5CF6]/15" : "bg-white/3"}`}>
                      <p className="text-[11px] font-bold text-white">{s.label}</p>
                      <p className="text-[9px] text-white/35">{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={generate}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-[15px] font-black text-white shadow-lg shadow-[#8B5CF6]/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              ✨ Générer l'annonce
            </button>
          </div>
        )}

        {/* ── Step 2: Loading ───────────────────────────────────────────────── */}
        {step === 2 && <GeneratingScreen phase={loadingPhase} />}

        {/* ── Step 3: Edit result ───────────────────────────────────────────── */}
        {step === 3 && result && (
          <div className="px-4 pt-4 pb-8 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[18px] font-black text-white">✏️ Vérifie & modifie</p>
                <p className="text-[13px] text-white/40 mt-0.5">L'IA a tout généré · édite si besoin</p>
              </div>
              <button onClick={generate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[11px] font-bold text-[#A78BFA] active:scale-95 transition-transform">
                <RefreshCw className="w-3 h-3" />
                Tout regénérer
              </button>
            </div>

            {/* Photos */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {photosToShow.map((f, i) => (
                <div key={i} className="relative flex-shrink-0">
                  <img src={URL.createObjectURL(f)} className={`rounded-2xl object-cover border ${i === 0 ? "w-28 h-28 border-[#8B5CF6]/40" : "w-20 h-20 border-white/8 opacity-70"}`} alt="" />
                  {i === 0 && (
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#8B5CF6]/80">
                      <Sparkles className="w-2.5 h-2.5 text-white" />
                      <span className="text-[8px] font-bold text-white">IA</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Fields */}
            <Field label="Titre" value={result.title} onChange={v => setResult({ ...result, title: v })}
              onRegenerate={() => regenerateField("title")} regenerating={regenField === "title"} />
            <Field label="Marque" value={result.brand} onChange={v => setResult({ ...result, brand: v })} />
            <Field label="Description" value={result.description} onChange={v => setResult({ ...result, description: v })}
              multiline onRegenerate={() => regenerateField("description")} regenerating={regenField === "description"} />

            {/* Prix + Catégorie */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-[10px] font-bold text-white/35 uppercase tracking-wider">Prix (€)</span>
                </div>
                <input value={price} onChange={e => setPrice(e.target.value)} type="number"
                  className="w-full bg-transparent text-[22px] font-black text-white outline-none" />
                <p className="text-[10px] text-[#A78BFA] mt-0.5">Conseillé : {result.price}€</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Package className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-[10px] font-bold text-white/35 uppercase tracking-wider">Catégorie</span>
                </div>
                <p className="text-[14px] font-bold text-white capitalize">{result.category}</p>
                <p className="text-[11px] text-white/35 mt-0.5 capitalize">{result.condition}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Taille" value={result.size} onChange={v => setResult({ ...result, size: v })} />
              <Field label="État" value={result.condition} onChange={v => setResult({ ...result, condition: v })} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {result.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-[11px] text-white/50">#{tag}</span>
              ))}
            </div>

            <button onClick={() => setStep(4)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-[15px] font-black text-white shadow-lg shadow-[#8B5CF6]/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-2">
              Voir le résumé
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Step 4: Publication summary ───────────────────────────────────── */}
        {step === 4 && result && (
          <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
            <div>
              <p className="text-[18px] font-black text-white mb-1">🚀 Prêt à publier</p>
              <p className="text-[13px] text-white/40">Vérifie une dernière fois avant de publier</p>
            </div>

            {/* Summary card */}
            <div className="rounded-3xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
              {/* Photo */}
              {photosToShow.length > 0 && (
                <img src={URL.createObjectURL(photosToShow[0])} alt="" className="w-full aspect-video object-cover" />
              )}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[17px] font-black text-white">{result.title}</p>
                  {result.brand && <p className="text-[12px] text-white/40 mt-0.5">{result.brand}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[28px] font-black text-white">{price || result.price}€</span>
                  <div className="text-right">
                    <p className="text-[12px] font-semibold text-white/60 capitalize">{result.category}</p>
                    <p className="text-[11px] text-white/30 capitalize">{result.condition} · {result.size}</p>
                  </div>
                </div>
                <p className="text-[12px] text-white/40 leading-relaxed line-clamp-3">{result.description}</p>
                <div className="flex items-center gap-2 pt-1 border-t border-white/6">
                  <span className="text-[11px] text-white/30">📦 Livraison calculée lors du paiement</span>
                </div>
              </div>
            </div>

            {error && <p className="text-red-400 text-[13px] text-center">{error}</p>}

            <button onClick={publish} disabled={publishing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-[16px] font-black text-white shadow-xl shadow-[#8B5CF6]/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-60">
              {publishing
                ? <span className="w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <><Zap className="w-5 h-5 fill-white" /> Publier l'annonce</>
              }
            </button>

            <button onClick={() => setStep(3)} className="text-center text-[13px] text-white/30 hover:text-white/60 transition-colors">
              ← Modifier l'annonce
            </button>
          </div>
        )}

      </div>
    </div>
  );
}