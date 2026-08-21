import React from "react";
import { ViewMode, UserProfile, NotificationItem, UserThemeSettings } from "../types";
import auraAcademicsLogo from "../assets/images/aura_academics_logo.jpg";
import {
  GraduationCap,
  Compass,
  LayoutDashboard,
  Moon,
  Sun,
  Bell,
  Search,
  Sparkles,
  ArrowRight,
  Trophy,
  Palette,
  Settings,
} from "lucide-react";

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  user: UserProfile;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenAITutor: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unlockedBadgesCount?: number;
  onOpenBadgeGallery?: () => void;
  themeSettings?: UserThemeSettings;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  isDarkMode,
  onToggleDarkMode,
  user,
  notifications,
  onOpenNotifications,
  onOpenAITutor,
  searchQuery,
  onSearchChange,
  unlockedBadgesCount = 0,
  onOpenBadgeGallery,
  themeSettings,
  onOpenSettings,
}) => {
  const unreadCount = notifications.filter((n) => n.unread).length;
  const isGalaxy = themeSettings?.activeThemeId === "multiple-galaxy";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onViewChange("landing")}
              className="flex items-center space-x-3 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform border border-indigo-200/50 dark:border-indigo-800/50 bg-slate-950 flex items-center justify-center shrink-0">
                <img
                  src={auraAcademicsLogo}
                  alt="Aura Academics Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Aura<span className="text-slate-900 dark:text-white font-semibold ml-1">Academics</span>
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                  {isGalaxy ? "🌌 Galaxy Edition" : "v3.2 AI"}
                </span>
              </div>
            </button>
          </div>

          {/* View Mode Pill Switcher (Landing vs Dashboard) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <button
              onClick={() => onViewChange("landing")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex items-center space-x-1.5 ${
                currentView === "landing"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Compass className={`w-4 h-4 ${currentView === "landing" ? "text-indigo-500" : ""}`} />
              <span>Landing Page</span>
            </button>

            <button
              onClick={() => onViewChange("dashboard")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex items-center space-x-1.5 ${
                currentView === "dashboard"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${currentView === "dashboard" ? "text-purple-500" : ""}`} />
              <span>App Dashboard</span>
            </button>
          </div>

          {/* Search Bar (When in Dashboard mode) */}
          {currentView === "dashboard" && (
            <div className="hidden md:flex items-center relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search courses, tasks, notes..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAITutor}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Ask AI Tutor</span>
            </button>

            {/* Quick Multiple Galaxy / Theme Settings Button */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-cyan-500/15 border border-purple-500/40 text-purple-600 dark:text-purple-300 hover:bg-purple-500/25 transition-all shadow-xs"
                title="Open Multiple Galaxy & Theme Settings"
                aria-label="Theme Settings"
              >
                <Palette className="w-4 h-4 text-purple-500 animate-pulse" />
                <span className="hidden md:inline-block">Themes</span>
              </button>
            )}

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Landing CTA or Dashboard Profile User Header */}
            {currentView === "landing" ? (
              <button
                onClick={() => onViewChange("dashboard")}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>Launch Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                {/* Badges Button */}
                {onOpenBadgeGallery && (
                  <button
                    onClick={onOpenBadgeGallery}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all text-xs font-black shadow-2xs"
                    title="View Digital Achievements & Badges"
                  >
                    <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="hidden sm:inline-block">{unlockedBadgesCount} Badges</span>
                  </button>
                )}

                {/* Notification Bell */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                  )}
                </button>

                {/* Settings Gear (Small Screen or Quick Access) */}
                {onOpenSettings && (
                  <button
                    onClick={onOpenSettings}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="App Settings"
                  >
                    <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </button>
                )}

                {/* User Avatar */}
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/40"
                  />
                  <div className="hidden xl:block text-left text-xs">
                    <p className="font-bold text-slate-900 dark:text-white leading-tight truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">GPA: {user.cumulativeGpa}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

