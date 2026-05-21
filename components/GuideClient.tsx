"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, ChevronDown, ChevronUp } from "lucide-react";

const FAQ_SECTIONS = [
  {
    title: "Vendre",
    emoji: "🍔",
    items: [
      { q: "Comment publier une annonce ?", a: "Clique sur le bouton + en bas. Choisis entre l'IA (recommandé) ou le formulaire manuel pour créer ton annonce en quelques secondes." },
      { q: "Comment fonctionne l'IA pour les annonces ?", a: "Prends une photo de ton article, l'IA génère automatiquement le titre, la description et suggère un prix en moins de 10 secondes." },
      { q: "Comment booster mon annonce ?", a: "Va dans Outils de promotion → Booster. Ton annonce apparaît en tête des résultats pendant 24h." },
      { q: "Quels sont les frais de commission ?", a: "Les vendeurs ne paient pas de commission. Wearlyx prend une commission uniquement sur les achats." },
      { q: "Comment marquer un article comme vendu ?", a: "Dans Mes annonces, appuie sur l'article puis sur «Marquer comme vendu»." },
    ],
  },
  {
    title: "Acheter",
    emoji: "🛒",
    items: [
      { q: "Comment acheter un article ?", a: "Clique sur un article pour voir sa fiche, puis appuie sur 'Acheter' pour finaliser la transaction." },
      { q: "Le vendeur peut-il refuser ma commande ?", a: "Oui, le vendeur a 48h pour accepter ou refuser. En cas de refus, tu es automatiquement remboursé." },
      { q: "Est-ce que je suis protégé en cas de problème ?", a: "Oui ! Tous les achats sont couverts par la protection Wearlyx. Si l'article ne correspond pas, tu peux ouvrir un litige." },
      { q: "Comment suivre ma commande ?", a: "Dans Mes achats, clique sur la commande pour voir le suivi en temps réel." },
    ],
  },
  {
    title: "Livraison",
    emoji: "🚚",
    items: [
      { q: "Quels transporteurs sont disponibles ?", a: "Colissimo, Mondial Relay, Chronopost et d'autres selon ton pays." },
      { q: "Comment expédier mon article vendu ?", a: "Une fois la vente confirmée, génère l'étiquette depuis Mes ventes et dépose ton colis au point relais." },
      { q: "Que faire si mon colis est perdu ?", a: "Contacte le support depuis Mes achats. Nous ouvrons une enquête et te remboursons si nécessaire." },
    ],
  },
  {
    title: "Compte & Abonnements",
    emoji: "🔧",
    items: [
      { q: "C'est quoi les abonnements Wearlyx ?", a: "Des plans Starter, Vendeur Pro et Premium qui offrent plus de boosts, photos IA et fonctionnalités avancées." },
      { q: "Comment modifier mon profil ?", a: "Va dans Paramètres → Modifier mon profil pour changer ta photo, ton nom ou ta bio." },
      { q: "Comment supprimer mon compte ?", a: "Dans Paramètres → Confidentialité → Supprimer mon compte. Cette action est irréversible." },
    ],
  },
];

