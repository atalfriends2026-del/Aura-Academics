import { ThemeId, ThemeOption, UserThemeSettings } from "../types";

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "multiple-galaxy",
    name: "Multi Galaxy",
    category: "galaxy",
    tagline: "Deep Cosmic Multi-Spiral Universe Vortex",
    description: "Extravagant cosmic panorama featuring a radiant swirling galactic core surrounded by brilliant spiral galaxies in violet, magenta, electric blue, and golden vortex streams.",
    primaryColor: "#f59e0b",
    secondaryColor: "#8b5cf6",
    accentGlow: "rgba(245, 158, 11, 0.55)",
    previewGradient: "from-[#04010e] via-[#240847] via-[#091845] to-[#1a0528]",
    badgeLabel: "FEATURED • MULTI GALAXY",
    hasParticles: true,
    hasSpirals: true,
    paletteSample: [
      { name: "Solar Spiral Gold", hex: "#f59e0b", role: "primary" },
      { name: "Nebula Violet", hex: "#8b5cf6", role: "secondary" },
      { name: "Supernova Pink", hex: "#ec4899", role: "accent" },
      { name: "Stellar Shimmer", hex: "#fbbf24", role: "glow" },
      { name: "Cosmic Deep Space", hex: "#04010e", role: "surface" },
    ],
  },
  {
    id: "ai-education",
    name: "AI in Education",
    category: "ai-theme",
    tagline: "Futuristic Cyber Classroom & Neural AI Holograms",
    description: "Immersive futuristic classroom powered by a glowing holographic AI brain, floating science artifacts (DNA helix, microscope, open textbook, quantum atom), and robotic teaching tutors.",
    primaryColor: "#00f0ff",
    secondaryColor: "#a855f7",
    accentGlow: "rgba(0, 240, 255, 0.5)",
    previewGradient: "from-[#020112] via-[#05113d] via-[#1c0840] to-[#04081c]",
    badgeLabel: "FEATURED • AI IN EDUCATION",
    hasParticles: true,
    hasSpirals: true,
    paletteSample: [
      { name: "Cyber Cyan", hex: "#00f0ff", role: "primary" },
      { name: "Holo Lavender", hex: "#a855f7", role: "secondary" },
      { name: "Digital Mint", hex: "#10b981", role: "accent" },
      { name: "Neon Glow", hex: "#67e8f9", role: "glow" },
      { name: "Cyber Lab Dark", hex: "#020112", role: "surface" },
    ],
  },
  {
    id: "ai-multiple-fields",
    name: "AI in Multiple Fields",
    category: "ai-theme",
    tagline: "Futuristic AI Across Healthcare, Education, Finance & All Fields",
    description: "Comprehensive AI network centered around a glowing holographic AI brain neural core connected across 10 vital sectors: Healthcare, Education, Finance, Transportation, Agriculture, Manufacturing, Space, and Environment.",
    primaryColor: "#00f0ff",
    secondaryColor: "#3b82f6",
    accentGlow: "rgba(0, 240, 255, 0.6)",
    previewGradient: "from-[#020517] via-[#041a40] via-[#10032b] to-[#010817]",
    badgeLabel: "FEATURED • AI IN MULTIPLE FIELDS",
    hasParticles: true,
    hasSpirals: true,
    paletteSample: [
      { name: "Holo Neon Cyan", hex: "#00f0ff", role: "primary" },
      { name: "Neural Blue", hex: "#3b82f6", role: "secondary" },
      { name: "Quantum Purple", hex: "#a855f7", role: "accent" },
      { name: "Data Stream", hex: "#38bdf8", role: "glow" },
      { name: "Deep Cyber Void", hex: "#020517", role: "surface" },
    ],
  },
  {
    id: "aurora",
    name: "Aurora",
    category: "galaxy",
    tagline: "Ethereal Emerald Northern Lights over Arctic Fjord",
    description: "Breathtaking Arctic panorama with emerald green, turquoise, and violet Aurora Borealis ribbons arching over snow-capped alpine peaks, serene reflective fjords, and a cozy glowing winter cabin.",
    primaryColor: "#10b981",
    secondaryColor: "#06b6d4",
    accentGlow: "rgba(16, 185, 129, 0.6)",
    previewGradient: "from-[#011414] via-[#042e2b] via-[#021829] to-[#010814]",
    badgeLabel: "FEATURED • AURORA",
    hasParticles: true,
    hasSpirals: true,
    paletteSample: [
      { name: "Emerald Aurora", hex: "#10b981", role: "primary" },
      { name: "Arctic Cyan", hex: "#06b6d4", role: "secondary" },
      { name: "Polar Violet", hex: "#8b5cf6", role: "accent" },
      { name: "Borealis Shimmer", hex: "#34d399", role: "glow" },
      { name: "Fjord Darkness", hex: "#011414", role: "surface" },
    ],
  },
  {
    id: "forest",
    name: "Forest Mode",
    category: "galaxy",
    tagline: "Enchanted Ancient Mossy Forest & Twilight Sunset",
    description: "Serene ancient woodland featuring a winding mossy footpath, majestic stag deer beside an ancient oak, gentle crystal stream with pebbles, and golden sunset twilight sky glowing through lush green foliage.",
    primaryColor: "#22c55e",
    secondaryColor: "#eab308",
    accentGlow: "rgba(34, 197, 94, 0.6)",
    previewGradient: "from-[#0a1a0f] via-[#122818] via-[#1e3a24] to-[#0d1f13]",
    badgeLabel: "FEATURED • FOREST MODE",
    hasParticles: true,
    hasSpirals: true,
    paletteSample: [
      { name: "Moss Emerald", hex: "#22c55e", role: "primary" },
      { name: "Sunset Gold", hex: "#eab308", role: "secondary" },
      { name: "Twilight Lavender", hex: "#c084fc", role: "accent" },
      { name: "Canopy Glow", hex: "#4ade80", role: "glow" },
      { name: "Ancient Bark Surface", hex: "#0a1a0f", role: "surface" },
    ],
  },
  {
    id: "ocean-mode",
    name: "Ocean Mode",
    category: "galaxy",
    tagline: "Tropical Coral Reef Paradise & Golden Sunset",
    description: "Magnificent underwater ocean paradise featuring sunbeams illuminating crystal turquoise waters, graceful sea turtles, schooling yellow snappers, reef sharks, and kaleidoscope coral gardens.",
    primaryColor: "#06b6d4",
    secondaryColor: "#3b82f6",
    accentGlow: "rgba(6, 182, 212, 0.6)",
    previewGradient: "from-[#011425] via-[#02334f] via-[#046182] to-[#011d33]",
    badgeLabel: "FEATURED • OCEAN MODE",
    hasParticles: true,
    hasSpirals: true,
    paletteSample: [
      { name: "Turquoise Reef", hex: "#06b6d4", role: "primary" },
      { name: "Deep Coral Blue", hex: "#3b82f6", role: "secondary" },
      { name: "Sunset Sunbeam", hex: "#f59e0b", role: "accent" },
      { name: "Biolum Glow", hex: "#22d3ee", role: "glow" },
      { name: "Abyssal Navy", hex: "#011425", role: "surface" },
    ],
  },
  {
    id: "cyberpunk-city",
    name: "Cyberpunk Night Market",
    category: "ai-theme",
    tagline: "Atmospheric Rainy Cyberpunk Neon City & Night Market",
    description: "Atmospheric rainy cyberpunk night market street illuminated by vibrant neon signs (Cybernetics, Ramen-Ya, Datastream, Synth Drinks), holographic signs, flying hover vehicles, and neon puddles.",
    primaryColor: "#00f0ff",
    secondaryColor: "#ec4899",
    accentGlow: "rgba(0, 240, 255, 0.55)",
    previewGradient: "from-[#080214] via-[#1f0938] via-[#051a2e] to-[#04010a]",
    badgeLabel: "FEATURED • CYBERPUNK NIGHT MARKET",
    hasParticles: true,
    hasSpirals: true,
    paletteSample: [
      { name: "Electric Cyan", hex: "#00f0ff", role: "primary" },
      { name: "Synthwave Pink", hex: "#ec4899", role: "secondary" },
      { name: "Neon Violet", hex: "#9333ea", role: "accent" },
      { name: "Rain Puddle Glint", hex: "#22d3ee", role: "glow" },
      { name: "Midnight Alley", hex: "#080214", role: "surface" },
    ],
  },
  {
    id: "light",
    name: "Clean Light (White & Grey)",
    category: "galaxy",
    tagline: "Minimalist White & Slate Grey Daylight Studio",
    description: "Pristine white and pearl slate grey daylight atmosphere featuring clean frosted architectural facets, soft silver grey accents, high-contrast dark slate typography, and daylight focus.",
    primaryColor: "#4f46e5",
    secondaryColor: "#64748b",
    accentGlow: "rgba(79, 70, 229, 0.15)",
    previewGradient: "from-[#f8fafc] via-[#e2e8f0] to-[#ffffff]",
    badgeLabel: "FEATURED • CLEAN LIGHT",
    hasParticles: false,
    hasSpirals: false,
    paletteSample: [
      { name: "Pure White", hex: "#ffffff", role: "surface" },
      { name: "Slate Grey", hex: "#64748b", role: "secondary" },
      { name: "Pearl Frost", hex: "#e2e8f0", role: "glow" },
      { name: "Academic Indigo", hex: "#4f46e5", role: "primary" },
      { name: "Deep Charcoal", hex: "#0f172a", role: "accent" },
    ],
  },
  {
    id: "dark",
    name: "Midnight Slate",
    category: "classic",
    tagline: "Classic Clean Dark Mode",
    description: "Sleek slate gray dark theme designed for night-time studying without background animations.",
    primaryColor: "#6366f1",
    secondaryColor: "#94a3b8",
    accentGlow: "rgba(99, 102, 241, 0.2)",
    previewGradient: "from-slate-950 via-slate-900 to-slate-950",
    badgeLabel: "Standard Dark",
    hasParticles: false,
    hasSpirals: false,
    paletteSample: [
      { name: "Slate Indigo", hex: "#6366f1", role: "primary" },
      { name: "Cool Slate", hex: "#94a3b8", role: "secondary" },
      { name: "Deep Iris", hex: "#4f46e5", role: "accent" },
      { name: "Border Highlight", hex: "#334155", role: "glow" },
      { name: "Midnight Charcoal", hex: "#0f172a", role: "surface" },
    ],
  },
];

