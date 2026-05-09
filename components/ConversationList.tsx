"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Sparkles } from "lucide-react";
import type { Conversation } from "@/types/database";
import { Avatar } from "@/components/ui/Avatar";
import { timeAgo, cn } from "@/lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
}

export function ConversationList({ conversations, currentUserId }: ConversationListProps) {
  if (!conversations.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.15)",
            boxShadow: "0 0 24px rgba(139,92,246,0.08)",
          }}
        >
          <MessageCircle className="w-7 h-7 text-[#8B5CF6]/50" />
        </div>
        <p className="font-bold text-white/60 text-[15px]">Aucune conversation</p>
        <p className="text-[13px] text-white/25 mt-1.5">Commence par contacter un vendeur !</p>
        <div className="flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.15)" }}>
          <Sparkles className="w-3 h-3 text-[#A78BFA]" />
          <span className="text-[11px] text-[#A78BFA] font-medium">Explorer les articles</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {conversations.map((conv) => {
        const other = conv.buyer_id === currentUserId ? conv.seller : conv.buyer;
        const product = conv.product as any;
        const isUnread = !conv.read && conv.last_message_sender_id !== currentUserId;

        return (
          <Link
            key={conv.id}
            href={`/messages/${conv.id}`}
            className="flex items-center gap-3.5 px-4 py-3.5 transition-all active:bg-white/3 relative"
            style={isUnread ? { background: "rgba(139,92,246,0.04)" } : {}}
          >
            {/* Unread left accent */}
            {isUnread && (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                style={{ background: "linear-gradient(180deg, #8B5CF6, #7C3AED)" }}
              />
            )}

            {/* Product + Avatar stack */}
            <div className="relative flex-shrink-0">
              {product?.images?.[0] ? (
                <div
                  className="relative w-12 h-12 rounded-xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              )}
              <div className={cn(
                "absolute -bottom-1 -right-1 ring-2",
                isUnread ? "ring-[#8B5CF6]/30" : "ring-[#07070A]"
              )}>
                <Avatar
                  src={(other as any)?.avatar_url}
                  name={(other as any)?.full_name || (other as any)?.username}
                  size="sm"
                />
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className={cn(
                  "text-[14px] truncate",
                  isUnread ? "font-black text-white" : "font-semibold text-white/65"
                )}>
                  {(other as any)?.full_name || (other as any)?.username}
                </p>
                <p className={cn(
                  "text-[11px] flex-shrink-0 ml-2",
                  isUnread ? "text-[#A78BFA] font-semibold" : "text-white/20"
                )}>
                  {timeAgo(conv.last_message_at)}
                </p>
              </div>

              {product && (
                <p className="text-[11px] font-medium truncate mb-0.5"
                  style={{ color: "rgba(167,139,250,0.6)" }}>
                  {product.title}
                </p>
              )}

              <p className={cn(
                "text-[12.5px] truncate",
                isUnread ? "text-white/55 font-medium" : "text-white/25"
              )}>
                {conv.last_message ?? "Nouvelle conversation"}
              </p>
            </div>

            {/* Unread dot */}
            {isUnread && (
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #A78BFA)", boxShadow: "0 0 8px rgba(139,92,246,0.6)" }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
