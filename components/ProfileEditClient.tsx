"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, AtSign, MapPin, FileText, Globe, Camera, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

interface Props {
  profile: Profile | null;
  userId: string;
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 focus-within:border-[#8B5CF6]/40 transition-colors">
      <span className="text-white/35 flex-shrink-0">{icon}</span>
      {children}
    </div>
  );
}

export function ProfileEditClient({ profile, userId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [city, setCity] = useState((profile as any)?.city ?? profile?.location ?? "");
  const [country, setCountry] = useState((profile as any)?.country ?? "France");
  const [showCity, setShowCity] = useState((profile as any)?.show_city ?? true);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const initials = (fullName || username || "?")[0]?.toUpperCase();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);
    setError("");
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `avatars/${userId}/avatar.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
    } catch {
      setError("Erreur lors de l'upload de la photo.");
      setAvatarPreview(profile?.avatar_url ?? "");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const { error: err } = await supabase.from("profiles").update({
      full_name: fullName,
      username,
      bio,
      location: city,
      city,
      country,
      show_city: showCity,
      avatar_url: avatarUrl || profile?.avatar_url,
      updated_at: new Date().toISOString(),
    }).eq("id", userId);
    if (err) {
      setError("Erreur : " + err.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.back(), 1200);
    }
    setLoading(false);
  };

  return (
    <div className="px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[20px] font-black text-white">Modifier mon profil</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <button type="button" onClick={() => fileRef.current?.click()} className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#8B5CF6]/40 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]">
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><span className="text-white font-bold text-3xl">{initials}</span></div>}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
            {uploadingAvatar ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
          </div>
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#8B5CF6] border-2 border-[#07070A] flex items-center justify-center">
            <Camera className="w-3.5 h-3.5 text-white" />
          </div>
        </button>
        <button type="button" onClick={() => fileRef.current?.click()}
          className="mt-2.5 text-[13px] text-[#A78BFA] font-semibold">
          {uploadingAvatar ? "Upload en cours…" : "Changer la photo"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-3">

        <Field icon={<User className="w-4 h-4" />}>
          <input type="text" placeholder="Prénom Nom" value={fullName} onChange={(e) => setFullName(e.target.value)}
            className="flex-1 bg-transparent text-[15px] text-white placeholder-white/25 outline-none" />
        </Field>

        <Field icon={<AtSign className="w-4 h-4" />}>
          <input type="text" placeholder="pseudo" value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
            className="flex-1 bg-transparent text-[15px] text-white placeholder-white/25 outline-none" />
        </Field>

        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 focus-within:border-[#8B5CF6]/40 transition-colors">
          <FileText className="w-4 h-4 text-white/35 flex-shrink-0 mt-0.5" />
          <textarea placeholder="À propos de moi…" value={bio} onChange={(e) => setBio(e.target.value)}
            rows={3} className="flex-1 bg-transparent text-[15px] text-white placeholder-white/25 outline-none resize-none" />
        </div>

        <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mt-1">Ma position</p>

        <Field icon={<MapPin className="w-4 h-4" />}>
          <input type="text" placeholder="Ville (ex: Paris)" value={city} onChange={(e) => setCity(e.target.value)}
            className="flex-1 bg-transparent text-[15px] text-white placeholder-white/25 outline-none" />
        </Field>

        <Field icon={<Globe className="w-4 h-4" />}>
          <input type="text" placeholder="Pays (ex: France)" value={country} onChange={(e) => setCountry(e.target.value)}
            className="flex-1 bg-transparent text-[15px] text-white placeholder-white/25 outline-none" />
        </Field>

        {/* Toggle afficher la ville */}
        <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl border border-white/10 bg-white/[0.04]">
          <span className="text-[14px] text-white/70">Afficher la ville dans le profil</span>
          <button type="button" onClick={() => setShowCity((v: boolean) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${showCity ? "bg-[#8B5CF6]" : "bg-white/15"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${showCity ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>

        {error && <p className="text-[12px] text-red-400 px-1">{error}</p>}

        <button type="submit" disabled={loading || uploadingAvatar}
          className="w-full py-4 rounded-2xl text-[15px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          style={{ background: success ? "#10B981" : "linear-gradient(135deg, #8B5CF6, #7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" />
            : success ? <><Check className="w-4 h-4" /> Sauvegardé !</>
            : "Sauvegarder"}
        </button>
      </form>
    </div>
  );
}
