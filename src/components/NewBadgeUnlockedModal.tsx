import React, { useEffect } from "react";
import { AchievementBadge } from "../types";
import { AchievementCard } from "./AchievementCard";
import { Award, Sparkles, X, Share2, Star, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface NewBadgeUnlockedModalProps {
  badge: AchievementBadge | null;
  onClose: () => void;
}

export const NewBadgeUnlockedModal: React.FC<NewBadgeUnlockedModalProps> = ({
  badge,
  onClose,
}) => {
  useEffect(() => {
    if (badge) {
      // Fire festive fireworks confetti!
      const count = 200;
      const defaults = { origin: { y: 0.6 } };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-amber-300 dark:border-amber-700/60 shadow-2xl p-6 overflow-hidden text-center space-y-5">
        {/* Glowing Background Blob */}
        <div
          className={`absolute -top-24 -left-24 w-64 h-64 rounded-full bg-gradient-to-br ${badge.gradient} opacity-20 blur-3xl`}
        />
        <div
          className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${badge.gradient} opacity-20 blur-3xl`}
        />

        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="space-y-2 pt-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
            <span>Achievement Unlocked!</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Congratulations! 🎉
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            You reached a new academic progress milestone and earned a digital badge!
          </p>
        </div>

        {/* Achievement Card Preview */}
        <div className="py-2">
          <AchievementCard badge={badge} size="medium" />
        </div>

        {/* Rewards Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
            <div className="text-left">
              <span className="font-extrabold text-slate-900 dark:text-white block">
                +{badge.xpPoints} Academic XP
              </span>
              <span className="text-[10px] text-slate-500">Added to your student profile</span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-[10px] border border-emerald-300 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Badge</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-aura-600 text-white font-extrabold text-xs shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
          >
            Claim Badge & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
