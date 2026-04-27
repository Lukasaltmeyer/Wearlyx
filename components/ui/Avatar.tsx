"use client";

import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizeClass = sizes[size];

  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden bg-gray-100 flex-shrink-0", sizeClass, className)}>
        <Image src={src} alt={name ?? "Avatar"} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white",
        "bg-gradient-to-br from-[#8B5CF6] to-[#8B85FF]",
        sizeClass,
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}