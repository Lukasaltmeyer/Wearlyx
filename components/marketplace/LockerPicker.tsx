"use client";

import { useState, useEffect } from "react";
import { MapPin, Package, Store, Home, Navigation, Search, Loader2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShippingMode } from "@/types/database";

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  distance: number; // metres
  type: "locker" | "relay";
  operator?: string;
  opening_hours?: string;
  lat: number;
  lon: number;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  zip: string;
}

interface Props {
  onConfirm: (mode: ShippingMode, point?: PickupPoint, address?: ShippingAddress) => void;
  initialMode?: ShippingMode;
}

const SHIPPING_FEES: Record<ShippingMode, number> = {
  home: 4.99,
  relay: 3.49,
  locker: 2.99,
};

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(m: number): string {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

async function fetchNearbyPoints(lat: number, lon: number, radius = 5000): Promise<PickupPoint[]> {
  // Query OpenStreetMap Overpass API for real locker + relay data in France
  const query = `
    [out:json][timeout:15];
    (
      node[amenity=parcel_locker](around:${radius},${lat},${lon});
      node[amenity=post_box][operator~"Colissimo|La Poste|DPD|Chronopost|Amazon|Mondial Relay",i](around:${radius},${lat},${lon});
      node[shop=convenience][parcel_pickup=yes](around:${radius},${lat},${lon});
      node[brand~"Mondial Relay|Relais Colis|Pickup|Point Relais",i](around:${radius},${lat},${lon});
    );
    out body;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  const data = await res.json();

  const points: PickupPoint[] = (data.elements ?? [])
    .filter((el: any) => el.lat && el.lon)
    .map((el: any): PickupPoint => {
      const tags = el.tags ?? {};
      const isLocker = tags.amenity === "parcel_locker" || tags.locker === "yes";
      const operator = tags.operator || tags.brand || tags.name || "";
      const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
      const city = tags["addr:city"] || tags["addr:town"] || "";
      return {
        id: String(el.id),
        name: tags.name || operator || (isLocker ? "Locker automatique" : "Point relais"),
        address: street || "Adresse non précisée",
        city,
        distance: Math.round(haversine(lat, lon, el.lat, el.lon)),
        type: isLocker ? "locker" : "relay",
        operator,
        opening_hours: tags.opening_hours,
        lat: el.lat,
        lon: el.lon,
      };
    })
    .sort((a: PickupPoint, b: PickupPoint) => a.distance - b.distance)
    .slice(0, 30);

  return points;
}

// Geocode an address to lat/lon using Nominatim (free OpenStreetMap)
async function geocode(address: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ", France")}&format=json&limit=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "fr" } });
  const data = await res.json();
  if (data[0]) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  return null;
}

export function LockerPicker({ onConfirm, initialMode = "home" }: Props) {
  const [mode, setMode] = useState<ShippingMode>(initialMode);
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [selected, setSelected] = useState<PickupPoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(null);
  const [address, setAddress] = useState<ShippingAddress>({ name: "", street: "", city: "", zip: "" });
  const [filter, setFilter] = useState<"all" | "locker" | "relay">("all");

  const loadPoints = async (lat: number, lon: number) => {
    setLoading(true);
    setGeoError("");
    try {
      const pts = await fetchNearbyPoints(lat, lon);
      setPoints(pts);
      if (pts.length === 0) setGeoError("Aucun point trouvé dans un rayon de 5 km.");
    } catch {
      setGeoError("Erreur lors de la recherche. Vérifie ta connexion.");
    }
    setLoading(false);
  };

  const geolocate = () => {
    if (!navigator.geolocation) { setGeoError("Géolocalisation non disponible."); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos({ lat: latitude, lon: longitude });
        loadPoints(latitude, longitude);
      },
      () => {
        setLoading(false);
        setGeoError("Localisation refusée. Saisis une adresse.");
      }
    );
  };

  const searchByAddress = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    const pos = await geocode(searchQuery);
    if (!pos) { setGeoError("Adresse introuvable."); setLoading(false); return; }
    setUserPos(pos);
    loadPoints(pos.lat, pos.lon);
  };

  const filteredPoints = points.filter((p) => filter === "all" || p.type === filter);

  const canConfirm =
    mode === "home"
      ? address.name && address.street && address.city && address.zip
      : selected !== null;

  return (
    <div className="flex flex-col gap-4">
      {/* Mode tabs */}
      <div className="grid grid-cols-3 gap-2">
        {(["home", "relay", "locker"] as ShippingMode[]).map((m) => {
          const icons = { home: Home, relay: Store, locker: Package };
          const labels = { home: "Domicile", relay: "Relais", locker: "Locker" };
          const Icon = icons[m];
          return (
            <button
              key={m}
              onClick={() => { setMode(m); setSelected(null); }}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all",
                mode === m ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-white/8 bg-white/3"
              )}
            >
              <Icon className={cn("w-5 h-5", mode === m ? "text-[#8B5CF6]" : "text-white/40")} />
              <span className={cn("text-[12px] font-bold", mode === m ? "text-white" : "text-white/40")}>{labels[m]}</span>
              <span className={cn("text-[10px] font-semibold", mode === m ? "text-[#8B5CF6]" : "text-white/25")}>
                {SHIPPING_FEES[m].toFixed(2)} €
              </span>
            </button>
          );
        })}
      </div>

      {/* Home delivery — address form */}
      {mode === "home" && (
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Adresse de livraison</p>
          {[
            { key: "name", placeholder: "Nom complet", type: "text" },
            { key: "street", placeholder: "Numéro et rue", type: "text" },
            { key: "zip", placeholder: "Code postal", type: "text" },
            { key: "city", placeholder: "Ville", type: "text" },
          ].map(({ key, placeholder, type }) => (
            <input
              key={key}
              type={type}
              value={(address as any)[key]}
              onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-2xl bg-white/6 border border-white/10 text-[14px] text-white placeholder-white/25 outline-none focus:border-[#8B5CF6]/50 transition-colors"
            />
          ))}
        </div>
      )}

      {/* Locker / Relay — picker */}
      {(mode === "locker" || mode === "relay") && (
        <>
          {/* Search bar */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/6 border border-white/10 focus-within:border-[#8B5CF6]/50 transition-colors">
              <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchByAddress()}
                placeholder="Ville, adresse, code postal..."
                className="flex-1 bg-transparent text-[13px] text-white placeholder-white/25 outline-none"
              />
            </div>
            <button
              onClick={searchByAddress}
              disabled={loading}
              className="px-3 py-2.5 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#A78BFA] text-[12px] font-bold flex-shrink-0"
            >
              Chercher
            </button>
            <button
              onClick={geolocate}
              disabled={loading}
              className="w-10 h-10 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center flex-shrink-0"
              title="Me localiser"
            >
              <Navigation className="w-4 h-4 text-white/50" />
            </button>
          </div>

          {/* Filter pills */}
          {points.length > 0 && (
            <div className="flex gap-2">
              {(["all", "locker", "relay"] as const).map((f) => {
                const labels = { all: "Tous", locker: "Lockers", relay: "Points relais" };
                const count = f === "all" ? points.length : points.filter((p) => p.type === f).length;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[11px] font-bold transition-all",
                      filter === f ? "bg-[#8B5CF6] text-white" : "bg-white/6 text-white/40 border border-white/10"
                    )}
                  >
                    {labels[f]} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center py-8 gap-3">
              <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
              <p className="text-[13px] text-white/40">Recherche des points autour de toi...</p>
            </div>
          )}

          {/* Error */}
          {geoError && !loading && (
            <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
              <p className="text-[12px] text-red-400">{geoError}</p>
            </div>
          )}

          {/* Empty state before search */}
          {!loading && !geoError && points.length === 0 && (
            <div className="flex flex-col items-center py-8 gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-white/40 font-semibold text-[14px]">
                {mode === "locker" ? "Trouve un locker" : "Trouve un point relais"}
              </p>
              <p className="text-white/25 text-[12px]">Saisis ton adresse ou active la géolocalisation</p>
              <button
                onClick={geolocate}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#A78BFA] text-[13px] font-semibold"
              >
                <Navigation className="w-3.5 h-3.5" />
                Me localiser
              </button>
            </div>
          )}

          {/* Points list */}
          {!loading && filteredPoints.length > 0 && (
            <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto">
              {filteredPoints.map((point) => (
                <button
                  key={point.id}
                  onClick={() => setSelected(point)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all",
                    selected?.id === point.id
                      ? "border-[#8B5CF6] bg-[#8B5CF6]/10"
                      : "border-white/8 bg-white/3 hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    point.type === "locker" ? "bg-violet-500/20" : "bg-blue-500/20"
                  )}>
                    {point.type === "locker"
                      ? <Package className="w-5 h-5 text-violet-400" />
                      : <Store className="w-5 h-5 text-blue-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-[13px] font-bold leading-tight", selected?.id === point.id ? "text-white" : "text-white/80")}>
                      {point.name}
                    </p>
                    <p className="text-[11px] text-white/35 truncate mt-0.5">
                      {point.address}{point.city ? `, ${point.city}` : ""}
                    </p>
                    {point.opening_hours && (
                      <p className="text-[10px] text-white/25 mt-0.5">{point.opening_hours}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[11px] font-bold text-white/40">{formatDist(point.distance)}</span>
                    {selected?.id === point.id && (
                      <span className="text-[10px] font-black text-[#8B5CF6]">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Confirm button */}
      <button
        onClick={() => onConfirm(mode, mode !== "home" ? selected ?? undefined : undefined, mode === "home" ? address : undefined)}
        disabled={!canConfirm}
        className={cn(
          "w-full py-4 rounded-2xl text-[15px] font-bold text-white transition-all mt-1",
          canConfirm
            ? "bg-[#4CAF50] shadow-lg shadow-[#4CAF50]/20 active:scale-[0.98]"
            : "bg-white/10 opacity-40 cursor-not-allowed"
        )}
      >
        {canConfirm
          ? mode === "home"
            ? `Livraison à domicile — ${SHIPPING_FEES.home.toFixed(2)} €`
            : `${selected?.name} — ${SHIPPING_FEES[mode].toFixed(2)} €`
          : mode === "home"
            ? "Remplis ton adresse"
            : `Sélectionne un ${mode === "locker" ? "locker" : "point relais"}`
        }
      </button>
    </div>
  );
}