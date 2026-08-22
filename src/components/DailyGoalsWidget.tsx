import React, { useState, useEffect, useMemo } from "react";
import { DailyGoal } from "../types";
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Sparkles,
  Flame,
  CheckCheck,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Pencil,
  Check,
  X,
  Zap,
  Bookmark
} from "lucide-react";
import { triggerConfetti } from "../utils/confetti";

const STORAGE_KEY = "aura_daily_goals_v1";

const DEFAULT_INITIAL_GOALS: DailyGoal[] = [
  {
    id: "goal-1",
    title: "Review Quantum Mechanics Lecture 4 notes & equations",
    category: "Revision",
    targetMinutes: 45,
    completedMinutes: 45,
    isCompleted: true,
    createdAt: new Date().toISOString(),
    priority: "High",
  },
  {
    id: "goal-2",
    title: "Solve 10 problem sets for Multivariable Calculus",
    category: "Practice",
    targetMinutes: 60,
    completedMinutes: 30,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    priority: "High",
  },
  {
    id: "goal-3",
    title: "Read Chapter 3 on DNA Replication in Molecular Biology",
    category: "Reading",
    targetMinutes: 30,
    completedMinutes: 0,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    priority: "Medium",
  },
  {
    id: "goal-4",
    title: "Complete 1 focused 25-min Pomodoro session for CS Algorithm design",
    category: "Focus",
    targetMinutes: 25,
    completedMinutes: 0,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    priority: "Normal",
  },
];

const PRESET_SUGGESTIONS = [
  { title: "Review latest lecture notes", category: "Revision" as const, minutes: 30 },
  { title: "Solve 5 practice problems", category: "Practice" as const, minutes: 45 },
  { title: "Read 1 textbook chapter", category: "Reading" as const, minutes: 35 },
  { title: "Complete 25m Focus session", category: "Focus" as const, minutes: 25 },
  { title: "Draft assignment submission", category: "Homework" as const, minutes: 50 },
];

