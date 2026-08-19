import React, { useState } from "react";
import { UserProfile, UserThemeSettings } from "../types";
import { ThemeSettingsTab } from "./ThemeSettingsTab";
import {
  X,
  Palette,
  User,
  Bell,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  themeSettings: UserThemeSettings;
  onUpdateThemeSettings: (newSettings: Partial<UserThemeSettings>) => void;
  onResetThemeSettings: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  themeSettings,
  onUpdateThemeSettings,
  onResetThemeSettings,
}) => {
  const [activeTab, setActiveTab] = useState<"theme" | "profile" | "notifications" | "about">("theme");
  const [formData, setFormData] = useState({ ...user });
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-purple-500/30 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Application Settings</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                  Galaxy Engine v3.2
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize your Multiple Galaxy themes, student profile, and AI preferences.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Navigation Strip */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 overflow-x-auto shrink-0 custom-scrollbar">
          <button
            onClick={() => setActiveTab("theme")}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-black border-b-2 transition-all shrink-0 ${
              activeTab === "theme"
                ? "border-purple-600 text-purple-600 dark:text-purple-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Theme & Multiple Galaxy</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-black border-b-2 transition-all shrink-0 ${
              activeTab === "profile"
                ? "border-purple-600 text-purple-600 dark:text-purple-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Student Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-black border-b-2 transition-all shrink-0 ${
              activeTab === "notifications"
                ? "border-purple-600 text-purple-600 dark:text-purple-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications & Audio</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-black border-b-2 transition-all shrink-0 ${
              activeTab === "about"
                ? "border-purple-600 text-purple-600 dark:text-purple-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About Aura Academics</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          
          {/* TAB 1: THEME & GALAXY */}
          {activeTab === "theme" && (
            <ThemeSettingsTab
              settings={themeSettings}
              onUpdateSettings={onUpdateThemeSettings}
              onResetSettings={onResetThemeSettings}
            />
          )}

          {/* TAB 2: STUDENT PROFILE */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-md"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {formData.name}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                    Class 8th Standard • Advanced Track
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formData.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    Target GPA Goal
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={formData.targetGpa}
                    onChange={(e) =>
                      setFormData({ ...formData, targetGpa: parseFloat(e.target.value) || 3.8 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    Major / Stream
                  </label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>

              {isSavedAlert && (
                <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: NOTIFICATIONS & AUDIO */}
          {activeTab === "notifications" && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Academic Alerts & Reminders
                </h3>
                
                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 cursor-pointer">
                    <span className="font-bold">Assignment Deadline Alerts (24 hrs before)</span>
                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 cursor-pointer">
                    <span className="font-bold">Digital Badge & Achievement Unlocked Chimes</span>
                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 cursor-pointer">
                    <span className="font-bold">Daily NCERT Revision Reminders</span>
                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT */}
          {activeTab === "about" && (
            <div className="max-w-2xl mx-auto space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Aura Academics • Multiple Galaxy Edition
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Empowering secondary students with NCERT curriculum, 4K video modules, AI-powered tutoring, digital achievements, and immersive cosmological UI themes.
              </p>
              <div className="pt-4 flex items-center justify-center space-x-2 text-xs font-bold text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted & Verified Client Platform</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80 shrink-0">
          <span className="text-[11px] text-slate-400 font-semibold">
            Changes are saved automatically to your device.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
