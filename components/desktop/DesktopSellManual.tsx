"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, X, ArrowLeft, Zap, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, CONDITIONS, SIZES } from "@/types/database";
import Link from "next/link";

interface Props { userId: string; }

type Condition = "new" | "like_new" | "good" | "fair";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: "0 0 7px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
      {children}
      {error && <p style={{ fontSize: 11.5, color: "#EF4444", margin: "5px 0 0" }}>{error}</p>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "white",
  outline: "none", caretColor: "#8B5CF6",
};

function priceTip(p: number) {
  if (p <= 10) return { color: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", text: "Prix attractif — se vend 3× plus vite" };
  if (p <= 30) return { color: "#60A5FA", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", text: "Prix dans la moyenne — bon rapport qualité/prix" };
  if (p <= 60) return { color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", text: "Prix un peu élevé — pense à activer « Faire une offre »" };
  return { color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "Prix élevé — soigne tes photos et ta description" };
}

export function DesktopSellManual({ userId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState<Condition>("good");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 8 - images.length);
    const merged = [...images, ...files].slice(0, 8);
    setImages(merged);
    setPreviews(merged.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (i: number) => {
    const imgs = images.filter((_, idx) => idx !== i);
    setImages(imgs);
    setPreviews(imgs.map(f => URL.createObjectURL(f)));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Requis";
    if (!price || parseFloat(price) <= 0) e.price = "Requis";
    if (!category) e.category = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const imageUrls: string[] = [];
    for (const file of images) {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("products").upload(path, file, { cacheControl: "3600", contentType: file.type });
      if (!error) {
        const { data } = supabase.storage.from("products").getPublicUrl(path);
        imageUrls.push(data.publicUrl);
      }
    }

    const { data: product, error } = await supabase.from("products").insert({
      seller_id: userId, title: title.trim(), description: description.trim() || null,
      price: parseFloat(price), category, size: size || null,
      brand: brand.trim() || null, condition, images: imageUrls,
    }).select("id").single();

    setLoading(false);
    if (error) { setErrors({ submit: "Une erreur est survenue. Réessaie." }); return; }
    router.push(`/products/${product.id}`);
  };

  const numPrice = parseFloat(price);
  const tip = price && numPrice > 0 ? priceTip(numPrice) : null;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#0A0A0F", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "26px 32px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
        <Link href="/sell" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
          <ArrowLeft style={{ width: 16, height: 16 }} />
        </Link>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "white", margin: 0 }}>Nouvelle annonce</h1>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)", margin: "2px 0 0" }}>Remplis les informations pour publier ton article</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 0, minHeight: "calc(100vh - 89px)" }}>

          {/* LEFT — photos */}
          <div style={{ padding: "28px 24px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.28)", margin: "0 0 14px" }}>Photos (max 8)</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                  <Image src={src} alt="" fill style={{ objectFit: "cover" }} />
                  {i === 0 && (
                    <span style={{ position: "absolute", bottom: 6, left: 6, fontSize: 9, fontWeight: 800, background: "rgba(139,92,246,0.9)", color: "white", padding: "2px 7px", borderRadius: 20, letterSpacing: "0.06em" }}>COVER</span>
                  )}
                  <button type="button" onClick={() => removeImage(i)} style={{
                    position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%",
                    background: "rgba(0,0,0,0.7)", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <X style={{ width: 11, height: 11, color: "white" }} />
                  </button>
                </div>
              ))}
              {images.length < 8 && (
                <button type="button" onClick={() => fileRef.current?.click()} style={{
                  aspectRatio: "1", borderRadius: 12, border: "2px dashed rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.04)",
                  cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.07)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.25)"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.04)"; }}
                >
                  <Camera style={{ width: 22, height: 22, color: "rgba(167,139,250,0.5)" }} />
                  <span style={{ fontSize: 11.5, color: "rgba(167,139,250,0.5)", fontWeight: 600 }}>Ajouter une photo</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addImages} />

            {/* Tip card */}
            <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Zap style={{ width: 13, height: 13, color: "#A78BFA" }} />
                <p style={{ fontSize: 11.5, fontWeight: 700, color: "#A78BFA", margin: 0 }}>Conseil photo</p>
              </div>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.5 }}>
                Bonne lumière naturelle, fond neutre, plusieurs angles. La 1ère photo sera la cover.
              </p>
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Titre" error={errors.title}>
                <input value={title} onChange={e => setTitle(e.target.value)} maxLength={80} placeholder="Ex: Nike Air Force 1 Blanc T42" style={{ ...inputStyle, borderColor: errors.title ? "rgba(239,68,68,0.4)" : undefined }} />
              </Field>
              <Field label="Marque">
                <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Nike, Zara, Vintage…" style={inputStyle} />
              </Field>
            </div>

            <Field label="Description">
              <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={600} rows={4}
                placeholder="Décris l'article, son état, les mesures, des détails importants…"
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Prix (€)" error={errors.price}>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" step="0.01" placeholder="0,00"
                  style={{ ...inputStyle, borderColor: errors.price ? "rgba(239,68,68,0.4)" : undefined }} />
                {tip && (
                  <div style={{ marginTop: 6, padding: "8px 12px", borderRadius: 8, background: tip.bg, border: `1px solid ${tip.border}` }}>
                    <p style={{ fontSize: 11.5, color: tip.color, margin: 0 }}>{tip.text}</p>
                  </div>
                )}
              </Field>
              <Field label="Catégorie" error={errors.category}>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer", borderColor: errors.category ? "rgba(239,68,68,0.4)" : undefined }}>
                  <option value="" disabled style={{ background: "#0A0A0F" }}>Choisir…</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value} style={{ background: "#0A0A0F" }}>{c.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Taille">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {SIZES.map(s => (
                  <button key={s} type="button" onClick={() => setSize(size === s ? "" : s)} style={{
                    padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    background: size === s ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
                    border: size === s ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    color: size === s ? "#C4B5FD" : "rgba(255,255,255,0.45)", transition: "all 0.1s",
                  }}>{s}</button>
                ))}
              </div>
            </Field>

            <Field label="État">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {CONDITIONS.map(c => (
                  <button key={c.value} type="button" onClick={() => setCondition(c.value as Condition)} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10,
                    cursor: "pointer", textAlign: "left",
                    background: condition === c.value ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.03)",
                    border: condition === c.value ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)",
                    transition: "all 0.1s",
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                      border: condition === c.value ? "2px solid #8B5CF6" : "2px solid rgba(255,255,255,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {condition === c.value && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#8B5CF6" }} />}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: condition === c.value ? 600 : 400, color: condition === c.value ? "#C4B5FD" : "rgba(255,255,255,0.55)" }}>{c.label}</span>
                  </button>
                ))}
              </div>
            </Field>

            {errors.submit && (
              <div style={{ display: "flex", gap: 8, padding: "12px 14px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertCircle style={{ width: 15, height: 15, color: "#EF4444", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: "#EF4444", margin: 0 }}>{errors.submit}</p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
              <button type="submit" disabled={loading} style={{
                padding: "13px 40px", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", border: "none",
                background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg,#8B5CF6,#7C3AED)",
                color: "white", boxShadow: loading ? "none" : "0 6px 24px rgba(139,92,246,0.4)",
                transition: "all 0.15s", opacity: loading ? 0.7 : 1,
              }}>
                {loading ? "Publication en cours…" : "Publier l'annonce"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
