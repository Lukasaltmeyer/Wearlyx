import Link from "next/link";
import {
  Zap, ShieldCheck, Package, MessageCircle, Star, TrendingUp,
  Heart, Truck, Camera, Sparkles, Users, ArrowRight, Check, Crown,
  BarChart2, Bell, Search, Tag
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#07070A", color: "white", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(7,7,10,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-[20px] font-black tracking-tight">
          Wear<span style={{ background: "linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>lyx</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-[13px] font-semibold text-white/50 hover:text-white transition-colors px-3 py-1.5">
            Se connecter
          </Link>
          <Link href="/auth/register"
            className="text-[13px] font-bold text-white px-4 py-2 rounded-xl transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#8B5CF6,#7C3AED)", boxShadow: "0 4px 20px rgba(139,92,246,0.35)" }}>
            Commencer
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "15%", left: "30%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[12px] font-bold text-purple-300">Marketplace mode IA · Gratuit</span>
            </div>

            <h1 className="text-[48px] sm:text-[64px] font-black leading-[1.05] tracking-tight mb-6">
              Vends ta<br />
              garde-robe en<br />
              <span style={{ background: "linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                quelques secondes
              </span>
            </h1>

            <p className="text-[17px] text-white/50 leading-relaxed mb-8 max-w-[440px]">
              Wearlyx utilise l'intelligence artificielle pour rédiger tes annonces, améliorer tes photos et te connecter avec des acheteurs partout en France.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-3 mb-10">
              {[
                { icon: Sparkles, text: "Annonce générée par IA en 10 secondes", color: "#8B5CF6" },
                { icon: ShieldCheck, text: "Protection acheteur incluse sur chaque vente", color: "#10B981" },
                { icon: Zap, text: "Boost tes articles pour plus de visibilité", color: "#F59E0B" },
                { icon: MessageCircle, text: "Messagerie intégrée avec tes acheteurs", color: "#3B82F6" },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}22` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <span className="text-[14px] text-white/70">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link href="/auth/register"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[15px] font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg,#8B5CF6,#7C3AED)", boxShadow: "0 8px 30px rgba(139,92,246,0.4)" }}>
                Créer un compte gratuit <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/auth/login" className="text-[14px] text-white/40 hover:text-white/70 transition-colors">
                Déjà un compte
              </Link>
            </div>

            <p className="mt-4 text-[12px] text-white/25">Gratuit pour toujours · Sans carte de crédit · 5% seulement sur les ventes</p>
          </div>

          {/* Right — phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="py-12 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "10s", label: "Pour créer une annonce" },
            { value: "5%", label: "Commission seulement" },
            { value: "100%", label: "Gratuit pour acheter" },
            { value: "IA", label: "Photos & descriptions" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-[36px] font-black mb-1"
                style={{ background: "linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {value}
              </p>
              <p className="text-[13px] text-white/35">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-purple-400 mb-3">Fonctionnalités</p>
            <h2 className="text-[40px] font-black leading-tight mb-4">
              Tout ce qu'il faut pour<br />acheter et vendre
            </h2>
            <p className="text-[16px] text-white/40 max-w-[480px] mx-auto">
              De la photo à la livraison, chaque étape est simplifiée.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6" style={{ background: "rgba(139,92,246,0.04)", borderTop: "1px solid rgba(139,92,246,0.1)", borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-purple-400 mb-3">Comment ça marche</p>
            <h2 className="text-[40px] font-black leading-tight">
              Vendre n'a jamais été aussi simple
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_STEPS.map((step, i) => (
              <HowStep key={step.title} step={i + 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[12px] font-bold text-purple-300">Intelligence Artificielle</span>
            </div>
            <h2 className="text-[40px] font-black leading-tight mb-6">
              L'IA rédige tes annonces<br />
              <span style={{ background: "linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                à ta place
              </span>
            </h2>
            <p className="text-[16px] text-white/50 leading-relaxed mb-8">
              Prends une photo de ton vêtement. Notre IA détecte la marque, la taille, l'état et rédige une description complète et attractive en quelques secondes.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Détection automatique de la marque et de la catégorie",
                "Suppression du fond et amélioration de la photo (Pro)",
                "Prix suggéré selon le marché en temps réel",
                "Description optimisée pour les recherches",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.35)" }}>
                    <Check className="w-3 h-3 text-purple-300" />
                  </div>
                  <span className="text-[14px] text-white/65">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <AICard />
          </div>
        </div>
      </section>

      {/* ── PROTECTION ── */}
      <section className="py-24 px-6" style={{ background: "rgba(16,185,129,0.03)", borderTop: "1px solid rgba(16,185,129,0.08)", borderBottom: "1px solid rgba(16,185,129,0.08)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <ProtectionCard />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[12px] font-bold text-emerald-300">Protection acheteur</span>
            </div>
            <h2 className="text-[40px] font-black leading-tight mb-6">
              Chaque transaction<br />est
              <span style={{ background: "linear-gradient(135deg,#10B981,#34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> sécurisée</span>
            </h2>
            <p className="text-[16px] text-white/50 leading-relaxed mb-8">
              La protection acheteur est incluse dans chaque commande. En cas de litige, notre équipe intervient pour résoudre le problème.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Paiement sécurisé et garanti",
                "Article non conforme ? Remboursement complet",
                "Suivi de livraison en temps réel",
                "Support prioritaire pour les litiges",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                    <Check className="w-3 h-3 text-emerald-300" />
                  </div>
                  <span className="text-[14px] text-white/65">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-purple-400 mb-3">Tarifs</p>
            <h2 className="text-[40px] font-black leading-tight mb-4">Simple et transparent</h2>
            <p className="text-[16px] text-white/40">
              Gratuit pour démarrer. Seulement 5% de commission sur tes ventes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} {...plan} />
            ))}
          </div>

          <p className="text-center text-[13px] text-white/25 mt-8">
            Aucun frais cachés · Pas de frais d'inscription · Pas de frais pour acheter
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-[48px] font-black leading-tight mb-6">
            Prêt à vider ton<br />
            <span style={{ background: "linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              dressing ?
            </span>
          </h2>
          <p className="text-[17px] text-white/45 mb-10">
            Rejoins la communauté Wearlyx et commence à vendre dès aujourd'hui.
          </p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-[16px] font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#8B5CF6,#7C3AED)", boxShadow: "0 12px 40px rgba(139,92,246,0.45)" }}>
            Créer mon compte gratuitement <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <span className="text-[18px] font-black">
          Wear<span style={{ background: "linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>lyx</span>
        </span>
        <p className="text-[12px] text-white/20 mt-2">© 2025 Wearlyx · Mode seconde main, propulsée par l'IA</p>
      </footer>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PhoneMockup() {
  return (
    <div className="relative" style={{ width: 260, height: 520 }}>
      {/* Phone frame */}
      <div className="absolute inset-0 rounded-[44px] overflow-hidden"
        style={{ background: "linear-gradient(145deg,#1A1A2E,#16213E)", border: "1.5px solid rgba(255,255,255,0.12)", boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full z-10"
          style={{ background: "#0D0D14" }} />
        {/* Screen content */}
        <div className="absolute inset-0 pt-10 px-3 pb-3 flex flex-col gap-2">
          {/* Mini product cards */}
          {[
            { name: "Jordan 1 Retro High", brand: "Nike", price: "89€", color: "#8B5CF6" },
            { name: "Levi's 501 Original", brand: "Levi's", price: "34€", color: "#3B82F6" },
            { name: "Bomber Vintage", brand: "Zara", price: "28€", color: "#10B981" },
          ].map((item) => (
            <div key={item.name} className="rounded-xl p-2.5 flex items-center gap-2"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-10 h-10 rounded-lg flex-shrink-0"
                style={{ background: `${item.color}22`, border: `1px solid ${item.color}33` }}>
                <div className="w-full h-full flex items-center justify-center">
                  <Tag className="w-4 h-4" style={{ color: item.color }} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-white truncate">{item.name}</p>
                <p className="text-[9px] text-white/35">{item.brand}</p>
              </div>
              <span className="text-[11px] font-black" style={{ color: item.color }}>{item.price}</span>
            </div>
          ))}
          {/* Boost indicator */}
          <div className="rounded-xl px-3 py-2 flex items-center gap-2"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <TrendingUp className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-300">Jordan boosted · 847 vues</span>
          </div>
          {/* New order */}
          <div className="rounded-xl px-3 py-2 flex items-center gap-2"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <Package className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-300">Nouvelle commande ! +89€</span>
          </div>
        </div>
      </div>
      {/* Reflection */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-8 rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse, #8B5CF6, transparent)" }} />
    </div>
  );
}

function AICard() {
  return (
    <div className="w-full max-w-[340px] rounded-3xl p-6"
      style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)", boxShadow: "0 20px 60px rgba(139,92,246,0.12)" }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-purple-400 mb-4">Génération IA en cours…</p>
      <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3] flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(124,58,237,0.08))", border: "1px dashed rgba(139,92,246,0.25)" }}>
        <div className="text-center">
          <Camera className="w-10 h-10 text-purple-500 mx-auto mb-2" />
          <span className="text-[12px] text-purple-400">Photo analysée</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {[
          { label: "Marque", value: "Nike · Air Max 90", done: true },
          { label: "Catégorie", value: "Chaussures", done: true },
          { label: "Description", value: "Génération…", done: false },
          { label: "Prix suggéré", value: "74€", done: true },
        ].map(({ label, value, done }) => (
          <div key={label} className="flex items-center justify-between py-1.5 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <span className="text-[12px] text-white/35">{label}</span>
            <span className={`text-[12px] font-semibold ${done ? "text-white/80" : "text-purple-400"}`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProtectionCard() {
  return (
    <div className="w-full max-w-[320px] flex flex-col gap-3">
      {[
        { title: "Commande confirmée", sub: "Paiement sécurisé reçu", icon: ShieldCheck, color: "#10B981", amount: "+34.00€" },
        { title: "Colis expédié", sub: "Suivi n° WLX-8821-FR", icon: Truck, color: "#3B82F6", amount: null },
        { title: "Livraison confirmée", sub: "Article conforme", icon: Check, color: "#10B981", amount: null },
        { title: "Avis laissé ⭐⭐⭐⭐⭐", sub: "Transaction terminée", icon: Star, color: "#F59E0B", amount: null },
      ].map(({ title, sub, icon: Icon, color, amount }, i) => (
        <div key={title} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: `${color}0D`, border: `1px solid ${color}22`, opacity: i === 0 ? 1 : 0.7 + i * 0.1 }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}1A` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-white">{title}</p>
            <p className="text-[11px] text-white/35">{sub}</p>
          </div>
          {amount && <span className="text-[14px] font-black" style={{ color }}>{amount}</span>}
        </div>
      ))}
    </div>
  );
}