export function GuideClient({ isDesktop }: { isDesktop?: boolean }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggle = (key: string) => setOpenKey(openKey === key ? null : key);

  const filtered = FAQ_SECTIONS.map((s) => ({
    ...s,
    items: s.items.filter(
      (i) =>
        !search ||
        i.q.toLowerCase().includes(search.toLowerCase()) ||
        i.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((s) => s.items.length > 0);

  const searchBar = (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-[12px] border border-white/8 bg-white/[0.03]">
      <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
      <input type="text" placeholder="Rechercher une question..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className="flex-1 bg-transparent text-[14px] text-white placeholder-white/30 outline-none" />
    </div>
  );

  const faqList = (
    <div className="flex flex-col gap-5">
      {filtered.map((section) => (
        <div key={section.title}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[15px]">{section.emoji}</span>
            <p className="text-[13px] font-bold text-white/60 uppercase tracking-wide">{section.title}</p>
          </div>
          <div className="flex flex-col gap-1">
            {section.items.map((item) => {
              const key = `${section.title}-${item.q}`;
              const open = openKey === key;
              return (
                <div key={key} className="rounded-[12px] border border-white/6 bg-white/[0.02] overflow-hidden">
                  <button onClick={() => toggle(key)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left">
                    <span className="text-[13px] text-white/80 flex-1 pr-3">{item.q}</span>
                    {open ? <ChevronUp className="w-4 h-4 text-white/25 flex-shrink-0" />
                           : <ChevronDown className="w-4 h-4 text-white/25 flex-shrink-0" />}
                  </button>
                  {open && (
                    <div className="px-4 pb-4">
                      <p className="text-[12.5px] text-white/45 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="flex gap-10">
        {/* Left — FAQ */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-[20px] px-8 py-7"
            style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(139,92,246,0.05) 100%)", border: "1px solid rgba(168,85,247,0.15)" }}>
            <div className="absolute pointer-events-none" style={{ top: -60, right: -40, width: 220, height: 220, background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)", filter: "blur(40px)" }} />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(192,132,252,0.6)" }}>Centre d'aide</p>
              <p className="text-[22px] font-black text-white tracking-tight mb-1.5">Comment peut-on t'aider ?</p>
              <p className="text-[13px] text-white/35">Toutes les réponses sur Wearlyx — vente, achat, livraison, compte.</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-[14px]"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.28)" }} />
            <input type="text" placeholder="Rechercher une question…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-white placeholder-white/25 outline-none" />
            {search && (
              <button onClick={() => setSearch("")} className="text-white/25 hover:text-white/50 text-[11px] font-semibold">Effacer</button>
            )}
          </div>

          {/* FAQ */}
          <div className="flex flex-col gap-6">
            {filtered.map((section) => (
              <div key={section.title}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[14px]"
                    style={{ background: "rgba(255,255,255,0.05)" }}>{section.emoji}</div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.28)" }}>{section.title}</p>
                </div>
                <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  {section.items.map((item, i) => {
                    const key = `${section.title}-${item.q}`;
                    const open = openKey === key;
                    return (
                      <div key={key} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <button onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left transition-all"
                          style={{ background: open ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.02)" }}
                          onMouseEnter={e => { if (!open) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)"; }}
                          onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}>
                          <span className="text-[13.5px] font-semibold flex-1 pr-4" style={{ color: open ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.72)" }}>{item.q}</span>
                          {open
                            ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "#A855F7" }} />
                            : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.2)" }} />}
                        </button>
                        {open && (
                          <div className="px-5 pb-4" style={{ background: "rgba(168,85,247,0.04)" }}>
                            <p className="text-[13px] text-white/50 leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-16 flex flex-col items-center text-center">
                <p className="text-[15px] font-bold text-white/30 mb-1">Aucun résultat</p>
                <p className="text-[13px] text-white/18">Essaie des mots-clés différents</p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-[240px] flex-shrink-0 flex flex-col gap-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.22)" }}>Besoin d'aide ?</p>

          <div className="relative overflow-hidden rounded-[18px] p-6"
            style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(109,40,217,0.08) 100%)", border: "1px solid rgba(168,85,247,0.18)" }}>
            <p className="text-[16px] font-black text-white mb-1.5">Chat avec l'IA</p>
            <p className="text-[12px] text-white/35 mb-4 leading-relaxed">Pose ta question directement à notre assistant — réponse instantanée.</p>
            <button className="w-full py-2.5 rounded-[10px] text-[13px] font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "rgba(168,85,247,0.85)", boxShadow: "0 4px 16px rgba(168,85,247,0.3)" }}>
              💬 Démarrer le chat
            </button>
          </div>

          <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest px-4 pt-3.5 pb-2" style={{ color: "rgba(255,255,255,0.22)" }}>Rubriques</p>
            {FAQ_SECTIONS.map(({ title, emoji }, i) => (
              <button key={title}
                onClick={() => { setSearch(""); setOpenKey(null); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all"
                style={{ background: "rgba(255,255,255,0.02)", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.045)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}>
                <span className="text-[13px]">{emoji}</span>
                <span className="text-[12.5px] font-medium text-white/55">{title}</span>
              </button>
            ))}
          </div>
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
        <h1 className="text-[17px] font-bold text-white">Guide Wearlyx</h1>
      </div>
      <div className="px-4 mb-5">{searchBar}</div>
      <div className="px-4 mb-5">{faqList}</div>
      <div className="px-4 pb-4">
        <button className="w-full py-4 rounded-2xl font-bold text-[14px] text-white flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #A855F7, #8B5CF6)" }}>
          💬 Tu as une autre question ? Chat avec l'IA →
        </button>
      </div>
    </div>
  );
}