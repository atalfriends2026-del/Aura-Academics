import React from "react";
import { DashboardTab, UserProfile } from "../types";
import {
  ArrowLeft,
  BookOpenText,
  BookOpen,
  Video,
  LayoutDashboard,
  GraduationCap,
  CheckSquare,
  Calendar,
  BarChart3,
  Target,
  Compass,
  BrainCircuit,
  School,
  Sparkles,
  Bot,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface SidebarNavItem {
  id: DashboardTab;
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  action: () => void;
  badge?: string;
  badgeBg?: string;
}

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onBack: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: UserProfile;
  pendingAssignmentsCount?: number;
  onOpenAITutor?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onBack,
  isCollapsed,
  onToggleCollapse,
  user,
  pendingAssignmentsCount = 0,
  onOpenAITutor,
}) => {
  const primarySection: SidebarNavItem[] = [
    {
      id: "my-subjects",
      label: "My Subjects",
      icon: BookOpenText,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800",
      action: () => onSelectTab("my-subjects"),
      badge: "16 All",
      badgeBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    },
    {
      id: "book-library",
      label: "Book Library",
      icon: BookOpen,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
      action: () => onSelectTab("book-library"),
      badge: "NCERT",
      badgeBg: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    },
    {
      id: "video-library",
      label: "Video Library",
      icon: Video,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800",
      action: () => onSelectTab("video-library"),
      badge: "4K HD",
      badgeBg: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    },
  ];

  const academicSection: SidebarNavItem[] = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800",
      action: () => onSelectTab("overview"),
    },
    {
      id: "courses",
      label: "Courses",
      icon: GraduationCap,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
      action: () => onSelectTab("courses"),
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: CheckSquare,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
      action: () => onSelectTab("assignments"),
      badge: pendingAssignmentsCount > 0 ? `${pendingAssignmentsCount} Due` : undefined,
      badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: Calendar,
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800",
      action: () => onSelectTab("schedule"),
    },
    {
      id: "classroom",
      label: "Google Classroom",
      icon: School,
      color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800",
      action: () => onSelectTab("classroom"),
      badge: "Connected",
      badgeBg: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800",
      action: () => onSelectTab("analytics"),
    },
  ];

  const toolsSection: SidebarNavItem[] = [
    {
      id: "focus",
      label: "Focus Mode",
      icon: Target,
      color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800",
      action: () => onSelectTab("focus"),
    },
    {
      id: "learning-path",
      label: "Learning Paths",
      icon: Compass,
      color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800",
      action: () => onSelectTab("learning-path"),
    },
    {
      id: "quiz",
      label: "Quizzes",
      icon: BrainCircuit,
      color: "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-800",
      action: () => onSelectTab("quiz"),
    },
    {
      id: "school-finder",
      label: "School Finder",
      icon: School,
      color: "text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-950/60 border-fuchsia-200 dark:border-fuchsia-800",
      action: () => onSelectTab("school-finder"),
    },
    {
      id: "video-animator",
      label: "AI Video Animator",
      icon: Sparkles,
      color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800",
      action: () => onSelectTab("video-animator"),
    },
  ];

  const renderNavGroup = (title: string, items: SidebarNavItem[]) => (
    <div className="space-y-1.5">
      {!isCollapsed && (
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
          {title}
        </p>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={item.action}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center px-2" : "space-x-3 px-3"
            } py-2.5 rounded-2xl font-bold text-xs transition-all border ${
              isActive
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md border-transparent"
                : "bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-white dark:hover:bg-slate-800"
            }`}
            title={isCollapsed ? item.label : undefined}
          >
            <div
              className={`p-1.5 rounded-xl shrink-0 ${
                isActive
                  ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                  : item.color
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>

            {!isCollapsed && (
              <span className="truncate flex-1 text-left font-extrabold">{item.label}</span>
            )}

            {!isCollapsed && item.badge && (
              <span
                className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${item.badgeBg}`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside
      className={`transition-all duration-300 ease-in-out border-r border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex flex-col justify-between shrink-0 relative z-20 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Top Header Logo */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white block truncate leading-tight">
                  EduDashboard
                </span>
                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 block truncate">
                  Student Learning Hub
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronsRight className="w-5 h-5 text-indigo-500" />
            ) : (
              <ChevronsLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Back Button */}
        <div className="p-3 shrink-0">
          <button
            onClick={onBack}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center px-2" : "space-x-3 px-3"
            } py-2 rounded-2xl text-xs font-extrabold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors`}
            title="Return Home"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-rose-500" />
            {!isCollapsed && <span>Back to Home</span>}
          </button>
        </div>

        {/* AI Tutor Quick Launcher */}
        {onOpenAITutor && (
          <div className="px-3 pb-2 shrink-0">
            <button
              onClick={onOpenAITutor}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center px-2" : "space-x-3 px-3"
              } py-2.5 rounded-2xl text-xs font-extrabold transition-all bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/20 hover:opacity-95 active:scale-95`}
              title="Aura AI Homework Assistant"
            >
              <Bot className="w-4 h-4 shrink-0 animate-bounce" />
              {!isCollapsed && (
                <>
                  <span className="truncate flex-1 text-left">AI Study Buddy</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-white/20 text-white">
                    24/7
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Scrollable Navigation Sections */}
        <div className="p-3 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {renderNavGroup("Core Learning", primarySection)}
          {renderNavGroup("Student Dashboard", academicSection)}
          {renderNavGroup("Smart Tools & AI", toolsSection)}
        </div>

        {/* Bottom Student Profile */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center p-2" : "space-x-3 p-2.5"
            } rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-800/60 dark:to-indigo-950/40 border border-slate-200/60 dark:border-slate-700/60`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover shrink-0 ring-2 ring-indigo-500/40 shadow-sm"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                  Class 8th Standard • Student
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
