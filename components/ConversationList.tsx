"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
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
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
          <MessageCircle className="w-7 h-7 text-white/20" />
        </div>
        <p className="font-semibold text-white/70">Aucune conversation</p>
        <p className="text-sm text-white/30 mt-1">Commence par contacter un vendeur !</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/[0.05]">
      {conversations.map((conv) => {
        const other = conv.buyer_id === currentUserId ? conv.seller : conv.buyer;
        const product = conv.product as any;
        const isUnread = !conv.read && conv.last_message_sender_id !== currentUserId;

        return (
          <Link
            key={conv.id}
            href={`/messages/${conv.id}`}
            className="flex items-center gap-3 px-4 py-3.5 active:bg-white/4 transition-colors"
            style={isUnread ? { background: "rgba(34,197,94,0.05)" } : {}}
          >
            <div className="relative flex-shrink-0">
              {product?.images?.[0] ? (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/8">
                  <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex-shrink-0" />
              )}
              <div className={cn(
                "absolute -bottom-1 -right-1 ring-2 ring-[#08080F] rounded-full",
                isUnread ? "ring-[#22C55E]/50" : ""
              )}>
                <Avatar
                  src={(other as any)?.avatar_url}
                  name={(other as any)?.full_name || (other as any)?.username}
                  size="sm"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 ml-1">
              <div className="flex items-center justify-between">
                <p className={cn("text-sm truncate", isUnread ? "font-bold text-white" : "font-semibold text-white/75")}>
                  {(other as any)?.full_name || (other as any)?.username}
                </p>
                <p className={cn("text-[11px] flex-shrink-0 ml-2", isUnread ? "text-[#9B93FF] font-semibold" : "text-white/25")}>
                  {timeAgo(conv.last_message_at)}
                </p>
              </div>
              {product && (
                <p className="text-[11px] text-[#9B93FF]/70 font-medium mt-0.5 truncate">{product.title}</p>
              )}
              <p className={cn("text-[13px] truncate mt-0.5", isUnread ? "text-white/60 font-medium" : "text-white/30")}>
                {conv.last_message ?? "Nouvelle conversation"}
              </p>
            </div>

            {isUnread && (
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)" }} />
            )}
          </Link>
        );
      })}
    </div>
  );
}
