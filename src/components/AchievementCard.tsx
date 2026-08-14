import React from "react";
import { AchievementBadge } from "../types";
import {
  CheckCircle2,
  Zap,
  Target,
  Flame,
  Award,
  Trophy,
  Sparkles,
  Crown,
  GraduationCap,
  Lock,
  Star,
  ShieldCheck,
} from "lucide-react";

interface AchievementCardProps {
  badge: AchievementBadge;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
}

const ICON_MAP: Record<string, React.ElementType> = {
  CheckCircle2,
  Zap,
  Target,
  Flame,
  Award,
  Trophy,
  Sparkles,
  Crown,
  GraduationCap,
  Star,
  ShieldCheck,
};

export const AchievementCard: React.FC<AchievementCardProps> = ({
  badge,
  onClick,
  size = "medium",
}) => {
  const IconComponent = ICON_MAP[badge.icon] || Award;

  const getTierBadgeColor = (tier: AchievementBadge["tier"]) => {
    switch (tier) {
      case "Bronze":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300";
      case "Silver":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300";
      case "Gold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-400";
      case "Platinum":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-400";
      case "Diamond":
        return "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300 border-fuchsia-400";
    }
  };

  if (size === "small") {
    return (
      <button
        onClick={onClick}
        type="button"
        className={`relative p-3 rounded-2xl border transition-all duration-300 text-left flex items-center space-x-3 ${
          badge.unlocked
            ? `${badge.bgLight} ${badge.borderAccent} hover:scale-105 shadow-sm`
            : "bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60 grayscale hover:grayscale-0"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${badge.gradient} text-white flex items-center justify-center shrink-0 shadow-md`}
        >
          {badge.unlocked ? (
            <IconComponent className="w-5 h-5" />
          ) : (
            <Lock className="w-4 h-4 text-white/80" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
              {badge.title}
            </h4>
            <span className="text-[10px] font-black text-amber-500">
              +{badge.xpPoints} XP
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            {badge.unlocked ? `Unlocked ${badge.unlockedAt}` : `${badge.progressPercentage}% progress`}
          </p>
        </div>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        badge.unlocked
          ? `${badge.bgLight} ${badge.borderAccent} shadow-md hover:shadow-xl hover:-translate-y-1`
          : "bg-slate-50/80 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80 opacity-75 hover:opacity-100"
      }`}
    >
      {/* Background Metallic Blur */}
      {badge.unlocked && (
        <div
          className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${badge.gradient} opacity-20 blur-2xl`}
        />
      )}

      <div>
        {/* Top Header: Tier & XP */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getTierBadgeColor(
              badge.tier
            )}`}
          >
            {badge.tier}
          </span>

          <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-black border border-amber-300 dark:border-amber-800 flex items-center space-x-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>+{badge.xpPoints} XP</span>
          </span>
        </div>

        {/* Center Badge Icon & Title */}
        <div className="flex items-start space-x-3.5 relative z-10 mb-3">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${badge.gradient} text-white flex items-center justify-center shrink-0 shadow-lg ${
              badge.unlocked ? "ring-2 ring-white/50" : "grayscale opacity-60"
            }`}
          >
            {badge.unlocked ? (
              <IconComponent className="w-7 h-7 animate-pulse-subtle" />
            ) : (
              <Lock className="w-6 h-6 text-white/90" />
            )}
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                {badge.title}
              </h3>
              {badge.unlocked && (
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
              {badge.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Progress or Unlocked Timestamp */}
      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 relative z-10 space-y-1.5 mt-2">
        {badge.unlocked ? (
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Unlocked & Earned</span>
            </span>
            <span className="font-bold text-slate-400">
              {badge.unlockedAt || "Earned"}
            </span>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500">
                Progress: {badge.currentValue} / {badge.targetValue}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                {badge.progressPercentage}%
              </span>
            </div>

            <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${badge.gradient} transition-all duration-300`}
                style={{ width: `${badge.progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
