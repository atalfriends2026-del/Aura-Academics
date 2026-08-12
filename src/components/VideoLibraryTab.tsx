import React, { useState } from "react";
import { GRADE_STANDARDS, SYLLABUS_OPTIONS, SyllabusOption } from "../data/educationData";
import {
  Video,
  Play,
  Atom,
  Globe,
  PenTool,
  Calculator,
  GraduationCap,
  Scroll,
  BookMarked,
  Code2,
  Clock,
  Sparkles,
  X,
  Bot,
  Layers,
  CheckCircle2,
  Tv,
  Volume2,
  Maximize2,
  Rewind,
  FastForward,
} from "lucide-react";

interface VideoLibraryTabProps {
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

export const VideoLibraryTab: React.FC<VideoLibraryTabProps> = ({ onOpenAITutor }) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("8th Standard");
  const [selectedVideo, setSelectedVideo] = useState<{
    syllabus: SyllabusOption;
    chapterIndex: number;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white shadow-xl border border-white/20">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-white border border-white/30">
            <Tv className="w-3.5 h-3.5" />
            <span>4K Animated Video Streaming</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Video Library
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            Watch high-definition animated video lessons, teacher explanations, and step-by-step problem breakdowns across all 12 grades and syllabuses.
          </p>
        </div>
      </div>

      {/* STEP 1: Grade / Class Selection Grid (1st to 12th Standard) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-purple-500" />
              <span>Select Grade / Class Standard</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filter video lectures by grade standard from 1st to 12th Standard.
            </p>
          </div>

          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 self-start sm:self-auto">
            Streaming: {selectedGrade}
          </span>
        </div>

        {/* 12 Grade Cards */}
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
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-400 hover:scale-102"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                        : "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                    }`}
                  >
                    {grade.badge}
                  </span>

                  {isSelected && <CheckCircle2 className="w-4 h-4 text-pink-400" />}
                </div>

                <span className="text-sm font-black tracking-tight">{grade.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Syllabus Video Cards for Selected Grade */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Video className="w-5 h-5 text-purple-500" />
            <span>Syllabus Video Lessons ({selectedGrade})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any video card below to start playing the video chapter lesson.
          </p>
        </div>

        {/* 8 Required Syllabus Video Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SYLLABUS_OPTIONS.map((book) => {
            const IconComp = ICON_MAP[book.iconName] || Video;

            return (
              <div
                key={book.id}
                onClick={() => setSelectedVideo({ syllabus: book, chapterIndex: 0 })}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
              >
                {/* Video Thumbnail Placeholder Poster with Gradient */}
                <div className={`relative h-44 bg-gradient-to-br ${book.gradient} p-4 flex flex-col justify-between overflow-hidden`}>
                  {/* Background overlay pattern */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                  {/* Top Badges */}
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-black uppercase text-white border border-white/20">
                      {book.publisher}
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-white/90 text-slate-900 text-[10px] font-black flex items-center space-x-1 shadow">
                      <Clock className="w-3 h-3 text-purple-600" />
                      <span>{book.chapters[0]?.duration || "15 mins"}</span>
                    </span>
                  </div>

                  {/* Center Animated Play Button Overlay */}
                  <div className="relative z-10 self-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 text-purple-600 flex items-center justify-center shadow-xl group-hover:scale-115 transition-transform duration-300">
                      <Play className="w-6 h-6 ml-1 fill-current" />
                    </div>
                  </div>

                  {/* Bottom Subject Tag */}
                  <div className="relative z-10 flex items-center space-x-2 text-white">
                    <IconComp className="w-4 h-4" />
                    <span className="text-xs font-bold drop-shadow">{book.subjectCategory}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {book.chapters[0]?.summary || book.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                    <span>{book.chapters.length} Video Chapters</span>
                    <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Watch Lesson</span>
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-slate-800 flex flex-col text-white">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black">{selectedVideo.syllabus.title}</h3>
                  <p className="text-[11px] text-slate-400">
                    {selectedGrade} • {selectedVideo.syllabus.chapters[selectedVideo.chapterIndex]?.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Canvas Screen */}
            <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden">
              {/* Simulated video frame animation */}
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedVideo.syllabus.gradient} opacity-40`} />

              <div className="relative z-10 text-center space-y-4 p-6">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                  <Play className="w-10 h-10 ml-1 fill-current" />
                </div>

                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase">
                    4K Ultra HD Animated Stream
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    {selectedVideo.syllabus.chapters[selectedVideo.chapterIndex]?.title}
                  </h4>
                </div>
              </div>

              {/* Video Player Controls Bar Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 space-y-2">
                {/* Progress bar */}
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div className="bg-purple-500 h-full w-2/5 rounded-full" />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      {isPlaying ? <Clock className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <span className="font-semibold text-slate-300">06:24 / 15:00</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-4 h-4 text-slate-300" />
                    <Maximize2 className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Description & Chapter Navigation */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-4 flex-1 overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Lesson Summary & Key Concepts
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {selectedVideo.syllabus.chapters[selectedVideo.chapterIndex]?.summary}
                  </p>
                </div>

                <button
                  onClick={() => {
                    const ctx = `${selectedVideo.syllabus.title} - ${selectedVideo.syllabus.chapters[selectedVideo.chapterIndex]?.title}`;
                    setSelectedVideo(null);
                    onOpenAITutor(ctx);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs hover:opacity-90 transition-all flex items-center space-x-2 shrink-0"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask AI Tutor About Video</span>
                </button>
              </div>

              {/* Other chapters in this syllabus */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">
                  All Chapters in this Playlist ({selectedVideo.syllabus.chapters.length}):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedVideo.syllabus.chapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedVideo({ ...selectedVideo, chapterIndex: idx })}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        selectedVideo.chapterIndex === idx
                          ? "bg-purple-900/60 border-purple-500 text-white"
                          : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span className="truncate">{ch.title}</span>
                      <span className="text-[10px] text-purple-400 ml-2 shrink-0">{ch.duration}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
