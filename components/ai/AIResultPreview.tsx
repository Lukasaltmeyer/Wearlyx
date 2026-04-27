"use client";

import { useState } from "react";
import { Edit3, Tag, Package, Sparkles, Copy, Check } from "lucide-react";

export interface AIResult {
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  condition: string;
}

interface Props {
  result: AIResult;
  photos: File[];
  onEdit: (r: AIResult) => void;
  onPublish: () => void;
  publishing?: boolean;
}

export function AIResultPreview({ result, photos, onEdit, onPublish, publishing }: Props) {
  const [editing, setEditing] = useState<keyof AIResult | null>(null);
  const [draft, setDraft] = useState(result);
  const [copied, setCopied] = useState(false);

  const save = () => { onEdit(draft); setEditing(null); };

  const copy = () => {
    navigator.clipboard.writeText(`${draft.title}\n\n${draft.description}\n\nPrix : ${draft.price}€`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#A78BFA]" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-white">Annonce générée par IA</p>
          <p className="text-[11px] text-white/40">Modifie si besoin puis publie</p>
        </div>
      </div>

      {/* Photo preview */}
      {photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {photos.map((f, i) => (
            <img
              key={i}
              src={URL.createObjectURL(f)}
              className={`flex-shrink-0 rounded-2xl object-cover border ${i === 0 ? "w-24 h-24 border-[#8B5CF6]/40" : "w-16 h-16 border-white/10 opacity-70"}`}
              alt=""
            />
          ))}
        </div>
      )}

      {/* Title */}
      <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Titre</span>
          <button onClick={() => setEditing(editing === "title" ? null : "title")}
            className="text-white/30 hover:text-[#A78BFA] transition-colors">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
        {editing === "title" ? (
          <div className="flex flex-col gap-2">
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="w-full bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]/50" />
            <button onClick={save} className="self-end text-xs text-[#A78BFA] font-semibold">Sauvegarder</button>
          </div>
        ) : (
          <p className="text-[15px] font-bold text-white">{draft.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Description</span>
          <button onClick={() => setEditing(editing === "description" ? null : "description")}
            className="text-white/30 hover:text-[#A78BFA] transition-colors">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
        {editing === "description" ? (
          <div className="flex flex-col gap-2">
            <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={4}
              className="w-full bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-sm text-white/80 outline-none focus:border-[#8B5CF6]/50 resize-none" />
            <button onClick={save} className="self-end text-xs text-[#A78BFA] font-semibold">Sauvegarder</button>
          </div>
        ) : (
          <p className="text-[13px] text-white/70 leading-relaxed">{draft.description}</p>
        )}
      </div>

      {/* Price + Category row */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-2xl border border-white/8 bg-white/4 p-3.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Tag className="w-3 h-3 text-white/35" />
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Prix IA</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{draft.price}</span>
            <span className="text-sm text-white/50 font-semibold">€</span>
          </div>
          <p className="text-[10px] text-[#A78BFA] mt-0.5">Prix conseillé par IA</p>
        </div>
        <div className="flex-1 rounded-2xl border border-white/8 bg-white/4 p-3.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Package className="w-3 h-3 text-white/35" />
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Catégorie</span>
          </div>
          <p className="text-[14px] font-bold text-white capitalize">{draft.category}</p>
          <p className="text-[10px] text-white/35 mt-0.5">{draft.condition}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {draft.tags.map((tag, i) => (
          <span key={i} className="px-2.5 py-1 rounded-full bg-white/6 border border-white/10 text-[12px] text-white/60 font-medium">
            #{tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button onClick={copy}
          className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-3 rounded-2xl border border-white/10 bg-white/5 text-[13px] text-white/60 hover:bg-white/8 transition-all">
          {copied ? <Check className="w-4 h-4 text-violet-400" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copié" : "Copier"}
        </button>
        <button
          onClick={onPublish}
          disabled={publishing}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#8B5CF6] text-[15px] font-semibold text-white shadow-lg shadow-[#8B5CF6]/25 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {publishing ? (
            <span className="w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>🚀 Publier l&apos;annonce</>
          )}
        </button>
      </div>
    </div>
  );
}