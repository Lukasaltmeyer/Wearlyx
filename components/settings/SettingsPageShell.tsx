"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, User, CreditCard, Truck, Shield, Bell, Globe, Eye } from "lucide-react";

const SECTIONS = [
  { href: "/profile/settings",                  label: "Paramètres",       icon: null      },
  { href: "/profile/edit",                       label: "Modifier le profil", icon: User    },
  { href: "/profile/settings/payment",           label: "Paiement",           icon: CreditCard },
  { href: "/profile/settings/shipping",          label: "Envoi & livraison",  icon: Truck   },
  { href: "/profile/settings/security",          label: "Sécurité",           icon: Shield  },
  { href: "/profile/settings/notifications",     label: "Notifications",      icon: Bell    },
  { href: "/profile/settings/language",          label: "Langue",             icon: Globe   },
  { href: "/profile/settings/privacy",           label: "Confidentialité",    icon: Eye     },
];

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsPageShell({ title, description, children }: Props) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: "100dvh", background: "#07060F", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(7,6,15,0.92)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 12, padding: "0 24px", height: 56, flexShrink: 0,
      }}>
        <Link href="/profile/settings" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 8,
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.5)", textDecoration: "none",
        }}>
          <ArrowLeft style={{ width: 15, height: 15 }} />
        </Link>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: 0 }}>Paramètres</p>
          <h1 style={{ fontSize: 15, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>{title}</h1>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Left nav (desktop only) */}
        <div style={{
          width: 220, flexShrink: 0, padding: "16px 12px",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex", flexDirection: "column", gap: 2,
        }}>
          {SECTIONS.filter(s => s.icon).map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8,
                background: active ? "rgba(139,92,246,0.1)" : "transparent",
                border: active ? "1px solid rgba(139,92,246,0.2)" : "1px solid transparent",
                color: active ? "#C4B5FD" : "rgba(255,255,255,0.38)",
                fontSize: 13, fontWeight: active ? 600 : 400, textDecoration: "none",
                transition: "all 0.1s",
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                {Icon && <Icon style={{ width: 14, height: 14, flexShrink: 0, color: active ? "#A78BFA" : "inherit" }} />}
                {label}
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, padding: "28px 32px", maxWidth: 680 }}>
          {description && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "0 0 24px", lineHeight: 1.6 }}>{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
