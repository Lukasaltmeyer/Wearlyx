import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function timeAgo(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function conditionLabel(condition: string): string {
  const map: Record<string, string> = {
    new: "Neuf",
    like_new: "Comme neuf",
    good: "Bon état",
    fair: "Correct",
  };
  return map[condition] ?? condition;
}

export function conditionColor(condition: string): string {
  const map: Record<string, string> = {
    new: "bg-emerald-100 text-emerald-700",
    like_new: "bg-blue-100 text-blue-700",
    good: "bg-amber-100 text-amber-700",
    fair: "bg-gray-100 text-gray-600",
  };
  return map[condition] ?? "bg-gray-100 text-gray-600";
}
