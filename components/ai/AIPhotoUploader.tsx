"use client";

import { useRef, useState } from "react";
import { Upload, X, ImagePlus, Sparkles } from "lucide-react";
import { enhancePhoto, DEFAULT_OPTIONS } from "@/lib/enhance-photo";

interface Props {
  photos: File[];
  onChange: (files: File[]) => void;
  plan?: "free" | "starter" | "pro" | "premium";
}

const MAX_PHOTOS = 5;

async function dataUrlToFile(dataUrl: string, name: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], name, { type: "image/jpeg" });
}

export function AIPhotoUploader({ photos, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [enhancing, setEnhancing] = useState<number[]>([]); // indices en cours

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files)
      .filter((f) => f.type === "image/jpeg" || f.type === "image/png")
      .slice(0, MAX_PHOTOS - photos.length);
    if (!valid.length) return;

    // Ajouter les originaux d'abord (pour affichage immédiat)
    const startIdx = photos.length;
    onChange([...photos, ...valid]);

    // Indices en cours d'amélioration
    setEnhancing(valid.map((_, i) => startIdx + i));

    // Améliorer chaque photo en parallèle
    const enhanced = await Promise.all(
      valid.map(async (file) => {
        try {
          const dataUrl = await enhancePhoto(file, DEFAULT_OPTIONS);
          return await dataUrlToFile(dataUrl, file.name);
        } catch {
          return file; // si erreur, garder l'original
        }
      })
    );

    // Remplacer par les versions améliorées
    const next = [...photos];
    enhanced.forEach((f, i) => { next[startIdx + i] = f; });
    onChange(next);
    setEnhancing([]);
  };

  const remove = (i: number) => onChange(photos.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {photos.length < MAX_PHOTOS && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-8 cursor-pointer transition-all duration-200 ${
            dragging
              ? "border-[#22C55E] bg-[#22C55E]/10 scale-[0.99]"
              : "border-white/15 bg-white/4 hover:border-white/25 hover:bg-white/6"
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/20 flex items-center justify-center">
            <ImagePlus className="w-6 h-6 text-[#4ADE80]" />
          </div>
          <div className="text-center">
            <p className="text-[15px] font-semibold text-white">Clique ou glisse tes photos</p>
            <p className="text-[12px] text-white/35 mt-1">JPG, PNG · max 5 photos</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
            <Sparkles className="w-3 h-3 text-[#4ADE80]" />
            <span className="text-[11px] font-semibold text-[#4ADE80]">Amélioration IA automatique</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((file, i) => {
            const isEnhancing = enhancing.includes(i);
            return (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className={`w-full h-full object-cover transition-all duration-300 ${isEnhancing ? "opacity-50 blur-sm" : ""}`}
                />

                {/* Enhancing overlay */}
                {isEnhancing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                    <div className="w-6 h-6 rounded-full border-2 border-[#4ADE80] border-t-transparent animate-spin" />
                    <span className="text-[9px] font-bold text-[#4ADE80]">IA…</span>
                  </div>
                )}

                {/* IA badge (photo améliorée) */}
                {!isEnhancing && (
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#22C55E]/80 backdrop-blur-sm">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                    <span className="text-[9px] font-bold text-white">IA</span>
                  </div>
                )}

                {/* Remove button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); remove(i); }}
                    className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center border border-white/20"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

                {i === 0 && (
                  <div className="absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#22C55E] text-white">
                    Principale
                  </div>
                )}
              </div>
            );
          })}

          {photos.length < MAX_PHOTOS && (
            <button
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-white/12 bg-white/4 flex items-center justify-center hover:border-white/25 hover:bg-white/7 transition-all"
            >
              <Upload className="w-5 h-5 text-white/25" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
