"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

export function SearchBar({ initialValue }: { initialValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher une marque, article…"
        className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all"
        autoFocus
      />
      {value && (
        <button
          type="button"
          onClick={() => { setValue(""); router.push("/search"); }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
