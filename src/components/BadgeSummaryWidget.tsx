import React from "react";
import { AchievementBadge } from "../types";
import { AchievementCard } from "./AchievementCard";
import { Award, Trophy, Sparkles, ChevronRight, Star } from "lucide-react";

interface BadgeSummaryWidgetProps {
  badges: AchievementBadge[];
  onOpenBadgeGallery: () => void;
}

export const BadgeSummaryWidget: React.FC<BadgeSummaryWidgetProps> = ({
  badges,
  onOpenBadgeGallery,
}) => {
  const unlockedBadges = badges.filter((b) => b.unlocked);
  const totalCount = badges.length;
  const totalXp = unlockedBadges.reduce((sum, b) => sum + b.xpPoints, 0);

  // Show up to 3 recent unlocked or high progress badges
  const previewBadges = badges
    .sort((a, b) => (b.unlocked ? 1 : 0) - (a.unlocked ? 1 : 0))
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 dark:from-amber-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-amber-200 dark:border-amber-800/60 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-white flex items-center justify-center font-black shadow-md shrink-0">
            <Trophy className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Academic Achievements & Badges
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-extrabold text-[11px] border border-amber-300 dark:border-amber-700">
                {unlockedBadges.length}/{totalCount} Unlocked
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Earn digital milestone badges as you complete course modules and raise your progress!
            </p>
          </div>
        </div>

        {/* View All Badges Trigger Button */}
        <button
          onClick={onOpenBadgeGallery}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-extrabold text-xs hover:bg-amber-50 dark:hover:bg-slate-800 border border-amber-300 dark:border-amber-700/80 shadow-sm transition-all flex items-center space-x-1.5 shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>View Badge Showcase ({totalXp} XP)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mini Preview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {previewBadges.map((badge) => (
          <AchievementCard
            key={badge.id}
            badge={badge}
            size="small"
            onClick={onOpenBadgeGallery}
          />
        ))}
      </div>
    </div>
  );
};
