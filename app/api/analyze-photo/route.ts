import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_FILE_SIZE_MB = 10;

export async function POST(req: NextRequest) {
  // Auth required — prevents free API abuse
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Service IA indisponible" }, { status: 503 });
  }

  const formData = await req.formData();
  const photo = formData.get("photo") as File | null;
  const styleRaw = (formData.get("style") as string) ?? "fond_blanc";

  if (!photo) {
    return NextResponse.json({ error: "Aucune photo fournie" }, { status: 400 });
  }

  // Validate file size
  if (photo.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `Image trop grande (max ${MAX_FILE_SIZE_MB} Mo)` }, { status: 400 });
  }

  // Validate MIME type — prevent SVG/HTML/script injection
  if (!ALLOWED_MIME_TYPES.includes(photo.type)) {
    return NextResponse.json({ error: "Format non supporté (JPEG, PNG, WebP uniquement)" }, { status: 400 });
  }

  // Sanitize style parameter — whitelist only
  const ALLOWED_STYLES = ["fond_blanc", "rose_pastel", "noir_luxe", "bleu_ciel", "lavande", "sable"];
  const style = ALLOWED_STYLES.includes(styleRaw) ? styleRaw : "fond_blanc";

  const bytes = await photo.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const prompt = `Tu es un expert en mode et en vente en ligne (Vinted, Vestiaire Collective). Analyse cette photo de vêtement et génère une annonce complète.

Réponds UNIQUEMENT avec un JSON valide (pas de texte avant ni après):
{
  "title": "Titre accrocheur max 60 caractères avec la marque si visible",
  "brand": "Marque exacte ou Sans marque",
  "description": "Description 100-150 mots: type, matière, coupe, état, particularités",
  "price": 25,
  "category": "streetwear ou casual ou sport ou luxe ou vintage ou formel",
  "condition": "neuf avec étiquette ou neuf ou très bon état ou bon état ou état correct",
  "size": "XS ou S ou M ou L ou XL ou XXL",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}
Style: ${style}. Prix réaliste pour Vinted en euros.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: photo.type, data: base64 } },
            ],
          }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const errMsg = data?.error?.message ?? data?.error ?? JSON.stringify(data);
      return NextResponse.json({ error: `Gemini: ${errMsg}` }, { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Réponse invalide de l'IA" }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (e: any) {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