const THEME_STORAGE_KEY = "aura_academics_theme_settings_v7";

export const DEFAULT_THEME_SETTINGS: UserThemeSettings = {
  activeThemeId: "multiple-galaxy", // Default to the breathtaking Multi Galaxy Universe Masterpiece!
  enableStarParticles: true,
  enableCosmicGlow: true,
  enableSpiralRotation: true,
  enableShootingStars: true,
  enableAIHolograms: true,
  enableCyberHUD: true,
  galaxyWallpaperIntensity: 95,
  cardGlassmorphism: "crystal",
  accentPalette: "emerald-aurora",
  fontSizeScale: "normal",
  soundEffects: false,
};

export const loadThemeSettings = (): UserThemeSettings => {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return DEFAULT_THEME_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_THEME_SETTINGS, ...parsed };
  } catch (e) {
    console.warn("Could not load theme settings, using defaults", e);
    return DEFAULT_THEME_SETTINGS;
  }
};

export const saveThemeSettings = (settings: UserThemeSettings): UserThemeSettings => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn("Could not save theme settings", e);
  }
  return settings;
};

export const isGalaxyTheme = (themeId: ThemeId): boolean => {
  return [
    "multiple-galaxy",
    "ai-education",
    "ai-multiple-fields",
    "aurora",
    "forest",
    "ocean-mode",
    "cyberpunk-city",
    "cosmic-nebula",
    "starlight-andromeda",
    "supernova-gold",
    "deep-void",
  ].includes(themeId);
};
