"use client";

import { useState } from "react";
import { Search, X, TrendingUp, Sparkles, Zap, SlidersHorizontal, ArrowUpRight, Flame, Heart, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  { label: "Tout",        value: "",            emoji: "✨" },
  { label: "Femme",       value: "femme",       emoji: "👗" },
  { label: "Homme",       value: "homme",       emoji: "👕" },
  { label: "Enfant",      value: "enfant",      emoji: "🧸" },
  { label: "Luxe",        value: "luxe",        emoji: "💎" },
  { label: "Sneakers",    value: "sneakers",    emoji: "👟" },
  { label: "Robes",       value: "robes",       emoji: "👘" },
  { label: "Manteaux",    value: "manteaux",    emoji: "🧥" },
  { label: "Accessoires", value: "accessoires", emoji: "👜" },
  { label: "Sport",       value: "sport",       emoji: "🏃" },
  { label: "Vintage",     value: "vintage",     emoji: "🕰" },
];

const SORTS = [
  { label: "Nouveautés",      value: "recent"     },
  { label: "Prix croissant",  value: "price_asc"  },
  { label: "Prix décroissant",value: "price_desc" },
  { label: "Populaires",      value: "popular"    },
];

const SIZES_CLOTHES = ["XS", "S", "M", "L", "XL", "XXL"];
const SIZES_SHOES   = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

const TRENDING = [
  "Nike Air Force 1", "Jordan 1", "Jacquemus bag", "Vintage Levi's",
  "Zara SS24", "Balenciaga sneakers", "The North Face", "Carhartt",
];

const PRICE_RANGES = [
  { label: "Moins de 20€",  min: 0,   max: 20  },
  { label: "20€ – 50€",     min: 20,  max: 50  },
  { label: "50€ – 100€",    min: 50,  max: 100 },
  { label: "Plus de 100€",  min: 100, max: 9999 },
];

function ProductCard({ product, currentUserId }: { product: Product; currentUserId?: string }) {
  const [liked, setLiked] = useState(product.is_liked ?? false);
  const supabase = createClient();

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!currentUserId) return;
    if (liked) {
      await supabase.from("likes").delete().match({ user_id: currentUserId, product_id: product.id });
    } else {
      await supabase.from("likes").insert({ user_id: currentUserId, product_id: product.id });
    }
    setLiked(v => !v);
  };

  const img = product.images?.[0];

  return (
    <Link href={`/products/${product.id}`} style={{ display: "block", textDecoration: "none" }}>
      <div style={{
        borderRadius: 14, overflow: "hidden", position: "relative",
        background: "#0E0D1A", border: "1px solid rgba(255,255,255,0.06)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-4px)";
          el.style.boxShadow = "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "none";
        }}>

        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "rgba(139,92,246,0.04)" }}>
          {img
            ? <Image src={img} alt={product.title} fill sizes="220px"
                style={{ objectFit: "cover", transition: "transform 0.4s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.07)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }} />
            : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>👕</div>
          }

          {/* Boost badge */}
          {product.is_boosted && (
            <div style={{
              position: "absolute", top: 10, left: 10,
              display: "flex", alignItems: "center", gap: 4,
              padding: "3px 8px", borderRadius: 6,
              background: "linear-gradient(135deg,#7C3AED,#6D28D9)",
              fontSize: 9, fontWeight: 800, color: "white", letterSpacing: "0.05em",
            }}>
              <Zap style={{ width: 9, height: 9 }} />BOOST
            </div>
          )}

          {/* Like button */}
          <button onClick={toggleLike} style={{
            position: "absolute", top: 10, right: 10,
            width: 32, height: 32, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: liked ? "#EF4444" : "rgba(0,0,0,0.55)",
            border: liked ? "none" : "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(6px)",
            opacity: 0, transition: "opacity 0.2s",
          }}
            className="like-btn"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
            <Heart style={{ width: 13, height: 13, color: "white", fill: liked ? "white" : "none" }} />
          </button>

          {/* Price overlay */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "24px 12px 10px",
            background: "linear-gradient(to top, rgba(14,13,26,0.98) 0%, transparent 100%)",
          }}>
            <p style={{ fontSize: 17, fontWeight: 900, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
              {formatPrice(product.price)}
            </p>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "10px 12px 12px" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.title}
          </p>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {product.brand && (
              <span style={{
                fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                background: "rgba(139,92,246,0.12)", color: "#A78BFA",
              }}>
                {product.brand}
              </span>
            )}
            {product.size && (
              <span style={{
                fontSize: 9.5, fontWeight: 600, padding: "2px 7px", borderRadius: 5,
                background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)",
              }}>
                {product.size}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Show like button on card hover */}
      <style>{`.group:hover .like-btn { opacity: 1 !important; }`}</style>
    </Link>
  );
}

