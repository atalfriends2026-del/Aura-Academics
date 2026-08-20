import React, { useEffect, useRef, useState } from "react";
import { UserThemeSettings } from "../types";
import forestWallpaper from "../assets/images/forest_wallpaper.jpg";
import oceanModeWallpaper from "../assets/images/ocean_mode_wallpaper.jpg";
import auroraWallpaper from "../assets/images/aurora_wallpaper.jpg";
import aiMultipleFieldsWallpaper from "../assets/images/ai_multiple_fields_wallpaper.jpg";
import multipleGalaxyWallpaper from "../assets/images/multiple_galaxy_wallpaper.jpg";
import aiEducationWallpaper from "../assets/images/ai_education_wallpaper.jpg";
import starlightAndromedaWallpaper from "../assets/images/starlight_andromeda_wallpaper.jpg";
import cosmicNebulaSwirlWallpaper from "../assets/images/cosmic_nebula_swirl_wallpaper.jpg";

interface GalaxyBackgroundProps {
  settings: UserThemeSettings;
}

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ settings }) => {
  const {
    activeThemeId,
    enableStarParticles,
    enableSpiralRotation,
    enableShootingStars,
    galaxyWallpaperIntensity,
  } = settings;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; top: number; left: number; angle: number; delay: number }>>([]);

  // Spawn periodic shooting stars
  useEffect(() => {
    if (!enableShootingStars) {
      setShootingStars([]);
      return;
    }

    const interval = setInterval(() => {
      setShootingStars((prev) => {
        const next = [
          ...prev.slice(-3),
          {
            id: Date.now(),
            top: Math.random() * 60,
            left: Math.random() * 80 + 10,
            angle: 30 + Math.random() * 25,
            delay: Math.random() * 0.5,
          },
        ];
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [enableShootingStars]);

  // Starfield particle animation on Canvas
  useEffect(() => {
    if (!enableStarParticles) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Generate stars
    const starCount = Math.floor((width * height) / 4500);
    const stars = Array.from({ length: Math.min(starCount, 280) }, () => {
      const colors = [
        "rgba(255, 255, 255,",
        "rgba(216, 180, 254,", // purple
        "rgba(147, 197, 253,", // blue
        "rgba(253, 230, 138,", // gold
        "rgba(165, 243, 252,", // cyan
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
        color,
      };
    });

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 1;

      stars.forEach((star) => {
        const alpha =
          star.baseAlpha + Math.sin(tick * star.pulseSpeed + star.pulseOffset) * 0.25;
        const clampedAlpha = Math.max(0.1, Math.min(1, alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color} ${clampedAlpha})`;
        ctx.fill();

        // Star glow for larger stars
        if (star.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color} ${clampedAlpha * 0.25})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enableStarParticles, activeThemeId]);

  const opacityStyle = {
    opacity: (galaxyWallpaperIntensity / 100).toFixed(2),
  };

  // Color schemes per theme
  const isForest = activeThemeId === "forest";
  const isOceanMode = activeThemeId === "ocean-mode";
  const isAurora = activeThemeId === "aurora";
  const isAIMultipleFields = activeThemeId === "ai-multiple-fields";
  const isAIEducation = activeThemeId === "ai-education";
  const isAndromeda = activeThemeId === "starlight-andromeda";
  const isNebula = activeThemeId === "cosmic-nebula";
  const isSupernova = activeThemeId === "supernova-gold";
  const isVoid = activeThemeId === "deep-void";

  const primaryGlow = isForest
    ? "#22c55e"
    : isOceanMode
    ? "#06b6d4"
    : isAurora
    ? "#10b981"
    : isAIMultipleFields
    ? "#00f0ff"
    : isAIEducation
    ? "#00f0ff"
    : isAndromeda
    ? "#0284c7"
    : isNebula
    ? "#c026d3"
    : isSupernova
    ? "#f59e0b"
    : "#9333ea"; // Multiple Galaxy default

  const secondaryGlow = isForest
    ? "#eab308"
    : isOceanMode
    ? "#3b82f6"
    : isAurora
    ? "#06b6d4"
    : isAIMultipleFields
    ? "#3b82f6"
    : isAIEducation
    ? "#a855f7"
    : isAndromeda
    ? "#3b82f6"
    : isNebula
    ? "#db2777"
    : isSupernova
    ? "#ea580c"
    : "#06b6d4";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700"
      style={opacityStyle}
      aria-hidden="true"
    >
      {/* Deep Cosmos / Forest / Ocean Abyss Background */}
      <div
        className={`absolute inset-0 ${
          isForest
            ? "bg-[#06140b] bg-radial-[at_50%_40%] from-[#0f2d18] via-[#091b10] to-[#040e07]"
            : isOceanMode
            ? "bg-[#011422] bg-radial-[at_50%_40%] from-[#02314d] via-[#011b2b] to-[#010b14]"
            : isAurora
            ? "bg-[#010e14] bg-radial-[at_50%_40%] from-[#042426] via-[#02131a] to-[#01080e]"
            : isAIMultipleFields || isAIEducation
            ? "bg-[#030114] bg-radial-[at_50%_40%] from-[#0d133d] via-[#06041c] to-[#02010c]"
            : "bg-[#04010e] bg-radial-[at_50%_50%] from-[#0e0428] via-[#050214] to-[#020008]"
        }`}
      />

      {/* 🌲 THEME: ENCHANTED FOREST SANCTUARY MASTERPIECE */}
      {isForest && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* 🌲 ULTRA HIGH-DEFINITION ENCHANTED FOREST WALLPAPER (As Requested) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={forestWallpaper}
              alt="Enchanted Forest Sanctuary Masterpiece"
              className="w-full h-full object-cover object-center transition-transform duration-1000 scale-100"
              referrerPolicy="no-referrer"
            />
            {/* Ambient Forest Twilight Lighting & Depth Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
          </div>

          {/* Ambient Warm Sunset God Rays & Moss Emerald Shimmer */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-b from-amber-400/20 via-emerald-500/20 to-teal-600/15 rounded-full blur-[105px]" />
            <div className="absolute top-[15%] left-[8%] w-[480px] h-[350px] bg-emerald-500/20 rounded-full blur-[90px]" />
            <div className="absolute top-[18%] right-[8%] w-[480px] h-[350px] bg-amber-400/15 rounded-full blur-[90px]" />
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[850px] h-[320px] bg-emerald-600/15 rounded-full blur-[95px]" />
          </div>
        </div>
      )}

      {/* 🌊 THEME 0: TROPICAL CORAL REEF OCEAN MODE MASTERPIECE */}
      {isOceanMode && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* 🌊 ULTRA HIGH-DEFINITION OCEAN MODE WALLPAPER (As Requested) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={oceanModeWallpaper}
              alt="Tropical Coral Reef Ocean Mode Masterpiece"
              className="w-full h-full object-cover object-center transition-transform duration-1000 scale-100"
              referrerPolicy="no-referrer"
            />
            {/* Ambient Underwater Lighting & Depth Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
          </div>

          {/* Ambient Turquoise & Azure Sunbeam Light Shimmer */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-300/20 via-cyan-400/25 to-blue-500/20 rounded-full blur-[100px]" />
            <div className="absolute top-[15%] left-[10%] w-[450px] h-[300px] bg-cyan-400/20 rounded-full blur-[80px]" />
            <div className="absolute top-[18%] right-[10%] w-[450px] h-[300px] bg-blue-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-teal-500/15 rounded-full blur-[90px]" />
          </div>
        </div>
      )}

      {/* 🌌 THEME 1: AURORA BOREALIS ETHEREAL ARCTIC MASTERPIECE */}
      {isAurora && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* 🌌 ULTRA HIGH-DEFINITION AURORA BOREALIS WALLPAPER (As Requested) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={auroraWallpaper}
              alt="Aurora Borealis Arctic Fjord Masterpiece"
              className="w-full h-full object-cover object-center transition-transform duration-1000 scale-100"
              referrerPolicy="no-referrer"
            />
            {/* Ambient Arctic Vignette & Depth Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60" />
          </div>

          {/* Ambient Emerald & Cyan Auroral Wave Accents */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-500/25 via-teal-400/25 to-cyan-500/25 rounded-full blur-[110px]" />
            <div className="absolute top-[5%] left-[10%] w-[500px] h-[350px] bg-emerald-400/20 rounded-full blur-[90px]" />
            <div className="absolute top-[8%] right-[10%] w-[500px] h-[350px] bg-cyan-400/20 rounded-full blur-[90px]" />
            <div className="absolute bottom-[10%] left-[20%] w-[450px] h-[300px] bg-teal-500/15 rounded-full blur-[80px]" />
          </div>
        </div>
      )}

      {/* 🧠 THEME 2: AI IN MULTIPLE FIELDS FUTURISTIC ECOSYSTEM MASTERPIECE */}
      {isAIMultipleFields && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* 🌌 ULTRA HIGH-DEFINITION AI IN MULTIPLE FIELDS WALLPAPER (As Requested) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={aiMultipleFieldsWallpaper}
              alt="AI in Multiple Fields Masterpiece"
              className="w-full h-full object-cover object-center transition-transform duration-1000 scale-100"
              referrerPolicy="no-referrer"
            />
            {/* Ambient Cyber Neon Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60" />
          </div>

          {/* Ambient Cyber Neon Glow Accents */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-purple-600/25 rounded-full blur-[100px]" />
            <div className="absolute top-[10%] left-[12%] w-[420px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px]" />
            <div className="absolute top-[10%] right-[12%] w-[420px] h-[300px] bg-blue-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-[10%] left-[15%] w-[450px] h-[320px] bg-emerald-500/20 rounded-full blur-[85px]" />
            <div className="absolute bottom-[10%] right-[15%] w-[450px] h-[320px] bg-indigo-500/20 rounded-full blur-[85px]" />
          </div>
        </div>
      )}

      {/* 🤖 THEME 1: AI IN EDUCATION FUTURISTIC CLASSROOM & NEURAL HOLOGRAM MASTERPIECE */}
      {isAIEducation && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          
          {/* 🌌 ULTRA HIGH-DEFINITION AI IN EDUCATION CLASSROOM WALLPAPER (As Requested) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={aiEducationWallpaper}
              alt="AI in Education Classroom Masterpiece"
              className="w-full h-full object-cover object-center transition-transform duration-1000 scale-100"
              referrerPolicy="no-referrer"
            />
            {/* Ambient Cyber Neon Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60" />
          </div>

          {/* Ambient Cyber Neon Glow Accents */}
          <div className="absolute inset-0 pointer-events-none opacity-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-r from-cyan-500/20 via-sky-400/15 to-blue-600/20 rounded-full blur-[100px]" />
            <div className="absolute top-[12%] right-[18%] w-[420px] h-[300px] bg-blue-500/15 rounded-full blur-[80px]" />
            <div className="absolute bottom-[10%] left-[20%] w-[450px] h-[320px] bg-cyan-500/15 rounded-full blur-[85px]" />
          </div>
        </div>
      )}

      {/* 🤖 THEME 2: STARLIGHT ANDROMEDA AI ECOSYSTEM MASTERPIECE */}
      {isAndromeda && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* 🌌 ULTRA HIGH-DEFINITION STARLIGHT ANDROMEDA AI ECOSYSTEM WALLPAPER (As Requested) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={starlightAndromedaWallpaper}
              alt="Starlight Andromeda AI Ecosystem Masterpiece"
              className="w-full h-full object-cover object-center transition-transform duration-1000 scale-100"
              referrerPolicy="no-referrer"
            />
            {/* Ambient Cybernetic Blue Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60" />
          </div>

          {/* Ambient Cyber Circuit Glow Effects */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/25 via-sky-400/20 to-blue-600/25 rounded-full blur-[100px]" />
            <div className="absolute top-[10%] right-[15%] w-[400px] h-[300px] bg-sky-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-[10%] left-[15%] w-[400px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px]" />
          </div>
        </div>
      )}

      {/* 🌆 THEME 3: COSMIC NEBULA SWIRL (CYBERPUNK NEON NIGHT MARKET MASTERPIECE) */}
      {isNebula && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* 🌆 ULTRA HIGH-DEFINITION CYBERPUNK NIGHT MARKET WALLPAPER (As Requested) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={cosmicNebulaSwirlWallpaper}
              alt="Cosmic Nebula Swirl Cyberpunk Night Market Masterpiece"
              className="w-full h-full object-cover object-center transition-transform duration-1000 scale-100"
              referrerPolicy="no-referrer"
            />
            {/* Ambient Neon Magenta & Cyan Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
          </div>

          {/* Ambient Cyber Neon Pulsing Lighting */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute top-[20%] left-[10%] w-[450px] h-[350px] bg-cyan-500/20 rounded-full blur-[90px]" />
            <div className="absolute top-[15%] right-[10%] w-[450px] h-[350px] bg-fuchsia-500/20 rounded-full blur-[90px]" />
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-purple-600/25 rounded-full blur-[100px]" />
          </div>
        </div>
      )}

      {/* 🌌 THEME 4+: MULTI-GALAXY UNIVERSE COMPOSITION */}
      {!isVoid && !isForest && !isOceanMode && !isAurora && !isAIMultipleFields && !isAIEducation && !isAndromeda && !isNebula && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          
          {/* 🌌 ULTRA HIGH-DEFINITION MULTIPLE GALAXY MASTERPIECE WALLPAPER (As Requested) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={multipleGalaxyWallpaper}
              alt="Multiple Galaxy Universe Wallpaper"
              className={`w-full h-full object-cover object-center transition-transform duration-1000 ${
                enableSpiralRotation ? "scale-105" : "scale-100"
              }`}
              referrerPolicy="no-referrer"
            />
            {/* Ambient Cosmic Vignette & Depth Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60" />
          </div>

          {/* 🌌 COSMIC WEB & NEBULAR DUST BACKGROUND ACCENTS */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            {/* Top-Right Amber Nebula Cloud */}
            <div className="absolute top-[2%] right-[8%] w-[500px] h-[400px] bg-gradient-to-br from-amber-600/20 via-orange-950/15 to-transparent rounded-full blur-[90px]" />
            {/* Top-Left Violet Nebula Cloud */}
            <div className="absolute top-[5%] left-[6%] w-[480px] h-[480px] bg-gradient-to-br from-purple-600/25 via-fuchsia-950/20 to-transparent rounded-full blur-[80px]" />
            {/* Center Core Fiery Amber Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/25 via-yellow-400/15 to-purple-600/20 rounded-full blur-[100px]" />
            {/* Bottom-Left Copper-Gold Glow */}
            <div className="absolute bottom-[4%] left-[5%] w-[520px] h-[450px] bg-gradient-to-tr from-amber-700/25 via-orange-600/15 to-transparent rounded-full blur-[85px]" />
            {/* Bottom-Right Electric Blue Nebula */}
            <div className="absolute bottom-[4%] right-[4%] w-[500px] h-[500px] bg-gradient-to-tl from-cyan-600/25 via-blue-600/20 to-indigo-950/25 rounded-full blur-[90px]" />
          </div>

          {/* ✨ BRILLIANT 4-POINT & 8-POINT DIFFRACTION SPIKE STARBURSTS (Matching image) */}
          {[
            { top: "22%", left: "22%", color: "#00f0ff", size: "w-8 h-8 sm:w-12 sm:h-12" },
            { top: "14%", right: "22%", color: "#fef08a", size: "w-8 h-8 sm:w-10 sm:h-10" },
            { top: "42%", left: "16%", color: "#a855f7", size: "w-7 h-7 sm:w-10 sm:h-10" },
            { top: "38%", right: "18%", color: "#ec4899", size: "w-7 h-7 sm:w-10 sm:h-10" },
            { top: "64%", left: "20%", color: "#38bdf8", size: "w-8 h-8 sm:w-12 sm:h-12" },
            { top: "76%", right: "20%", color: "#f59e0b", size: "w-8 h-8 sm:w-11 sm:h-11" },
            { top: "68%", right: "34%", color: "#00f0ff", size: "w-7 h-7 sm:w-10 sm:h-10" },
            { top: "48%", left: "44%", color: "#ffffff", size: "w-8 h-8 sm:w-12 sm:h-12" },
          ].map((flare, i) => (
            <div
              key={i}
              className={`absolute pointer-events-none ${flare.size} -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse`}
              style={{
                top: flare.top,
                left: flare.left,
                right: flare.right,
                animationDuration: `${2.5 + (i % 3)}s`,
              }}
            >
              <svg viewBox="0 0 60 60" className="w-full h-full">
                {/* Horizontal diffraction spike */}
                <line x1="0" y1="30" x2="60" y2="30" stroke={flare.color} strokeWidth="1.8" />
                {/* Vertical diffraction spike */}
                <line x1="30" y1="0" x2="30" y2="60" stroke={flare.color} strokeWidth="1.8" />
                {/* Diagonal secondary spikes */}
                <line x1="12" y1="12" x2="48" y2="48" stroke={flare.color} strokeWidth="0.9" opacity="0.75" />
                <line x1="48" y1="12" x2="12" y2="48" stroke={flare.color} strokeWidth="0.9" opacity="0.75" />
                {/* Center Core Halo */}
                <circle cx="30" cy="30" r="5" fill="#ffffff" filter={`drop-shadow(0 0 6px ${flare.color})`} />
              </svg>
            </div>
          ))}

        </div>
      )}

      {/* Twinkling Starfield Particle Canvas */}
      {enableStarParticles && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* Periodic Shooting Stars / Meteors */}
      {enableShootingStars &&
        shootingStars.map((meteor) => (
          <div
            key={meteor.id}
            className="absolute w-32 h-[1.5px] bg-gradient-to-r from-transparent via-white to-cyan-300 shadow-[0_0_12px_#38bdf8] animate-shooting-star"
            style={{
              top: `${meteor.top}%`,
              left: `${meteor.left}%`,
              transform: `rotate(${meteor.angle}deg)`,
              animationDelay: `${meteor.delay}s`,
            }}
          />
        ))}

      {/* Cosmic Vignette & Color Balance Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent via-[#04010e]/20 to-[#04010e]/60" />
    </div>
  );
};
