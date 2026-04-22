"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, ShoppingBag, Package, Tag, Star,
  AlertTriangle, MessageCircle, ChevronRight, Plus,
  Send, Headphones, Bug, Camera, X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "achats" | "ventes" | "offres" | "avis" | "litiges" | "support" | "bugs";
interface Props { userId: string }

// ─── Status maps ──────────────────────────────────────────────────────────────

const ORDER_ST: Record<string, { label: string; badge: string }> = {
  pending:    { label: "En attente",  badge: "bg-amber-400/12 text-amber-400" },
  paid:       { label: "Payé",        badge: "bg-blue-400/12 text-blue-400" },
  shipped:    { label: "Expédié",     badge: "bg-violet-400/12 text-violet-400" },
  in_transit: { label: "En transit",  badge: "bg-indigo-400/12 text-indigo-400" },
  delivered:  { label: "Livré ✓",    badge: "bg-emerald-400/12 text-emerald-400" },
  dispute:    { label: "Litige",      badge: "bg-red-400/12 text-red-400" },
  cancelled:  { label: "Annulé",      badge: "bg-zinc-600/12 text-zinc-500" },
  refunded:   { label: "Remboursé",   badge: "bg-teal-400/12 text-teal-400" },
};

const OFFER_ST: Record<string, { label: string; badge: string }> = {
  pending:   { label: "En attente",   badge: "bg-amber-400/12 text-amber-400" },
  accepted:  { label: "Acceptée ✓",  badge: "bg-emerald-400/12 text-emerald-400" },
  refused:   { label: "Refusée",      badge: "bg-red-400/12 text-red-400" },
  countered: { label: "Contre-offre", badge: "bg-blue-400/12 text-blue-400" },
  expired:   { label: "Expirée",      badge: "bg-zinc-600/12 text-zinc-500" },
};

const DISPUTE_ST: Record<string, { label: string; badge: string }> = {
  open:              { label: "Ouvert",             badge: "bg-red-400/12 text-red-400" },
  under_review:      { label: "En cours",           badge: "bg-amber-400/12 text-amber-400" },
  validated:         { label: "Validé — Action req.", badge: "bg-[#6C63FF]/12 text-[#9B93FF]" },
  solution_proposed: { label: "Solution envoyée",   badge: "bg-blue-400/12 text-blue-400" },
  solution_accepted: { label: "Résolu ✓",          badge: "bg-emerald-400/12 text-emerald-400" },
  solution_refused:  { label: "Solution refusée",   badge: "bg-red-400/12 text-red-400" },
  resolved:          { label: "Résolu ✓",          badge: "bg-emerald-400/12 text-emerald-400" },
  refunded:          { label: "Remboursé",          badge: "bg-teal-400/12 text-teal-400" },
  rejected:          { label: "Clôturé",            badge: "bg-zinc-600/12 text-zinc-500" },
};

const TICKET_ST: Record<string, { label: string; badge: string }> = {
  open:        { label: "Ouvert",     badge: "bg-red-400/12 text-red-400" },
  in_progress: { label: "En cours",   badge: "bg-blue-400/12 text-blue-400" },
  resolved:    { label: "Résolu ✓",  badge: "bg-emerald-400/12 text-emerald-400" },
  closed:      { label: "Fermé",      badge: "bg-zinc-600/12 text-zinc-500" },
};

const DISPUTE_TYPES = [
  { id: "counterfeit",      label: "Contrefaçon" },
  { id: "wrong_size",       label: "Mauvaise taille" },
  { id: "not_as_described", label: "Non conforme" },
  { id: "damaged",          label: "Endommagé" },
  { id: "not_received",     label: "Non reçu" },
  { id: "other",            label: "Autre" },
];

const DISPUTE_TYPE_FR: Record<string, string> = {
  counterfeit: "Contrefaçon", wrong_size: "Mauvaise taille",
  not_as_described: "Non conforme", damaged: "Endommagé",
  not_received: "Non reçu", other: "Autre",
};

const SOLUTIONS = [
  { id: "refund_return", label: "Remboursement + retour de l'article", sub: "Je renvoie l'article et je suis remboursé" },
  { id: "refund_keep",   label: "Remboursement + garder l'article",    sub: "Je garde l'article et je suis remboursé partiellement" },
  { id: "other",         label: "Autre solution",                       sub: "Je décris ma demande à l'équipe" },
];

const SOLUTION_FR: Record<string, string> = {
  refund_return: "Remboursement + retour",
  refund_keep: "Remboursement + garder",
  other: "Autre solution",
};

const CATEGORY_FR: Record<string, string> = {
  payment: "Paiement", delivery: "Livraison", bug: "Bug", account: "Compte", other: "Autre",
};

// ─── Micro-components ─────────────────────────────────────────────────────────

function StatusBadge({ status, map }: { status: string; map: Record<string, { label: string; badge: string }> }) {
  const s = map[status] ?? { label: status, badge: "bg-zinc-500/10 text-zinc-500" };
  return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap", s.badge)}>{s.label}</span>;
}

function EmptyState({ icon: Icon, text, sub, cta }: { icon: any; text: string; sub: string; cta?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white/30" />
      </div>
      <p className="text-[15px] font-bold text-white/50 mb-1">{text}</p>
      <p className="text-[13px] text-white/25">{sub}</p>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3 px-4 pt-4">
      {[1, 2, 3].map(i => <div key={i} className="h-[84px] rounded-2xl bg-white/5 border border-white/8 animate-pulse" />)}
    </div>
  );
}

