"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, AtSign, MapPin, FileText, Save, Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

interface Props {
  profile: Profile | null;
  userId: string;
}

export function ProfileEditClient({ profile, userId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url ?? "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview instantly
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setUploadingAvatar(true);
    setError("");

    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `avatars/${userId}/avatar.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      // Add cache-bust so Next.js Image refreshes
      const bustedUrl = `${publicUrl}?t=${Date.now()}`;
      setAvatarUrl(bustedUrl);
    } catch {
      setError("Erreur lors de l'upload de la photo.");
      setAvatarPreview(profile?.avatar_url ?? "");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: err } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username,
        bio,
        location,
        avatar_url: avatarUrl || profile?.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (err) {
      setError("Erreur lors de la sauvegarde.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1000);
    }
    setLoading(false);
  };

  const initials = (fullName || username || "?")[0]?.toUpperCase();

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[20px] font-black text-white">Modifier mon profil</h1>
      </div>

      {/* Avatar picker */}
      <div className="flex flex-col items-center mb-6">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative group"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32]">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{initials}</span>
              </div>
            )}
          </div>
          {/* Overlay on hover */}
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
            {uploadingAvatar
              ? <Loader2 className="w-5 h-5 text-white animate-spin" />
              : <Camera className="w-5 h-5 text-white" />
            }
          </div>
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mt-2 text-[13px] text-[#4CAF50] font-semibold"
        >
          {uploadingAvatar ? "Upload en cours…" : "Changer la photo"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-3">
        {/* Nom */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
          <User className="w-4 h-4 text-white/35 flex-shrink-0" />
          <input
            type="text"
            placeholder="Prénom Nom"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="flex-1 bg-transparent text-[15px] text-white placeholder-white/25 outline-none"
          />
        </div>

        {/* Username */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
          <AtSign className="w-4 h-4 text-white/35 flex-shrink-0" />
          <input
            type="text"
            placeholder="pseudo"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
            className="flex-1 bg-transparent text-[15px] text-white placeholder-white/25 outline-none"
          />
        </div>

        {/* Localisation */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
          <MapPin className="w-4 h-4 text-white/35 flex-shrink-0" />
          <input
            type="text"
            placeholder="Ville (ex: Paris)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 bg-transparent text-[15px] text-white placeholder-white/25 outline-none"
          />
        </div>

        {/* Bio */}
        <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
          <FileText className="w-4 h-4 text-white/35 flex-shrink-0 mt-0.5" />
          <textarea
            placeholder="Ta bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="flex-1 bg-transparent text-[15px] text-white placeholder-white/25 outline-none resize-none"
          />
        </div>

        {error && <p className="text-[12px] text-red-400">{error}</p>}
        {success && <p className="text-[12px] text-[#4CAF50]">Profil mis à jour !</p>}

        <button
          type="submit"
          disabled={loading || uploadingAvatar}
          className="w-full py-4 rounded-2xl bg-[#4CAF50] text-[15px] font-bold text-white shadow-lg shadow-[#4CAF50]/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? "Sauvegarde…" : "Sauvegarder"}
        </button>
      </form>
    </div>
  );
}
