import React, { useState } from "react";
import { ThemeOption, ThemeId } from "../types";
import {
  Palette,
  Sparkles,
  Check,
  CheckCircle2,
  Copy,
  CheckCheck,
  Eye,
  Sliders,
  Flame,
  Bot,
  BrainCircuit,
  Compass,
  Waves,
} from "lucide-react";

interface ThemePalettePreviewCardProps {
  theme: ThemeOption;
  isActive: boolean;
  onApplyTheme: (themeId: ThemeId) => void;
  wallpaperSrc?: string | null;
  allThemes: ThemeOption[];
  onSelectPreviewTheme: (themeId: ThemeId) => void;
}

export const ThemePalettePreviewCard: React.FC<ThemePalettePreviewCardProps> = ({
  theme,
  isActive,
  onApplyTheme,
  wallpaperSrc,
  allThemes,
  onSelectPreviewTheme,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const isTesla = theme.id === "tesla-future";
  const isBmwM8 = theme.id === "bmw-m8";
  const isLight = theme.id === "light";
  const isForest = theme.id === "forest";
  const isOcean = theme.id === "ocean-mode";
  const isAurora = theme.id === "aurora";
  const isAIMultipleFields = theme.id === "ai-multiple-fields";
  const isCyberpunk = theme.id === "cyberpunk-city" || theme.id === "cosmic-nebula";

  return (
    <div
      id="theme-palette-inspector-card"
      className="relative overflow-hidden rounded-3xl p-6 sm:p-7 border bg-slate-950/90 text-white shadow-2xl transition-all duration-500 backdrop-blur-2xl"
      style={{
        borderColor: isBmwM8
          ? "rgba(245, 158, 11, 0.6)"
          : isTesla
          ? "rgba(232, 33, 39, 0.6)"
          : isLight
          ? "rgba(99, 102, 241, 0.6)"
          : isForest
          ? "rgba(34, 197, 94, 0.5)"
          : isOcean
          ? "rgba(6, 182, 212, 0.5)"
          : isAurora
          ? "rgba(16, 185, 129, 0.5)"
          : isAIMultipleFields
          ? "rgba(0, 240, 255, 0.5)"
          : isCyberpunk
          ? "rgba(0, 240, 255, 0.6)"
          : "rgba(147, 51, 234, 0.4)",
        boxShadow: `0 20px 50px -10px ${theme.accentGlow || "rgba(0,0,0,0.5)"}`,
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-40 transition-colors duration-700"
        style={{ backgroundColor: theme.primaryColor }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-30 transition-colors duration-700"
        style={{ backgroundColor: theme.secondaryColor }}
      />

      <div className="relative z-10 space-y-6">
        
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-black tracking-wider uppercase">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300">Live Visual Palette Inspector</span>
              <span className="text-white/40">•</span>
              <span className="text-slate-300">Pre-Application Preview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{theme.name}</span>
              {isActive && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Currently Applied
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
              {theme.tagline}
            </p>
          </div>

          {/* Apply / Active Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onApplyTheme(theme.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center gap-2 shadow-lg ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30 cursor-default"
                  : "bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:brightness-110 text-slate-950 font-black shadow-cyan-500/30 active:scale-95"
              }`}
            >
              {isActive ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  <span>Active Theme</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Apply {theme.name}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main 2-Column Inspector Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Visual Artwork & Wallpaper Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-black text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Wallpaper Canvas Artwork
              </span>
              <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                {theme.category.toUpperCase()}
              </span>
            </div>

            <div className="relative h-52 sm:h-56 rounded-2xl overflow-hidden border border-white/20 shadow-xl group bg-slate-900 flex items-center justify-center">
              {wallpaperSrc ? (
                <img
                  src={wallpaperSrc}
                  alt={theme.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-tr ${theme.previewGradient} flex items-center justify-center`}>
                  <div
                    className="w-24 h-24 rounded-full blur-xl"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                </div>
              )}

              {/* Gradient Overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Badges on preview artwork */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                {theme.badgeLabel && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-white border border-white/20 shadow-sm">
                    {theme.badgeLabel}
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-1.5 text-[11px] font-bold bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-ping inline-block"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <span>Live Render Simulation</span>
                </div>
                <div className="text-[11px] text-slate-300 bg-slate-950/70 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10">
                  {theme.hasParticles ? "Particles Active" : "Clean Static"}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {theme.description}
            </p>
          </div>

          {/* Right Column: Miniature Color Palette Sample & Simulated UI Elements (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Color Palette Swatches Grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  Miniature Color Palette Sample (5 Coordinated Swatches)
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Click any hex to copy
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {theme.paletteSample.map((swatch, idx) => {
                  const isCopied = copiedHex === swatch.hex;
                  return (
                    <button
                      key={idx}
                      onClick={(e) => handleCopyHex(swatch.hex, e)}
                      title={`Click to copy ${swatch.name} (${swatch.hex})`}
                      className="group/swatch relative p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all text-left flex flex-col justify-between space-y-2 hover:scale-[1.03] active:scale-95"
                    >
                      {/* Color block with glow */}
                      <div
                        className="w-full h-9 rounded-xl shadow-md transition-transform flex items-center justify-center text-white"
                        style={{
                          backgroundColor: swatch.hex,
                          boxShadow: `0 4px 12px ${swatch.hex}55`,
                        }}
                      >
                        {isCopied && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-black/70 text-emerald-300 flex items-center gap-0.5">
                            <CheckCheck className="w-3 h-3" />
                            Copied
                          </span>
                        )}
                      </div>

                      {/* Swatch Details */}
                      <div>
                        <span className="text-[11px] font-extrabold text-white block truncate">
                          {swatch.name}
                        </span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="font-mono text-[10px] text-slate-400 group-hover/swatch:text-cyan-300">
                            {swatch.hex}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-1 py-0.2 rounded bg-white/5">
                            {swatch.role}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Miniature UI Component Sample Preview */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  Simulated UI Elements Sample
                </span>
                <span className="text-[10px] text-slate-400">Live Preview</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                
                {/* Sample Action Button */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    Interactive Button
                  </span>
                  <div
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-black text-center shadow-md truncate"
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: "#020617",
                      boxShadow: `0 2px 10px ${theme.primaryColor}66`,
                    }}
                  >
                    Submit Assignment
                  </div>
                </div>

                {/* Sample Badge & Metric Pill */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    Pill Badge & Status
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 rounded-md text-[10px] font-black border uppercase tracking-wider"
                      style={{
                        backgroundColor: `${theme.primaryColor}22`,
                        borderColor: `${theme.primaryColor}66`,
                        color: theme.primaryColor,
                      }}
                    >
                      98% A+
                    </span>
                    <span
                      className="px-2 py-1 rounded-md text-[10px] font-bold border"
                      style={{
                        backgroundColor: `${theme.secondaryColor}22`,
                        borderColor: `${theme.secondaryColor}66`,
                        color: theme.secondaryColor,
                      }}
                    >
                      On Track
                    </span>
                  </div>
                </div>

                {/* Sample Progress Bar */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-300">
                    <span>Course Progress</span>
                    <span style={{ color: theme.primaryColor }}>85%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: "85%",
                        background: `linear-gradient(to right, ${theme.secondaryColor}, ${theme.primaryColor})`,
                        boxShadow: `0 0 8px ${theme.primaryColor}`,
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Switcher Carousel to inspect any other theme */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Inspect Other Themes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {allThemes.map((t) => {
                  const isCurrentInspected = t.id === theme.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onSelectPreviewTheme(t.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                        isCurrentInspected
                          ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: t.primaryColor }}
                      />
                      <span>{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
