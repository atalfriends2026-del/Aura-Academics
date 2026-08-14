import React, { useState } from "react";
import { AchievementBadge } from "../types";
import { AchievementCard } from "./AchievementCard";
import {
  Award,
  Trophy,
  Sparkles,
  X,
  Filter,
  Star,
  CheckCircle2,
  Lock,
  Crown,
  Share2,
} from "lucide-react";

interface BadgeGalleryModalProps {
  badges: AchievementBadge[];
  onClose: () => void;
}

export const BadgeGalleryModal: React.FC<BadgeGalleryModalProps> = ({
  badges,
  onClose,
}) => {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;
  const totalXpEarned = badges
    .filter((b) => b.unlocked)
    .reduce((sum, b) => sum + b.xpPoints, 0);

  const categories = ["All", "Milestone", "Course Completion", "Module Streak", "Mastery"];

  const filteredBadges = badges.filter((b) => {
    if (filter === "unlocked" && !b.unlocked) return false;
    if (filter === "locked" && b.unlocked) return false;
    if (selectedCategory !== "All" && b.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-orange-500 text-white flex items-center justify-center font-black shadow-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Academic Achievement Badges
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-black border border-amber-300 dark:border-amber-700">
                  {unlockedCount}/{totalCount} Unlocked
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Digital achievements awarded as you complete modules and reach course milestones.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border-b border-slate-200/60 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Total XP Earned
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {totalXpEarned.toLocaleString()} XP
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Badges Unlocked
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {unlockedCount} of {totalCount} ({Math.round((unlockedCount / totalCount) * 100)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Highest Badge Tier
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {badges.some((b) => b.unlocked && b.tier === "Diamond")
                  ? "Diamond"
                  : badges.some((b) => b.unlocked && b.tier === "Gold")
                  ? "Gold"
                  : "Silver"}
              </span>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === "all"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All ({badges.length})
            </button>
            <button
              onClick={() => setFilter("unlocked")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === "unlocked"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter("locked")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === "locked"
                  ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Locked ({totalCount - unlockedCount})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex items-center space-x-1 overflow-x-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Badge Grid Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {filteredBadges.length === 0 ? (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-xs italic">
              No badges match the selected status or category filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBadges.map((badge) => (
                <AchievementCard key={badge.id} badge={badge} size="medium" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
