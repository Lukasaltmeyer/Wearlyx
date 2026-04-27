"use client";

interface Step { label: string; icon: string; }

const STEPS: Step[] = [
  { label: "Photos",   icon: "📸" },
  { label: "Style",    icon: "🎨" },
  { label: "Générer",  icon: "✨" },
];

export function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 px-6">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center">
          {/* Step circle */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold transition-all duration-300 ${
                i < current
                  ? "bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30"
                  : i === current
                  ? "bg-[#8B5CF6]/20 border-2 border-[#8B5CF6] text-white scale-110"
                  : "bg-white/5 border border-white/10 text-white/30"
              }`}
            >
              {i < current ? "✓" : s.icon}
            </div>
            <span
              className={`text-[11px] font-semibold transition-colors duration-300 ${
                i === current ? "text-white" : i < current ? "text-[#8B5CF6]" : "text-white/30"
              }`}
            >
              {s.label}
            </span>
          </div>
          {/* Connector */}
          {i < STEPS.length - 1 && (
            <div className="w-12 h-0.5 mx-1 mb-5 rounded-full transition-all duration-500"
              style={{ background: i < current ? "#8B5CF6" : "rgba(255,255,255,0.1)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}