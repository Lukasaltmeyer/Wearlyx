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

export function GuideClient() {
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-5">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[17px] font-bold text-white">Guide Wearlyx</h1>
      </div>

      {/* Search */}
      <div className="px-4 mb-5">
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-white/8 bg-white/4">
          <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[14px] text-white placeholder-white/30 outline-none"
          />
        </div>
      </div>

      {/* FAQ sections */}
      <div className="px-4 flex flex-col gap-4 mb-5">
        {filtered.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[16px]">{section.emoji}</span>
              <p className="text-[14px] font-bold text-white">{section.title}</p>
            </div>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const key = `${section.title}-${item.q}`;
                const open = openKey === key;
                return (
                  <div key={key} className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between px-4 py-4 text-left"
                    >
                      <span className="text-[14px] text-white flex-1 pr-3">{item.q}</span>
                      {open ? (
                        <ChevronUp className="w-4 h-4 text-white/30 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />
                      )}
                    </button>
                    {open && (
                      <div className="px-4 pb-4">
                        <p className="text-[13px] text-white/50 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          className="w-full py-4 rounded-2xl font-bold text-[14px] text-white flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #A855F7, #8B5CF6)" }}
        >
          💬 Tu as une autre question ? Chat avec l'IA →
        </button>
      </div>
    </div>
  );
}