interface Props {
  products: Product[];
  currentUserId?: string;
  initialQ?: string;
  initialCategory?: string;
}

export function DesktopExplorer({ products, currentUserId, initialQ, initialCategory }: Props) {
  const [q, setQ] = useState(initialQ ?? "");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [sort, setSort] = useState("recent");
  const [selectedSize, setSelectedSize] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [filterOpen, setFilterOpen] = useState(true);

  const filtered = products
    .filter(p => {
      const matchQ = !q || p.title?.toLowerCase().includes(q.toLowerCase()) || p.brand?.toLowerCase().includes(q.toLowerCase());
      const matchCat = !category || p.category?.toLowerCase() === category;
      const matchSz = !selectedSize || p.size === selectedSize;
      const range = PRICE_RANGES.find(r => r.label === priceRange);
      const matchPrice = !range || ((p.price ?? 0) >= range.min && (p.price ?? 0) < range.max);
      return matchQ && matchCat && matchSz && matchPrice;
    })
    .sort((a, b) => {
      if (sort === "price_asc")  return (a.price ?? 0) - (b.price ?? 0);
      if (sort === "price_desc") return (b.price ?? 0) - (a.price ?? 0);
      if (sort === "popular")    return (b.likes_count ?? 0) - (a.likes_count ?? 0);
      return 0;
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100dvh", overflow: "hidden", background: "#07060F" }}>

      {/* ── TOP BAR ── */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 0,
        height: 56, borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(7,6,15,0.96)", backdropFilter: "blur(24px)",
        position: "sticky", top: 0, zIndex: 20,
      }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px", flex: "0 0 260px", borderRight: "1px solid rgba(255,255,255,0.06)", height: "100%" }}>
          <Search style={{ width: 15, height: 15, color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Marques, articles, styles…"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: 13.5, color: "white", caretColor: "#8B5CF6",
            }}
          />
          {q && (
            <button onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "rgba(255,255,255,0.25)", padding: 0 }}>
              <X style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, padding: "0 16px", overflowX: "auto", scrollbarWidth: "none", height: "100%" }}>
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)} style={{
              flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 600,
              background: category === c.value ? "rgba(139,92,246,0.18)" : "transparent",
              border: category === c.value ? "1px solid rgba(139,92,246,0.35)" : "1px solid transparent",
              color: category === c.value ? "#C4B5FD" : "rgba(255,255,255,0.38)",
              cursor: "pointer", transition: "all 0.12s", whiteSpace: "nowrap",
            }}
              onMouseEnter={e => { if (category !== c.value) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={e => { if (category !== c.value) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}>
              <span style={{ fontSize: 13 }}>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div style={{ flexShrink: 0, padding: "0 16px", borderLeft: "1px solid rgba(255,255,255,0.06)", height: "100%", display: "flex", alignItems: "center" }}>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            background: "transparent", border: "none", outline: "none",
            fontSize: 12.5, color: "rgba(255,255,255,0.5)", cursor: "pointer",
            appearance: "none", paddingRight: 18, fontWeight: 500,
          }}>
            {SORTS.map(s => <option key={s.value} value={s.value} style={{ background: "#0E0D1A" }}>{s.label}</option>)}
          </select>
          <ChevronDown style={{ width: 13, height: 13, color: "rgba(255,255,255,0.3)", marginLeft: -14, pointerEvents: "none" }} />
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>

        {/* LEFT FILTERS */}
        <div style={{
          width: filterOpen ? 220 : 0, flexShrink: 0, overflowY: "auto", overflowX: "hidden",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          scrollbarWidth: "none", transition: "width 0.2s",
          background: "rgba(255,255,255,0.01)",
        }}>
          <div style={{ width: 220, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Sort */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
                <SlidersHorizontal style={{ width: 11, height: 11 }} /> Trier
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {SORTS.map(s => (
                  <button key={s.value} onClick={() => setSort(s.value)} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 9,
                    textAlign: "left", background: sort === s.value ? "rgba(139,92,246,0.1)" : "transparent",
                    border: "none", color: sort === s.value ? "#A78BFA" : "rgba(255,255,255,0.4)",
                    fontSize: 12.5, fontWeight: sort === s.value ? 600 : 400, cursor: "pointer", transition: "all 0.1s",
                  }}
                    onMouseEnter={e => { if (sort !== s.value) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (sort !== s.value) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                      background: sort === s.value ? "#8B5CF6" : "rgba(255,255,255,0.12)",
                    }} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes clothes */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: "0 0 10px" }}>
                Taille vêtements
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {SIZES_CLOTHES.map(sz => (
                  <button key={sz} onClick={() => setSelectedSize(selectedSize === sz ? "" : sz)} style={{
                    padding: "5px 10px", borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                    background: selectedSize === sz ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                    border: selectedSize === sz ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)",
                    color: selectedSize === sz ? "#C4B5FD" : "rgba(255,255,255,0.35)",
                    transition: "all 0.1s",
                  }}>
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes shoes */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: "0 0 10px" }}>
                Pointure
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {SIZES_SHOES.map(sz => (
                  <button key={sz} onClick={() => setSelectedSize(selectedSize === sz ? "" : sz)} style={{
                    padding: "5px 10px", borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                    background: selectedSize === sz ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                    border: selectedSize === sz ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)",
                    color: selectedSize === sz ? "#C4B5FD" : "rgba(255,255,255,0.35)",
                    transition: "all 0.1s",
                  }}>
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: "0 0 10px" }}>
                Prix
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {PRICE_RANGES.map(r => (
                  <button key={r.label} onClick={() => setPriceRange(priceRange === r.label ? "" : r.label)} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8,
                    background: priceRange === r.label ? "rgba(139,92,246,0.1)" : "transparent",
                    border: "none", color: priceRange === r.label ? "#A78BFA" : "rgba(255,255,255,0.38)",
                    fontSize: 12.5, fontWeight: priceRange === r.label ? 600 : 400, cursor: "pointer", transition: "all 0.1s", textAlign: "left",
                  }}
                    onMouseEnter={e => { if (priceRange !== r.label) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (priceRange !== r.label) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                      background: priceRange === r.label ? "#8B5CF6" : "rgba(255,255,255,0.12)",
                    }} />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* IA Picks */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 5 }}>
                <Sparkles style={{ width: 10, height: 10, color: "#8B5CF6" }} /> Sélection IA
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  { label: "Pièces uniques", icon: "✨", count: "234 articles" },
                  { label: "Bon état · -60%", icon: "🏷️", count: "1.2K articles" },
                  { label: "Livraison rapide", icon: "⚡", count: "456 articles" },
                ].map(p => (
                  <button key={p.label} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.18)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", margin: "0 0 2px" }}>{p.label}</p>
                      <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)", margin: 0 }}>{p.count}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {(q || category || selectedSize || priceRange) && (
              <button onClick={() => { setQ(""); setCategory(""); setSelectedSize(""); setPriceRange(""); }} style={{
                padding: "9px", borderRadius: 9, fontSize: 12.5, fontWeight: 600,
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
                color: "rgba(239,68,68,0.7)", cursor: "pointer", transition: "all 0.12s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.14)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}>
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>

        {/* CENTER — grid */}
        <div style={{ flex: 1, minWidth: 0, overflowY: "auto", scrollbarWidth: "none" }}>

          {/* Trending banner */}
          {!q && !category && (
            <div style={{
              margin: "16px 20px 0",
              padding: "16px 20px", borderRadius: 14,
              background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Flame style={{ width: 15, height: 15, color: "#F97316" }} />
                <p style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0 }}>Tendances du moment</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {TRENDING.map(t => (
                  <button key={t} onClick={() => setQ(t)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
                    color: "rgba(255,255,255,0.55)", cursor: "pointer", transition: "all 0.12s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.28)"; (e.currentTarget as HTMLElement).style.color = "#C4B5FD"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}>
                    <TrendingUp style={{ width: 11, height: 11, color: "#8B5CF6" }} />
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Count bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "white", letterSpacing: "-0.02em", margin: "0 0 2px" }}>
                {q ? `"${q}"` : category ? CATEGORIES.find(c => c.value === category)?.label : "Tous les articles"}
              </p>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.28)", margin: 0 }}>
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button onClick={() => setFilterOpen(v => !v)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9,
              background: filterOpen ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.04)",
              border: filterOpen ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(255,255,255,0.08)",
              color: filterOpen ? "#A78BFA" : "rgba(255,255,255,0.38)",
              fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all 0.12s",
            }}>
              <SlidersHorizontal style={{ width: 13, height: 13 }} />
              Filtres
            </button>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
              <Search style={{ width: 40, height: 40, color: "rgba(255,255,255,0.07)", marginBottom: 16 }} />
              <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.2)", margin: "0 0 6px" }}>Aucun résultat</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.14)", margin: "0 0 20px" }}>Essaie d&apos;autres mots-clés ou filtres</p>
              <button onClick={() => { setQ(""); setCategory(""); setSelectedSize(""); setPriceRange(""); }} style={{
                padding: "9px 22px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#A78BFA",
              }}>
                Tout afficher
              </button>
            </div>
          ) : (
            <div style={{
              display: "grid", padding: "0 20px 24px",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: 12,
            }}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} currentUserId={currentUserId} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{
          width: 260, flexShrink: 0, overflowY: "auto", scrollbarWidth: "none",
          borderLeft: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.01)",
          display: "flex", flexDirection: "column", gap: 0,
        }}>

          {/* Sell CTA */}
          <Link href="/sell/ai" style={{ textDecoration: "none", display: "block", margin: "16px 16px 0" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 14px", borderRadius: 14,
              background: "linear-gradient(135deg, rgba(124,58,237,0.22) 0%, rgba(91,33,182,0.14) 100%)",
              border: "1px solid rgba(124,58,237,0.3)",
              transition: "all 0.15s", cursor: "pointer",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.3)"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "white", margin: "0 0 3px" }}>Vends maintenant</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>Annonce en 30 sec avec l&apos;IA</p>
              </div>
              <div style={{
                width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(139,92,246,0.25)",
              }}>
                <Zap style={{ width: 16, height: 16, color: "#C4B5FD" }} />
              </div>
            </div>
          </Link>

          {/* Stats */}
          <div style={{ margin: "12px 16px 0", padding: "14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block", boxShadow: "0 0 7px rgba(34,197,94,0.7)" }} />
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: 0 }}>
                Live · Wearlyx
              </p>
            </div>
            {[
              { label: "Articles en ligne",  value: "32 540" },
              { label: "Ventes aujourd'hui", value: "1 280"  },
              { label: "Membres actifs",     value: "50 K+"  },
              { label: "Note moyenne",       value: "4.8 ★"  },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.32)" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.72)" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Trending searches */}
          <div style={{ padding: "16px 16px 0" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 5 }}>
              <TrendingUp style={{ width: 11, height: 11, color: "#8B5CF6" }} /> Recherches
            </p>
            {TRENDING.slice(0, 5).map((t, i) => (
              <button key={t} onClick={() => setQ(t)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 8px", borderRadius: 8, background: "transparent", border: "none",
                cursor: "pointer", transition: "background 0.1s", textAlign: "left",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, width: 12, color: i < 3 ? "rgba(139,92,246,0.55)" : "rgba(255,255,255,0.14)" }}>{i+1}</span>
                  <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{t}</span>
                </div>
                <ArrowUpRight style={{ width: 12, height: 12, color: "rgba(139,92,246,0.4)", opacity: 0.6 }} />
              </button>
            ))}
          </div>

          {/* AI CTA */}
          <div style={{ margin: "14px 16px 16px", padding: "16px", borderRadius: 12, background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.13)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Sparkles style={{ width: 14, height: 14, color: "#A78BFA" }} />
              <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", margin: 0 }}>Sélection IA pour toi</p>
            </div>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.32)", margin: "0 0 12px", lineHeight: 1.4 }}>Basée sur tes centres d&apos;intérêt</p>
            <button style={{
              width: "100%", padding: "9px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.25)", color: "#C4B5FD",
              transition: "all 0.12s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.18)"; }}>
              Découvrir →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
