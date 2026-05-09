"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, MoreHorizontal, Phone, Video, Info, Image as ImageIcon, Smile, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, timeAgo } from "@/lib/utils";
import Image from "next/image";

interface Conversation {
  id: string;
  product?: { id: string; title: string; images?: string[] } | null;
  buyer?: { id: string; username: string | null; full_name: string | null; avatar_url: string | null } | null;
  seller?: { id: string; username: string | null; full_name: string | null; avatar_url: string | null } | null;
  last_message?: string | null;
  last_message_at?: string | null;
  unread_count?: number;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

function Avatar({ user, size = 36 }: { user: { username?: string | null; full_name?: string | null; avatar_url?: string | null } | null | undefined; size?: number }) {
  const name = user?.username || user?.full_name || "?";
  if (user?.avatar_url) {
    return <img src={user.avatar_url} alt={name} className="rounded-full object-cover flex-shrink-0" style={{ width: size, height: size }} />;
  }
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white"
      style={{ width: size, height: size, background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", fontSize: size * 0.35 }}>
      {name[0]?.toUpperCase()}
    </div>
  );
}

interface Props {
  conversations: Conversation[];
  currentUserId: string;
}

export function DesktopMessages({ conversations, currentUserId }: Props) {
  const [selected, setSelected] = useState<Conversation | null>(conversations[0] ?? null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const getOther = (c: Conversation) =>
    c.buyer?.id === currentUserId ? c.seller : c.buyer;

  const filtered = conversations.filter(c => {
    const other = getOther(c);
    const name = other?.username || other?.full_name || "";
    return name.toLowerCase().includes(search.toLowerCase()) ||
      (c.product?.title ?? "").toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    if (!selected) return;
    supabase.from("messages")
      .select("*")
      .eq("conversation_id", selected.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data ?? []));
  }, [selected?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !selected) return;
    const content = input.trim();
    setInput("");
    const { data } = await supabase.from("messages")
      .insert({ conversation_id: selected.id, sender_id: currentUserId, content })
      .select().single();
    if (data) setMessages(prev => [...prev, data]);
  };

  const other = selected ? getOther(selected) : null;

  return (
    <div className="flex h-[100dvh]" style={{ background: "#07070A" }}>

      {/* ── Conversations list ── */}
      <div className="w-[300px] flex-shrink-0 flex flex-col border-r" style={{ background: "#08080e", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="px-4 pt-5 pb-3 flex-shrink-0">
          <h1 className="text-[18px] font-black text-white mb-3">Messages</h1>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="flex-1 bg-transparent text-[13px] text-white placeholder-white/25 outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <p className="text-[13px] text-white/25">Aucune conversation</p>
            </div>
          )}
          {filtered.map(c => {
            const other = getOther(c);
            const isSelected = selected?.id === c.id;
            return (
              <button key={c.id} onClick={() => setSelected(c)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                style={{ background: isSelected ? "rgba(139,92,246,0.1)" : "transparent",
                  borderLeft: isSelected ? "2px solid #8B5CF6" : "2px solid transparent" }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <Avatar user={other} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[13px] font-semibold text-white truncate">
                      {other?.username || other?.full_name || "Utilisateur"}
                    </p>
                    <span className="text-[10px] text-white/25 flex-shrink-0 ml-1">
                      {c.last_message_at ? timeAgo(c.last_message_at) : ""}
                    </span>
                  </div>
                  {c.product && (
                    <p className="text-[10px] text-[#8B5CF6]/70 truncate mb-0.5">{c.product.title}</p>
                  )}
                  <p className="text-[11px] text-white/30 truncate">{c.last_message || "Démarrer la conversation"}</p>
                </div>
                {(c.unread_count ?? 0) > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                    style={{ background: "#8B5CF6" }}>{c.unread_count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chat ── */}
      {selected ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
            style={{ background: "rgba(8,8,14,0.8)", borderColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-3">
              <Avatar user={other} size={36} />
              <div>
                <p className="text-[15px] font-bold text-white">{other?.username || other?.full_name}</p>
                {selected.product && (
                  <p className="text-[11px] text-[#A78BFA]">Re : {selected.product.title}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[Phone, Video, Info].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2" style={{ scrollbarWidth: "none" }}>
            {/* Product card */}
            {selected.product && (
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl max-w-[280px]"
                  style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
                  {selected.product.images?.[0] && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={selected.product.images[0]} alt={selected.product.title} width={48} height={48} className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] text-white/40 mb-0.5">À propos de</p>
                    <p className="text-[12px] font-semibold text-white truncate max-w-[160px]">{selected.product.title}</p>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Avatar user={other} size={56} />
                <p className="text-[15px] font-bold text-white mt-3 mb-1">{other?.username || other?.full_name}</p>
                <p className="text-[12px] text-white/30">Commence la conversation</p>
              </div>
            )}

            {messages.map((m) => {
              const isMe = m.sender_id === currentUserId;
              return (
                <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[65%]">
                    <div className="px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed"
                      style={{
                        background: isMe ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "rgba(255,255,255,0.06)",
                        color: isMe ? "#fff" : "rgba(255,255,255,0.85)",
                        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      }}>
                      {m.content}
                    </div>
                    <p className={`text-[9px] text-white/20 mt-1 ${isMe ? "text-right" : "text-left"} px-1`}>
                      {timeAgo(m.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 flex-shrink-0 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button className="text-white/25 hover:text-white/50 transition-colors flex-shrink-0">
                <Smile className="w-5 h-5" />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Écrire un message…"
                className="flex-1 bg-transparent text-[14px] text-white placeholder-white/25 outline-none" />
              <button className="text-white/25 hover:text-white/50 transition-colors flex-shrink-0">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button onClick={send} disabled={!input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}>
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center flex-col text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <MessageCircle className="w-7 h-7 text-[#8B5CF6]/50" />
          </div>
          <p className="text-[16px] font-bold text-white/25">Sélectionne une conversation</p>
        </div>
      )}

      {/* ── Right info panel ── */}
      {selected && other && (
        <div className="w-[260px] flex-shrink-0 border-l overflow-y-auto"
          style={{ background: "#08080e", borderColor: "rgba(255,255,255,0.05)", scrollbarWidth: "none" }}>
          <div className="p-5 flex flex-col items-center text-center border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <Avatar user={other} size={60} />
            <p className="text-[15px] font-bold text-white mt-3">{other.username || other.full_name}</p>
            {other.username && <p className="text-[12px] text-white/30">@{other.username}</p>}
            <button className="mt-3 px-5 py-2 rounded-xl text-[12px] font-semibold text-[#A78BFA] hover:bg-[#8B5CF6]/15 transition-all"
              style={{ border: "1px solid rgba(139,92,246,0.25)" }}>
              Voir le profil
            </button>
          </div>

          {selected.product && (
            <div className="p-4">
              <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-3">Article concerné</p>
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                {selected.product.images?.[0] && (
                  <div className="relative aspect-square">
                    <Image src={selected.product.images[0]} alt={selected.product.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-[12px] font-semibold text-white truncate">{selected.product.title}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MessageCircle({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
}
