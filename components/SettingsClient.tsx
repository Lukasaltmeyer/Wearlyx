"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, CreditCard, Truck, Shield, Bell, Globe, Eye, LogOut, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const SETTINGS = [
  { label: "Modifier mon profil", icon: User, href: "/profile/edit", bg: "#3B82F6", desc: "Photo, nom, bio, ville" },
  { label: "Paiement", icon: CreditCard, href: "/profile/settings/payment", bg: "#10B981", desc: "IBAN, carte, virement" },
  { label: "Envoi & livraison", icon: Truck, href: "/profile/settings/shipping", bg: "#F59E0B", desc: "Adresse, transporteurs" },
  { label: "Sécurité", icon: Shield, href: "/profile/settings/security", bg: "#EF4444", desc: "Mot de passe, 2FA" },
  { label: "Notifications", icon: Bell, href: "/profile/settings/notifications", bg: "#8B5CF6", desc: "Email, push, SMS" },
  { label: "Langue", icon: Globe, href: "/profile/settings/language", bg: "#06B6D4", desc: "Langue de l'interface" },
  { label: "Confidentialité", icon: Eye, href: "/profile/settings/privacy", bg: "#8B5CF6", desc: "Données, suppression" },
];

export function SettingsClient({ isDesktop }: { isDesktop?: boolean }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-3">
          {SETTINGS.map(({ label, icon: Icon, href, bg, desc }) => (
            <Link key={href} href={href}
              className="flex items-center gap-4 px-5 py-4 rounded-[14px] border border-white/6 bg-white/[0.025] hover:bg-white/[0.045] hover:border-white/10 transition-all group">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: bg + "22", border: `1px solid ${bg}33` }}>
                <Icon className="w-5 h-5" style={{ color: bg }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-white/85">{label}</p>
                <p className="text-[12px] text-white/30 mt-0.5">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/30 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} className="pt-6">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3.5 rounded-[14px] border border-red-500/15 hover:bg-red-500/5 hover:border-red-500/25 transition-all">
            <LogOut className="w-4 h-4 text-red-400/70" />
            <span className="text-[14px] font-semibold text-red-400/70">Déconnexion</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-5 pb-5">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-bold text-white">Paramètres</h1>
      </div>
      <div className="px-4 flex flex-col gap-1.5">
        {SETTINGS.map(({ label, icon: Icon, href, bg }) => (
          <Link key={href} href={href}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border border-white/6 bg-white/2 hover:bg-white/4 transition-all">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="flex-1 text-[14px] font-semibold text-white">{label}</span>
            <ChevronRight className="w-4 h-4 text-white/20" />
          </Link>
        ))}
        <button onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border border-red-500/25 mt-2 w-full text-left hover:bg-red-500/5 transition-all">
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="text-[14px] font-semibold text-red-400">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
