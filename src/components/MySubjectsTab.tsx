import React, { useState, useEffect } from "react";
import { SUBJECTS_LIST, SubjectItem, SYLLABUS_OPTIONS, SyllabusOption } from "../data/educationData";
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
  Upload,
  Trash2,
  Eye,
  Download,
  Plus,
  FolderOpen,
  FileCheck,
  FilePlus,
  Paperclip,
  AlertCircle,
} from "lucide-react";
import {
  getUploadedPDFs,
  getUploadedPDFsForSubject,
  saveUploadedPDF,
  deleteUploadedPDF,
  formatFileSize,
  HINDI_7TH_SPLIT_PAGES,
} from "../utils/pdfStorage";
import { UploadedSubjectPDF } from "../types";
import { PDFViewerModal } from "./PDFViewerModal";

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
  const [activeDetailTab, setActiveDetailTab] = useState<"chapters" | "pdfs" | "notes" | "quiz">("chapters");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "all-topics">("grid");

  // PDF Storage & Upload State
  const [allUploadedPDFs, setAllUploadedPDFs] = useState<UploadedSubjectPDF[]>([]);
  const [uploadCategory, setUploadCategory] = useState<UploadedSubjectPDF["category"]>("Notes");
  const [uploadDescription, setUploadDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [viewerPDF, setViewerPDF] = useState<any | null>(null);

  // Load uploaded PDFs from localStorage on mount
  useEffect(() => {
    setAllUploadedPDFs(getUploadedPDFs());
  }, []);

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

  // Handle PDF file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedSubject) return;

    setIsUploading(true);
    setUploadSuccessMessage(null);

    const fileList: File[] = Array.from(files);
    let processedCount = 0;

    fileList.forEach((file) => {
      if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
        alert("Please select a PDF document file (.pdf).");
        setIsUploading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newPDF: UploadedSubjectPDF = {
          id: "pdf-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
          subjectId: selectedSubject.id,
          subjectName: selectedSubject.name,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          uploadDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          fileDataUrl: dataUrl,
          category: uploadCategory,
          description: uploadDescription.trim() || `Uploaded document for ${selectedSubject.name}`,
          previewText: `Document Name: ${file.name}\nSubject: ${selectedSubject.name} (${selectedSubject.code})\nUploaded on: ${new Date().toLocaleString()}`,
        };

        const updated = saveUploadedPDF(newPDF);
        setAllUploadedPDFs(updated);

        processedCount++;
        if (processedCount === fileList.length) {
          setUploadSuccessMessage(`Successfully uploaded ${fileList.length} PDF file(s) to ${selectedSubject.name}!`);
          setIsUploading(false);
          setUploadDescription("");
          // Reset file input
          e.target.value = "";
        }
      };

      reader.onerror = () => {
        alert("An error occurred while reading the file.");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    });
  };

  // Handle PDF Deletion
  const handleDeletePDF = (pdfId: string, pdfName: string) => {
    if (confirm(`Are you sure you want to delete "${pdfName}" from this subject?`)) {
      const updated = deleteUploadedPDF(pdfId);
      setAllUploadedPDFs(updated);
    }
  };

  // Quick Add Sample PDF for the currently active subject
  const handleQuickAddSamplePDF = () => {
    if (!selectedSubject) return;

    const isMaths = selectedSubject.id.toLowerCase() === "maths";
    const isHindi = selectedSubject.id.toLowerCase() === "hindi";

    let sampleName = `${selectedSubject.name}_Class7_Study_Notes_and_Practice_Set.pdf`;
    if (isMaths) {
      sampleName = "7th_Standard_Mathematics_Part_2_Textbook.pdf";
    } else if (isHindi) {
      sampleName = "7th_Standard_Hindi_NCERT_Full_Textbook.pdf";
    }

    const mathsSplitPages = [
      {
        pageNumber: 1,
        title: "Page 1: Chapter 7 - Comparing Quantities (Percentages, Profit & Loss, Simple Interest)",
        excerpt: `Ratio & Percentage Conversions:
• Ratio: Comparison of two quantities in identical units (e.g. 5 m to 25 cm = 500 cm : 25 cm = 20 : 1).
• Fraction to Percentage: (3/5) × 100% = 60%.

Profit & Loss Calculations:
• Profit = SP - CP | Profit % = (Profit / CP) × 100
• Loss = CP - SP | Loss % = (Loss / CP) × 100

Simple Interest Formula:
• SI = (P × R × T) / 100
• Total Amount = P + SI
Worked Example: Principal P = ₹4,000, Rate R = 5% per annum, Time T = 3 years.
SI = (4000 × 5 × 3) / 100 = ₹600. Total Repayment Amount = ₹4,000 + ₹600 = ₹4,600.`,
      },
      {
        pageNumber: 2,
        title: "Page 2: Chapter 8 - Rational Numbers & Arithmetic Operations",
        excerpt: `Definition of Rational Numbers:
• Any number written as p/q where p, q are integers and q ≠ 0.
• Positive Rational (3/7, -4/-9) and Negative Rational (-5/8, 2/-3).
• Standard Form: -15/35 reduces to -3/7 (coprime and positive denominator).

Arithmetic Operations:
• Addition: (-7/5) + (2/3) = (-21 + 10) / 15 = -11/15.
• Multiplication: (4/9) × (-3/8) = (4 × -3) / (9 × 8) = -12/72 = -1/6.
• Division: (2/7) ÷ (-4/21) = (2/7) × (21/-4) = 42/-28 = -3/2 = -1 1/2.`,
      },
      {
        pageNumber: 3,
        title: "Page 3: Chapter 9 - Perimeter & Area (Parallelograms, Triangles & Circles)",
        excerpt: `Area Formulas:
• Area of Parallelogram = Base × Height (b × h).
  Example: Base = 8 cm, Height = 4.5 cm => Area = 8 × 4.5 = 36 cm².
• Area of Triangle = 1/2 × Base × Height = 1/2 × b × h.
  Example: Base = 6 cm, Height = 5 cm => Area = 1/2 × 6 × 5 = 15 cm².

Circle Measurements:
• Circumference = 2πr = πd (using π = 22/7).
• Area of Circle = πr².
Worked Problem: The diameter of a circular pipe is 14 cm.
Radius r = 7 cm.
Circumference = 2 × (22/7) × 7 = 44 cm.
Area = (22/7) × 7 × 7 = 154 cm².`,
      },
      {
        pageNumber: 4,
        title: "Page 4: Chapter 10 - Algebraic Expressions (Terms, Operations & Evaluation)",
        excerpt: `Terms, Factors & Coefficients:
• In expression 5x²y - 3xy + 7:
  Terms are 5x²y, -3xy, and 7.
  Coefficient of x²y is 5, coefficient of xy is -3.

Like vs Unlike Terms:
• Like terms: 4x² and -9x² (same variables with identical powers).
• Unlike terms: 4x² and 4x (different powers).

Addition & Evaluation:
• Sum of (3x² + 5x - 4) and (2x² - 8x + 7) = 5x² - 3x + 3.
• Evaluating: If a = 2, b = -3, find value of a² - 2ab + b²:
  = 2² - 2(2)(-3) + (-3)² = 4 - (-12) + 9 = 4 + 12 + 9 = 25.`,
      },
      {
        pageNumber: 5,
        title: "Page 5: Chapter 11 - Exponents & Powers (Laws of Exponents & Scientific Form)",
        excerpt: `Laws of Exponents:
1. a^m × a^n = a^(m + n)  =>  2³ × 2⁴ = 2⁷ = 128
2. a^m ÷ a^n = a^(m - n)  =>  5⁶ ÷ 5² = 5⁴ = 625
3. (a^m)^n = a^(m × n)   =>  (3²)³ = 3⁶ = 729
4. a^m × b^m = (a × b)^m  =>  2³ × 5³ = 10³ = 1000
5. a⁰ = 1                =>  7⁰ = 1, (100)⁰ = 1

Scientific Notation (Standard Form):
• Speed of Light = 300,000,000 m/s = 3.0 × 10⁸ m/s.
• Population of country = 1,380,000,000 = 1.38 × 10⁹.`,
      },
      {
        pageNumber: 6,
        title: "Page 6: Chapter 12 - Symmetry (Line Symmetry & Rotational Symmetry)",
        excerpt: `Line Symmetry:
• Equilateral Triangle: 3 lines of symmetry
• Square: 4 lines of symmetry (2 medians, 2 diagonals)
• Rectangle: 2 lines of symmetry
• Circle: Infinite lines of symmetry passing through center.

Rotational Symmetry:
• Center of Rotation: The fixed point around which rotation occurs.
• Angle of Rotation: 90° for square, 120° for equilateral triangle, 180° for rectangle.
• Order of Rotational Symmetry:
  Square = Order 4 | Equilateral Triangle = Order 3 | Rectangle = Order 2 | Circle = Infinite order.`,
      },
      {
        pageNumber: 7,
        title: "Page 7: Chapter 13 - Visualising Solid Shapes & Euler's Formula",
        excerpt: `3D Shapes: Faces, Vertices & Edges:
• Faces (F): Flat surfaces of the 3D solid.
• Vertices (V): Corner points where edges meet.
• Edges (E): Line segments where faces intersect.

Euler's Formula: F + V - E = 2
1. Cube / Cuboid: F = 6, V = 8, E = 12 => 6 + 8 - 12 = 2.
2. Triangular Prism: F = 5, V = 6, E = 9 => 5 + 6 - 9 = 2.
3. Square Pyramid: F = 5, V = 5, E = 8 => 5 + 5 - 8 = 2.

Nets of Solids:
• A net is a 2D foldable blueprint of a 3D solid (e.g. 6 connected squares fold into a cube).`,
      },
    ];

    let resolvedFileSize = "1.9 MB";
    let resolvedPageCount = 24;
    let resolvedDescription = `Uploaded Study PDF Document for 7th Standard ${selectedSubject.name}`;
    let resolvedCategory: UploadedSubjectPDF["category"] = uploadCategory || "Notes";
    let resolvedPreviewText = `7TH STANDARD ${selectedSubject.name.toUpperCase()} - REVISION & STUDY PDF\n\nSubject: ${selectedSubject.name} (${selectedSubject.code})\nCategory: ${uploadCategory || "Notes"}`;
    let resolvedSplitPages = undefined;

    if (isMaths) {
      resolvedFileSize = "7.4 MB";
      resolvedPageCount = 148;
      resolvedCategory = "Textbook";
      resolvedDescription = "Official 7th Standard Mathematics Part 2 Textbook (NCERT / State Board) covering Chapters 7 to 13 with solved examples.";
      resolvedPreviewText = `7TH STANDARD MATHEMATICS (PART 2) TEXTBOOK\nSYLLABUS FOR CLASS 7 (PART 2):\n• Chapter 7: Comparing Quantities\n• Chapter 8: Rational Numbers\n• Chapter 9: Perimeter and Area\n• Chapter 10: Algebraic Expressions\n• Chapter 11: Exponents and Powers\n• Chapter 12: Symmetry\n• Chapter 13: Visualising Solid Shapes`;
      resolvedSplitPages = mathsSplitPages;
    } else if (isHindi) {
      resolvedFileSize = "8.6 MB";
      resolvedPageCount = 164;
      resolvedCategory = "Textbook";
      resolvedDescription = "Official 7th Standard NCERT Hindi Literature & Grammar Textbook (वसंत भाग-2 एवं मल्हार सम्पूर्ण गाइड).";
      resolvedPreviewText = `कक्षा 7 हिंदी (वसंत भाग-2 एवं मल्हार) सम्पूर्ण एनसीईआरटी पाठ्यपुस्तक\n7TH STANDARD NCERT HINDI OFFICIAL FULL TEXTBOOK\n\nपाठ 1: हम पंछी उन्मुक्त गगन के\nपाठ 2: दादी माँ\nपाठ 3: हिमालय की बेटियाँ\nपाठ 4: कठपुतली\nपाठ 5: मिठाईवाला\nपाठ 6: रक्त और हमारा शरीर\nपाठ 7: पापा खो गए\nपाठ 8: शाम - एक किसान\nपाठ 11: रहीम के दोहे\nपाठ 13: एक तिनका\nव्याकरण: संधि, समास, कारक, काल, मुहावरे एवं पत्र लेखन।`;
      resolvedSplitPages = HINDI_7TH_SPLIT_PAGES;
    }

    const newPDF: UploadedSubjectPDF = {
      id: "pdf-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      fileName: sampleName,
      fileSize: resolvedFileSize,
      uploadDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      category: resolvedCategory,
      gradeStandard: "7th Standard",
      pageCount: resolvedPageCount,
      description: resolvedDescription,
      previewText: resolvedPreviewText,
      splitPages: resolvedSplitPages,
    };

    const updated = saveUploadedPDF(newPDF);
    setAllUploadedPDFs(updated);
    setUploadSuccessMessage(`Successfully uploaded "${sampleName}" to ${selectedSubject.name} PDF section!`);
  };

  // Get uploaded PDFs for currently selected subject
  const currentSubjectUploadedPDFs = selectedSubject
    ? allUploadedPDFs.filter((p) => p.subjectId.toLowerCase() === selectedSubject.id.toLowerCase())
    : [];

  // Get official textbook PDFs from SYLLABUS_OPTIONS matching current selected subject
  const currentSubjectOfficialTextbooks = selectedSubject
    ? SYLLABUS_OPTIONS.filter(
        (b) =>
          b.subject.toLowerCase().includes(selectedSubject.name.toLowerCase()) ||
          selectedSubject.name.toLowerCase().includes(b.subject.toLowerCase()) ||
          (selectedSubject.id === "maths" && b.id.includes("ganita")) ||
          (selectedSubject.id === "hindi" && b.id.includes("malhar")) ||
          (selectedSubject.id === "kannada" && b.id.includes("kannada")) ||
          (selectedSubject.id === "science" && b.id.includes("curiosity"))
      )
    : [];

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
              Click any subject to view topics, upload custom PDF study materials, and access NCERT/State Board digital textbooks.
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
            placeholder="Search subjects, PDFs, or topics (e.g. Maths, Kannada, Hindi, Cell...)"
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
                Click any subject card to view chapters, upload custom PDF notes, and access textbook PDFs.
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
                const subjPdfs = allUploadedPDFs.filter((p) => p.subjectId.toLowerCase() === subj.id.toLowerCase());
                const uploadedCount = subjPdfs.length;

                return (
                  <div
                    key={subj.id}
                    onClick={() => {
                      setSelectedSubject(subj);
                      setActiveDetailTab("chapters");
                    }}
                    className={`group relative overflow-hidden p-6 rounded-3xl border ${subj.borderAccent} bg-white dark:bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[260px]`}
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

                        <div className="flex items-center space-x-1.5">
                          {uploadedCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-[10px] flex items-center space-x-1 border border-purple-300 dark:border-purple-800">
                              <FileText className="w-3 h-3" />
                              <span>{uploadedCount} PDF{uploadedCount > 1 ? "s" : ""}</span>
                            </span>
                          )}
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${subj.bgLight} ${subj.textColor} border ${subj.borderAccent}`}>
                            {subj.code}
                          </span>
                        </div>
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

                    {/* Bottom Bar with Progress & Direct PDF Button */}
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

                      {/* Direct PDF Option Button */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubject(subj);
                            setActiveDetailTab("pdfs");
                          }}
                          className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 font-extrabold text-[11px] border border-purple-200 dark:border-purple-800 transition-colors flex items-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          <span>PDFs & Docs ({uploadedCount})</span>
                        </button>

                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center space-x-0.5">
                          <span>Open</span>
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

      {/* Mode 2: Master Topic Directory View */}
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

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSubject(subj);
                          setActiveDetailTab("pdfs");
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-xs hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors flex items-center space-x-1 border border-purple-200 dark:border-purple-800"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>PDF Option</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedSubject(subj);
                          setActiveDetailTab("chapters");
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors flex items-center space-x-1"
                      >
                        <span>Study {subj.name}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Topics Grid for this Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subj.topics.map((topic, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedSubject(subj);
                          setActiveDetailTab("chapters");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedSubject.gradient} text-white flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black shadow-inner text-base">
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

            {/* Sub-tabs Navigation inside Modal */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 pt-3 space-x-4 overflow-x-auto">
              <button
                onClick={() => setActiveDetailTab("chapters")}
                className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-2 shrink-0 ${
                  activeDetailTab === "chapters"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>All Syllabus Topics ({selectedSubject.topics.length})</span>
              </button>

              {/* PDF & UPLOADED DOCUMENTS OPTION TAB (HIGHLIGHTED) */}
              <button
                onClick={() => setActiveDetailTab("pdfs")}
                className={`pb-3 text-xs font-extrabold border-b-2 transition-colors flex items-center space-x-2 shrink-0 ${
                  activeDetailTab === "pdfs"
                    ? "border-purple-600 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <FileText className="w-4 h-4 text-purple-500" />
                <span>
                  📄 PDFs & Uploaded Docs ({currentSubjectUploadedPDFs.length + currentSubjectOfficialTextbooks.length})
                </span>
                {currentSubjectUploadedPDFs.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[10px] font-black">
                    {currentSubjectUploadedPDFs.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveDetailTab("notes")}
                className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-2 shrink-0 ${
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
                className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-2 shrink-0 ${
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
              
              {/* TAB 1: ALL SYLLABUS TOPICS */}
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

              {/* TAB 2: PDF DOCUMENTS & UPLOADER (THIS IS THE KEY REQUESTED FEATURE) */}
              {activeDetailTab === "pdfs" && (
                <div className="space-y-6">
                  
                  {viewerPDF ? (
                    <PDFViewerModal
                      pdf={viewerPDF}
                      inline={true}
                      onClose={() => setViewerPDF(null)}
                      onOpenAITutor={(ctx) => {
                        setViewerPDF(null);
                        setSelectedSubject(null);
                        onOpenAITutor(ctx);
                      }}
                    />
                  ) : (
                    <>
                      {/* Upload Success Alert */}
                      {uploadSuccessMessage && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-extrabold flex items-center justify-between animate-fadeIn">
                      <div className="flex items-center space-x-2">
                        <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{uploadSuccessMessage}</span>
                      </div>
                      <button
                        onClick={() => setUploadSuccessMessage(null)}
                        className="text-xs font-bold hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Upload PDF Section */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-slate-500/10 border-2 border-dashed border-purple-300 dark:border-purple-800/80 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                          <Upload className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span>Upload PDF File to {selectedSubject.name}</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Upload custom worksheets, class notes, or reference PDFs specifically for {selectedSubject.name}.
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          Category:
                        </label>
                        <select
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value as any)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                        >
                          <option value="Notes">Notes</option>
                          <option value="Homework">Homework</option>
                          <option value="Question Paper">Question Paper</option>
                          <option value="Textbook">Textbook</option>
                          <option value="Reference">Reference</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        placeholder={`Optional description (e.g. Chapter 3 Notes for ${selectedSubject.name})...`}
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />

                      <div className="relative flex items-center justify-center p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-purple-200 dark:border-purple-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group text-center">
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          multiple
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div className="space-y-2 pointer-events-none relative z-10">
                          <FilePlus className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                              {isUploading ? "Uploading PDF..." : `Click or Drag & Drop PDF files here`}
                            </p>
                            <p className="text-[10px] text-slate-500 font-semibold">
                              Supports standard PDF files for {selectedSubject.name}. Saved locally to your subject folder.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleQuickAddSamplePDF}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-colors flex items-center space-x-1.5 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Quick Upload Sample PDF for {selectedSubject.name}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded PDFs List */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <FolderOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Uploaded Documents for {selectedSubject.name} ({currentSubjectUploadedPDFs.length})</span>
                      </span>
                    </h4>

                    {currentSubjectUploadedPDFs.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                        <Paperclip className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                          No custom PDFs uploaded yet for {selectedSubject.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Use the upload form above to add your own PDF notes, homework sheets, or study guides.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {currentSubjectUploadedPDFs.map((pdf) => (
                          <div
                            key={pdf.id}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-300 transition-all shadow-sm"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 font-black">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                                    {pdf.fileName}
                                  </h5>
                                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-extrabold text-[10px]">
                                    {pdf.category || "Uploaded PDF"}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {pdf.fileSize} • Uploaded on {pdf.uploadDate}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons for Uploaded PDF */}
                            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                              <button
                                onClick={() => setViewerPDF(pdf)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors flex items-center space-x-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View PDF</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedSubject(null);
                                  onOpenAITutor(`${pdf.fileName} (${selectedSubject.name})`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-extrabold text-xs hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors flex items-center space-x-1"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Ask AI</span>
                              </button>

                              <button
                                onClick={() => handleDeletePDF(pdf.id, pdf.fileName)}
                                className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors"
                                title="Delete PDF"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Official NCERT / State Board Textbook PDFs Section */}
                  {currentSubjectOfficialTextbooks.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Official Digital Textbooks for {selectedSubject.name} ({currentSubjectOfficialTextbooks.length})</span>
                      </h4>

                      <div className="space-y-3">
                        {currentSubjectOfficialTextbooks.map((book) => (
                          <div
                            key={book.id}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 font-black">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                                    {book.title}
                                  </h5>
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px]">
                                    NCERT / State Textbook
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  Publisher: {book.publisher} • {book.chapters.length} Chapters
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={() => {
                                  const allPages = book.chapters.flatMap((c) => c.splitPages || []);
                                  setViewerPDF({
                                    title: book.title,
                                    subjectName: selectedSubject.name,
                                    previewText: book.description,
                                    splitPages: allPages.length > 0 ? allPages : book.chapters[0]?.splitPages,
                                  });
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors flex items-center space-x-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Read Full Textbook</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedSubject(null);
                                  onOpenAITutor(`${book.title} (${selectedSubject.name})`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-extrabold text-xs hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors flex items-center space-x-1"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Ask AI</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                    </>
                  )}
                </div>
              )}

              {/* TAB 3: KEY CONCEPTS & SUMMARY */}
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

              {/* TAB 4: PRACTICE FLASHCARDS */}
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
