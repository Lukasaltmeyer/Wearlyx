import Link from "next/link";
import {
  Sparkles, ShieldCheck, Zap, MessageCircle, Truck, Heart,
  Camera, BarChart2, Bell, Search, Crown, Users, Check, Package,
} from "lucide-react";

/* ── Feature grid data ─────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Sparkles,      title: "Annonces générées par IA",   desc: "Photo → titre, description et prix en 10 secondes.",          color: "#8B5CF6" },
  { icon: Camera,        title: "Amélioration de photos",      desc: "Suppression de fond et retouche automatique (Pro).",           color: "#A855F7" },
  { icon: ShieldCheck,   title: "Protection acheteur",         desc: "Chaque transaction est couverte. Remboursement garanti.",      color: "#10B981" },
  { icon: Zap,           title: "Boost d'annonces",            desc: "Mets ton article en tête des résultats pendant 24h.",          color: "#F59E0B" },
  { icon: MessageCircle, title: "Messagerie intégrée",         desc: "Discute directement avec acheteurs et vendeurs.",              color: "#3B82F6" },
  { icon: Truck,         title: "Livraison simplifiée",        desc: "Point relais, consigne ou domicile — calculé auto.",           color: "#06B6D4" },
  { icon: Heart,         title: "Favoris & sauvegardes",       desc: "Retrouve les articles que tu surveilles.",                    color: "#EC4899" },
  { icon: BarChart2,     title: "Statistiques vendeur",        desc: "Vues, clics, ventes — optimise tes annonces.",                color: "#8B5CF6" },
  { icon: Bell,          title: "Notifications temps réel",    desc: "Alerté dès qu'une offre est faite ou un message reçu.",       color: "#F97316" },
  { icon: Search,        title: "Recherche avancée",           desc: "Filtres par marque, taille, couleur, état.",                  color: "#14B8A6" },
  { icon: Crown,         title: "Plans Premium",               desc: "Commission 0%, boosts illimités, fond IA avancé.",            color: "#F59E0B" },
  { icon: Users,         title: "Communauté mode",             desc: "Acheteurs et vendeurs passionnés partout en France.",         color: "#8B5CF6" },
] as const;

/* ── How it works ─────────────────────────────────────────────────────────── */
const HOW_STEPS = [
  { n: "01", title: "Prends une photo",      desc: "Photographie ton vêtement en quelques secondes avec ton téléphone." },
  { n: "02", title: "L'IA génère tout",      desc: "Titre, description, prix suggéré — prêt en moins de 10 secondes." },
  { n: "03", title: "Un acheteur paie",      desc: "Notification instantanée. Le paiement est sécurisé par Wearlyx." },
  { n: "04", title: "Tu expédies l'article", desc: "Imprime l'étiquette, dépose le colis. C'est tout !" },
] as const;

/* ── Plans ─────────────────────────────────────────────────────────────────── */
const PLANS = [
  {
    name: "Gratuit",
    price: "0€",
    firstMonth: null,
    note: "Pour toujours",
    perks: ["5 annonces IA / mois", "0% de frais vendeur", "Messagerie intégrée", "Protection acheteur"],
    highlight: false,
  },
  {
    name: "Starter",
    price: "10€",
    firstMonth: "8€",
    note: "/ mois",
    perks: ["30 annonces IA / mois", "0% de frais vendeur", "5 boosts / mois", "Stats de base"],
    highlight: false,
  },
  {
    name: "Vendeur Pro",
    price: "25€",
    firstMonth: "18€",
    note: "/ mois",
    badge: "Le plus populaire",
    perks: ["100 annonces IA / mois", "Suppression fond IA", "20 boosts / mois", "Stats avancées", "Relance acheteurs"],
    highlight: true,
  },
  {
    name: "Premium",
    price: "50€",
    firstMonth: "25€",
    note: "/ mois",
    perks: ["Annonces IA illimitées", "0% de frais vendeur", "Boosts illimités", "Boutique personnalisée", "Support prioritaire"],
    highlight: false,
  },
] as const;

