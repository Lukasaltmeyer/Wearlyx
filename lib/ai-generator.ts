import type { AIResult } from "@/components/ai/AIResultPreview";

export async function generateListingFromPhotos(
  photos: File[],
  style: string
): Promise<AIResult> {
  const photo = photos[0];
  if (!photo) throw new Error("Aucune photo fournie");

  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("style", style);

  const res = await fetch("/api/analyze-photo", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Erreur lors de l'analyse IA");
  }

  const data = await res.json();

  return {
    title: data.title ?? "Article de mode",
    description: data.description ?? "",
    price: typeof data.price === "number" ? data.price : 20,
    category: data.category ?? "casual",
    condition: data.condition ?? "très bon état",
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
}
