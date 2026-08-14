import React, { useState } from "react";
import {
  GRADE_STANDARDS,
  SYLLABUS_OPTIONS,
  SyllabusOption,
  LessonModule,
} from "../data/educationData";
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
  ExternalLink,
  FolderTree,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Split,
  Eye,
  FileCode,
  Table as TableIcon,
  ChevronDown,
  ChevronUp,
  Brain,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  Award,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface BookLibraryTabProps {
  onOpenAITutor: (context?: string) => void;
}

interface AISummaryResult {
  executiveSummary: string[];
  keyTerms: { term: string; definition: string; example: string }[];
  quizQuestions: {
    id: string;
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }[];
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

export const BookLibraryTab: React.FC<BookLibraryTabProps> = ({
  onOpenAITutor,
}) => {
  // State variables
  const [selectedBoard, setSelectedBoard] = useState<string>("ALL");
  const [selectedGrade, setSelectedGrade] = useState<string>("7th Standard");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedBook, setSelectedBook] = useState<SyllabusOption | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [activeSplitPageIndex, setActiveSplitPageIndex] = useState<number>(0);

  const [showArchitectureTable, setShowArchitectureTable] = useState<boolean>(true);
  const [showFolderTree, setShowFolderTree] = useState<boolean>(false);
  const [bookmarkedModules, setBookmarkedModules] = useState<Set<string>>(new Set());

