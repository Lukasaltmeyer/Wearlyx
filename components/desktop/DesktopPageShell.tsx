"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: number | string;
  noPadding?: boolean;
}

export function DesktopPageShell({ title, subtitle, backHref = "/profile/menu", actions, children, maxWidth, noPadding }: Props) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#0A0A0F", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        padding: "26px 32px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 14,
        flexShrink: 0,
      }}>
        <Link href={backHref} style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.6)", textDecoration: "none", flexShrink: 0,
        }}>
          <ArrowLeft style={{ width: 16, height: 16 }} />
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)", margin: "2px 0 0" }}>{subtitle}</p>}
        </div>
        {actions && <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>{actions}</div>}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: noPadding ? 0 : "28px 32px",
        ...(maxWidth ? { maxWidth, width: "100%" } : {}),
      }}>
        {children}
      </div>
    </div>
  );
}
