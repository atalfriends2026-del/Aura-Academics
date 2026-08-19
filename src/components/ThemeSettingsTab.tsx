import React, { useState } from "react";
import { UserThemeSettings, ThemeId } from "../types";
import { THEME_OPTIONS, isGalaxyTheme } from "../utils/themeStorage";
import { ThemePalettePreviewCard } from "./ThemePalettePreviewCard";
import oceanModeWallpaper from "../assets/images/ocean_mode_wallpaper.jpg";
import auroraWallpaper from "../assets/images/aurora_wallpaper.jpg";
import aiMultipleFieldsWallpaper from "../assets/images/ai_multiple_fields_wallpaper.jpg";
import multipleGalaxyWallpaper from "../assets/images/multiple_galaxy_wallpaper.jpg";
import aiEducationWallpaper from "../assets/images/ai_education_wallpaper.jpg";
import starlightAndromedaWallpaper from "../assets/images/starlight_andromeda_wallpaper.jpg";
import cosmicNebulaSwirlWallpaper from "../assets/images/cosmic_nebula_swirl_wallpaper.jpg";
import {
  Palette,
  Sparkles,
  Sliders,
  Eye,
  RotateCw,
  Sun,
  Layers,
  Check,
  RotateCcw,
  Star,
  Flame,
  Bot,
  BrainCircuit,
  Cpu,
  GraduationCap,
  BookOpen,
  Dna,
  Network,
  Globe,
  Boxes,
} from "lucide-react";

interface ThemeSettingsProps {
  settings: UserThemeSettings;
  onUpdateSettings: (newSettings: Partial<UserThemeSettings>) => void;
  onResetSettings: () => void;
}

