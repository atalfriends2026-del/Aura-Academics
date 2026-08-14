import React, { useState } from "react";
import { Course, AchievementBadge } from "../types";
import { BadgeSummaryWidget } from "./BadgeSummaryWidget";
import {
  BookOpen,
  User,
  MapPin,
  Clock,
  CheckCircle,
  Circle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Award,
  Filter,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";

interface CoursesTabProps {
  courses: Course[];
  onOpenCourseModal: (course: Course) => void;
  onOpenAITutorWithContext: (courseTitle: string) => void;
  onUpdateCourse: (course: Course) => void;
  badges?: AchievementBadge[];
  onOpenBadgeGallery?: () => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  onOpenCourseModal,
  onOpenAITutorWithContext,
  onUpdateCourse,
  badges = [],
  onOpenBadgeGallery = () => {},
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "");
  const [moduleFilter, setModuleFilter] = useState<"all" | "completed" | "in-progress">("all");

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handleToggleModule = (courseId: string, moduleId: string) => {
    const courseToUpdate = courses.find((c) => c.id === courseId);
    if (!courseToUpdate) return;

    let targetIsNowCompleted = false;

    const updatedModules = courseToUpdate.modules.map((mod) => {
      if (mod.id === moduleId) {
        targetIsNowCompleted = !mod.isCompleted;
        return { ...mod, isCompleted: targetIsNowCompleted };
      }
      return mod;
    });

    if (targetIsNowCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    const completedCount = updatedModules.filter((m) => m.isCompleted).length;
    const totalCount = updatedModules.length;
    const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const updatedCourse: Course = {
      ...courseToUpdate,
      modules: updatedModules,
      progress: newProgress,
      syllabusProgress: newProgress,
    };

    onUpdateCourse(updatedCourse);
  };

  const activeCompletedModulesCount = activeCourse?.modules.filter((m) => m.isCompleted).length || 0;
  const activeTotalModulesCount = activeCourse?.modules.length || 0;
  const activeProgressPercentage = activeTotalModulesCount > 0 
    ? Math.round((activeCompletedModulesCount / activeTotalModulesCount) * 100)
    : activeCourse?.progress || 0;

  const filteredModules = activeCourse?.modules.filter((mod) => {
    if (moduleFilter === "completed") return mod.isCompleted;
    if (moduleFilter === "in-progress") return !mod.isCompleted;
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span>Courses & Learning Progress Tracker</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track module completion, view overall progress percentages, and manage course syllabi.
          </p>
        </div>

        {activeCourse && (
          <button
            onClick={() => onOpenAITutorWithContext(activeCourse.title)}
            className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:opacity-95 transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Quiz for {activeCourse.code}</span>
          </button>
        )}
      </div>

      {/* Digital Achievements & Badges Widget */}
      {badges && badges.length > 0 && (
        <BadgeSummaryWidget
          badges={badges}
          onOpenBadgeGallery={onOpenBadgeGallery}
        />
      )}

      {/* Main Layout: Course Selector Sidebar + Module Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List of Enrolled Courses */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Enrolled Classes ({courses.length})
          </h3>

          {courses.map((course) => {
            const isSelected = course.id === selectedCourseId;
            const completedCount = course.modules.filter((m) => m.isCompleted).length;
            const totalCount = course.modules.length;
            const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : course.progress;

            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col space-y-2.5 ${
                  isSelected
                    ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500/60 ring-2 ring-indigo-500/30 shadow-sm"
                    : "bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-white/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="space-y-1 min-w-0 pr-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                      {course.code}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {course.instructor}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-emerald-500 block">
                      {course.gradePercentage}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Grade: {course.letterGrade}
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Module Count Indicator */}
                <div className="w-full space-y-1.5 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500 dark:text-slate-400">
                      {completedCount} of {totalCount} Modules
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                      {progressPct}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Detail Module Workspace */}
        {activeCourse && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Course Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-1 rounded text-xs font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    {activeCourse.code} • {activeCourse.credits} Credits
                  </span>
                  <h3 className="text-xl font-black mt-2">{activeCourse.title}</h3>
                </div>

                <button
                  onClick={() => onOpenCourseModal(activeCourse)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center space-x-1.5 self-start"
                >
                  <span>Full Syllabus</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Indicator Card inside Banner */}
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-extrabold text-white">Course Completion Progress</h4>
                      <p className="text-[11px] text-slate-300">
                        {activeCompletedModulesCount} of {activeTotalModulesCount} modules completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black text-emerald-300">
                      {activeProgressPercentage}%
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full border ${
                        activeProgressPercentage === 100
                          ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/40"
                          : activeProgressPercentage > 50
                          ? "bg-indigo-500/30 text-indigo-200 border-indigo-400/40"
                          : "bg-amber-500/30 text-amber-200 border-amber-400/40"
                      }`}
                    >
                      {activeProgressPercentage === 100
                        ? "Mastered 🏆"
                        : activeProgressPercentage > 50
                        ? "On Track"
                        : "In Progress"}
                    </span>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-slate-950/60 rounded-full h-3 p-0.5 border border-white/10">
                  <div
                    className="bg-gradient-to-r from-emerald-400 via-indigo-400 to-purple-400 h-2 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${activeProgressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Info Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>{activeCourse.instructor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>{activeCourse.room}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>{activeCourse.schedule}</span>
                </div>
              </div>

              {/* Announcement */}
              {activeCourse.announcement && (
                <div className="p-3 rounded-xl bg-indigo-900/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start space-x-2">
                  <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Professor Notice:</strong> {activeCourse.announcement}
                  </p>
                </div>
              )}
            </div>

            {/* Modules Section */}
            <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Learning Modules Checklist
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click any module to mark it complete and update your overall course progress.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
                  <button
                    onClick={() => setModuleFilter("all")}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      moduleFilter === "all"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    All ({activeCourse.modules.length})
                  </button>
                  <button
                    onClick={() => setModuleFilter("completed")}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      moduleFilter === "completed"
                        ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Done ({activeCompletedModulesCount})
                  </button>
                  <button
                    onClick={() => setModuleFilter("in-progress")}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      moduleFilter === "in-progress"
                        ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Active ({activeTotalModulesCount - activeCompletedModulesCount})
                  </button>
                </div>
              </div>

              {/* Module Cards List */}
              <div className="space-y-3">
                {filteredModules.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs italic">
                    No modules match the selected filter.
                  </div>
                ) : (
                  filteredModules.map((module) => (
                    <div
                      key={module.id}
                      onClick={() => handleToggleModule(activeCourse.id, module.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 group ${
                        module.isCompleted
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300/60 dark:border-emerald-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-white dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleModule(activeCourse.id, module.id);
                            }}
                            className="text-slate-400 hover:text-emerald-500 transition-colors focus:outline-none"
                          >
                            {module.isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-indigo-500 transition-colors" />
                            )}
                          </button>
                          <div>
                            <h4
                              className={`font-extrabold text-sm ${
                                module.isCompleted
                                  ? "text-slate-700 dark:text-slate-300 line-through decoration-emerald-500/50"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {module.title}
                            </h4>
                            {module.dueDate && !module.isCompleted && (
                              <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                                Due: {module.dueDate}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all ${
                            module.isCompleted
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 group-hover:bg-indigo-100 group-hover:text-indigo-700"
                          }`}
                        >
                          {module.isCompleted ? "Completed" : "Mark as Complete"}
                        </span>
                      </div>

                      {/* Topics bullet list */}
                      <div className="pl-8 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                        <p className="font-semibold text-slate-500 dark:text-slate-400">
                          Key Focus Concepts:
                        </p>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {module.topics.map((topic, i) => (
                            <li key={i}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

