"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Zap, Crown, Home, Compass, MessageCircle, Bell, Heart,
  User, Package, TrendingUp, Settings, ArrowRight, Plus, Sparkles,
} from "lucide-react";

const STATIC_ACTIONS = [
  { id: "home",          label: "Accueil",                icon: Home,          href: "/",                 category: "Navigation" },
  { id: "explore",       label: "Explorer",               icon: Compass,       href: "/search",           category: "Navigation" },
  { id: "messages",      label: "Messages",               icon: MessageCircle, href: "/messages",         category: "Navigation" },
  { id: "notifications", label: "Notifications",          icon: Bell,          href: "/notifications",    category: "Navigation" },
  { id: "favorites",     label: "Mes favoris",            icon: Heart,         href: "/favorites",        category: "Navigation" },
  { id: "profile",       label: "Mon profil",             icon: User,          href: "/profile/menu",     category: "Navigation" },
  { id: "sell-ai",       label: "Vendre avec l'IA",       icon: Zap,           href: "/sell/ai",          category: "Vendre",     accent: "#A78BFA" },
  { id: "sell-manual",   label: "Créer une annonce",      icon: Plus,          href: "/sell/manual",      category: "Vendre" },
  { id: "enhance",       label: "Améliorer mes photos IA", icon: Sparkles,      href: "/sell/enhance",     category: "Vendre",     accent: "#A78BFA" },
  { id: "sales",         label: "Mes ventes",             icon: TrendingUp,    href: "/sales",            category: "Compte" },
  { id: "orders",        label: "Mes commandes",          icon: Package,       href: "/orders/me",        category: "Compte" },
  { id: "premium",       label: "Plan Premium",           icon: Crown,         href: "/premium",          category: "Compte",     accent: "#F59E0B" },
  { id: "settings",      label: "Paramètres",             icon: Settings,      href: "/profile/settings", category: "Compte" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? STATIC_ACTIONS.filter(a =>
        a.label.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
      )
    : STATIC_ACTIONS;

  const searchAction = query.trim()
    ? [{ id: "search", label: `Rechercher "${query}"`, icon: Search, href: `/search?q=${encodeURIComponent(query)}`, category: "Recherche", accent: "#C4B5FD" }]
    : [];

  const items = [...searchAction, ...filtered];

  const go = useCallback((href: string) => {
    router.push(href);
    onClose();
    setQuery("");
  }, [router, onClose]);

  useEffect(() => {
    if (open) {
      setSelected(0);
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, items.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && items[selected]) go(items[selected].href);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, items, selected, go, onClose]);

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selected}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!open) return null;

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  let globalIdx = 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[18vh]"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)" }}
      onClick={onClose}>

      <div
        className="w-full max-w-[560px] mx-4 rounded-[20px] overflow-hidden flex flex-col"
        style={{
          background: "rgba(14,11,24,0.97)",
          border: "1px solid rgba(139,92,246,0.22)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 80px rgba(139,92,246,0.08)",
          maxHeight: "60vh",
          animation: "cmdPaletteIn 0.18s cubic-bezier(0.22,1,0.36,1)",
        }}
        onClick={e => e.stopPropagation()}>

        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Search className="w-[17px] h-[17px] flex-shrink-0" style={{ color: "rgba(167,139,250,0.7)" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher ou naviguer…"
            className="flex-1 bg-transparent text-[15px] text-white outline-none"
            style={{ caretColor: "#A78BFA" }}
          />
          <kbd className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[5px]"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.28)", border: "1px solid rgba(255,255,255,0.08)" }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="overflow-y-auto flex-1 py-2" style={{ scrollbarWidth: "none" }}>
          {query.trim() && searchAction.length > 0 && (() => {
            const item = items[0];
            const idx = globalIdx++;
            const isSel = selected === idx;
            return (
              <button key="search" data-idx={idx}
                onClick={() => go(item.href)}
                onMouseEnter={() => setSelected(idx)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                style={{ background: isSel ? "rgba(139,92,246,0.12)" : "transparent" }}>
                <div className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(167,139,250,0.12)" }}>
                  <Search className="w-3.5 h-3.5" style={{ color: "#C4B5FD" }} />
                </div>
                <span className="text-[13.5px] font-medium text-white/80">{item.label}</span>
                {isSel && <ArrowRight className="w-3.5 h-3.5 ml-auto" style={{ color: "rgba(167,139,250,0.5)" }} />}
              </button>
            );
          })()}

          {Object.entries(grouped).filter(([cat]) => cat !== "Recherche").map(([category, catItems]) => (
            <div key={category}>
              <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: "rgba(255,255,255,0.2)" }}>
                {category}
              </p>
              {catItems.map(item => {
                const idx = globalIdx++;
                const isSel = selected === idx;
                const Icon = item.icon;
                return (
                  <button key={item.id} data-idx={idx}
                    onClick={() => go(item.href)}
                    onMouseEnter={() => setSelected(idx)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left transition-colors"
                    style={{ background: isSel ? "rgba(139,92,246,0.10)" : "transparent" }}>
                    <div className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
                      style={{ background: isSel ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.05)" }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: item.accent ?? (isSel ? "#A78BFA" : "rgba(255,255,255,0.45)") }} />
                    </div>
                    <span className="flex-1 text-[13px] font-medium"
                      style={{ color: isSel ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)" }}>
                      {item.label}
                    </span>
                    {isSel && <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(167,139,250,0.4)" }} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
          {[["↑↓", "Naviguer"], ["↵", "Ouvrir"], ["Esc", "Fermer"]].map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <kbd className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded-[4px]"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.32)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {key}
              </kbd>
              <span className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.22)" }}>{label}</span>
            </div>
          ))}
          <span className="ml-auto text-[10px] font-bold tracking-wider" style={{ color: "rgba(139,92,246,0.4)" }}>
            WEARLYX
          </span>
        </div>
      </div>

      <style>{`
        @keyframes cmdPaletteIn {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
