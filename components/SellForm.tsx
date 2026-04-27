"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { CATEGORIES, CONDITIONS, SIZES } from "@/types/database";
import { cn } from "@/lib/utils";

interface SellFormProps {
  userId: string;
}

export function SellForm({ userId }: SellFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState<string>("good");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 8 - images.length);
    const newImages = [...images, ...files].slice(0, 8);
    setImages(newImages);
    const newPreviews = newImages.map((f) => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  const removeImage = (i: number) => {
    const newImages = images.filter((_, idx) => idx !== i);
    const newPreviews = previews.filter((_, idx) => idx !== i);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Le titre est requis";
    if (!price || parseFloat(price) <= 0) e.price = "Le prix doit être supérieur à 0";
    if (!category) e.category = "Sélectionne une catégorie";
    if (!condition) e.condition = "Sélectionne un état";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Upload images
    const imageUrls: string[] = [];
    for (const file of images) {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("products").upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
      });
      if (!error) {
        const { data: urlData } = supabase.storage.from("products").getPublicUrl(path);
        imageUrls.push(urlData.publicUrl);
      }
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        seller_id: userId,
        title: title.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        category,
        size: size || null,
        brand: brand.trim() || null,
        condition: condition as "new" | "like_new" | "good" | "fair",
        images: imageUrls,
      })
      .select("id")
      .single();

    setLoading(false);

    if (error) {
      setErrors({ submit: "Une erreur est survenue. Réessaie." });
      return;
    }

    router.push(`/products/${product.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-8 space-y-5">
      {/* Images */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Photos <span className="text-gray-400">(max 8)</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <Image src={src} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-full font-medium">
                  Cover
                </span>
              )}
            </div>
          ))}
          {images.length < 8 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-200 hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 transition-colors"
            >
              <Camera className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] text-gray-400 font-medium">Ajouter</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageSelect}
        />
      </div>

      <Input
        label="Titre"
        placeholder="Ex: Nike Air Force 1 Blanc Taille 42"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        maxLength={80}
      />

      <Input
        label="Marque"
        placeholder="Nike, Zara, Vintage…"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      <Textarea
        label="Description"
        placeholder="Décris l'article, son état, les mesures…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        maxLength={600}
      />

      <Input
        label="Prix (€)"
        type="number"
        placeholder="0"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0"
        step="0.01"
        error={errors.price}
      />
      {price && parseFloat(price) > 0 && (() => {
        const p = parseFloat(price);
        if (p <= 10) return (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-base">💸</span>
            <div>
              <p className="text-[12px] font-black text-emerald-400">Prix attractif</p>
              <p className="text-[11px] text-emerald-400/60">Articles à moins de 10 € se vendent 3× plus vite</p>
            </div>
          </div>
        );
        if (p <= 30) return (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-base">✅</span>
            <div>
              <p className="text-[12px] font-black text-blue-400">Prix dans la moyenne</p>
              <p className="text-[11px] text-blue-400/60">Bon rapport qualité / prix pour les acheteurs</p>
            </div>
          </div>
        );
        if (p <= 60) return (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-base">⚠️</span>
            <div>
              <p className="text-[12px] font-black text-amber-400">Prix un peu élevé</p>
              <p className="text-[11px] text-amber-400/60">Pense à activer "Faire une offre" pour négocier</p>
            </div>
          </div>
        );
        return (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <span className="text-base">🔴</span>
            <div>
              <p className="text-[12px] font-black text-red-400">Prix élevé</p>
              <p className="text-[11px] text-red-400/60">Les articles premium nécessitent de bonnes photos et description</p>
            </div>
          </div>
        );
      })()}

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Catégorie</label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={cn(
              "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none",
              "focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all",
              !category && "text-gray-400",
              errors.category && "border-red-400"
            )}
          >
            <option value="" disabled>Choisir une catégorie</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
      </div>

      {/* Size */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Taille</label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(size === s ? "" : s)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm font-medium border transition-all",
                size === s
                  ? "bg-[#8B5CF6] border-[#8B5CF6] text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">État</label>
        <div className="space-y-2">
          {CONDITIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCondition(c.value)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                condition === c.value
                  ? "bg-[#8B5CF6]/5 border-[#8B5CF6] text-[#8B5CF6]"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                condition === c.value ? "border-[#8B5CF6]" : "border-gray-300"
              )}>
                {condition === c.value && (
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                )}
              </div>
              <span className="text-sm font-medium">{c.label}</span>
            </button>
          ))}
        </div>
        {errors.condition && <p className="text-xs text-red-500">{errors.condition}</p>}
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <Button type="submit" loading={loading} fullWidth size="lg">
        Publier l'annonce
      </Button>
    </form>
  );
}