import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(req: NextRequest) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: "REPLICATE_API_TOKEN manquante" }, { status: 500 });
  }

  const formData = await req.formData();
  const photo = formData.get("photo") as File | null;
  if (!photo) {
    return NextResponse.json({ error: "Aucune photo fournie" }, { status: 400 });
  }

  const bytes = await photo.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUrl = `data:${photo.type || "image/jpeg"};base64,${base64}`;

  try {
    // Clarity Upscaler : amélioration qualité photo + lissage + netteté pro
    const output = await replicate.run(
      "philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
      {
        input: {
          image: dataUrl,
          scale_factor: 2,
          sharpen: 2.5,
          resemblance: 0.6,
          creativity: 0.25,
          dynamic: 6,
          sd_model: "epicrealism_naturalSinRC1VAE.safetensors [84d76a0328]",
          negative_prompt: "wrinkles, creases, folds, bad quality, blur",
          prompt: "professional product photo, clean garment, smooth fabric, studio lighting, high quality",
        },
      }
    );

    // output est une URL de l'image améliorée
    const imageUrl = output as unknown as string;

    // Télécharge l'image améliorée et la retourne en base64
    const imgRes = await fetch(imageUrl);
    const imgBuffer = await imgRes.arrayBuffer();
    const imgBase64 = Buffer.from(imgBuffer).toString("base64");

    return NextResponse.json({ image: `data:image/png;base64,${imgBase64}` });
  } catch (e: any) {
    return NextResponse.json({ error: `Erreur Replicate: ${e.message ?? "inconnue"}` }, { status: 500 });
  }
}
