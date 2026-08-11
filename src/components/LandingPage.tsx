import React, { useState } from "react";
import { ViewMode } from "../types";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bot,
  Layout,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
  Calculator,
  BookMarked,
  Clock,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  // Quick GPA Calculator State on Landing Page
  const [gradeA, setGradeA] = useState(3); // 3-credit course
  const [scoreA, setScoreA] = useState(4.0); // A
  const [gradeB, setGradeB] = useState(4); // 4-credit course
  const [scoreB, setScoreB] = useState(3.7); // A-
  const [gradeC, setGradeC] = useState(3); // 3-credit course
  const [scoreC, setScoreC] = useState(3.3); // B+

  const calculatedGpa = (
    (gradeA * scoreA + gradeB * scoreB + gradeC * scoreC) /
    (gradeA + gradeB + gradeC)
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-slate-50 via-indigo-50/40 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500" />
              Next-Gen AI Academic Intelligence Platform
            </span>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Empower Learning with{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Aura Analytics
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Aura Academics unifies AI-driven performance insights, flexible course workflows, smart task planning, and real-time student engagement in one seamless ecosystem.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onLaunchDashboard}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-95 transition-all text-sm sm:text-base flex items-center justify-center space-x-3"
              >
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm sm:text-base text-center shadow-sm"
              >
                See Platform Features
              </a>
            </div>

            {/* Key Trust Stats */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200/80 dark:border-slate-800/80 mt-12">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">98.4%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">On-time Submissions</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">450+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Partner Universities</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">3.8x</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Faster AI Tutoring</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">1.2M</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Active Learners</p>
              </div>
            </div>

          </div>

          {/* Live Mockup Interactive Showcase Frame */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner">
              <div className="px-4 py-3 bg-slate-800/90 flex items-center justify-between border-b border-slate-700/60">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-pink-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-xs font-mono text-slate-400 ml-2">aura-academics.edu/dashboard</span>
                </div>
                <button
                  onClick={onLaunchDashboard}
                  className="px-2.5 py-1 text-[11px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 hover:bg-indigo-500/30 transition-colors"
                >
                  Click to Open Interactive Dashboard &rarr;
                </button>
              </div>

              {/* Mock Dashboard Preview Inner Cards */}
              <div className="p-6 bg-slate-950 text-white grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Cumulative GPA</span>
                    <span className="text-emerald-400">+0.08 term</span>
                  </div>
                  <p className="text-3xl font-black text-white">3.92 / 4.00</p>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" style={{ width: "98%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>CS 401: Data Structures</span>
                    <span className="text-indigo-400 font-bold">94.5% (A)</span>
                  </div>
                  <p className="text-sm font-bold text-slate-200 truncate">Algorithm Proof Analysis</p>
                  <p className="text-xs text-pink-400 font-semibold">Due Tomorrow, 11:59 PM</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span>Aura AI Assistant</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"I have prepared a 3-question review for your Linear Algebra midterm..."</p>
                  <button
                    onClick={onLaunchDashboard}
                    className="w-full py-1.5 text-center text-[11px] font-bold rounded-lg bg-indigo-600 text-white"
                  >
                    Open AI Tutor
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* QUICK GPA CALCULATOR INTERACTIVE WIDGET SECTION */}
      <section className="py-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-y border-white/50 dark:border-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-slate-200 dark:border-slate-700/80 shadow-lg space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <Calculator className="w-3.5 h-3.5 inline mr-1" /> Quick Estimator
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  Try the Aura GPA Predictor
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Estimate your semester GPA instantly by adjusting course grades and credits below.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 text-center shadow-md min-w-[160px]">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Projected GPA
                </p>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                  {calculatedGpa}
                </p>
                <span className="text-[10px] font-semibold text-emerald-500">Academic Honors Eligible</span>
              </div>
            </div>

            {/* Course Slider Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 space-y-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Course 1: CS 401</span>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 flex justify-between">
                    <span>Grade Scale</span>
                    <span className="font-bold text-slate-900 dark:text-white">{scoreA === 4.0 ? "A (4.0)" : scoreA === 3.7 ? "A- (3.7)" : "B+ (3.3)"}</span>
                  </label>
                  <select
                    value={scoreA}
                    onChange={(e) => setScoreA(parseFloat(e.target.value))}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value={4.0}>A (4.0)</option>
                    <option value={3.7}>A- (3.7)</option>
                    <option value={3.3}>B+ (3.3)</option>
                    <option value={3.0}>B (3.0)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 space-y-2">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Course 2: MATH 302</span>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 flex justify-between">
                    <span>Grade Scale</span>
                    <span className="font-bold text-slate-900 dark:text-white">{scoreB === 4.0 ? "A (4.0)" : scoreB === 3.7 ? "A- (3.7)" : "B+ (3.3)"}</span>
                  </label>
                  <select
                    value={scoreB}
                    onChange={(e) => setScoreB(parseFloat(e.target.value))}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value={4.0}>A (4.0)</option>
                    <option value={3.7}>A- (3.7)</option>
                    <option value={3.3}>B+ (3.3)</option>
                    <option value={3.0}>B (3.0)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 space-y-2">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Course 3: PHYS 201</span>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 flex justify-between">
                    <span>Grade Scale</span>
                    <span className="font-bold text-slate-900 dark:text-white">{scoreC === 4.0 ? "A (4.0)" : scoreC === 3.7 ? "A- (3.7)" : "B+ (3.3)"}</span>
                  </label>
                  <select
                    value={scoreC}
                    onChange={(e) => setScoreC(parseFloat(e.target.value))}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value={4.0}>A (4.0)</option>
                    <option value={3.7}>A- (3.7)</option>
                    <option value={3.3}>B+ (3.3)</option>
                    <option value={3.0}>B (3.0)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onLaunchDashboard}
                className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Save To Full Grade Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE PILLARS SECTION */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
              Engineered for High Academic Performance
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Aura Academics combines predictive analytics with student workspace ergonomics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Predictive GPA & Performance Trends</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Track semester grade trajectories over time. Identify syllabus vulnerabilities before midterms with built-in trend algorithms.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm hover:border-purple-500/50 hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Academic Tutor & Companion</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Instant answers to coursework questions, automated practice quiz generation, and personalized study schedule planning powered by Gemini.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm hover:border-pink-500/50 hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Collapsible Ergonomic Sidebar</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Maximize screen real estate during study sessions with an expandable and minimizable workspace sidebar layout.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                <BookMarked className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Course Modules & Syllabus Workspaces</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Organize lectures, assignment submissions, professor announcements, and reading materials in designated course hubs.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm hover:border-amber-500/50 hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pomodoro Focus Timer & Lo-Fi</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Stay in flow state with built-in interval timers, study log tracking, and ambient acoustic background sounds.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm hover:border-sky-500/50 hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">LMS & Assignment Syncing</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Keep deadline dates synced with automated priority flags, completion status tracking, and submission file upload tools.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <h2 className="text-3xl font-black sm:text-4xl">Ready to transform your academic journey?</h2>
          <p className="text-indigo-200 max-w-xl mx-auto text-xs sm:text-base">
            Access the full Aura Academics interactive student portal now.
          </p>
          <button
            onClick={onLaunchDashboard}
            className="px-8 py-4 rounded-xl font-extrabold bg-white text-indigo-900 hover:bg-indigo-50 transition-all shadow-xl hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Launch Interactive Workspace
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 text-xs py-8 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">Aura Academics Inc.</span>
          </div>
          <p>&copy; 2026 Aura Academics. Empowering students worldwide.</p>
        </div>
      </footer>

    </div>
  );
};