export function LandingSections() {
  return (
    <div style={{ background: "#07070A", overflowX: "hidden" }}>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <div className="py-14 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "10s",   label: "Pour créer une annonce" },
            { value: "0%",    label: "Frais pour les vendeurs" },
            { value: "7%",    label: "Frais acheteur (5%+2%)" },
            { value: "IA",    label: "Photos & descriptions" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-[38px] font-black mb-1 leading-none"
                style={{ background: "linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {value}
              </p>
              <p className="text-[13px] text-white/30 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURE GRID ──────────────────────────────────────────────────── */}
      <div className="py-20 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#8B5CF6" }}>Fonctionnalités</p>
            <h2 className="text-[38px] font-black leading-tight text-white mb-3">
              Un seul espace pour<br />
              <span style={{ background: "linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                acheter et vendre
              </span>
            </h2>
            <p className="text-[15px] text-white/35 max-w-[460px] mx-auto">
              Douze modules intégrés qui couvrent tout le parcours, de la photo à la livraison.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title}
                className="p-5 rounded-2xl transition-all hover:scale-[1.01] cursor-default"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}18` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <p className="text-[14px] font-bold text-white mb-1">{title}</p>
                <p className="text-[12.5px] text-white/35 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <div className="py-20 px-6"
        style={{ background: "rgba(139,92,246,0.04)", borderTop: "1px solid rgba(139,92,246,0.1)", borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — mini mockup */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: "#8B5CF6" }}>Vendre avec l&apos;IA</p>
            <h2 className="text-[36px] font-black text-white leading-tight mb-4">
              Vendre n&apos;a jamais<br />
              <span style={{ background: "linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                été aussi simple
              </span>
            </h2>
            {HOW_STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-[14px] font-black"
                  style={{
                    background: "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(124,58,237,0.15))",
                    border: "1px solid rgba(139,92,246,0.3)",
                    color: "#C4B5FD",
                  }}>
                  {n}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-white">{title}</p>
                  <p className="text-[12.5px] text-white/35 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — mock card */}
          <div className="flex justify-center lg:justify-end">
            <AiPreviewCard />
          </div>
        </div>
      </div>

      {/* ── PROTECTION ─────────────────────────────────────────────────────── */}
      <div className="py-20 px-6"
        style={{ borderBottom: "1px solid rgba(16,185,129,0.08)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#10B981" }}>Protection acheteur</p>
            <h2 className="text-[36px] font-black text-white leading-tight mb-4">
              Chaque transaction<br />
              <span style={{ background: "linear-gradient(135deg,#10B981,#34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                est sécurisée
              </span>
            </h2>
            <p className="text-[15px] text-white/40 leading-relaxed mb-6">
              La protection acheteur est incluse dans chaque commande. En cas de litige, notre équipe intervient pour résoudre le problème.
            </p>
            {[
              "Paiement sécurisé et garanti",
              "Article non conforme ? Remboursement complet",
              "Suivi de livraison en temps réel",
              "Support prioritaire pour les litiges",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                  <Check className="w-3 h-3 text-emerald-300" />
                </div>
                <span className="text-[13.5px] text-white/60">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center lg:justify-end">
            <ProtectionTimeline />
          </div>
        </div>
      </div>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#8B5CF6" }}>Tarifs</p>
            <h2 className="text-[38px] font-black text-white leading-tight mb-3">
              Simple et transparent
            </h2>
            <p className="text-[15px] text-white/35">
              Gratuit pour démarrer. 0% de frais pour les vendeurs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan) => (
              <div key={plan.name} className="relative p-6 rounded-3xl flex flex-col"
                style={{
                  background: plan.highlight
                    ? "linear-gradient(145deg,rgba(139,92,246,0.12),rgba(124,58,237,0.06))"
                    : "rgba(255,255,255,0.025)",
                  border: plan.highlight ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: plan.highlight ? "0 20px 60px rgba(139,92,246,0.15)" : "none",
                }}>
                {"badge" in plan && plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#8B5CF6,#7C3AED)" }}>
                    {plan.badge}
                  </div>
                )}
                <p className="text-[12px] font-bold text-white/40 mb-1">{plan.name}</p>
                <div className="flex items-end gap-2 mb-0.5">
                  <p className="text-[32px] font-black text-white leading-none">{plan.price}</p>
                  {plan.firstMonth && (
                    <p className="text-[12px] text-purple-400 font-bold mb-1">{plan.firstMonth} le 1er mois</p>
                  )}
                </div>
                <p className="text-[12px] text-white/25 mb-5">{plan.note}</p>
                <div className="flex flex-col gap-2.5 flex-1">
                  {plan.perks.map((perk) => (
                    <div key={perk} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[12.5px] text-white/55">{perk}</span>
                    </div>
                  ))}
                </div>
                <Link href="/auth/signup"
                  className="mt-6 block text-center py-3 rounded-xl text-[13px] font-bold transition-all hover:opacity-90"
                  style={plan.highlight
                    ? { background: "linear-gradient(135deg,#8B5CF6,#7C3AED)", color: "white" }
                    : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  Commencer
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-[12px] text-white/20 mt-8">
            0% pour les vendeurs · 5% commission + 2% protection pour les acheteurs · Sans frais d&apos;inscription
          </p>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <div className="px-6 pt-16 pb-10" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.35)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

            {/* Brand */}
            <div>
              <span className="text-[22px] font-black tracking-tight block mb-3">
                Wear<span style={{ background:"linear-gradient(135deg,#8B5CF6,#C4B5FD)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>lyx</span>
              </span>
              <p className="text-[13px] text-white/35 leading-relaxed">
                La marketplace mode seconde main propulsée par l&apos;intelligence artificielle. Vends en 10 secondes.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color:"#8B5CF6" }}>Navigation</p>
              <div className="flex flex-col gap-2.5">
                {["Accueil","Parcourir les articles","Vendre un article","Comment ça marche"].map(l=>(
                  <span key={l} className="text-[13px] text-white/40 hover:text-white/70 transition-colors cursor-pointer">{l}</span>
                ))}
              </div>
            </div>

            {/* Vendeurs */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color:"#8B5CF6" }}>Vendeurs</p>
              <div className="flex flex-col gap-2.5">
                {["Créer une annonce","Booster mes articles","Plans Premium","Guide du vendeur"].map(l=>(
                  <span key={l} className="text-[13px] text-white/40 hover:text-white/70 transition-colors cursor-pointer">{l}</span>
                ))}
              </div>
            </div>

            {/* Légal */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color:"#8B5CF6" }}>Informations</p>
              <div className="flex flex-col gap-2.5">
                {["CGU","Politique de confidentialité","Mentions légales","Aide & contact"].map(l=>(
                  <span key={l} className="text-[13px] text-white/40 hover:text-white/70 transition-colors cursor-pointer">{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[12px] text-white/20">© 2025 Wearlyx · Tous droits réservés</p>
            <p className="text-[12px] text-white/20">0% de frais pour les vendeurs · Paiement sécurisé</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function AiPreviewCard() {
  return (
    <div className="w-full max-w-[320px] rounded-3xl p-5"
      style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-400 mb-4">Génération IA en cours…</p>
      <div className="rounded-2xl mb-4 aspect-[4/3] flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(124,58,237,0.08))", border: "1px dashed rgba(139,92,246,0.25)" }}>
        <div className="text-center">
          <Camera className="w-8 h-8 text-purple-500 mx-auto mb-1.5" />
          <span className="text-[11px] text-purple-400">Photo analysée</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {[
          { label: "Marque",      value: "Nike · Air Max 90", done: true  },
          { label: "Catégorie",   value: "Chaussures",         done: true  },
          { label: "Description", value: "Génération…",        done: false },
          { label: "Prix suggéré",value: "74€",                done: true  },
        ].map(({ label, value, done }) => (
          <div key={label} className="flex items-center justify-between py-1.5 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <span className="text-[11px] text-white/30">{label}</span>
            <span className={`text-[12px] font-semibold ${done ? "text-white/75" : "text-purple-400"}`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProtectionTimeline() {
  const items: { title: string; sub: string; color: string; icon: typeof ShieldCheck; amount?: string }[] = [
    { title: "Commande confirmée",   sub: "Paiement sécurisé reçu",  color: "#10B981", icon: ShieldCheck, amount: "+34.00€" },
    { title: "Colis expédié",        sub: "Suivi n° WLX-8821-FR",    color: "#3B82F6", icon: Truck        },
    { title: "Livraison confirmée",  sub: "Article conforme",         color: "#10B981", icon: Package      },
    { title: "Avis laissé ⭐⭐⭐⭐⭐", sub: "Transaction terminée",    color: "#F59E0B", icon: ShieldCheck  },
  ];
  return (
    <div className="flex flex-col gap-2.5 w-full max-w-[300px]">
      {items.map(({ title, sub, color, icon: Icon, amount }, i) => (
        <div key={title}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: `${color}0D`, border: `1px solid ${color}22`, opacity: 0.65 + i * 0.12 }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}1A` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-white">{title}</p>
            <p className="text-[11px] text-white/30">{sub}</p>
          </div>
          {amount && <span className="text-[13px] font-black" style={{ color }}>{amount}</span>}
        </div>
      ))}
    </div>
  );
}