  // AI Summarize State
  const [showSummarizeModal, setShowSummarizeModal] = useState<boolean>(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<AISummaryResult | null>(null);
  const [activeSummaryTab, setActiveSummaryTab] = useState<"summary" | "terms" | "quiz">("summary");
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<string, number>>({});
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Filtered books
  const filteredBooks = SYLLABUS_OPTIONS.filter((book) => {
    const matchesBoard =
      selectedBoard === "ALL" || book.board === selectedBoard;
    const matchesGrade =
      selectedGrade === "ALL" ||
      !book.gradeStandard ||
      book.gradeStandard === selectedGrade;
    const matchesSubject =
      selectedSubject === "ALL" ||
      book.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesQuery =
      searchQuery.trim() === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.board.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.chapters.some((ch) =>
        ch.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesBoard && matchesGrade && matchesSubject && matchesQuery;
  });

  const toggleBookmark = (moduleId: string) => {
    setBookmarkedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleGenerateSummary = async (customModule?: LessonModule) => {
    if (!selectedBook) return;
    const targetModule = customModule || selectedBook.chapters[activeModuleIndex];
    if (!targetModule) return;

    setShowSummarizeModal(true);
    setIsGeneratingSummary(true);
    setSummaryError(null);
    setUserQuizAnswers({});
    setActiveSummaryTab("summary");

    try {
      const response = await fetch("/api/ai/summarize-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookTitle: selectedBook.title,
          board: selectedBook.board,
          subject: selectedBook.subject,
          grade: selectedGrade,
          moduleTitle: targetModule.title,
          moduleSummary: targetModule.summary,
          splitPages: targetModule.splitPages,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate AI summary.");
      }

      const data: AISummaryResult = await response.json();
      setSummaryData(data);
    } catch (err: any) {
      console.error("Error generating AI summary:", err);
      setSummaryError(err.message || "An unexpected error occurred while analyzing the PDF.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleCopySummary = () => {
    if (!summaryData || !selectedBook) return;
    const currentModule = selectedBook.chapters[activeModuleIndex];
    
    let textToCopy = `📚 AI PDF SUMMARY: ${selectedBook.title} - ${currentModule?.title || ""}\n`;
    textToCopy += `Board: ${selectedBook.board} | Grade: ${selectedGrade} | Subject: ${selectedBook.subject}\n\n`;
    textToCopy += `--- 📌 EXECUTIVE SUMMARY ---\n`;
    summaryData.executiveSummary?.forEach((item, idx) => {
      textToCopy += `${idx + 1}. ${item}\n`;
    });

    if (summaryData.keyTerms?.length) {
      textToCopy += `\n--- 🔤 KEY TERMINOLOGY ---\n`;
      summaryData.keyTerms.forEach((kt) => {
        textToCopy += `• ${kt.term}: ${kt.definition} (e.g. ${kt.example})\n`;
      });
    }

    if (summaryData.quizQuestions?.length) {
      textToCopy += `\n--- ❓ PRACTICE QUIZ QUESTIONS ---\n`;
      summaryData.quizQuestions.forEach((q, idx) => {
        textToCopy += `Q${idx + 1}: ${q.question}\n`;
        q.options.forEach((opt, oIdx) => {
          textToCopy += `   ${String.fromCharCode(65 + oIdx)}) ${opt}\n`;
        });
        textToCopy += `   Answer: ${q.options[q.answerIndex]}\n\n`;
      });
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn text-slate-800 dark:text-slate-100">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl border border-white/20">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-white border border-white/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Book Library & Split PDF Repository</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Multi-Syllabus Digital Library
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            Explore structured textbook collections across Karnataka State Board (KSEEB), NCERT (New NCF Series), D-CODE Series, and Cambridge Curriculum. View split PDF lesson modules, official download procurement links, and page-by-page reader split views.
          </p>

          {/* Quick Breadcrumb Cloud Storage Path */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs font-mono bg-black/20 p-2.5 rounded-xl border border-white/10 text-white/90">
            <span className="text-emerald-300 font-bold">☁️ Cloud Storage:</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10">
              {selectedBoard === "ALL" ? "[Syllabus Board]" : selectedBoard}
            </span>
            <span>/</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10">{selectedGrade}</span>
            <span>/</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10">
              {selectedSubject === "ALL" ? "[Subject]" : selectedSubject}
            </span>
            <span>/</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10">
              [Book Title]
            </span>
            <span>/</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-amber-300 font-bold">
              [Lesson PDFs]
            </span>
          </div>
        </div>
      </div>

      {/* Official Procurement Links Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black uppercase tracking-wide">
              Official Source Procurement Portals
            </h3>
          </div>
          <span className="text-[11px] text-slate-300">
            Procure full-text PDFs directly from accredited board repositories
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <a
            href="https://ncert.nic.in/textbook.php"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-black text-amber-300">NCERT Official Portal</p>
              <p className="text-[10px] text-slate-300">Ganita Prakash, Curiosity, Malhar</p>
            </div>
            <ExternalLink className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="https://ktbs.kar.nic.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-black text-amber-300">KTBS Karnataka Portal</p>
              <p className="text-[10px] text-slate-300">Siri & Tili Kannada Textbooks</p>
            </div>
            <ExternalLink className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="https://www.cambridge.org/education"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-black text-sky-300">Cambridge Repository</p>
              <p className="text-[10px] text-slate-300">Cambridge Global Series</p>
            </div>
            <ExternalLink className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="https://www.google.com/search?q=D-CODE+Computer+Science+Textbook"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-black text-fuchsia-300">D-CODE Series Portal</p>
              <p className="text-[10px] text-slate-300">Computer Science & Coding</p>
            </div>
            <ExternalLink className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Digital Library Architecture Comparison Table (Toggleable) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TableIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Digital Library Syllabus Architecture Matrix
            </h2>
          </div>

          <button
            onClick={() => setShowArchitectureTable(!showArchitectureTable)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 transition-colors flex items-center space-x-1"
          >
            <span>{showArchitectureTable ? "Hide Overview Table" : "Show Overview Table"}</span>
            {showArchitectureTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showArchitectureTable && (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 rounded-l-xl">Syllabus / Board</th>
                  <th className="p-3">Textbook Name</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Content Structure</th>
                  <th className="p-3 rounded-r-xl">Procurement Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-extrabold text-amber-700 dark:text-amber-400">
                    Karnataka State Board (KSEEB)
                  </td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">Siri Kannada</td>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">Kannada (1st Language)</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">Prose, Poetry, Grammar, Supplementary Readings</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                      KTBS Portal
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-extrabold text-amber-700 dark:text-amber-400">
                    Karnataka State Board (KSEEB)
                  </td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">Tili Kannada</td>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">Kannada (2nd / 3rd Language)</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">Simplified Prose, Basic Grammar, Worksheets</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 font-bold text-[10px]">
                      KTBS Portal
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-extrabold text-emerald-700 dark:text-emerald-400">
                    NCERT (Class 7 New NCF)
                  </td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">Ganita Prakash (गणित प्रकाश)</td>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">Mathematics (7th Standard NCERT)</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">Class 7 NCERT Math Units, Worked Examples, Practice PDFs</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                      NCERT Portal (Class 7)
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-extrabold text-cyan-700 dark:text-cyan-400">
                    NCERT (New NCF Series)
                  </td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">Curiosity</td>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">Science</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">Concept Modules, Lab Activities, Chapter PDFs</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 font-bold text-[10px]">
                      NCERT Portal
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-extrabold text-purple-700 dark:text-purple-400">
                    NCERT (New NCF Series)
                  </td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">Exploring Society: India and Beyond</td>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">Social Science</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">History, Geography, Political Life Integrated Chapters</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-bold text-[10px]">
                      NCERT Portal
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-extrabold text-rose-700 dark:text-rose-400">
                    NCERT (Class 7 New NCF)
                  </td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">Malhar (मल्हार)</td>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">Hindi (7th Standard NCERT)</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">Class 7 NCERT Prose, Poetry Verse, Vocabulary Guides</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 font-bold text-[10px]">
                      NCERT Portal (Class 7)
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-extrabold text-fuchsia-700 dark:text-fuchsia-400">
                    D-CODE Series
                  </td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">D-CODE</td>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">Computer Science / Coding</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">Logic Building, Programming Exercises, Project PDFs</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950/80 text-fuchsia-800 dark:text-fuchsia-300 font-bold text-[10px]">
                      D-CODE Portal
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-extrabold text-indigo-700 dark:text-indigo-400">
                    Cambridge Curriculum
                  </td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">Cambridge Global Series</td>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">English / Science / Math</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">International Core Units, Activity Pages, Assessments</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 font-bold text-[10px]">
                      Cambridge Repository
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FILTER BAR: Syllabus Board Tabs, Grade Standard, Subject, and Search */}
      <div className="space-y-4">
        {/* Board Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            <span>Select Syllabus / Board:</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              "ALL",
              "Karnataka State Board (KSEEB)",
              "NCERT (New NCF Series)",
              "D-CODE Series",
              "Cambridge Curriculum",
            ].map((board) => {
              const isSelected = selectedBoard === board;
              return (
                <button
                  key={board}
                  onClick={() => setSelectedBoard(board)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-lg scale-105"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                  }`}
                >
                  {board === "ALL" ? "All Syllabuses & Boards" : board}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Folder View Toggle Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search textbook title, subject, board, or lesson module keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFolderTree(!showFolderTree)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 border transition-all ${
                showFolderTree
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              }`}
            >
              <FolderTree className="w-4 h-4 text-indigo-500" />
              <span>{showFolderTree ? "Switch to Grid View" : "View Directory Folder Tree"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* STEP 1: Grade / Class Selection Grid (1st to 12th Standard) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Target Grade / Class Level</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pick your grade standard from 1st to 12th Standard to align lesson difficulty.
            </p>
          </div>

          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
            Selected Grade: {selectedGrade}
          </span>
        </div>

        {/* 12 Grade Option Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {GRADE_STANDARDS.map((grade) => {
            const isSelected = selectedGrade === grade.name;

            return (
              <button
                key={grade.id}
                onClick={() => setSelectedGrade(grade.name)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-20 ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md scale-102"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span
                    className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                        : "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                    }`}
                  >
                    {grade.badge}
                  </span>

                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                <span className="text-xs font-black tracking-tight">{grade.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Tree View (If Toggled) */}
      {showFolderTree && (
        <div className="p-6 bg-slate-900 text-emerald-300 rounded-3xl border border-slate-800 font-mono text-xs space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-white border-b border-slate-800 pb-3">
            <FolderTree className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm">Library Directory Tree: [Syllabus] ➔ [Grade] ➔ [Subject] ➔ [Book] ➔ [PDFs]</h3>
          </div>

          <div className="space-y-2 pl-2">
            <p className="text-amber-300">📁 /library_storage_root/</p>
            {filteredBooks.map((book) => (
              <div key={book.id} className="pl-4 space-y-1 border-l border-slate-800 py-1">
                <p className="text-indigo-300 font-bold">
                  📁 [{book.board}] ➔ 📁 [{selectedGrade}] ➔ 📁 [{book.subject}]
                </p>
                <div className="pl-4 space-y-1">
                  <p className="text-white font-bold">📘 {book.title} ({book.contentStructure})</p>
                  <div className="pl-4 space-y-0.5">
                    {book.chapters.map((ch) => (
                      <p key={ch.id} className="text-slate-300 text-[11px] flex items-center space-x-2">
                        <FileText className="w-3 h-3 text-amber-400" />
                        <span>📄 {ch.pdfFileName} ({ch.pageRange} • {ch.moduleType})</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEXTBOOK GRID */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span>Digital Textbooks ({filteredBooks.length} Available)</span>
          </h2>

          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Showing Grade: {selectedGrade}
          </span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No textbooks found matching your current filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedBoard("ALL");
                setSelectedSubject("ALL");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredBooks.map((book) => {
              const IconComp = ICON_MAP[book.iconName] || BookOpen;

              return (
                <div
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setActiveModuleIndex(0);
                    setActiveSplitPageIndex(0);
                  }}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Poster Gradient */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${book.gradient}`}
                  />

                  <div className="space-y-4 pt-1">
                    {/* Icon & Badge */}
                    <div className="flex justify-between items-start gap-2">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${book.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0`}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${book.badgeColor} text-right`}
                      >
                        {book.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        {book.board}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        Subject: {book.subject}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
                        {book.description}
                      </p>

                      {/* Content Structure Pills */}
                      <div className="pt-2 flex flex-wrap gap-1">
                        {book.contentStructure.split(", ").map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Card Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                      {book.chapters.length} PDF Modules
                    </span>

                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Explore Lessons</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Lesson PDF Reader & Page Split Viewer Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            {/* Header */}
            <div
              className={`p-5 sm:p-6 bg-gradient-to-r ${selectedBook.gradient} text-white flex items-center justify-between shadow-md`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase">
                    {selectedBook.board}
                  </span>
                  <span className="text-xs font-bold text-white/90">
                    {selectedGrade} • {selectedBook.subject}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black">
                  {selectedBook.title}
                </h3>
                <p className="text-xs text-white/90 font-medium">
                  Content Structure: {selectedBook.contentStructure}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={selectedBook.procurementUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center space-x-1"
                  title="Procure from Official Portal"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{selectedBook.procurementName}</span>
                </a>

                <button
                  onClick={() => setSelectedBook(null)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Book Reader Layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Left Module Navigation Sidebar */}
              <div className="md:col-span-4 p-4 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800 overflow-y-auto space-y-3">
                <div className="flex justify-between items-center px-1">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">
                    Split Lesson Modules ({selectedBook.chapters.length})
                  </p>
                  <span className="text-[10px] text-indigo-500 font-bold">
                    PDF Split Page Engine
                  </span>
                </div>

                {selectedBook.chapters.map((mod, idx) => {
                  const isBookmarked = bookmarkedModules.has(mod.id);

                  return (
                    <div
                      key={mod.id}
                      onClick={() => {
                        setActiveModuleIndex(idx);
                        setActiveSplitPageIndex(0);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all border cursor-pointer space-y-1.5 ${
                        activeModuleIndex === idx
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-xs line-clamp-2 leading-snug">
                          {mod.title}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(mod.id);
                          }}
                          className={`p-1 rounded-md ${
                            activeModuleIndex === idx
                              ? "text-amber-300"
                              : "text-slate-400 hover:text-amber-500"
                          }`}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-300 fill-amber-300" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] opacity-90 pt-1 border-t border-white/10">
                        <span className="font-black px-2 py-0.5 rounded bg-black/10">
                          {mod.moduleType}
                        </span>
                        <span>{mod.pageRange} ({mod.pages} Pages)</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Module Reader & Split Page Viewer */}
              <div className="md:col-span-8 p-6 overflow-y-auto space-y-6">
                {selectedBook.chapters[activeModuleIndex] && (
                  <div className="space-y-5">
                    {/* Active Module Header */}
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase">
                            {selectedBook.chapters[activeModuleIndex].moduleType}
                          </span>
                          <span className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-bold">
                            📄 {selectedBook.chapters[activeModuleIndex].pdfFileName}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-indigo-950 dark:text-indigo-100 pt-1">
                          {selectedBook.chapters[activeModuleIndex].title}
                        </h4>
                      </div>

                      <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 text-xs font-black shadow-sm self-start sm:self-auto shrink-0 border border-indigo-100 dark:border-indigo-900">
                        {selectedBook.chapters[activeModuleIndex].pageRange}
                      </span>
                    </div>

                    {/* Summary */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 space-y-2 text-xs sm:text-sm">
                      <p className="font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Lesson Module Executive Summary:</span>
                      </p>
                      <p className="leading-relaxed">
                        {selectedBook.chapters[activeModuleIndex].summary}
                      </p>
                    </div>

                    {/* PDF Page Splitting Viewer Tab */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                        <h5 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
                          <Split className="w-4 h-4 text-indigo-500" />
                          <span>Split Page-by-Page Digital Viewer</span>
                        </h5>
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          Individual Page Excerpts
                        </span>
                      </div>

                      {/* Split Page Tabs */}
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {selectedBook.chapters[activeModuleIndex].splitPages.map(
                          (page, pIdx) => (
                            <button
                              key={page.pageNumber}
                              onClick={() => setActiveSplitPageIndex(pIdx)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                                activeSplitPageIndex === pIdx
                                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                              }`}
                            >
                              Page {page.pageNumber}
                            </button>
                          )
                        )}
                      </div>

                      {/* Active Split Page Card */}
                      {selectedBook.chapters[activeModuleIndex].splitPages[
                        activeSplitPageIndex
                      ] && (
                        <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-3">
                          <div className="flex justify-between items-center">
                            <h6 className="text-xs font-black text-amber-900 dark:text-amber-200">
                              {
                                selectedBook.chapters[activeModuleIndex]
                                  .splitPages[activeSplitPageIndex].title
                              }
                            </h6>

                            <span className="px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/60 text-[10px] font-mono text-amber-900 dark:text-amber-200 font-bold">
                              Split PDF Page #{selectedBook.chapters[activeModuleIndex].splitPages[activeSplitPageIndex].pageNumber}
                            </span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 text-xs font-serif leading-relaxed text-slate-800 dark:text-slate-200">
                            "{selectedBook.chapters[activeModuleIndex].splitPages[activeSplitPageIndex].excerpt}"
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => handleGenerateSummary()}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-600 text-white font-black text-xs hover:opacity-90 transition-all flex items-center space-x-2 shadow-md hover:scale-105"
                      >
                        <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                        <span>AI Summarize PDF</span>
                      </button>

                      <button
                        onClick={() => {
                          const contextStr = `${selectedBook.title} - ${selectedBook.chapters[activeModuleIndex].title}`;
                          setSelectedBook(null);
                          onOpenAITutor(contextStr);
                        }}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs hover:opacity-90 transition-all flex items-center space-x-2 shadow-md"
                      >
                        <Bot className="w-4 h-4" />
                        <span>Explain Lesson with AI Tutor</span>
                      </button>

                      <button
                        onClick={() =>
                          alert(
                            `Downloading split lesson PDF: ${selectedBook.chapters[activeModuleIndex].pdfFileName}...`
                          )
                        }
                        className="px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition-colors flex items-center space-x-2 border border-indigo-200 dark:border-indigo-800"
                      >
                        <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Download Split Lesson PDF</span>
                      </button>

                      <a
                        href={selectedBook.procurementUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-colors flex items-center space-x-2 border border-slate-200 dark:border-slate-700"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-500" />
                        <span>Procure Full Book on {selectedBook.procurementName}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Summarize Modal */}
      {showSummarizeModal && selectedBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-lg animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span>Gemini 3.5 Flash Engine</span>
                  </span>
                  <span className="text-xs text-amber-200 font-bold">
                    {selectedBook.board} • {selectedGrade}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black">
                  AI PDF Summary & Quiz
                </h3>
                <p className="text-xs text-white/90 font-medium">
                  Book: {selectedBook.title} — {selectedBook.chapters[activeModuleIndex]?.title}
                </p>
              </div>

              <button
                onClick={() => setShowSummarizeModal(false)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isGeneratingSummary ? (
                <div className="p-12 text-center space-y-4 my-auto">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-500/30 animate-ping" />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg text-white">
                      <Brain className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      Analyzing Textbook PDF Content...
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      Gemini AI is scanning page excerpts from <span className="font-bold text-indigo-600">{selectedBook.chapters[activeModuleIndex]?.title}</span> to construct concise summaries, key terminology definitions, and practice quiz questions.
                    </p>
                  </div>
                </div>
              ) : summaryError ? (
                <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/30 rounded-3xl border border-rose-200 dark:border-rose-900 space-y-3">
                  <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                  <h4 className="text-base font-black text-rose-900 dark:text-rose-200">
                    Summarization Error
                  </h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">
                    {summaryError}
                  </p>
                  <button
                    onClick={() => handleGenerateSummary()}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors inline-flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Generation</span>
                  </button>
                </div>
              ) : summaryData ? (
                <div className="space-y-6">
                  {/* Tab Navigation */}
                  <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2 gap-2 overflow-x-auto">
                    <button
                      onClick={() => setActiveSummaryTab("summary")}
                      className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
                        activeSummaryTab === "summary"
                          ? "bg-amber-500 text-white shadow-md"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Concise Summary ({summaryData.executiveSummary?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => setActiveSummaryTab("terms")}
                      className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
                        activeSummaryTab === "terms"
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Key Terminology ({summaryData.keyTerms?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => setActiveSummaryTab("quiz")}
                      className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
                        activeSummaryTab === "quiz"
                          ? "bg-purple-600 text-white shadow-md"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Practice Quiz ({summaryData.quizQuestions?.length || 0})</span>
                    </button>
                  </div>

                  {/* TAB 1: EXECUTIVE SUMMARY */}
                  {activeSummaryTab === "summary" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-black text-amber-950 dark:text-amber-200">
                            High-Yield Textbook Takeaways
                          </h4>
                          <p className="text-[11px] text-amber-800 dark:text-amber-300">
                            Core learning objectives synthesized directly from textbook PDF split pages
                          </p>
                        </div>
                        <button
                          onClick={handleCopySummary}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-700 flex items-center space-x-1 hover:bg-amber-100 transition-colors shrink-0"
                        >
                          {copiedSummary ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Summary</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-3">
                        {summaryData.executiveSummary?.map((point, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start space-x-3"
                          >
                            <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                              {pIdx + 1}
                            </span>
                            <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                              {point}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: KEY TERMINOLOGY GLOSSARY */}
                  {activeSummaryTab === "terms" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50">
                        <h4 className="text-sm font-black text-indigo-950 dark:text-indigo-200">
                          Syllabus Key Terminology & Definitions
                        </h4>
                        <p className="text-[11px] text-indigo-800 dark:text-indigo-300">
                          Essential definitions and contextual examples for exams
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {summaryData.keyTerms?.map((kt, ktIdx) => (
                          <div
                            key={ktIdx}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 flex flex-col justify-between"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                <h5 className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                                  {kt.term}
                                </h5>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {kt.definition}
                              </p>
                            </div>

                            {kt.example && (
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 italic">
                                <span className="font-bold text-indigo-500 not-italic">Example: </span>
                                "{kt.example}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PRACTICE QUIZ */}
                  {activeSummaryTab === "quiz" && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <h4 className="text-sm font-black text-purple-950 dark:text-purple-200">
                            Interactive Practice Quiz
                          </h4>
                          <p className="text-[11px] text-purple-800 dark:text-purple-300">
                            Select an option to test your comprehension and reveal instant feedback.
                          </p>
                        </div>

                        {/* Score pill */}
                        {Object.keys(userQuizAnswers).length > 0 && (
                          <div className="px-3.5 py-1.5 rounded-full bg-purple-600 text-white text-xs font-black flex items-center space-x-1.5 shadow-sm self-start sm:self-auto">
                            <Award className="w-4 h-4 text-amber-300" />
                            <span>
                              Score: {
                                summaryData.quizQuestions.filter(
                                  (q) => userQuizAnswers[q.id] === q.answerIndex
                                ).length
                              } / {summaryData.quizQuestions.length}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        {summaryData.quizQuestions?.map((q, qIdx) => {
                          const selectedOpt = userQuizAnswers[q.id];
                          const isAnswered = selectedOpt !== undefined;
                          const isCorrect = isAnswered && selectedOpt === q.answerIndex;

                          return (
                            <div
                              key={q.id || qIdx}
                              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                                  <span className="text-indigo-600 dark:text-indigo-400 font-black mr-1">
                                    Q{qIdx + 1}.
                                  </span>
                                  {q.question}
                                </h5>

                                {isAnswered && (
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center space-x-1 shrink-0 ${
                                      isCorrect
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                                        : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
                                    }`}
                                  >
                                    {isCorrect ? (
                                      <>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>Correct</span>
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                        <span>Incorrect</span>
                                      </>
                                    )}
                                  </span>
                                )}
                              </div>

                              {/* Options */}
                              <div className="grid grid-cols-1 gap-2">
                                {q.options?.map((opt, oIdx) => {
                                  const isSelected = selectedOpt === oIdx;
                                  const isThisCorrect = oIdx === q.answerIndex;

                                  let btnStyle = "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400";
                                  if (isAnswered) {
                                    if (isThisCorrect) {
                                      btnStyle = "bg-emerald-500 text-white border-emerald-600 font-bold shadow-sm";
                                    } else if (isSelected && !isThisCorrect) {
                                      btnStyle = "bg-rose-500 text-white border-rose-600 font-bold";
                                    } else {
                                      btnStyle = "opacity-50 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500";
                                    }
                                  }

                                  return (
                                    <button
                                      key={oIdx}
                                      onClick={() => {
                                        setUserQuizAnswers((prev) => ({
                                          ...prev,
                                          [q.id]: oIdx,
                                        }));
                                      }}
                                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                                    >
                                      <span>
                                        <span className="font-mono font-bold mr-2">
                                          {String.fromCharCode(65 + oIdx)}.
                                        </span>
                                        {opt}
                                      </span>

                                      {isAnswered && isThisCorrect && (
                                        <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Explanation */}
                              {isAnswered && (
                                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs space-y-1 animate-fadeIn">
                                  <p className="font-black text-indigo-900 dark:text-indigo-200 flex items-center space-x-1">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Step-by-Step Explanation:</span>
                                  </p>
                                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {q.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleGenerateSummary()}
                disabled={isGeneratingSummary}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingSummary ? "animate-spin" : ""}`} />
                <span>Re-analyze PDF</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (selectedBook) {
                      const contextStr = `AI Summary Context for ${selectedBook.title} - ${selectedBook.chapters[activeModuleIndex]?.title}: ${summaryData?.executiveSummary?.join("; ")}`;
                      setShowSummarizeModal(false);
                      setSelectedBook(null);
                      onOpenAITutor(contextStr);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition-all flex items-center space-x-1.5 shadow"
                >
                  <Bot className="w-4 h-4" />
                  <span>Discuss in AI Tutor</span>
                </button>

                <button
                  onClick={() => setShowSummarizeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-black hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