interface FeatureCardProps { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; title: string; desc: string; color: string; }
function FeatureCard({ icon: Icon, title, desc, color }: FeatureCardProps) {
  return (
    <div className="p-5 rounded-2xl transition-all hover:scale-[1.01]"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${color}18` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="text-[15px] font-bold text-white mb-1.5">{title}</h3>
      <p className="text-[13px] text-white/35 leading-relaxed">{desc}</p>
    </div>
  );
}

interface HowStepProps { step: number; title: string; desc: string; }
function HowStep({ step, title, desc }: HowStepProps) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[18px] font-black"
        style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(124,58,237,0.15))", border: "1px solid rgba(139,92,246,0.3)", color: "#C4B5FD" }}>
        {step}
      </div>
      <h3 className="text-[15px] font-bold text-white mb-2">{title}</h3>
      <p className="text-[13px] text-white/35 leading-relaxed">{desc}</p>
    </div>
  );
}

interface PlanCardProps { name: string; price: string; priceNote: string; perks: readonly string[]; highlight?: boolean; badge?: string; }
function PlanCard({ name, price, priceNote, perks, highlight, badge }: PlanCardProps) {
  return (
    <div className="relative p-6 rounded-3xl flex flex-col"
      style={{
        background: highlight ? "linear-gradient(145deg,rgba(139,92,246,0.12),rgba(124,58,237,0.06))" : "rgba(255,255,255,0.025)",
        border: highlight ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)",
        boxShadow: highlight ? "0 20px 60px rgba(139,92,246,0.15)" : "none",
      }}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold"
          style={{ background: "linear-gradient(135deg,#8B5CF6,#7C3AED)", color: "white" }}>
          {badge}
        </div>
      )}
      <p className="text-[13px] font-bold text-white/50 mb-1">{name}</p>
      <p className="text-[32px] font-black text-white mb-0.5">{price}</p>
      <p className="text-[12px] text-white/30 mb-6">{priceNote}</p>
      <div className="flex flex-col gap-3 flex-1">
        {perks.map((perk) => (
          <div key={perk} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <span className="text-[13px] text-white/60">{perk}</span>
          </div>
        ))}
      </div>
      <Link href="/auth/register"
        className="mt-6 block text-center py-3 rounded-xl text-[13px] font-bold transition-all hover:opacity-90"
        style={highlight
          ? { background: "linear-gradient(135deg,#8B5CF6,#7C3AED)", color: "white" }
          : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
        Commencer
      </Link>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Sparkles, title: "Annonces générées par IA", desc: "Décris juste ton article — notre IA rédige un titre, une description et suggère un prix.", color: "#8B5CF6" },
  { icon: Camera, title: "Amélioration de photos", desc: "Suppression de fond et retouche automatique pour des photos professionnelles.", color: "#A855F7" },
  { icon: ShieldCheck, title: "Protection acheteur", desc: "Chaque transaction est couverte. Paiement sécurisé, remboursement garanti.", color: "#10B981" },
  { icon: Zap, title: "Boost d'annonces", desc: "Mets ton article en tête des résultats pendant 24h pour plus de visibilité.", color: "#F59E0B" },
  { icon: MessageCircle, title: "Messagerie intégrée", desc: "Discute directement avec les acheteurs et vendeurs en temps réel.", color: "#3B82F6" },
  { icon: Truck, title: "Livraison simplifiée", desc: "Point relais, consigne ou domicile — toujours calculé automatiquement.", color: "#06B6D4" },
  { icon: Heart, title: "Favoris & sauvegardes", desc: "Retrouve facilement les articles que tu surveilles.", color: "#EC4899" },
  { icon: BarChart2, title: "Statistiques vendeur", desc: "Suis tes vues, clics et ventes pour optimiser tes annonces.", color: "#8B5CF6" },
  { icon: Bell, title: "Notifications en temps réel", desc: "Sois alerté dès qu'une offre est faite ou qu'un acheteur te contacte.", color: "#F97316" },
  { icon: Search, title: "Recherche avancée", desc: "Filtres par marque, taille, couleur, état et bien plus.", color: "#14B8A6" },
  { icon: Crown, title: "Plans Premium", desc: "Commission 0%, boosts illimités et suppression de fond IA avancée.", color: "#F59E0B" },
  { icon: Users, title: "Communauté mode", desc: "Acheteurs et vendeurs passionnés de mode seconde main partout en France.", color: "#8B5CF6" },
] as const;

const HOW_STEPS = [
  { title: "Prends une photo", desc: "Photographie ton vêtement en quelques secondes avec ton téléphone." },
  { title: "L'IA génère tout", desc: "Titre, description, prix suggéré — tout est prêt en moins de 10 secondes." },
  { title: "Un acheteur paie", desc: "Tu reçois une notification et le paiement est sécurisé par Wearlyx." },
  { title: "Tu expédies l'article", desc: "Imprime l'étiquette, dépose le colis — c'est tout !" },
];

const PLANS = [
  {
    name: "Gratuit",
    price: "0€",
    priceNote: "Pour toujours",
    perks: ["5 annonces IA / mois", "Commission 5% sur les ventes", "Messagerie intégrée", "Protection acheteur"],
  },
  {
    name: "Vendeur Pro",
    price: "9.99€",
    priceNote: "/ mois",
    badge: "Le plus populaire",
    highlight: true,
    perks: ["60 annonces IA / mois", "Commission 5% sur les ventes", "Suppression fond IA", "15 boosts / mois", "Stats avancées", "Relance acheteurs"],
  },
  {
    name: "Premium",
    price: "19.99€",
    priceNote: "/ mois",
    perks: ["Annonces IA illimitées", "Commission 0% !", "Boosts illimités", "Boutique personnalisée", "Support prioritaire", "Toutes les fonctions Pro"],
  },
] as const;
