import React from "react";
import { DashboardTab, UserProfile } from "../types";
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  CalendarDays,
  Bot,
  TrendingUp,
  Timer,
  ChevronsLeft,
  ChevronsRight,
  GraduationCap,
  Sparkles,
  Compass,
} from "lucide-react";

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: UserProfile;
  pendingAssignmentsCount: number;
  onOpenAITutor: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  user,
  pendingAssignmentsCount,
  onOpenAITutor,
}) => {
  const navItems = [
    {
      id: "overview" as DashboardTab,
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "courses" as DashboardTab,
      label: "Courses & Modules",
      icon: BookOpen,
      badge: "4",
    },
    {
      id: "assignments" as DashboardTab,
      label: "Assignments",
      icon: CheckSquare,
      badge: pendingAssignmentsCount > 0 ? String(pendingAssignmentsCount) : null,
      badgeColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300",
    },
    {
      id: "schedule" as DashboardTab,
      label: "Schedule & Timetable",
      icon: CalendarDays,
      badge: null,
    },
    {
      id: "analytics" as DashboardTab,
      label: "Grade Analytics",
      icon: TrendingUp,
      badge: "3.92",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    },
    {
      id: "focus" as DashboardTab,
      label: "Focus & Pomodoro",
      icon: Timer,
      badge: null,
    },
    {
      id: "quiz" as DashboardTab,
      label: "Quizzes & Assessments",
      icon: CheckSquare,
      badge: null,
    },
    {
      id: "learning-path" as DashboardTab,
      label: "AI Learning Paths",
      icon: Sparkles,
      badge: "New",
      badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    },
    {
      id: "school-finder" as DashboardTab,
      label: "Dynamic School Finder",
      icon: Compass,
      badge: "Hot",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    },
  ];

  return (
    <aside
      className={`transition-all duration-300 ease-in-out border-r border-white/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between shrink-0 relative z-20 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header Section with Logo & Toggle Button */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                Aura Workspace
              </span>
            </div>
          )}

          {isCollapsed && (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* Minimize / Maximize Sidebar Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? "Maximize Sidebar" : "Minimize Sidebar"}
            aria-label={isCollapsed ? "Maximize Sidebar" : "Minimize Sidebar"}
          >
            {isCollapsed ? (
              <ChevronsRight className="w-5 h-5 text-indigo-500" />
            ) : (
              <ChevronsLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* AI Tutor Dedicated Highlight Button */}
        <div className="p-3">
          <button
            onClick={onOpenAITutor}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center px-2" : "space-x-3 px-3"
            } py-2.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/20 hover:opacity-95 active:scale-95`}
            title="Launch Aura AI Tutor"
          >
            <Bot className="w-4 h-4 shrink-0 animate-bounce" />
            {!isCollapsed && (
              <>
                <span className="truncate flex-1 text-left">Aura AI Tutor</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-white/20 text-white">
                  NEW
                </span>
              </>
            )}
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center ${
                  isCollapsed ? "justify-center px-2" : "space-x-3 px-3"
                } py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all relative ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      item.badgeColor ||
                      "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Compact indicator dot when collapsed */}
                {isCollapsed && item.badge && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Summary Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center p-2" : "space-x-3 p-2.5"
          } rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60`}
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-lg object-cover shrink-0 ring-1 ring-indigo-500/30"
          />
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user.major} • B.S.
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
