"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  before: string; // original image URL/dataURL
  after: string;  // enhanced image URL/dataURL
}

export function BeforeAfterSlider({ before, after }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  const updateFromEvent = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPct((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => { dragging.current = true; updateFromEvent(e.clientX); };
  const onTouchStart = (e: React.TouchEvent) => { dragging.current = true; updateFromEvent(e.touches[0].clientX); };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateFromEvent(clientX);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [updateFromEvent]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden select-none touch-none"
      style={{ aspectRatio: "1/1" }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* After (full width, behind) */}
      <img src={after} alt="Après" className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <img src={before} alt="Avant" className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${(100 / pct) * 100}%`, maxWidth: "none" }}
          draggable={false} />
      </div>

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${pct}%`, transform: "translateX(-50%)" }}>
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing">
          <div className="flex gap-0.5">
            <svg viewBox="0 0 6 10" className="w-2.5 h-2.5 text-gray-500" fill="currentColor">
              <path d="M1 0L0 1l4 4-4 4 1 1 5-5z" transform="scale(-1,1) translate(-6,0)"/>
            </svg>
            <svg viewBox="0 0 6 10" className="w-2.5 h-2.5 text-gray-500" fill="currentColor">
              <path d="M1 0L0 1l4 4-4 4 1 1 5-5z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[11px] font-bold text-white/80 pointer-events-none">
        AVANT
      </div>
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#6C63FF]/70 backdrop-blur-sm text-[11px] font-bold text-white pointer-events-none">
        APRÈS ✨
      </div>
    </div>
  );
}
