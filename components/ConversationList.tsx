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
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <MessageCircle className="w-7 h-7 text-gray-400" />
        </div>
        <p className="font-semibold text-gray-900">Aucune conversation</p>
        <p className="text-sm text-gray-400 mt-1">Commence par contacter un vendeur !</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conv) => {
        const other = conv.buyer_id === currentUserId ? conv.seller : conv.buyer;
        const product = conv.product as any;

        return (
          <Link
            key={conv.id}
            href={`/messages/${conv.id}`}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            {/* Product thumbnail */}
            {product?.images?.[0] ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0" />
            )}

            <Avatar
              src={(other as any)?.avatar_url}
              name={(other as any)?.full_name || (other as any)?.username}
              size="md"
              className="-ml-4 ring-2 ring-white"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900 text-sm">
                  {(other as any)?.full_name || (other as any)?.username}
                </p>
                <p className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {timeAgo(conv.last_message_at)}
                </p>
              </div>
              {product && (
                <p className="text-xs text-[#6C63FF] font-medium mt-0.5 truncate">{product.title}</p>
              )}
              <p className="text-sm text-gray-500 truncate mt-0.5">
                {conv.last_message ?? "Nouvelle conversation"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
