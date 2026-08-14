import { AchievementBadge, Course } from "../types";

export const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: "badge-first-step",
    title: "First Steps",
    description: "Mark your very first course learning module as completed.",
    category: "Milestone",
    tier: "Bronze",
    icon: "CheckCircle2",
    unlocked: true,
    unlockedAt: "Aug 10, 2026",
    currentValue: 1,
    targetValue: 1,
    progressPercentage: 100,
    gradient: "from-amber-600 via-orange-500 to-yellow-600",
    borderAccent: "border-amber-300 dark:border-amber-800",
    bgLight: "bg-amber-50 dark:bg-amber-950/40",
    textColor: "text-amber-600 dark:text-amber-400",
    xpPoints: 50,
  },
  {
    id: "badge-module-marathon",
    title: "Module Marathoner",
    description: "Complete 5 course modules across your enrolled classes.",
    category: "Module Streak",
    tier: "Bronze",
    icon: "Zap",
    unlocked: true,
    unlockedAt: "Aug 11, 2026",
    currentValue: 5,
    targetValue: 5,
    progressPercentage: 100,
    gradient: "from-blue-600 via-indigo-500 to-sky-600",
    borderAccent: "border-blue-300 dark:border-blue-800",
    bgLight: "bg-blue-50 dark:bg-blue-950/40",
    textColor: "text-blue-600 dark:text-blue-400",
    xpPoints: 150,
  },
  {
    id: "badge-quarter-mark",
    title: "Quarter Mark",
    description: "Achieve an overall average course progress of at least 25%.",
    category: "Milestone",
    tier: "Bronze",
    icon: "Target",
    unlocked: true,
    unlockedAt: "Aug 11, 2026",
    currentValue: 75,
    targetValue: 25,
    progressPercentage: 100,
    gradient: "from-emerald-600 via-teal-500 to-green-600",
    borderAccent: "border-emerald-300 dark:border-emerald-800",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
    textColor: "text-emerald-600 dark:text-emerald-400",
    xpPoints: 100,
  },
  {
    id: "badge-halfway-hero",
    title: "Halfway Hero",
    description: "Reach 50% overall average progress across all your courses.",
    category: "Milestone",
    tier: "Silver",
    icon: "Flame",
    unlocked: true,
    unlockedAt: "Aug 11, 2026",
    currentValue: 75,
    targetValue: 50,
    progressPercentage: 100,
    gradient: "from-purple-600 via-indigo-600 to-violet-600",
    borderAccent: "border-purple-300 dark:border-purple-800",
    bgLight: "bg-purple-50 dark:bg-purple-950/40",
    textColor: "text-purple-600 dark:text-purple-400",
    xpPoints: 200,
  },
  {
    id: "badge-three-quarter",
    title: "Three-Quarter Scholar",
    description: "Reach 75% average course completion across all subjects.",
    category: "Milestone",
    tier: "Gold",
    icon: "Award",
    unlocked: true,
    unlockedAt: "Aug 11, 2026",
    currentValue: 75,
    targetValue: 75,
    progressPercentage: 100,
    gradient: "from-amber-500 via-yellow-500 to-amber-600",
    borderAccent: "border-amber-400 dark:border-amber-700",
    bgLight: "bg-amber-50 dark:bg-amber-950/40",
    textColor: "text-amber-600 dark:text-amber-400",
    xpPoints: 350,
  },
  {
    id: "badge-course-master",
    title: "Course Completer",
    description: "Complete 100% of all modules in at least one full course.",
    category: "Course Completion",
    tier: "Gold",
    icon: "Trophy",
    unlocked: false,
    currentValue: 0,
    targetValue: 1,
    progressPercentage: 0,
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
    borderAccent: "border-yellow-400 dark:border-yellow-700",
    bgLight: "bg-yellow-50 dark:bg-yellow-950/40",
    textColor: "text-yellow-600 dark:text-yellow-400",
    xpPoints: 500,
  },
  {
    id: "badge-decathlon",
    title: "Decathlon Scholar",
    description: "Complete 10 course modules across your subjects.",
    category: "Module Streak",
    tier: "Silver",
    icon: "Sparkles",
    unlocked: true,
    unlockedAt: "Aug 11, 2026",
    currentValue: 10,
    targetValue: 10,
    progressPercentage: 100,
    gradient: "from-cyan-500 via-blue-600 to-indigo-600",
    borderAccent: "border-cyan-300 dark:border-cyan-800",
    bgLight: "bg-cyan-50 dark:bg-cyan-950/40",
    textColor: "text-cyan-600 dark:text-cyan-400",
    xpPoints: 300,
  },
  {
    id: "badge-high-flyer",
    title: "High Flyer",
    description: "Maintain an overall average course progress of 80% or higher.",
    category: "Mastery",
    tier: "Gold",
    icon: "Crown",
    unlocked: false,
    currentValue: 75,
    targetValue: 80,
    progressPercentage: 93,
    gradient: "from-rose-500 via-pink-600 to-purple-600",
    borderAccent: "border-pink-300 dark:border-pink-800",
    bgLight: "bg-pink-50 dark:bg-pink-950/40",
    textColor: "text-pink-600 dark:text-pink-400",
    xpPoints: 400,
  },
  {
    id: "badge-consistent-learner",
    title: "Consistent Learner",
    description: "Complete at least one module in 3 different courses.",
    category: "Mastery",
    tier: "Silver",
    icon: "GraduationCap",
    unlocked: true,
    unlockedAt: "Aug 11, 2026",
    currentValue: 4,
    targetValue: 3,
    progressPercentage: 100,
    gradient: "from-emerald-500 via-teal-600 to-indigo-600",
    borderAccent: "border-emerald-300 dark:border-emerald-800",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
    textColor: "text-emerald-600 dark:text-emerald-400",
    xpPoints: 250,
  },
  {
    id: "badge-multi-master",
    title: "Multi-Course Titan",
    description: "Achieve 100% completion in 2 or more full courses.",
    category: "Course Completion",
    tier: "Platinum",
    icon: "Award",
    unlocked: false,
    currentValue: 0,
    targetValue: 2,
    progressPercentage: 0,
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    borderAccent: "border-indigo-400 dark:border-indigo-700",
    bgLight: "bg-indigo-50 dark:bg-indigo-950/40",
    textColor: "text-indigo-600 dark:text-indigo-400",
    xpPoints: 800,
  },
  {
    id: "badge-grandmaster",
    title: "Academic Grandmaster",
    description: "Achieve 100% completion across all enrolled courses!",
    category: "Mastery",
    tier: "Diamond",
    icon: "Crown",
    unlocked: false,
    currentValue: 75,
    targetValue: 100,
    progressPercentage: 75,
    gradient: "from-fuchsia-600 via-purple-600 to-pink-500",
    borderAccent: "border-fuchsia-400 dark:border-fuchsia-700",
    bgLight: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    textColor: "text-fuchsia-600 dark:text-fuchsia-400",
    xpPoints: 1500,
  },
];