const CATEGORY_COLORS: Record<DailyGoal["category"], { bg: string; text: string; border: string }> = {
  Study: { bg: "bg-indigo-500/10 dark:bg-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/30" },
  Reading: { bg: "bg-emerald-500/10 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  Practice: { bg: "bg-amber-500/10 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30" },
  Revision: { bg: "bg-purple-500/10 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
  Homework: { bg: "bg-rose-500/10 dark:bg-rose-500/20", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/30" },
  Focus: { bg: "bg-cyan-500/10 dark:bg-cyan-500/20", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/30" },
};

interface DailyGoalsWidgetProps {
  onOpenFocusTimer?: () => void;
}

export const DailyGoalsWidget: React.FC<DailyGoalsWidgetProps> = ({ onOpenFocusTimer }) => {
  const [goals, setGoals] = useState<DailyGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_INITIAL_GOALS;
  });

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<DailyGoal["category"]>("Study");
  const [newMinutes, setNewMinutes] = useState<number>(30);
  const [newPriority, setNewPriority] = useState<DailyGoal["priority"]>("Medium");

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMinutes, setEditMinutes] = useState(30);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch {
      // ignore
    }
  }, [goals]);

  // Statistics calculation
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.isCompleted).length;
  const progressPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  
  const totalTargetMinutes = useMemo(() => {
    return goals.reduce((acc, g) => acc + (g.targetMinutes || 0), 0);
  }, [goals]);

  const totalCompletedMinutes = useMemo(() => {
    return goals.reduce((acc, g) => {
      if (g.isCompleted) return acc + (g.targetMinutes || 0);
      return acc + (g.completedMinutes || 0);
    }, 0);
  }, [goals]);

  // Toggle goal completion with confetti
  const handleToggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === id) {
          const nextCompleted = !goal.isCompleted;
          if (nextCompleted) {
            triggerConfetti({
              particleCount: 35,
              spread: 50,
              origin: { y: 0.7 },
            });
          }
          return {
            ...goal,
            isCompleted: nextCompleted,
            completedMinutes: nextCompleted ? goal.targetMinutes || 0 : 0,
          };
        }
        return goal;
      })
    );
  };

  // Add a new goal
  const handleAddGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: DailyGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetMinutes: Number(newMinutes) || 30,
      completedMinutes: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      priority: newPriority,
    };

    setGoals((prev) => [newGoal, ...prev]);
    setNewTitle("");
    setIsAddingGoal(false);
  };

  // Quick add from preset
  const handleQuickAdd = (preset: typeof PRESET_SUGGESTIONS[0]) => {
    const newGoal: DailyGoal = {
      id: `goal-${Date.now()}`,
      title: preset.title,
      category: preset.category,
      targetMinutes: preset.minutes,
      completedMinutes: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      priority: "Medium",
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Edit goal
  const handleStartEdit = (goal: DailyGoal) => {
    setEditingId(goal.id);
    setEditTitle(goal.title);
    setEditMinutes(goal.targetMinutes || 30);
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, title: editTitle.trim(), targetMinutes: editMinutes } : g))
    );
    setEditingId(null);
  };

  // Clear completed goals
  const handleClearCompleted = () => {
    setGoals((prev) => prev.filter((g) => !g.isCompleted));
  };

  // Reset to default sample goals
  const handleResetDefaults = () => {
    setGoals(DEFAULT_INITIAL_GOALS);
  };

  // Filtered goals
  const filteredGoals = useMemo(() => {
    if (filter === "active") return goals.filter((g) => !g.isCompleted);
    if (filter === "completed") return goals.filter((g) => g.isCompleted);
    return goals;
  }, [goals, filter]);

  // Motivational message based on progress
  const getMotivationalCue = () => {
    if (totalGoals === 0) return "Add your first study objective for today!";
    if (progressPercentage === 100) return "🔥 Spectacular! All daily study objectives completed!";
    if (progressPercentage >= 75) return "⚡ Almost there! 1 more push to complete today's goals!";
    if (progressPercentage >= 50) return "🚀 Halfway done! Great momentum, keep studying!";
    if (progressPercentage > 0) return "💪 Strong start! Keep ticking off your objectives!";
    return "🎯 Ready to conquer today? Select or add study objectives below!";
  };

  return (
    <div
      id="daily-goals-widget"
      className="p-5 sm:p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-800/80 shadow-md relative overflow-hidden space-y-5 transition-all duration-300"
    >
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Target className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Daily Study Objectives
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {completedGoals}/{totalGoals} Done
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Short-term target tracking • {totalCompletedMinutes}m / {totalTargetMinutes}m study time
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsAddingGoal(!isAddingGoal)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 active:scale-95"
            title="Add new study goal"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingGoal ? "Cancel" : "Add Goal"}</span>
          </button>

          {completedGoals > 0 && (
            <button
              onClick={handleClearCompleted}
              className="px-2.5 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              title="Clear completed objectives"
            >
              Clear Done
            </button>
          )}

          <button
            onClick={handleResetDefaults}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset to sample goals"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress-Tracking Bar with Live Percentage & Motivational Cue */}
      <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2.5 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
            {progressPercentage === 100 ? (
              <Flame className="w-4 h-4 text-amber-500 inline fill-amber-500 animate-bounce" />
            ) : (
              <Zap className="w-4 h-4 text-indigo-500 inline" />
            )}
            <span>{getMotivationalCue()}</span>
          </span>
          <span className="font-black text-indigo-600 dark:text-indigo-400 tabular-nums text-sm">
            {progressPercentage}%
          </span>
        </div>

        {/* Enhanced Multi-Tier Progress Track */}
        <div className="w-full bg-slate-200 dark:bg-slate-700/70 rounded-full h-3 p-0.5 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              progressPercentage === 100
                ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-md shadow-emerald-500/40"
                : progressPercentage >= 50
                ? "bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 shadow-md shadow-indigo-500/30"
                : "bg-gradient-to-r from-indigo-500 to-indigo-600"
            }`}
            style={{ width: `${Math.max(progressPercentage, totalGoals > 0 ? 3 : 0)}%` }}
          />
        </div>

        {/* Bottom milestones ticker */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-0.5">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span className={progressPercentage === 100 ? "text-emerald-500 font-extrabold" : ""}>100% 🎯</span>
        </div>
      </div>

      {/* Add New Goal Inline Form */}
      {isAddingGoal && (
        <form
          onSubmit={handleAddGoal}
          className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 relative z-10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Define New Study Objective</span>
            </span>
            <button
              type="button"
              onClick={() => setIsAddingGoal(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Read Physics Chapter 5, Practice 10 Calculus integrals..."
            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as DailyGoal["category"])}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="Study">Study</option>
                <option value="Reading">Reading</option>
                <option value="Practice">Practice</option>
                <option value="Revision">Revision</option>
                <option value="Homework">Homework</option>
                <option value="Focus">Focus</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Target Time
              </label>
              <select
                value={newMinutes}
                onChange={(e) => setNewMinutes(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value={15}>15 Minutes</option>
                <option value={25}>25 Min (Pomodoro)</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes (1 hr)</option>
                <option value={90}>90 Minutes (1.5 hr)</option>
                <option value={120}>120 Minutes (2 hr)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as DailyGoal["priority"])}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="High">High Priority 🔥</option>
                <option value="Medium">Medium Priority ⚡</option>
                <option value="Normal">Normal Priority 📖</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingGoal(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Save Objective
            </button>
          </div>
        </form>
      )}

      {/* Quick Preset Badges */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar relative z-10">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center space-x-1">
          <Bookmark className="w-3 h-3 text-indigo-500 inline" />
          <span>Quick Add:</span>
        </span>
        {PRESET_SUGGESTIONS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickAdd(preset)}
            className="px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold shrink-0 transition-all flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>{preset.title}</span>
            <span className="text-[10px] text-slate-400">({preset.minutes}m)</span>
          </button>
        ))}
      </div>

      {/* Filters and List Controls */}
      <div className="flex items-center justify-between pt-1 relative z-10 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            All ({goals.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === "active"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Active ({goals.length - completedGoals})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === "completed"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Completed ({completedGoals})
          </button>
        </div>

        {onOpenFocusTimer && (
          <button
            onClick={onOpenFocusTimer}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Launch Pomodoro Timer &rarr;</span>
          </button>
        )}
      </div>

      {/* Objectives Checklist List */}
      <div className="space-y-2.5 relative z-10">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-8 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            <CheckCheck className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="font-bold text-slate-600 dark:text-slate-300">
              {filter === "completed"
                ? "No completed objectives yet today."
                : filter === "active"
                ? "All objectives completed! Awesome job."
                : "No study objectives for today."}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click "+ Add Goal" above or select a preset to start tracking your daily progress.
            </p>
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const catStyle = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.Study;
            const isEditing = editingId === goal.id;

            return (
              <div
                key={goal.id}
                className={`group p-3 sm:p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  goal.isCompleted
                    ? "bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/40 dark:border-slate-800/60 opacity-65"
                    : "bg-white/80 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50 hover:shadow-xs"
                }`}
              >
                {/* Left: Custom Checkbox and Info */}
                <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleGoal(goal.id)}
                    className="mt-0.5 sm:mt-0 text-indigo-600 dark:text-indigo-400 shrink-0 transition-transform active:scale-90"
                    title={goal.isCompleted ? "Mark as active" : "Mark as completed"}
                  >
                    {goal.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-900 border border-indigo-400 text-slate-900 dark:text-white flex-1"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(goal.id)}
                          className="p-1 rounded-md bg-emerald-600 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 rounded-md bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p
                          onClick={() => handleToggleGoal(goal.id)}
                          className={`text-xs sm:text-sm font-bold cursor-pointer transition-colors line-clamp-2 ${
                            goal.isCompleted
                              ? "line-through text-slate-400 dark:text-slate-500"
                              : "text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                          }`}
                        >
                          {goal.title}
                        </p>

                        <div className="flex items-center flex-wrap gap-1.5 text-[10px]">
                          {/* Category Tag */}
                          <span
                            className={`px-2 py-0.5 rounded-md font-extrabold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                          >
                            {goal.category}
                          </span>

                          {/* Time tag */}
                          {goal.targetMinutes && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold flex items-center space-x-1">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{goal.targetMinutes}m</span>
                            </span>
                          )}

                          {/* Priority badge */}
                          {goal.priority === "High" && (
                            <span className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 font-extrabold">
                              High
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Quick actions */}
                {!isEditing && (
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => handleStartEdit(goal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit objective"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Delete objective"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
