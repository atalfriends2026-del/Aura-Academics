import React from "react";
import { UserProfile, Course, Assignment, AchievementBadge } from "../types";
import { BadgeSummaryWidget } from "./BadgeSummaryWidget";
import { DailyGoalsWidget } from "./DailyGoalsWidget";
import {
  Award,
  BookOpen,
  CalendarCheck,
  Clock,
  TrendingUp,
  Plus,
  Sparkles,
  CheckSquare,
  ArrowRight,
  ExternalLink,
  Activity
} from "lucide-react";
import { triggerConfetti } from "../utils/confetti";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

interface OverviewTabProps {
  user: UserProfile;
  courses: Course[];
  assignments: Assignment[];
  onToggleAssignmentStatus: (assignmentId: string) => void;
  onOpenNewTaskModal: () => void;
  onOpenAITutor: () => void;
  onOpenCourseModal: (course: Course) => void;
  onSwitchTab: (tab: any) => void;
  badges?: AchievementBadge[];
  onOpenBadgeGallery?: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  user,
  courses,
  assignments,
  onToggleAssignmentStatus,
  onOpenNewTaskModal,
  onOpenAITutor,
  onOpenCourseModal,
  onSwitchTab,
  badges = [],
  onOpenBadgeGallery = () => {},
}) => {
  const pendingTasks = assignments.filter((a) => a.status === "Pending");

  const handleTaskCheck = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      triggerConfetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    onToggleAssignmentStatus(id);
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-indigo-800/40">
        <div className="space-y-1 relative z-10">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/20 inline-block mb-1">
            Spring Semester 2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg">
            You have {pendingTasks.length} pending assignment deadlines this week and 1 exam scheduled on Thursday.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-3 shrink-0">
          <button
            onClick={onOpenNewTaskModal}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-md active:scale-95 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add Task</span>
          </button>
          
          <button
            onClick={onOpenAITutor}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-500 transition-all shadow-md active:scale-95 flex items-center space-x-2 border border-indigo-400/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI Tutor</span>
          </button>
        </div>

        {/* Decorative Glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Digital Achievements & Badges Summary */}
      {badges && badges.length > 0 && (
        <BadgeSummaryWidget
          badges={badges}
          onOpenBadgeGallery={onOpenBadgeGallery}
        />
      )}

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Cumulative GPA */}
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cumulative GPA
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {user.cumulativeGpa}{" "}
              <span className="text-xs font-bold text-emerald-500 ml-1">
                <TrendingUp className="w-3.5 h-3.5 inline mr-0.5" /> +0.08
              </span>
            </p>
            <p className="text-[11px] text-slate-400">Target: {user.targetGpa.toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl font-bold shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Degree Progress */}
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm flex items-center justify-between">
          <div className="space-y-1 w-full mr-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Degree Progress
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {user.completedCredits} / {user.totalRequiredCredits}
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full"
                style={{
                  width: `${(user.completedCredits / user.totalRequiredCredits) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl font-bold shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Attendance
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {user.attendanceRate}%
            </p>
            <p className="text-[11px] text-slate-400">32 of 33 classes attended</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center text-xl font-bold shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Study Hours */}
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Study Clock (Week)
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {user.studyHoursThisWeek} hrs
            </p>
            <p className="text-[11px] text-emerald-500 font-semibold">
              +12% vs last week
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl font-bold shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Daily Study Objectives & Goals Widget */}
      <DailyGoalsWidget onOpenFocusTimer={() => onSwitchTab("focus")} />

      {/* Main Grid: Grade Performance Trend & Upcoming Deadlines Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Study Summary Widget */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                <span>Weekly Study Summary</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Completed Assignments vs. Pomodoro Sessions
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={[
                  { name: "Mon", assignments: 1, pomodoros: 4 },
                  { name: "Tue", assignments: 0, pomodoros: 3 },
                  { name: "Wed", assignments: 2, pomodoros: 6 },
                  { name: "Thu", assignments: 1, pomodoros: 2 },
                  { name: "Fri", assignments: 2, pomodoros: 5 },
                  { name: "Sat", assignments: 0, pomodoros: 3 },
                  { name: "Sun", assignments: 3, pomodoros: 7 },
                ]}
                margin={{ top: 20, right: 20, bottom: 20, left: -20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Bar yAxisId="left" dataKey="assignments" name="Assignments Completed" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="pomodoros" name="Pomodoros" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Tasks Checklist */}
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-indigo-500" />
                <span>Upcoming Tasks</span>
              </h3>
              <button
                onClick={onOpenNewTaskModal}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                + Add Task
              </button>
            </div>

            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                    assignment.status === "Graded"
                      ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-800 opacity-60"
                      : "bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={assignment.status === "Graded" || assignment.status === "Submitted"}
                    onChange={(e) => handleTaskCheck(assignment.id, e)}
                    className="mt-1 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 shrink-0 cursor-pointer"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${
                        assignment.status === "Graded" || assignment.status === "Submitted"
                          ? "line-through text-slate-400"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {assignment.courseCode}: {assignment.title}
                    </p>
                    <p className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold mt-0.5">
                      Due: {assignment.dueDate} • {assignment.dueTime}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded shrink-0 ${
                      assignment.priority === "High"
                        ? "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300"
                        : assignment.priority === "Medium"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {assignment.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSwitchTab("assignments")}
            className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors flex items-center justify-center space-x-1"
          >
            <span>View All Assignments & Project Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Active Courses Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Active Courses ({courses.length})
          </h3>
          <button
            onClick={() => onSwitchTab("courses")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View Syllabus & Modules &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {course.code}
                  </span>
                  <span className="text-xs font-black text-emerald-500">
                    Grade: {course.gradePercentage}% ({course.letterGrade})
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {course.instructor}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>Syllabus Completed</span>
                    <span>{course.syllabusProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${course.syllabusProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenCourseModal(course)}
                className="w-full py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1"
              >
                <span>Open Workspace</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
