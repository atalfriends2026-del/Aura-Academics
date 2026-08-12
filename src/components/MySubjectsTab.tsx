import React, { useState } from "react";
import { SUBJECTS_LIST, SubjectItem } from "../data/educationData";
import {
  BookOpenText,
  Scroll,
  PenTool,
  Calculator,
  Globe,
  Atom,
  Laptop,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Play,
  HelpCircle,
  X,
  FileText,
  BookOpen,
  Bot,
  BrainCircuit,
  Award,
  Search,
  Grid,
  ListFilter,
  CheckSquare,
  Layers,
} from "lucide-react";

interface MySubjectsTabProps {
  onOpenBookLibrary: () => void;
  onOpenVideoLibrary: () => void;
  onOpenAITutor: (subjectName?: string) => void;
}

// Map string icon names to Lucide icon components
const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  BookOpenText,
  Scroll,
  PenTool,
  Calculator,
  Globe,
  Atom,
  Laptop,
  Sparkles,
};

export const MySubjectsTab: React.FC<MySubjectsTabProps> = ({
  onOpenBookLibrary,
  onOpenVideoLibrary,
  onOpenAITutor,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<"chapters" | "notes" | "quiz">("chapters");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "all-topics">("grid");

  // Calculate total topic count across all subjects
  const totalTopicsCount = SUBJECTS_LIST.reduce((acc, sub) => acc + sub.topics.length, 0);

  // Filter subjects and topics based on search query
  const filteredSubjects = SUBJECTS_LIST.filter((subj) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = subj.name.toLowerCase().includes(query);
    const codeMatch = subj.code.toLowerCase().includes(query);
    const taglineMatch = subj.tagline.toLowerCase().includes(query);
    const topicMatch = subj.topics.some((t) => t.toLowerCase().includes(query));
    return nameMatch || codeMatch || taglineMatch || topicMatch;
  });

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Top Welcome Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl border border-white/20">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-white border border-white/30">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Interactive Learning Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              My Academic Subjects ({SUBJECTS_LIST.length})
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
              Comprehensive subject coverage featuring <strong>{totalTopicsCount}+ key topics</strong> across Science, Math, Languages, Social Studies, Technology, and Humanities.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={onOpenBookLibrary}
              className="px-4 py-2.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-xs hover:bg-slate-100 transition-all shadow-md active:scale-95 flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Book Library</span>
            </button>

            <button
              onClick={onOpenVideoLibrary}
              className="px-4 py-2.5 rounded-2xl bg-indigo-900/80 backdrop-blur-md text-white font-extrabold text-xs hover:bg-indigo-950 transition-all border border-white/20 shadow-md active:scale-95 flex items-center space-x-2"
            >
              <Play className="w-4 h-4 text-pink-300" />
              <span>Video Library</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Search and View Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or topics (e.g. Algebra, Newton, Kannada, Cell...)"
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">View:</span>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Subject Cards ({filteredSubjects.length})</span>
            </button>

            <button
              onClick={() => setViewMode("all-topics")}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                viewMode === "all-topics"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>All Topics Master List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Grid of All Subject Cards */}
      {viewMode === "grid" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>All Enrolled Subjects</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {filteredSubjects.length} of {SUBJECTS_LIST.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any subject to open chapter modules, practice quizzes, and topic summaries.
              </p>
            </div>
          </div>

          {filteredSubjects.length === 0 ? (
            <div className="p-12 text-center bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">No subjects or topics found</h3>
              <p className="text-xs text-slate-500">Try searching for another term or click Clear Search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredSubjects.map((subj) => {
                const IconComponent = ICON_MAP[subj.iconName] || BookOpenText;

                return (
                  <div
                    key={subj.id}
                    onClick={() => setSelectedSubject(subj)}
                    className={`group relative overflow-hidden p-6 rounded-3xl border ${subj.borderAccent} bg-white dark:bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[240px]`}
                  >
                    {/* Background Accent Blur */}
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${subj.gradient} opacity-15 blur-2xl group-hover:opacity-30 transition-opacity`}
                    />

                    <div className="space-y-3 relative z-10">
                      {/* Top Bar with Icon & Badge */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${subj.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>

                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${subj.bgLight} ${subj.textColor} border ${subj.borderAccent}`}>
                          {subj.code}
                        </span>
                      </div>

                      {/* Subject Name & Description */}
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {subj.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {subj.tagline}
                        </p>
                      </div>

                      {/* Topic Pill Badges Preview */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {subj.topics.slice(0, 3).map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate max-w-[140px]"
                          >
                            {topic}
                          </span>
                        ))}
                        {subj.topics.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-[10px] font-black text-indigo-600 dark:text-indigo-300">
                            +{subj.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Bar with Progress & Action */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 relative z-10 space-y-2 mt-3">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <span>{subj.topics.length} Key Topics</span>
                        <span className={subj.textColor}>{subj.progressPct}% Done</span>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${subj.gradient} transition-all duration-500`}
                          style={{ width: `${subj.progressPct}%` }}
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center space-x-1">
                          <span>View All Topics</span>
                          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Comprehensive All Topics Master List View */}
      {viewMode === "all-topics" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                <span>Master Topic Directory Across All Subjects</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Browse through all topics from all subjects in one organized view.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {filteredSubjects.map((subj) => {
              const IconComponent = ICON_MAP[subj.iconName] || BookOpenText;

              return (
                <div
                  key={subj.id}
                  className={`p-6 rounded-3xl border ${subj.borderAccent} bg-white dark:bg-slate-900 shadow-sm space-y-4`}
                >
                  {/* Subject Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${subj.gradient} text-white flex items-center justify-center font-black shadow-md`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {subj.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${subj.bgLight} ${subj.textColor}`}>
                            {subj.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {subj.tagline}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedSubject(subj)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors flex items-center space-x-1"
                    >
                      <span>Study {subj.name}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Topics Grid for this Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subj.topics.map((topic, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedSubject(subj);
                        }}
                        className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-[11px] flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                            {topic}
                          </span>
                        </div>

                        <span className="text-[10px] font-extrabold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                          Learn →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Subject Detail Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedSubject.gradient} text-white flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black shadow-inner">
                  {selectedSubject.code}
                </div>
                <div>
                  <h3 className="text-xl font-black">{selectedSubject.name}</h3>
                  <p className="text-xs text-white/90 font-medium">{selectedSubject.tagline}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSubject(null)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs inside modal */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 pt-3 space-x-4">
              <button
                onClick={() => setActiveDetailTab("chapters")}
                className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-2 ${
                  activeDetailTab === "chapters"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>All Syllabus Topics ({selectedSubject.topics.length})</span>
              </button>

              <button
                onClick={() => setActiveDetailTab("notes")}
                className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-2 ${
                  activeDetailTab === "notes"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Key Concepts & Summary</span>
              </button>

              <button
                onClick={() => setActiveDetailTab("quiz")}
                className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-2 ${
                  activeDetailTab === "quiz"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Practice Flashcards</span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {activeDetailTab === "chapters" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedSubject.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    {selectedSubject.topics.map((topic, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {topic}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            const topicQuery = `${selectedSubject.name}: ${topic}`;
                            setSelectedSubject(null);
                            onOpenAITutor(topicQuery);
                          }}
                          className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 flex items-center space-x-1"
                        >
                          <Bot className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Ask AI Tutor</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeDetailTab === "notes" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 space-y-2">
                    <h4 className="text-xs font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span>{selectedSubject.name} Curriculum Overview</span>
                    </h4>
                    <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                      This subject covers fundamental concepts tailored for school students. Key focus topics include: {selectedSubject.topics.join(", ")}.
                    </p>
                  </div>
                </div>
              )}

              {activeDetailTab === "quiz" && (
                <div className="space-y-3 text-center py-6">
                  <Award className="w-12 h-12 text-indigo-500 mx-auto animate-bounce" />
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedSubject.name} Knowledge Check
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Test your understanding with quick interactive multiple-choice questions!
                  </p>
                  <button
                    onClick={() => {
                      setSelectedSubject(null);
                      onOpenAITutor(selectedSubject.name);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Start {selectedSubject.name} AI Quiz
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  const subjectName = selectedSubject.name;
                  setSelectedSubject(null);
                  onOpenAITutor(subjectName);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors flex items-center space-x-2"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Tutor about {selectedSubject.name}</span>
              </button>

              <button
                onClick={() => setSelectedSubject(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

