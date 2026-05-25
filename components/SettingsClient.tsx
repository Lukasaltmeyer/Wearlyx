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
      <div className="flex gap-8 items-start">

        {/* Left — sticky sub-nav */}
        <div className="w-[200px] flex-shrink-0 sticky top-8 flex flex-col gap-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2 px-3" style={{ color: "rgba(255,255,255,0.2)" }}>Paramètres</p>
          {GROUPS.map(({ label }) => (
            <a key={label} href={`#${label}`}
              className="px-3 py-2 rounded-[8px] text-[13px] font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.38)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}>
              {label}
            </a>
          ))}
          <div className="mt-4 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          <button onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] font-medium transition-colors mt-1 text-left"
            style={{ color: "rgba(239,68,68,0.5)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.9)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.5)"; }}>
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            Déconnexion
          </button>
        </div>

        {/* Right — content */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">
          {GROUPS.map(({ label, items }) => (
            <div key={label} id={label}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>{label}</p>
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
                {items.map(({ label: itemLabel, icon: Icon, href, bg, desc }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-4 px-5 py-4 rounded-[16px] transition-all group"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
                    <div className="w-10 h-10 rounded-[11px] flex items-center justify-center flex-shrink-0"
                      style={{ background: bg + "18", border: `1px solid ${bg}30` }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: bg }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold text-white/85">{itemLabel}</p>
                      <p className="text-[11.5px] text-white/30 mt-0.5 truncate">{desc}</p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 text-white/10 group-hover:text-white/40 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
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