export const ThemeSettingsTab: React.FC<ThemeSettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"galaxy-themes" | "customizer" | "display">("galaxy-themes");
  const [previewThemeId, setPreviewThemeId] = useState<ThemeId>(settings.activeThemeId);
  const isCurrentGalaxy = isGalaxyTheme(settings.activeThemeId);

  const getThemeWallpaper = (themeId: ThemeId) => {
    switch (themeId) {
      case "ocean-mode":
        return oceanModeWallpaper;
      case "aurora":
        return auroraWallpaper;
      case "ai-multiple-fields":
        return aiMultipleFieldsWallpaper;
      case "multiple-galaxy":
        return multipleGalaxyWallpaper;
      case "ai-education":
        return aiEducationWallpaper;
      case "starlight-andromeda":
        return starlightAndromedaWallpaper;
      case "cosmic-nebula":
        return cosmicNebulaSwirlWallpaper;
      default:
        return null;
    }
  };

  const handleSelectTheme = (themeId: ThemeId) => {
    setPreviewThemeId(themeId);
    onUpdateSettings({ activeThemeId: themeId });
  };

  const inspectedTheme = THEME_OPTIONS.find((t) => t.id === previewThemeId) || THEME_OPTIONS[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-cyan-950/70 to-purple-950 border border-cyan-500/30 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black tracking-wider uppercase">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Next-Gen Holographic Learning Canvas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Theme & Cosmic Settings</span>
              <span className="text-xs px-2.5 py-0.5 rounded-xl bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 font-bold">
                AI in Education Edition
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Transform your workspace with neural AI holograms, floating textbooks, planetary orbits, robotic tutor droids, and deep multiple-spiral galaxy nebulas.
            </p>
          </div>

          {/* Quick Active Theme Indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/20 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 block">
                Active Theme
              </span>
              <span className="text-sm font-black text-white block">
                {THEME_OPTIONS.find((t) => t.id === settings.activeThemeId)?.name || "AI in Education"}
              </span>
              <span className="text-[11px] text-cyan-300 font-semibold">
                {isCurrentGalaxy ? "Holographic Engine Active" : "Standard Mode Active"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-300/60 dark:border-slate-800/80">
        <button
          onClick={() => setActiveSubTab("galaxy-themes")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeSubTab === "galaxy-themes"
              ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25"
              : "text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/60"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Themes Gallery</span>
        </button>

        <button
          onClick={() => setActiveSubTab("customizer")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeSubTab === "customizer"
              ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25"
              : "text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/60"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Cosmic & AI Hologram FX</span>
        </button>

        <button
          onClick={() => setActiveSubTab("display")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeSubTab === "display"
              ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25"
              : "text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/60"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Glassmorphism & Accents</span>
        </button>
      </div>

      {/* TAB 1: GALAXY & AI THEMES GALLERY */}
      {activeSubTab === "galaxy-themes" && (
        <div className="space-y-8">

          {/* Visual Palette Preview & Pre-Application Inspector Card */}
          <ThemePalettePreviewCard
            theme={inspectedTheme}
            isActive={settings.activeThemeId === inspectedTheme.id}
            onApplyTheme={handleSelectTheme}
            wallpaperSrc={getThemeWallpaper(inspectedTheme.id)}
            allThemes={THEME_OPTIONS}
            onSelectPreviewTheme={(id) => {
              setPreviewThemeId(id);
              document.getElementById("theme-palette-inspector-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
          
          {/* Section 1: Cosmic Multi-Galaxy & AI Themes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  AI in Education & Cosmic Galaxy Collection
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                9 Futuristic Variants
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {THEME_OPTIONS.filter((t) => t.category === "galaxy" || t.category === "ai-theme").map((theme) => {
                const isSelected = settings.activeThemeId === theme.id;
                const isInspected = inspectedTheme.id === theme.id;
                const isOcean = theme.id === "ocean-mode";
                const isAurora = theme.id === "aurora";
                const isAIMultipleFields = theme.id === "ai-multiple-fields";
                const isAIEdu = theme.id === "ai-education";
                const isMultipleGalaxy = theme.id === "multiple-galaxy";
                const isAndromeda = theme.id === "starlight-andromeda";
                const isNebula = theme.id === "cosmic-nebula";

                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      setPreviewThemeId(theme.id);
                      handleSelectTheme(theme.id);
                    }}
                    className={`group relative overflow-hidden rounded-3xl p-5 cursor-pointer transition-all duration-300 border text-left flex flex-col justify-between ${
                      isSelected
                        ? isOcean
                          ? "ring-2 ring-cyan-400 border-cyan-300 shadow-2xl shadow-cyan-500/40 bg-slate-950 text-white scale-[1.02]"
                          : isAurora
                          ? "ring-2 ring-emerald-400 border-emerald-300 shadow-2xl shadow-emerald-500/40 bg-slate-950 text-white scale-[1.02]"
                          : isAIMultipleFields
                          ? "ring-2 ring-cyan-400 border-cyan-300 shadow-2xl shadow-cyan-500/40 bg-slate-950 text-white scale-[1.02]"
                          : isNebula
                          ? "ring-2 ring-fuchsia-400 border-fuchsia-300 shadow-2xl shadow-fuchsia-500/30 bg-slate-950 text-white scale-[1.02]"
                          : isAndromeda
                          ? "ring-2 ring-sky-400 border-sky-300 shadow-2xl shadow-sky-500/30 bg-slate-950 text-white scale-[1.02]"
                          : isMultipleGalaxy
                          ? "ring-2 ring-amber-400 border-amber-300 shadow-2xl shadow-amber-500/30 bg-slate-950 text-white scale-[1.02]"
                          : isAIEdu
                          ? "ring-2 ring-cyan-400 border-cyan-300 shadow-2xl shadow-cyan-500/30 bg-slate-950 text-white scale-[1.02]"
                          : "ring-2 ring-purple-500 border-purple-400 shadow-xl shadow-purple-500/20 bg-slate-900/90 text-white scale-[1.02]"
                        : isInspected
                        ? "bg-slate-900/90 border-cyan-400/80 shadow-lg text-slate-200"
                        : "bg-slate-900/70 hover:bg-slate-900/90 border-slate-800/80 hover:border-cyan-500/50 text-slate-200"
                    }`}
                  >
                    {/* Visual Cosmic / AI Hologram Backdrop Swatch */}
                    <div
                      className={`h-36 rounded-2xl mb-4 relative overflow-hidden bg-gradient-to-tr ${theme.previewGradient} border border-white/10 flex items-center justify-center`}
                    >
                      {/* Ocean Mode Visual Preview */}
                      {isOcean ? (
                        <div className="absolute inset-0 overflow-hidden">
                          <img
                            src={oceanModeWallpaper}
                            alt="Tropical Coral Reef Ocean Mode Masterpiece"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-cyan-300 font-bold border border-cyan-400/40 shadow-xs">
                            <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                            <span>Ocean Reef</span>
                          </div>
                        </div>
                      ) : isAurora ? (
                        /* Aurora Borealis Visual Preview */
                        <div className="absolute inset-0 overflow-hidden">
                          <img
                            src={auroraWallpaper}
                            alt="Aurora Borealis Arctic Fjord Masterpiece"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-emerald-300 font-bold border border-emerald-400/40 shadow-xs">
                            <Sparkles className="w-3 h-3 text-emerald-300 animate-pulse" />
                            <span>Aurora Arctic</span>
                          </div>
                        </div>
                      ) : isAIMultipleFields ? (
                        /* AI in Multiple Fields Visual Preview */
                        <div className="absolute inset-0 overflow-hidden">
                          <img
                            src={aiMultipleFieldsWallpaper}
                            alt="AI in Multiple Fields Masterpiece"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-cyan-300 font-bold border border-cyan-400/40 shadow-xs">
                            <Boxes className="w-3 h-3 text-cyan-300 animate-pulse" />
                            <span>AI Multi-Field</span>
                          </div>
                        </div>
                      ) : isAIEdu ? (
                        /* AI in Education Visual Preview */
                        <div className="absolute inset-0 overflow-hidden">
                          <img
                            src={aiEducationWallpaper}
                            alt="AI in Education Futuristic Classroom"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-cyan-300 font-bold border border-cyan-400/40 shadow-xs">
                            <BrainCircuit className="w-3 h-3 text-cyan-300 animate-pulse" />
                            <span>AI Neural</span>
                          </div>
                        </div>
                      ) : isNebula ? (
                        /* Cosmic Nebula Swirl Cyber Night Market Masterpiece Preview */
                        <div className="absolute inset-0 overflow-hidden">
                          <img
                            src={cosmicNebulaSwirlWallpaper}
                            alt="Cosmic Nebula Swirl Cyberpunk Night Market"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-fuchsia-300 font-bold border border-fuchsia-400/40 shadow-xs">
                            <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                            <span>Cyber Neon</span>
                          </div>
                        </div>
                      ) : isAndromeda ? (
                        /* Starlight Andromeda AI Ecosystem Masterpiece Preview */
                        <div className="absolute inset-0 overflow-hidden">
                          <img
                            src={starlightAndromedaWallpaper}
                            alt="Starlight Andromeda AI Ecosystem"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-sky-300 font-bold border border-sky-400/40 shadow-xs">
                            <Network className="w-3 h-3 text-sky-300 animate-pulse" />
                            <span>AI Ecosystem</span>
                          </div>
                        </div>
                      ) : isMultipleGalaxy ? (
                        /* Multiple Galaxy Universe Preview Matching the Masterpiece Image Exactly */
                        <div className="absolute inset-0 overflow-hidden">
                          <img
                            src={multipleGalaxyWallpaper}
                            alt="Multiple Galaxy Universe"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-amber-300 font-bold border border-amber-400/40 shadow-xs">
                            <Sparkles className="w-3 h-3 text-amber-300 animate-spin-slow" />
                            <span>Multi-Spiral</span>
                          </div>
                        </div>
                      ) : (
                        /* Standard Stylized Miniature Galaxy Visual */
                        <div className="absolute inset-0 opacity-70">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-radial from-amber-200 via-purple-600 to-transparent blur-md" />
                          {theme.hasSpirals && (
                            <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                              <div className="w-20 h-20 border-2 border-dashed border-cyan-400/40 rounded-full" />
                              <div className="w-12 h-12 border-2 border-purple-400/60 rounded-full absolute" />
                            </div>
                          )}
                        </div>
                      )}

                      {theme.badgeLabel && (
                        <span className={`absolute bottom-2 left-2 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md text-white border ${
                          isOcean
                            ? "bg-cyan-600/80 border-cyan-300/80 shadow-md shadow-cyan-500/50"
                            : isAurora
                            ? "bg-emerald-600/80 border-emerald-300/80 shadow-md shadow-emerald-500/50"
                            : isAIMultipleFields
                            ? "bg-cyan-500/80 border-cyan-300/80 shadow-md shadow-cyan-500/50"
                            : isNebula
                            ? "bg-fuchsia-600/80 border-fuchsia-300/80 shadow-md shadow-fuchsia-500/50"
                            : isAndromeda
                            ? "bg-sky-500/80 border-sky-300/80 shadow-md shadow-sky-500/50"
                            : isMultipleGalaxy
                            ? "bg-amber-500/80 border-amber-300/80 shadow-md shadow-amber-500/50"
                            : isAIEdu
                            ? "bg-cyan-500/80 border-cyan-300/80 shadow-md shadow-cyan-500/50"
                            : "bg-black/60 border-white/20"
                        }`}>
                          {theme.badgeLabel}
                        </span>
                      )}

                      {isSelected && (
                        <div className={`absolute top-2 right-2 w-7 h-7 rounded-full text-white flex items-center justify-center shadow-md ${
                          isOcean
                            ? "bg-cyan-500 shadow-cyan-500/50"
                            : isAurora
                            ? "bg-emerald-500 shadow-emerald-500/50"
                            : isAIMultipleFields
                            ? "bg-cyan-500 shadow-cyan-500/50"
                            : isNebula
                            ? "bg-fuchsia-500 shadow-fuchsia-500/50"
                            : isAndromeda
                            ? "bg-sky-500 shadow-sky-500/50"
                            : isMultipleGalaxy
                            ? "bg-amber-500 shadow-amber-500/50"
                            : isAIEdu
                            ? "bg-cyan-500 shadow-cyan-500/50"
                            : "bg-purple-600"
                        }`}>
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                          <span>{theme.name}</span>
                          {isOcean && (
                            <span className="text-[10px] text-cyan-300 font-bold">★ Ocean Masterpiece</span>
                          )}
                          {isAurora && (
                            <span className="text-[10px] text-emerald-300 font-bold">★ Aurora Masterpiece</span>
                          )}
                          {isAIMultipleFields && (
                            <span className="text-[10px] text-cyan-300 font-bold">★ AI Masterpiece</span>
                          )}
                          {isNebula && (
                            <span className="text-[10px] text-fuchsia-300 font-bold">★ Cyber Neon</span>
                          )}
                          {isAndromeda && (
                            <span className="text-[10px] text-sky-300 font-bold">★ AI Ecosystem</span>
                          )}
                          {isMultipleGalaxy && (
                            <span className="text-[10px] text-amber-300 font-bold">★ Galaxy Masterpiece</span>
                          )}
                          {isAIEdu && (
                            <span className="text-[10px] text-cyan-300 font-bold">★ AI Featured</span>
                          )}
                        </h4>
                        <span
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                      </div>
                      <p className="text-xs text-sky-300 dark:text-sky-400 font-semibold">{theme.tagline}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {theme.description}
                      </p>

                      {/* Miniature Color Palette Sample Strip */}
                      <div className="pt-2 border-t border-slate-800/60">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Palette className="w-3 h-3 text-cyan-400" />
                            Palette Sample:
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {theme.paletteSample.map((swatch, sIdx) => (
                            <div
                              key={sIdx}
                              title={`${swatch.name} (${swatch.hex}) - ${swatch.role}`}
                              className="flex-1 h-3.5 rounded-md border border-white/10 shadow-xs transition-transform hover:scale-110"
                              style={{ backgroundColor: swatch.hex }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button Indicator */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewThemeId(theme.id);
                          document.getElementById("theme-palette-inspector-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                          isInspected
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-xs"
                            : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTheme(theme.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                          isSelected
                            ? isOcean
                              ? "bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/40"
                              : isAurora
                              ? "bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/40"
                              : isAIMultipleFields
                              ? "bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/40"
                              : isNebula
                              ? "bg-fuchsia-400 text-slate-950 font-black shadow-md shadow-fuchsia-500/40"
                              : isAndromeda
                              ? "bg-sky-400 text-slate-950 font-black shadow-md shadow-sky-500/40"
                              : isMultipleGalaxy
                              ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/40"
                              : isAIEdu
                              ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/40"
                              : "bg-purple-600 text-white shadow-sm"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {isSelected ? "Active" : "Apply"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Classic Modes */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 mb-4">
              <Sun className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Classic Clean Themes
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THEME_OPTIONS.filter((t) => t.category === "classic").map((theme) => {
                const isSelected = settings.activeThemeId === theme.id;
                const isInspected = inspectedTheme.id === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      setPreviewThemeId(theme.id);
                      handleSelectTheme(theme.id);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? "ring-2 ring-indigo-500 border-indigo-400 bg-indigo-50/50 dark:bg-slate-800/90 shadow-md"
                        : isInspected
                        ? "ring-1 ring-cyan-400 bg-white/90 dark:bg-slate-900/80 border-cyan-400/50"
                        : "bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${theme.previewGradient} border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0`}
                        >
                          {theme.id === "light" ? (
                            <Sun className="w-5 h-5 text-amber-500" />
                          ) : (
                            <Layers className="w-5 h-5 text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {theme.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {theme.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewThemeId(theme.id);
                            document.getElementById("theme-palette-inspector-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTheme(theme.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {isSelected ? "Active" : "Apply"}
                        </button>
                      </div>
                    </div>

                    {/* Miniature Color Palette Sample Strip */}
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Palette className="w-3 h-3 text-indigo-500" />
                        Palette Sample:
                      </span>
                      <div className="flex items-center gap-1.5 w-44">
                        {theme.paletteSample.map((swatch, sIdx) => (
                          <div
                            key={sIdx}
                            title={`${swatch.name} (${swatch.hex}) - ${swatch.role}`}
                            className="flex-1 h-3 rounded-md border border-slate-300/60 dark:border-white/10"
                            style={{ backgroundColor: swatch.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: COSMIC & AI HOLOGRAM FX */}
      {activeSubTab === "customizer" && (
        <div className="space-y-6">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  AI Holograms, Starfield & Dynamics Controls
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tune the visual energy, hologram visibility, and particle density of the learning environment.
                </p>
              </div>
              <button
                onClick={onResetSettings}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>

            {/* Galaxy Wallpaper Opacity Slider */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-cyan-500" />
                  <span>Wallpaper & Hologram Opacity / Brightness</span>
                </label>
                <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60">
                  {settings.galaxyWallpaperIntensity}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={settings.galaxyWallpaperIntensity}
                onChange={(e) =>
                  onUpdateSettings({ galaxyWallpaperIntensity: parseInt(e.target.value, 10) })
                }
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Subtle (20%)</span>
                <span>Balanced (60%)</span>
                <span>Vibrant Cosmic (100%)</span>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* AI Holograms & Teacher Droids */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-cyan-400" />
                    AI Neural Holograms & Droids
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Render floating neural brain avatars, tutor droids & textbooks.
                  </p>
                </div>
                <button
                  onClick={() =>
                    onUpdateSettings({ enableAIHolograms: !settings.enableAIHolograms })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${
                    settings.enableAIHolograms !== false ? "bg-cyan-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      settings.enableAIHolograms !== false ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Cyber HUD & Quantum Grid */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    Cyber HUD & Radar Widgets
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Display holographic telemetry, quantum atoms & DNA metrics.
                  </p>
                </div>
                <button
                  onClick={() =>
                    onUpdateSettings({ enableCyberHUD: !settings.enableCyberHUD })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${
                    settings.enableCyberHUD !== false ? "bg-purple-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      settings.enableCyberHUD !== false ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Star Particles */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-500" />
                    Twinkling Star Particles
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Live dynamic canvas star clusters & dust particles.
                  </p>
                </div>
                <button
                  onClick={() =>
                    onUpdateSettings({ enableStarParticles: !settings.enableStarParticles })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${
                    settings.enableStarParticles ? "bg-cyan-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      settings.enableStarParticles ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Spiral Galaxy Rotation */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <RotateCw className="w-4 h-4 text-purple-500" />
                    Galaxy & Vortex Rotation
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Smooth ambient vortex animation for galaxy spiral arms.
                  </p>
                </div>
                <button
                  onClick={() =>
                    onUpdateSettings({ enableSpiralRotation: !settings.enableSpiralRotation })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${
                    settings.enableSpiralRotation ? "bg-purple-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      settings.enableSpiralRotation ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Shooting Stars & Meteors */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    Shooting Stars & Meteors
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Occasional streak of celestial starlight traversing the sky.
                  </p>
                </div>
                <button
                  onClick={() =>
                    onUpdateSettings({ enableShootingStars: !settings.enableShootingStars })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${
                    settings.enableShootingStars ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      settings.enableShootingStars ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Cosmic Card Glow */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Holographic Aura Border
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Glowing cyan/purple borders surrounding learning dashboard cards.
                  </p>
                </div>
                <button
                  onClick={() =>
                    onUpdateSettings({ enableCosmicGlow: !settings.enableCosmicGlow })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${
                    settings.enableCosmicGlow ? "bg-cyan-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      settings.enableCosmicGlow ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 3: GLASSMORPHISM & ACCENTS */}
      {activeSubTab === "display" && (
        <div className="space-y-6">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
            
            {/* Card Glassmorphism Opacity */}
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-900 dark:text-white block">
                Card Glassmorphism & Translucency
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "crystal" as const,
                    title: "Crystal Glass",
                    desc: "High blur with visible galaxy and holographic backdrop through cards",
                  },
                  {
                    id: "frosted" as const,
                    title: "Frosted Mist",
                    desc: "Medium blur with balanced contrast",
                  },
                  {
                    id: "solid" as const,
                    title: "Solid Obsidian",
                    desc: "Max opacity for high-contrast reading",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onUpdateSettings({ cardGlassmorphism: item.id })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      settings.cardGlassmorphism === item.id
                        ? "ring-2 ring-cyan-400 border-cyan-300 bg-cyan-950/40 dark:bg-cyan-950/50 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-cyan-300"
                    }`}
                  >
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block mb-1">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Palette Override */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className="text-sm font-black text-slate-900 dark:text-white block">
                Highlight Accent Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {[
                  { id: "ocean-cyan" as const, name: "Ocean Cyan", color: "bg-cyan-500" },
                  { id: "emerald-aurora" as const, name: "Aurora Green", color: "bg-emerald-500" },
                  { id: "starlight-cyan" as const, name: "Cyber Cyan", color: "bg-cyan-400" },
                  { id: "cosmic-purple" as const, name: "Cosmic Purple", color: "bg-purple-600" },
                  { id: "celestial-gold" as const, name: "Solar Gold", color: "bg-amber-500" },
                  { id: "nebula-magenta" as const, name: "Nebula Pink", color: "bg-pink-500" },
                ].map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => onUpdateSettings({ accentPalette: palette.id })}
                    className={`p-3 rounded-2xl border flex items-center space-x-2.5 transition-all ${
                      settings.accentPalette === palette.id
                        ? "ring-2 ring-cyan-400 border-cyan-300 bg-cyan-50 dark:bg-slate-800 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${palette.color} shrink-0 shadow-[0_0_8px_currentColor]`} />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {palette.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Scale */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className="text-sm font-black text-slate-900 dark:text-white block">
                Reading Font Scale
              </label>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {(["compact", "normal", "spacious"] as const).map((scale) => (
                  <button
                    key={scale}
                    onClick={() => onUpdateSettings({ fontSizeScale: scale })}
                    className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
                      settings.fontSizeScale === scale
                        ? "bg-cyan-500 text-slate-950 font-black border-cyan-400 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
