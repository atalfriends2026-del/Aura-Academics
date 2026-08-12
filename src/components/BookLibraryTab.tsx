import React, { useState } from "react";
import { GRADE_STANDARDS, SYLLABUS_OPTIONS, SyllabusOption } from "../data/educationData";
import {
  BookOpen,
  Atom,
  Globe,
  PenTool,
  Calculator,
  GraduationCap,
  Scroll,
  BookMarked,
  Code2,
  ChevronRight,
  Download,
  FileText,
  Sparkles,
  X,
  Bot,
  Layers,
  CheckCircle2,
} from "lucide-react";

interface BookLibraryTabProps {
  onOpenAITutor: (context?: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Atom,
  Globe,
  PenTool,
  Calculator,
  GraduationCap,
  Scroll,
  BookMarked,
  Code2,
};

export const BookLibraryTab: React.FC<BookLibraryTabProps> = ({ onOpenAITutor }) => {
  // Selected grade (defaults to 8th Standard, but student can click any grade from 1st to 12th)
  const [selectedGrade, setSelectedGrade] = useState<string>("8th Standard");
  const [selectedBook, setSelectedBook] = useState<SyllabusOption | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl border border-white/20">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-white border border-white/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Textbook Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Book Library
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            Select your grade standard from 1st to 12th Standard to browse official NCERT, Cambridge, Tili/Siri Kannada, and D-CODE digital textbooks.
          </p>
        </div>
      </div>

      {/* STEP 1: Grade / Class Selection Grid (1st to 12th Standard) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <span>Select Grade / Class Standard</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose your academic grade to load tailored textbooks and syllabus resources.
            </p>
          </div>

          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
            Active: {selectedGrade}
          </span>
        </div>

        {/* 12 Grade Option Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {GRADE_STANDARDS.map((grade) => {
            const isSelected = selectedGrade === grade.name;

            return (
              <button
                key={grade.id}
                onClick={() => setSelectedGrade(grade.name)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-24 ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-lg scale-105"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400 hover:scale-102"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                        : "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                    }`}
                  >
                    {grade.badge}
                  </span>

                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>

                <span className="text-sm font-black tracking-tight">{grade.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Syllabus / Book Options Grid for the Selected Grade */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>Available Textbooks & Syllabuses ({selectedGrade})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              NCERT Curiosity, Exploring Society, Malhar, Ganita Prakash, Cambridge, Tili & Siri Kannada, and D-CODE.
            </p>
          </div>
        </div>

        {/* 8 Required Syllabus Book Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SYLLABUS_OPTIONS.map((book) => {
            const IconComp = ICON_MAP[book.iconName] || BookOpen;

            return (
              <div
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  setActiveChapterIndex(0);
                }}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Top Poster Gradient */}
                <div
                  className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${book.gradient}`}
                />

                <div className="space-y-4 pt-1">
                  {/* Icon & Badge */}
                  <div className="flex justify-between items-start">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${book.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>

                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${book.badgeColor}`}>
                      {book.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-[11px] font-bold text-indigo-500 dark:text-indigo-400">
                      {book.publisher} • {selectedGrade}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                    {book.chapters.length} Chapters
                  </span>

                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Book</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Book Reader Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedBook.gradient} text-white flex items-center justify-between`}>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase">
                    {selectedBook.publisher}
                  </span>
                  <span className="text-xs font-bold text-white/90">{selectedGrade}</span>
                </div>
                <h3 className="text-xl font-black">{selectedBook.title}</h3>
              </div>

              <button
                onClick={() => setSelectedBook(null)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Book Reader Layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
              {/* Left Chapter Navigation Sidebar */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800 overflow-y-auto space-y-2">
                <p className="text-[10px] font-extrabold uppercase text-slate-400 px-2">
                  Table of Contents
                </p>

                {selectedBook.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all border ${
                      activeChapterIndex === idx
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                    }`}
                  >
                    <p className="truncate">{ch.title}</p>
                    <span className={`text-[10px] block mt-1 ${activeChapterIndex === idx ? "text-indigo-100" : "text-slate-400"}`}>
                      {ch.pages} Pages • {ch.duration}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right Chapter Reader View */}
              <div className="md:col-span-2 p-6 overflow-y-auto space-y-6">
                {selectedBook.chapters[activeChapterIndex] && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-black text-indigo-900 dark:text-indigo-200">
                          {selectedBook.chapters[activeChapterIndex].title}
                        </h4>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">
                          Estimated reading time: {selectedBook.chapters[activeChapterIndex].duration}
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 text-xs font-black shadow-sm">
                        Page 1 of {selectedBook.chapters[activeChapterIndex].pages}
                      </span>
                    </div>

                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 space-y-3 leading-relaxed text-xs sm:text-sm">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        Chapter Executive Summary:
                      </p>
                      <p>
                        {selectedBook.chapters[activeChapterIndex].summary}
                      </p>
                      <p>
                        This textbook unit includes illustrated diagrams, key terminology lists, solved examples, and practice exercises tailored for school board examinations.
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => {
                          const contextStr = `${selectedBook.title} - ${selectedBook.chapters[activeChapterIndex].title}`;
                          setSelectedBook(null);
                          onOpenAITutor(contextStr);
                        }}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs hover:opacity-90 transition-all flex items-center space-x-2 shadow-md"
                      >
                        <Bot className="w-4 h-4" />
                        <span>Explain Chapter with AI Tutor</span>
                      </button>

                      <button
                        onClick={() => alert(`Simulating PDF download for ${selectedBook.title}...`)}
                        className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-colors flex items-center space-x-2 border border-slate-200 dark:border-slate-700"
                      >
                        <Download className="w-4 h-4 text-indigo-500" />
                        <span>Download Chapter PDF</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
