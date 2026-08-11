import React, { useState } from "react";
import { Course } from "../types";
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
} from "lucide-react";

interface CoursesTabProps {
  courses: Course[];
  onOpenCourseModal: (course: Course) => void;
  onOpenAITutorWithContext: (courseTitle: string) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  onOpenCourseModal,
  onOpenAITutorWithContext,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "");

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span>Courses & Learning Modules</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access lecture topics, study materials, instructor announcements, and syllabus checklists.
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

      {/* Main Layout: Course Selector Sidebar + Module Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List of Courses */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Enrolled Classes
          </h3>

          {courses.map((course) => {
            const isSelected = course.id === selectedCourseId;

            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between ${
                  isSelected
                    ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500/60 ring-2 ring-indigo-500/30 shadow-sm"
                    : "bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-white/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
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
                    {course.letterGrade}
                  </span>
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
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Learning Modules & Topics
              </h3>

              <div className="space-y-3">
                {activeCourse.modules.map((module) => (
                  <div
                    key={module.id}
                    className="p-4 rounded-xl border border-white/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {module.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {module.title}
                        </h4>
                      </div>

                      <span
                        className={`px-2 py-0.5 text-[10px] font-extrabold rounded ${
                          module.isCompleted
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {module.isCompleted ? "Completed" : "In Progress"}
                      </span>
                    </div>

                    {/* Topics bullet list */}
                    <div className="pl-7 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <p className="font-semibold text-slate-500">Key Focus Concepts:</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {module.topics.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