function ProductThumb({ images, title }: { images?: string[]; title?: string }) {
  if (images?.[0]) {
    return (
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/8">
        <Image src={images[0]} alt={title ?? ""} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
      <Package className="w-5 h-5 text-white/20" />
    </div>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order, isBuyer, onMarkShipped, onMarkDelivered, onOpenDispute }: {
  order: any; isBuyer: boolean;
  onMarkShipped?: () => void;
  onMarkDelivered?: () => void;
  onOpenDispute?: () => void;
}) {
  const product  = Array.isArray(order.product)  ? order.product[0]  : order.product;
  const buyer    = Array.isArray(order.buyer)    ? order.buyer[0]    : order.buyer;
  const seller   = Array.isArray(order.seller)   ? order.seller[0]   : order.seller;
  const shipment = Array.isArray(order.shipment) ? order.shipment[0] : order.shipment;
  const other    = isBuyer ? seller : buyer;

  return (
    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] space-y-3">
      <div className="flex items-start gap-3">
        <ProductThumb images={product?.images} title={product?.title} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[14px] font-bold text-white leading-snug truncate">{product?.title ?? "Article"}</p>
            <StatusBadge status={order.status} map={ORDER_ST} />
          </div>
          <p className="text-[13px] font-bold text-white/70 mt-0.5">{order.total?.toFixed(2)} €</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[11px] text-white/30">
              {isBuyer ? "Vendeur" : "Acheteur"} · @{other?.username ?? "—"}
            </span>
            {shipment?.tracking_number && (
              <span className="text-[11px] font-mono text-violet-400">{shipment.tracking_number}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Link href={`/orders/${order.id}`}
          className="flex-1 py-2 rounded-xl bg-white/6 border border-white/8 text-[12px] font-semibold text-white/60 text-center hover:bg-white/10 transition-colors">
          Voir détails
        </Link>
        {other?.id && (
          <Link href={`/messages?with=${other.id}`}
            className="w-9 h-9 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center text-white/40 hover:bg-white/10 transition-colors flex-shrink-0">
            <MessageCircle className="w-4 h-4" />
          </Link>
        )}
        {!isBuyer && onMarkShipped && (
          <button onClick={onMarkShipped}
            className="flex-1 py-2 rounded-xl bg-violet-400/12 border border-violet-400/20 text-[12px] font-bold text-violet-400 hover:bg-violet-400/20 transition-colors">
            📦 Expédier
          </button>
        )}
        {isBuyer && onMarkDelivered && (
          <button onClick={onMarkDelivered}
            className="flex-1 py-2 rounded-xl bg-emerald-400/12 border border-emerald-400/20 text-[12px] font-bold text-emerald-400 hover:bg-emerald-400/20 transition-colors">
            ✓ Confirmer réception
          </button>
        )}
      </div>

      {/* Report problem — only for buyer on delivered orders */}
      {isBuyer && order.status === "delivered" && onOpenDispute && (
        <button onClick={onOpenDispute}
          className="w-full py-2 rounded-xl bg-red-400/6 border border-red-400/12 text-[12px] font-semibold text-red-400/70 hover:bg-red-400/12 transition-colors flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-3 h-3" />
          Signaler un problème
        </button>
      )}
    </div>
  );
}

// ─── Dispute form bottom sheet ────────────────────────────────────────────────

function DisputeForm({ order, onClose, onSubmitted }: { order: any; onClose: () => void; onSubmitted: () => void }) {
  const [step, setStep] = useState<"type" | "details">("type");
  const [disputeType, setDisputeType] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const product = Array.isArray(order.product) ? order.product[0] : order.product;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of files.slice(0, 3)) {
      const ext = file.name.split(".").pop();
      const path = `disputes/${order.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("products").upload(path, file, { upsert: true });
      if (!upErr) {
        const { data } = supabase.storage.from("products").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    setPhotoUrls(prev => [...prev, ...urls]);
    setUploading(false);
  };

  const submit = async () => {
    if (!description.trim()) { setError("Décris le problème en quelques mots."); return; }
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/disputes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.id, disputeType, description, photos: photoUrls }),
    });
    if (res.ok) { onSubmitted(); }
    else { const d = await res.json(); setError(d.error ?? "Erreur"); }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70" onClick={onClose}>
      <div className="bg-[#0F0F18] border border-white/10 rounded-t-3xl w-full max-w-lg pb-10 overflow-y-auto max-h-[90dvh]"
        onClick={e => e.stopPropagation()}>
        <div className="w-8 h-1 rounded-full bg-white/20 mx-auto mt-4 mb-5" />
        <div className="px-6">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-[17px] font-black text-white">Signaler un problème</h3>
            <button onClick={onClose} className="text-white/40 hover:text-white/70 mt-1"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-[13px] text-white/40 mb-5 truncate">{product?.title}</p>

          {step === "type" && (
            <>
              <p className="text-[12px] font-bold text-white/40 uppercase tracking-wider mb-3">Type de problème</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {DISPUTE_TYPES.map(t => (
                  <button key={t.id} onClick={() => setDisputeType(t.id)}
                    className={cn("py-3 px-3 rounded-2xl text-[13px] font-bold text-left transition-all",
                      disputeType === t.id
                        ? "bg-red-400/15 border border-red-400/30 text-red-300"
                        : "bg-white/5 border border-white/8 text-white/60 hover:text-white/80")}>
                    {t.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep("details")} disabled={!disputeType}
                className="w-full py-4 rounded-2xl bg-red-500/80 text-white text-[15px] font-black disabled:opacity-30 active:scale-[0.98] transition-all">
                Continuer →
              </button>
            </>
          )}

          {step === "details" && (
            <>
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-red-400/8 border border-red-400/15">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-[12px] text-red-300/80">{DISPUTE_TYPE_FR[disputeType]}</span>
                <button onClick={() => setStep("type")} className="ml-auto text-white/30 hover:text-white/60 text-[11px]">Modifier</button>
              </div>

              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Décris le problème en détail…"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-red-400/40 resize-none mb-4" rows={4} />

              {/* Photo upload */}
              <p className="text-[12px] font-bold text-white/40 uppercase tracking-wider mb-2">Photos (optionnel)</p>
              <div className="flex gap-2 mb-4 flex-wrap">
                {photoUrls.map((url, i) => (
                  <div key={url} className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                    <Image src={url} alt="" fill className="object-cover" />
                    <button onClick={() => setPhotoUrls(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 flex items-center justify-center">
                      <X className="w-2.5 h-2.5 text-white" />
                    </button>
                  </div>
                ))}
                {photoUrls.length < 3 && (
                  <label className="w-16 h-16 rounded-xl bg-white/5 border border-white/8 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-white/8 transition-colors flex-shrink-0">
                    <Camera className="w-4 h-4 text-white/30 mb-0.5" />
                    <span className="text-[9px] text-white/25">{uploading ? "…" : "Ajouter"}</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                  </label>
                )}
              </div>

              {error && <p className="text-[12px] text-red-400 mb-3">{error}</p>}

              <button onClick={submit} disabled={submitting || !description.trim()}
                className="w-full py-4 rounded-2xl bg-red-500/80 text-white text-[15px] font-black disabled:opacity-30 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                {submitting ? "Envoi…" : "Envoyer le litige"}
              </button>
              <p className="text-[11px] text-white/25 text-center mt-3">L'équipe Wearlyx examine chaque litige sous 48h.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Achats Tab ───────────────────────────────────────────────────────────────

function AchatsTab({ userId }: { userId: string }) {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [actId, setActId] = useState<string | null>(null);
  const [disputeOrder, setDisputeOrder] = useState<any | null>(null);
  const router = useRouter();

  const load = useCallback(() => {
    supabase
      .from("orders")
      .select("*, product:products(id,title,images,price), seller:profiles!orders_seller_id_fkey(id,username,avatar_url), shipment:shipments(*)")
      .eq("buyer_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false); });
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const confirmDelivery = async (order: any) => {
    setActId(order.id);
    await supabase.from("shipments").update({ status: "delivered", delivered_at: new Date().toISOString() }).eq("order_id", order.id);
    await supabase.from("orders").update({ status: "delivered" }).eq("id", order.id);
    setOrders(prev => prev?.map(o => o.id === order.id ? { ...o, status: "delivered" } : o) ?? null);
    setActId(null);
    router.refresh();
  };

  if (loading) return <LoadingRows />;
  if (!orders?.length) return (
    <EmptyState icon={ShoppingBag} text="Aucun achat pour l'instant" sub="Tes achats apparaîtront ici"
      cta={<Link href="/" className="px-5 py-2.5 rounded-2xl bg-[#6C63FF] text-white text-[13px] font-bold">Explorer les articles</Link>} />
  );

  const active    = orders.filter(o => !["delivered","refunded","cancelled"].includes(o.status));
  const completed = orders.filter(o => ["delivered","refunded","cancelled"].includes(o.status));

  return (
    <div className="px-4 pt-4 space-y-3 pb-4">
      {disputeOrder && (
        <DisputeForm order={disputeOrder} onClose={() => setDisputeOrder(null)}
          onSubmitted={() => { setDisputeOrder(null); load(); }} />
      )}
      {active.length > 0 && <>
        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">En cours ({active.length})</p>
        {active.map(o => (
          <OrderCard key={o.id} order={o} isBuyer
            onMarkDelivered={o.status === "in_transit" && actId !== o.id ? () => confirmDelivery(o) : undefined} />
        ))}
      </>}
      {completed.length > 0 && <>
        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mt-2">Historique ({completed.length})</p>
        {completed.map(o => (
          <OrderCard key={o.id} order={o} isBuyer
            onOpenDispute={o.status === "delivered" ? () => setDisputeOrder(o) : undefined} />
        ))}
      </>}
    </div>
  );
}

// ─── Ventes Tab ───────────────────────────────────────────────────────────────

function VentesTab({ userId }: { userId: string }) {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [actId, setActId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase
      .from("orders")
      .select("*, product:products(id,title,images), buyer:profiles!orders_buyer_id_fkey(id,username,avatar_url), shipment:shipments(*)")
      .eq("seller_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false); });
  }, [userId]);

  const markShipped = async (order: any) => {
    setActId(order.id);
    const tracking = `WRX${Date.now().toString(36).toUpperCase()}`;
    const existing = Array.isArray(order.shipment) ? order.shipment[0] : order.shipment;
    if (existing) {
      await supabase.from("shipments").update({ status: "in_transit", tracking_number: tracking, carrier: "Colissimo" }).eq("order_id", order.id);
    } else {
      await supabase.from("shipments").insert({ order_id: order.id, status: "in_transit", tracking_number: tracking, carrier: "Colissimo" });
    }
    await supabase.from("orders").update({ status: "shipped" }).eq("id", order.id);
    await supabase.from("notifications").insert({ user_id: order.buyer_id, type: "order_shipped", title: "Ton colis est en route !", body: `Suivi : ${tracking}`, data: { order_id: order.id } });
    setOrders(prev => prev?.map(o => o.id === order.id ? { ...o, status: "shipped" } : o) ?? null);
    setActId(null);
    router.refresh();
  };

  if (loading) return <LoadingRows />;
  if (!orders?.length) return (
    <EmptyState icon={Package} text="Aucune vente pour l'instant" sub="Tes ventes apparaîtront ici"
      cta={<Link href="/sell" className="px-5 py-2.5 rounded-2xl bg-[#6C63FF] text-white text-[13px] font-bold">Vendre un article</Link>} />
  );

  const active    = orders.filter(o => !["delivered","refunded","cancelled"].includes(o.status));
  const completed = orders.filter(o => ["delivered","refunded","cancelled"].includes(o.status));

  return (
    <div className="px-4 pt-4 space-y-3 pb-4">
      {active.length > 0 && <>
        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">En cours ({active.length})</p>
        {active.map(o => (
          <OrderCard key={o.id} order={o} isBuyer={false}
            onMarkShipped={o.status === "paid" && actId !== o.id ? () => markShipped(o) : undefined} />
        ))}
      </>}
      {completed.length > 0 && <>
        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mt-2">Historique ({completed.length})</p>
        {completed.map(o => <OrderCard key={o.id} order={o} isBuyer={false} />)}
      </>}
    </div>
  );
}

// ─── Offres Tab ───────────────────────────────────────────────────────────────

function OffresTab({ userId }: { userId: string }) {
  const supabase = createClient();
  const [received, setReceived] = useState<any[] | null>(null);
  const [sent, setSent]         = useState<any[] | null>(null);
  const [loading, setLoading]   = useState(true);
  const [subTab, setSubTab]     = useState<"reçues" | "envoyées">("reçues");
  const [actId, setActId]       = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("offers").select("*, product:products(id,title,images,price), buyer:profiles!offers_buyer_id_fkey(id,username)")
        .eq("seller_id", userId).order("created_at", { ascending: false }),
      supabase.from("offers").select("*, product:products(id,title,images,price), seller:profiles!offers_seller_id_fkey(id,username)")
        .eq("buyer_id", userId).order("created_at", { ascending: false }),
    ]).then(([r, s]) => { setReceived(r.data ?? []); setSent(s.data ?? []); setLoading(false); });
  }, [userId]);

  const handleOffer = async (offerId: string, status: "accepted" | "refused") => {
    setActId(offerId);
    await supabase.from("offers").update({ status, updated_at: new Date().toISOString() }).eq("id", offerId);
    setReceived(prev => prev?.map(o => o.id === offerId ? { ...o, status } : o) ?? null);
    setActId(null);
  };

  if (loading) return <LoadingRows />;

  const pendingReceived = received?.filter(o => o.status === "pending").length ?? 0;
  const list = subTab === "reçues" ? (received ?? []) : (sent ?? []);

  return (
    <div className="pb-4">
      <div className="flex mx-4 mt-4 bg-white/5 border border-white/8 rounded-xl p-1 gap-1 mb-3">
        {(["reçues", "envoyées"] as const).map(t => (
          <button key={t} onClick={() => setSubTab(t)}
            className={cn("flex-1 py-2 rounded-lg text-[13px] font-bold capitalize transition-colors",
              subTab === t ? "bg-[#6C63FF] text-white" : "text-white/40 hover:text-white/60")}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "reçues" && pendingReceived > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px]">{pendingReceived}</span>
            )}
          </button>
        ))}
      </div>

      {!list.length ? (
        <EmptyState icon={Tag} text={`Aucune offre ${subTab}`} sub="Les offres apparaîtront ici" />
      ) : (
        <div className="px-4 space-y-3">
          {list.map((offer: any) => {
            const product = Array.isArray(offer.product) ? offer.product[0] : offer.product;
            const person  = subTab === "reçues"
              ? (Array.isArray(offer.buyer)  ? offer.buyer[0]  : offer.buyer)
              : (Array.isArray(offer.seller) ? offer.seller[0] : offer.seller);
            const pct = product?.price > 0 ? Math.round((1 - offer.amount / product.price) * 100) : 0;

            return (
              <div key={offer.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] space-y-3">
                <div className="flex items-center gap-3">
                  <ProductThumb images={product?.images} title={product?.title} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-bold text-white truncate">{product?.title ?? "Article"}</p>
                      <StatusBadge status={offer.status} map={OFFER_ST} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[15px] font-black text-violet-400">{offer.amount} €</span>
                      {product?.price && <span className="text-[11px] text-white/30 line-through">{product.price} €</span>}
                      {pct > 0 && <span className="text-[11px] text-emerald-400 font-bold">-{pct}%</span>}
                    </div>
                    <p className="text-[11px] text-white/30">@{person?.username ?? "—"}</p>
                  </div>
                </div>
                {offer.message && <p className="text-[12px] text-white/40 italic px-1">"{offer.message}"</p>}
                {subTab === "reçues" && offer.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleOffer(offer.id, "accepted")} disabled={actId === offer.id}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-400/12 border border-emerald-400/20 text-emerald-400 text-[13px] font-bold disabled:opacity-50 hover:bg-emerald-400/20 transition-colors">
                      {actId === offer.id ? "…" : "✓ Accepter"}
                    </button>
                    <button onClick={() => handleOffer(offer.id, "refused")} disabled={actId === offer.id}
                      className="flex-1 py-2.5 rounded-xl bg-red-400/12 border border-red-400/20 text-red-400 text-[13px] font-bold disabled:opacity-50 hover:bg-red-400/20 transition-colors">
                      {actId === offer.id ? "…" : "✕ Refuser"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Avis Tab ─────────────────────────────────────────────────────────────────

function AvisTab({ userId }: { userId: string }) {
  const supabase = createClient();
  const [reviews, setReviews]       = useState<any[] | null>(null);
  const [eligible, setEligible]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [subTab, setSubTab]         = useState<"à donner" | "donnés" | "reçus">("à donner");
  const [reviewForm, setReviewForm] = useState<any | null>(null);
  const [rating, setRating]         = useState(5);
  const [comment, setComment]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    Promise.all([
      supabase.from("reviews")
        .select("*, reviewer:profiles!reviews_reviewer_id_fkey(username), reviewed:profiles!reviews_reviewed_id_fkey(username)")
        .or(`reviewer_id.eq.${userId},reviewed_id.eq.${userId}`)
        .eq("is_deleted", false).order("created_at", { ascending: false }),
      supabase.from("orders")
        .select("*, product:products(id,title,images)")
        .eq("status", "delivered")
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`),
    ]).then(([rv, ord]) => {
      const reviewed = new Set((rv.data ?? []).filter(r => r.reviewer_id === userId).map(r => r.order_id));
      setReviews(rv.data ?? []);
      setEligible((ord.data ?? []).filter(o => !reviewed.has(o.id)));
      setLoading(false);
    });
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const submitReview = async () => {
    if (!reviewForm) return;
    setSubmitting(true);
    const isBuyer = reviewForm.buyer_id === userId;
    await supabase.from("reviews").insert({
      order_id: reviewForm.id, reviewer_id: userId,
      reviewed_id: isBuyer ? reviewForm.seller_id : reviewForm.buyer_id,
      role: isBuyer ? "buyer" : "seller", rating,
      comment: comment.trim() || null,
    });
    setReviewForm(null); setRating(5); setComment("");
    setSubmitting(false);
    load();
  };

  if (loading) return <LoadingRows />;

  const given    = reviews?.filter(r => r.reviewer_id === userId) ?? [];
  const received = reviews?.filter(r => r.reviewed_id === userId) ?? [];

  return (
    <div className="pb-4">
      {reviewForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70" onClick={() => setReviewForm(null)}>
          <div className="bg-[#0F0F18] border border-white/10 rounded-t-3xl p-6 w-full max-w-lg pb-10" onClick={e => e.stopPropagation()}>
            <div className="w-8 h-1 rounded-full bg-white/20 mx-auto mb-5" />
            <h3 className="text-[17px] font-black text-white mb-1">Laisser un avis</h3>
            <p className="text-[13px] text-white/40 mb-5">
              {(Array.isArray(reviewForm.product) ? reviewForm.product[0] : reviewForm.product)?.title}
            </p>
            <div className="flex justify-center gap-3 mb-5">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setRating(n)}
                  className={cn("text-4xl transition-all", n <= rating ? "text-amber-400 scale-110" : "text-white/15")}>★</button>
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Commentaire (optionnel)…"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-[#6C63FF]/50 resize-none mb-4" rows={3} />
            <button onClick={submitReview} disabled={submitting}
              className="w-full py-4 rounded-2xl bg-[#6C63FF] text-white text-[15px] font-black disabled:opacity-50 active:scale-[0.98] transition-all">
              {submitting ? "Envoi…" : "Publier l'avis"}
            </button>
          </div>
        </div>
      )}

      <div className="flex mx-4 mt-4 bg-white/5 border border-white/8 rounded-xl p-1 gap-1 mb-3">
        {([
          { id: "à donner", label: `À donner${eligible.length > 0 ? ` (${eligible.length})` : ""}` },
          { id: "donnés",   label: `Donnés (${given.length})` },
          { id: "reçus",    label: `Reçus (${received.length})` },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
            className={cn("flex-1 py-2 rounded-lg text-[12px] font-bold transition-colors",
              subTab === t.id ? "bg-[#6C63FF] text-white" : "text-white/40 hover:text-white/60")}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {subTab === "à donner" && (
          eligible.length === 0
            ? <EmptyState icon={Star} text="Aucun avis à laisser" sub="Les commandes livrées apparaîtront ici" />
            : eligible.map(order => {
                const product = Array.isArray(order.product) ? order.product[0] : order.product;
                return (
                  <div key={order.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center gap-3">
                    <ProductThumb images={product?.images} title={product?.title} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-white truncate">{product?.title ?? "Article"}</p>
                      <p className="text-[11px] text-white/30">Commande livrée</p>
                    </div>
                    <button onClick={() => setReviewForm(order)}
                      className="px-3 py-2 rounded-xl bg-amber-400/12 border border-amber-400/20 text-amber-400 text-[12px] font-bold flex-shrink-0 hover:bg-amber-400/20 transition-colors">
                      ★ Noter
                    </button>
                  </div>
                );
              })
        )}
        {subTab !== "à donner" && (() => {
          const list = subTab === "donnés" ? given : received;
          if (!list.length) return <EmptyState icon={Star} text="Aucun avis" sub="" />;
          return list.map((r: any) => {
            const reviewer = Array.isArray(r.reviewer) ? r.reviewer[0] : r.reviewer;
            const reviewed = Array.isArray(r.reviewed) ? r.reviewed[0] : r.reviewed;
            return (
              <div key={r.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} className={cn("text-[15px]", n <= r.rating ? "text-amber-400" : "text-white/15")}>★</span>
                    ))}
                  </div>
                  <span className="text-[11px] text-white/30">
                    {subTab === "donnés" ? `→ @${reviewed?.username ?? "—"}` : `← @${reviewer?.username ?? "—"}`}
                  </span>
                </div>
                {r.comment && <p className="text-[13px] text-white/50 italic">"{r.comment}"</p>}
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}

// ─── Litiges Tab ──────────────────────────────────────────────────────────────

function LitigesTab({ userId }: { userId: string }) {
  const supabase = createClient();
  const [disputes, setDisputes] = useState<any[] | null>(null);
  const [loading, setLoading]   = useState(true);
  const [solutionFor, setSolutionFor]   = useState<string | null>(null);
  const [chosenSolution, setChosenSolution] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    supabase.from("disputes")
      .select("*, order:orders(id,total,buyer_id,seller_id,product:products(title,images),buyer:profiles!orders_buyer_id_fkey(username),seller:profiles!orders_seller_id_fkey(username))")
      .eq("opened_by", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setDisputes(data ?? []); setLoading(false); });
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const proposeSolution = async (disputeId: string) => {
    if (!chosenSolution) return;
    setSubmitting(true);
    await fetch("/api/disputes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disputeId, solution: chosenSolution }),
    });
    setSolutionFor(null);
    setChosenSolution("");
    setSubmitting(false);
    load();
  };

  if (loading) return <LoadingRows />;
  if (!disputes?.length) return (
    <EmptyState icon={AlertTriangle} text="Aucun litige" sub="Les litiges ouverts depuis tes commandes apparaîtront ici" />
  );

  return (
    <div className="px-4 pt-4 space-y-3 pb-4">
      {disputes.map((d: any) => {
        const order   = Array.isArray(d.order) ? d.order[0] : d.order;
        const product = Array.isArray(order?.product) ? order.product[0] : order?.product;
        const needsSolution = d.status === "validated";

        return (
          <div key={d.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-white truncate">{product?.title ?? "Commande"}</p>
                <p className="text-[12px] text-white/40 mt-0.5">{DISPUTE_TYPE_FR[d.dispute_type ?? d.reason] ?? d.reason}</p>
                {d.description && <p className="text-[12px] text-white/30 mt-1 line-clamp-2">{d.description}</p>}
              </div>
              <StatusBadge status={d.status} map={DISPUTE_ST} />
            </div>

            {/* Photos */}
            {d.photos?.length > 0 && (
              <div className="flex gap-2">
                {d.photos.map((url: string) => (
                  <div key={url} className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <Image src={url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Admin note */}
            {d.admin_note && (
              <div className="px-3 py-2.5 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20">
                <p className="text-[11px] font-bold text-[#9B93FF] mb-0.5">Réponse de l'équipe Wearlyx</p>
                <p className="text-[12px] text-white/60">{d.admin_note}</p>
              </div>
            )}

            {/* Solution needed: user must pick */}
            {needsSolution && (
              <div>
                <p className="text-[12px] font-bold text-[#9B93FF] mb-2">✓ Litige accepté — Choisis ta solution :</p>
                {solutionFor === d.id ? (
                  <div className="space-y-2">
                    {SOLUTIONS.map(s => (
                      <button key={s.id} onClick={() => setChosenSolution(s.id)}
                        className={cn("w-full p-3 rounded-xl text-left transition-all",
                          chosenSolution === s.id
                            ? "bg-[#6C63FF]/15 border border-[#6C63FF]/30"
                            : "bg-white/5 border border-white/8 hover:bg-white/8")}>
                        <p className={cn("text-[13px] font-bold", chosenSolution === s.id ? "text-[#9B93FF]" : "text-white/70")}>{s.label}</p>
                        <p className="text-[11px] text-white/30 mt-0.5">{s.sub}</p>
                      </button>
                    ))}
                    <button onClick={() => proposeSolution(d.id)} disabled={!chosenSolution || submitting}
                      className="w-full py-3 rounded-xl bg-[#6C63FF] text-white text-[13px] font-black disabled:opacity-40 active:scale-[0.98] transition-all mt-1">
                      {submitting ? "Envoi…" : "Valider ma solution →"}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setSolutionFor(d.id); setChosenSolution(""); }}
                    className="w-full py-2.5 rounded-xl bg-[#6C63FF]/15 border border-[#6C63FF]/25 text-[#9B93FF] text-[13px] font-bold hover:bg-[#6C63FF]/25 transition-colors">
                    Choisir ma solution →
                  </button>
                )}
              </div>
            )}

            {/* Proposed solution waiting */}
            {d.status === "solution_proposed" && d.user_solution && (
              <div className="px-3 py-2.5 rounded-xl bg-blue-400/8 border border-blue-400/15">
                <p className="text-[11px] font-bold text-blue-400 mb-0.5">Ta solution proposée</p>
                <p className="text-[12px] text-white/60">{SOLUTION_FR[d.user_solution] ?? d.user_solution}</p>
                <p className="text-[11px] text-white/30 mt-1">En attente de validation par l'équipe…</p>
              </div>
            )}

            {/* Accepted solution */}
            {d.status === "solution_accepted" && d.user_solution && (
              <div className="px-3 py-2.5 rounded-xl bg-emerald-400/8 border border-emerald-400/15">
                <p className="text-[11px] font-bold text-emerald-400 mb-0.5">✓ Solution acceptée</p>
                <p className="text-[12px] text-white/60">{SOLUTION_FR[d.user_solution] ?? d.user_solution}</p>
              </div>
            )}

            {order?.id && (
              <Link href={`/orders/${order.id}`}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/5 border border-white/8 text-[12px] text-white/50 hover:bg-white/8 transition-colors">
                <span>Voir la commande · {order.total?.toFixed(2)} €</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Support Tab ──────────────────────────────────────────────────────────────

function SupportTab({ userId }: { userId: string }) {
  const supabase = createClient();
  const [tickets, setTickets]       = useState<any[] | null>(null);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState({ category: "other", subject: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    supabase.from("support_tickets").select("*").eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setTickets(data ?? []); setLoading(false); });
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!form.subject.trim() || !form.description.trim()) return;
    setSubmitting(true);
    await supabase.from("support_tickets").insert({ user_id: userId, ...form });
    setForm({ category: "other", subject: "", description: "" });
    setShowForm(false);
    setSubmitting(false);
    load();
  };

  if (loading) return <LoadingRows />;

  return (
    <div className="pb-4">
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70" onClick={() => setShowForm(false)}>
          <div className="bg-[#0F0F18] border border-white/10 rounded-t-3xl p-6 w-full max-w-lg pb-10 overflow-y-auto max-h-[90dvh]" onClick={e => e.stopPropagation()}>
            <div className="w-8 h-1 rounded-full bg-white/20 mx-auto mb-5" />
            <h3 className="text-[17px] font-black text-white mb-5">Contacter le support</h3>
            <p className="text-[12px] font-bold text-white/40 uppercase tracking-wider mb-2">Catégorie</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(["payment","delivery","bug","account","other"] as const).map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, category: c }))}
                  className={cn("py-2.5 rounded-xl text-[12px] font-bold transition-colors",
                    form.category === c ? "bg-[#6C63FF] text-white" : "bg-white/5 border border-white/8 text-white/40 hover:text-white/60")}>
                  {CATEGORY_FR[c]}
                </button>
              ))}
            </div>
            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="Sujet de ta demande…"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-[#6C63FF]/50 mb-3" />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Décris ton problème en détail…"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-[#6C63FF]/50 resize-none mb-4" rows={4} />
            <button onClick={submit} disabled={submitting || !form.subject.trim() || !form.description.trim()}
              className="w-full py-4 rounded-2xl bg-[#6C63FF] text-white text-[15px] font-black disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {submitting ? "Envoi…" : "Envoyer la demande"}
            </button>
          </div>
        </div>
      )}
      <div className="px-4 pt-4">
        <button onClick={() => setShowForm(true)}
          className="w-full py-3.5 rounded-2xl bg-[#6C63FF] text-white text-[14px] font-black mb-4 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
          <Plus className="w-4 h-4" />
          Nouveau ticket support
        </button>
      </div>
      {!tickets?.length ? (
        <EmptyState icon={Headphones} text="Aucune demande" sub="L'équipe répond sous 24h à chaque demande" />
      ) : (
        <div className="px-4 space-y-3">
          {tickets.map((t: any) => (
            <div key={t.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-white truncate">{t.subject}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{CATEGORY_FR[t.category] ?? t.category}</p>
                </div>
                <StatusBadge status={t.status} map={TICKET_ST} />
              </div>
              <p className="text-[12px] text-white/40 line-clamp-2">{t.description}</p>
              {t.admin_note && (
                <div className="px-3 py-2.5 rounded-xl bg-emerald-400/8 border border-emerald-400/15">
                  <p className="text-[11px] font-bold text-emerald-400 mb-0.5">Réponse de l'équipe</p>
                  <p className="text-[12px] text-white/60">{t.admin_note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bug Report Tab ───────────────────────────────────────────────────────────

function BugTab({ userId }: { userId: string }) {
  const supabase = createClient();
  const [bugs, setBugs]             = useState<any[] | null>(null);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState({ title: "", description: "", category: "ui", severity: "medium", url: "", steps: "" });
  const [submitting, setSubmitting] = useState(false);

  const SEVERITY_FR: Record<string, string> = { low: "Faible", medium: "Moyen", high: "Élevé", critical: "Critique" };
  const CATEGORY_BUG: Record<string, string> = { ui: "Interface", payment: "Paiement", account: "Compte", messaging: "Messages", other: "Autre" };
  const BUG_ST: Record<string, { label: string; badge: string }> = {
    detected:    { label: "Signalé",    badge: "bg-amber-400/12 text-amber-400" },
    in_progress: { label: "En cours",  badge: "bg-blue-400/12 text-blue-400" },
    fixed:       { label: "Corrigé ✓", badge: "bg-emerald-400/12 text-emerald-400" },
    wont_fix:    { label: "Non traité", badge: "bg-zinc-600/12 text-zinc-500" },
  };

  const load = useCallback(() => {
    supabase.from("bug_reports").select("*").eq("reporter_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setBugs(data ?? []); setLoading(false); });
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSubmitting(true);
    await supabase.from("bug_reports").insert({ reporter_id: userId, ...form, status: "detected" });
    setForm({ title: "", description: "", category: "ui", severity: "medium", url: "", steps: "" });
    setShowForm(false);
    setSubmitting(false);
    load();
  };

  if (loading) return <LoadingRows />;

  return (
    <div className="pb-4">
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70" onClick={() => setShowForm(false)}>
          <div className="bg-[#0F0F18] border border-white/10 rounded-t-3xl p-6 w-full max-w-lg pb-10 overflow-y-auto max-h-[90dvh]" onClick={e => e.stopPropagation()}>
            <div className="w-8 h-1 rounded-full bg-white/20 mx-auto mb-5" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
                <Bug className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-[17px] font-black text-white">Signaler un bug</h3>
                <p className="text-[12px] text-white/40">On corrige rapidement, merci !</p>
              </div>
            </div>

            <p className="text-[12px] font-bold text-white/40 uppercase tracking-wider mb-2">Catégorie</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Object.entries(CATEGORY_BUG).map(([k, v]) => (
                <button key={k} onClick={() => setForm(f => ({ ...f, category: k }))}
                  className={cn("py-2.5 rounded-xl text-[12px] font-bold transition-colors",
                    form.category === k ? "bg-amber-400/20 border border-amber-400/30 text-amber-300" : "bg-white/5 border border-white/8 text-white/40 hover:text-white/60")}>
                  {v}
                </button>
              ))}
            </div>

            <p className="text-[12px] font-bold text-white/40 uppercase tracking-wider mb-2">Sévérité</p>
            <div className="flex gap-2 mb-4">
              {["low","medium","high","critical"].map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, severity: s }))}
                  className={cn("flex-1 py-2 rounded-xl text-[11px] font-bold transition-colors",
                    form.severity === s ? "bg-amber-400/20 border border-amber-400/30 text-amber-300" : "bg-white/5 border border-white/8 text-white/35 hover:text-white/55")}>
                  {SEVERITY_FR[s]}
                </button>
              ))}
            </div>

            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Titre du bug…"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-amber-400/40 mb-3" />

            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Décris ce qui ne fonctionne pas…"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-amber-400/40 resize-none mb-3" rows={3} />

            <input value={form.steps} onChange={e => setForm(f => ({ ...f, steps: e.target.value }))}
              placeholder="Étapes pour reproduire (optionnel)…"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-amber-400/40 mb-3" />

            <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="URL de la page concernée (optionnel)…"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-amber-400/40 mb-4" />

            <button onClick={submit} disabled={submitting || !form.title.trim() || !form.description.trim()}
              className="w-full py-4 rounded-2xl bg-amber-500/80 text-white text-[15px] font-black disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {submitting ? "Envoi…" : "Envoyer le signalement"}
            </button>
          </div>
        </div>
      )}

      <div className="px-4 pt-4">
        <button onClick={() => setShowForm(true)}
          className="w-full py-3.5 rounded-2xl bg-amber-500/80 text-white text-[14px] font-black mb-4 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
          <Bug className="w-4 h-4" />
          Signaler un bug
        </button>
      </div>

      {!bugs?.length ? (
        <EmptyState icon={Bug} text="Aucun bug signalé" sub="Si tu rencontres un problème, signale-le ici" />
      ) : (
        <div className="px-4 space-y-3">
          {bugs.map((b: any) => (
            <div key={b.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-white truncate">{b.title}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{CATEGORY_BUG[b.category] ?? b.category} · {SEVERITY_FR[b.severity] ?? b.severity}</p>
                </div>
                <StatusBadge status={b.status} map={BUG_ST} />
              </div>
              <p className="text-[12px] text-white/40 line-clamp-2">{b.description}</p>
              {b.admin_note && (
                <div className="px-3 py-2.5 rounded-xl bg-emerald-400/8 border border-emerald-400/15">
                  <p className="text-[11px] font-bold text-emerald-400 mb-0.5">Réponse de l'équipe</p>
                  <p className="text-[12px] text-white/60">{b.admin_note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "achats",  label: "Achats",   icon: ShoppingBag },
  { id: "ventes",  label: "Ventes",   icon: Package },
  { id: "offres",  label: "Offres",   icon: Tag },
  { id: "avis",    label: "Avis",     icon: Star },
  { id: "litiges", label: "Litiges",  icon: AlertTriangle },
  { id: "support", label: "Support",  icon: Headphones },
  { id: "bugs",    label: "Bugs",     icon: Bug },
];

export function SalesClient({ userId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) ?? "achats";
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <div className="min-h-[100dvh] bg-[#08080F]">
      <div className="flex items-center gap-3 px-4 pt-5 pb-4 border-b border-white/[0.06]">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-[18px] font-black text-white">Mon activité</h1>
          <p className="text-[11px] text-white/30">Achats · Ventes · Offres · Avis · Litiges</p>
        </div>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide border-b border-white/[0.06] sticky top-0 bg-[#08080F] z-10">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id as Tab)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-3.5 text-[13px] font-bold whitespace-nowrap flex-shrink-0 relative transition-colors",
                active ? "text-white" : "text-white/35 hover:text-white/55"
              )}>
              <Icon className="w-3.5 h-3.5" />
              {label}
              {active && <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-[#6C63FF]" />}
            </button>
          );
        })}
      </div>

      <div className="pb-24">
        {tab === "achats"  && <AchatsTab  userId={userId} />}
        {tab === "ventes"  && <VentesTab  userId={userId} />}
        {tab === "offres"  && <OffresTab  userId={userId} />}
        {tab === "avis"    && <AvisTab    userId={userId} />}
        {tab === "litiges" && <LitigesTab userId={userId} />}
        {tab === "support" && <SupportTab userId={userId} />}
        {tab === "bugs"    && <BugTab     userId={userId} />}
      </div>
    </div>
  );
}