export interface EvaluationResult {
  updatedBadges: AchievementBadge[];
  newlyUnlockedBadges: AchievementBadge[];
}

export function evaluateBadges(
  courses: Course[],
  existingBadges: AchievementBadge[]
): EvaluationResult {
  let totalModulesCount = 0;
  let completedModulesCount = 0;
  let completedCoursesCount = 0;
  let coursesWithCompletedModuleCount = 0;
  let totalProgressSum = 0;

  courses.forEach((c) => {
    const mods = c.modules || [];
    const completed = mods.filter((m) => m.isCompleted).length;
    const total = mods.length;

    totalModulesCount += total;
    completedModulesCount += completed;

    if (completed > 0) {
      coursesWithCompletedModuleCount += 1;
    }

    const coursePct = total > 0 ? Math.round((completed / total) * 100) : c.progress;
    totalProgressSum += coursePct;

    if (total > 0 && completed === total) {
      completedCoursesCount += 1;
    }
  });

  const courseCount = courses.length || 1;
  const overallAvgProgress = Math.round(totalProgressSum / courseCount);

  const newlyUnlocked: AchievementBadge[] = [];

  const updatedBadges = existingBadges.map((badge) => {
    let currVal = badge.currentValue;
    let targetVal = badge.targetValue;
    let shouldUnlock = false;

    switch (badge.id) {
      case "badge-first-step":
        currVal = completedModulesCount;
        shouldUnlock = completedModulesCount >= 1;
        break;

      case "badge-module-marathon":
        currVal = completedModulesCount;
        shouldUnlock = completedModulesCount >= 5;
        break;

      case "badge-decathlon":
        currVal = completedModulesCount;
        shouldUnlock = completedModulesCount >= 10;
        break;

      case "badge-quarter-mark":
        currVal = overallAvgProgress;
        shouldUnlock = overallAvgProgress >= 25;
        break;

      case "badge-halfway-hero":
        currVal = overallAvgProgress;
        shouldUnlock = overallAvgProgress >= 50;
        break;

      case "badge-three-quarter":
        currVal = overallAvgProgress;
        shouldUnlock = overallAvgProgress >= 75;
        break;

      case "badge-high-flyer":
        currVal = overallAvgProgress;
        shouldUnlock = overallAvgProgress >= 80;
        break;

      case "badge-course-master":
        currVal = completedCoursesCount;
        shouldUnlock = completedCoursesCount >= 1;
        break;

      case "badge-multi-master":
        currVal = completedCoursesCount;
        shouldUnlock = completedCoursesCount >= 2;
        break;

      case "badge-consistent-learner":
        currVal = coursesWithCompletedModuleCount;
        shouldUnlock = coursesWithCompletedModuleCount >= 3;
        break;

      case "badge-grandmaster":
        currVal = overallAvgProgress;
        shouldUnlock = overallAvgProgress >= 100;
        break;

      default:
        break;
    }

    const progressPct = Math.min(100, Math.round((currVal / targetVal) * 100));

    // If it was locked before and now satisfies unlock condition
    const wasUnlocked = badge.unlocked;
    const isNowUnlocked = wasUnlocked || shouldUnlock;

    if (!wasUnlocked && isNowUnlocked) {
      const todayStr = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const newlyUnlockedBadge: AchievementBadge = {
        ...badge,
        currentValue: currVal,
        progressPercentage: 100,
        unlocked: true,
        unlockedAt: todayStr,
      };

      newlyUnlocked.push(newlyUnlockedBadge);
      return newlyUnlockedBadge;
    }

    return {
      ...badge,
      currentValue: currVal,
      progressPercentage: isNowUnlocked ? 100 : progressPct,
      unlocked: isNowUnlocked,
    };
  });

  return {
    updatedBadges,
    newlyUnlockedBadges: newlyUnlocked,
  };
}
