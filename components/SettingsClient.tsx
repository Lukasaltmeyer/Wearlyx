"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, CreditCard, Truck, Shield, Bell, Globe, Eye, LogOut, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const SETTINGS = [
  { label: "Modifier mon profil",  icon: User,       href: "/profile/edit",              bg: "#3B82F6", desc: "Photo, nom, bio, ville" },
  { label: "Paiement",             icon: CreditCard, href: "/profile/settings/payment",  bg: "#10B981", desc: "IBAN, carte, virement" },
  { label: "Envoi & livraison",    icon: Truck,      href: "/profile/settings/shipping", bg: "#F59E0B", desc: "Adresse, transporteurs" },
  { label: "Sécurité",             icon: Shield,     href: "/profile/settings/security", bg: "#EF4444", desc: "Mot de passe, 2FA" },
  { label: "Notifications",        icon: Bell,       href: "/profile/settings/notifications", bg: "#8B5CF6", desc: "Email, push, SMS" },
  { label: "Langue",               icon: Globe,      href: "/profile/settings/language", bg: "#06B6D4", desc: "Langue de l'interface" },
  { label: "Confidentialité",      icon: Eye,        href: "/profile/settings/privacy",  bg: "#8B5CF6", desc: "Données, suppression" },
];

const GROUPS = [
  { label: "Profil",   items: SETTINGS.slice(0, 1) },
  { label: "Compte",   items: SETTINGS.slice(1, 4) },
  { label: "Préférences", items: SETTINGS.slice(4) },
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
      <div className="flex flex-col gap-10">
        {GROUPS.map(({ label, items }) => (
          <div key={label}>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>{label}</p>
            <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              {items.map(({ label: itemLabel, icon: Icon, href, bg, desc }, i) => (
                <Link key={href} href={href}
                  className="flex items-center gap-4 px-5 py-4 transition-all group"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}>
                  <div className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0"
                    style={{ background: bg + "18", border: `1px solid ${bg}28` }}>
                    <Icon className="w-4 h-4" style={{ color: bg }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13.5px] font-semibold text-white/85">{itemLabel}</p>
                    <p className="text-[11.5px] text-white/28 mt-0.5">{desc}</p>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/12 group-hover:text-white/35 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} className="pt-4">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all group"
            style={{ border: "1px solid rgba(239,68,68,0.12)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.22)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.12)"; }}>
            <LogOut className="w-4 h-4 text-red-400/60 group-hover:text-red-400 transition-colors" />
            <span className="text-[13px] font-semibold text-red-400/60 group-hover:text-red-400 transition-colors">Déconnexion</span>
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
          </Link>
        ))}
        <button onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border border-red-500/25 mt-2 w-full hover:bg-red-500/5 transition-all">
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="text-[14px] font-semibold text-red-400">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
