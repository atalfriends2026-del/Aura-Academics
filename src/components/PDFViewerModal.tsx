import React, { useState } from "react";
import { X, Download, ZoomIn, ZoomOut, Bot, FileText, ChevronLeft, ChevronRight, Sparkles, BookOpen, Layers } from "lucide-react";
import { UploadedSubjectPDF } from "../types";

interface PDFViewerModalProps {
  pdf: UploadedSubjectPDF | {
    title: string;
    pdfFileName?: string;
    fileDataUrl?: string;
    subjectName?: string;
    previewText?: string;
    splitPages?: Array<{ pageNumber: number; title: string; excerpt: string }>;
  } | null;
  onClose: () => void;
  onOpenAITutor: (contextTitle: string) => void;
  inline?: boolean;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  pdf,
  onClose,
  onOpenAITutor,
  inline = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  if (!pdf) return null;

  const pdfTitle = "fileName" in pdf ? pdf.fileName : pdf.title;
  const subjectName = "subjectName" in pdf ? pdf.subjectName : ("subject" in pdf ? (pdf as any).subject : "Subject PDF");
  const dataUrl = pdf.fileDataUrl;
  const splitPages = "splitPages" in pdf ? pdf.splitPages : undefined;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));

  const handleDownload = () => {
    if (dataUrl) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = pdfTitle;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Create a blob text fallback download
      const textContent = `DOCUMENT: ${pdfTitle}\nSUBJECT: ${subjectName}\n\n${pdf.previewText || "Document Content"}`;
      const blob = new Blob([textContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = pdfTitle.endsWith(".pdf") ? pdfTitle : `${pdfTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={inline ? "w-full h-full flex flex-col animate-fadeIn" : "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"}>
      <div className={`bg-white dark:bg-slate-900 rounded-3xl w-full flex flex-col overflow-hidden ${inline ? 'h-[600px] border border-slate-200 dark:border-slate-800' : 'max-w-5xl h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800'}`}>
        
        {/* Header Bar */}
        <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/80 text-white flex items-center justify-center shrink-0 font-black shadow-inner">
              <FileText className="w-5 h-5 text-indigo-200" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                {subjectName}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold truncate text-white mt-0.5">
                {pdfTitle}
              </h3>
            </div>
          </div>

          {/* Top Control Bar */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-black text-slate-200 min-w-[50px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => onOpenAITutor(`${pdfTitle} (${subjectName})`)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs hover:bg-purple-500 transition-colors flex items-center space-x-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI Tutor</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-500 transition-colors flex items-center space-x-1.5 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-auto p-4 sm:p-6 flex flex-col items-center justify-start relative">
          
          {dataUrl ? (
            /* Render Native PDF object/embed or Data URL */
            <div 
              className="w-full h-full min-h-[500px] flex flex-col items-center justify-center transition-all duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            >
              <iframe
                src={dataUrl}
                title={pdfTitle}
                className="w-full h-full min-h-[600px] rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xl bg-white"
              />
            </div>
          ) : splitPages && splitPages.length > 0 ? (
            /* Render Split Pages PDF Reader for Textbook Chapters */
            <div className="w-full max-w-3xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    Page {activePageIndex + 1} of {splitPages.length}
                  </span>
                </div>
                
                {/* Direct Page Jump Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto py-1 max-w-full">
                  {splitPages.map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePageIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap ${
                        activePageIndex === idx
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      P.{page.pageNumber}
                    </button>
                  ))}
                </div>

                <div className="flex space-x-2 shrink-0">
                  <button
                    disabled={activePageIndex === 0}
                    onClick={() => setActivePageIndex((p) => Math.max(0, p - 1))}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={activePageIndex === splitPages.length - 1}
                    onClick={() => setActivePageIndex((p) => Math.min(splitPages.length - 1, p + 1))}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Page View */}
              <div 
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 min-h-[400px] transition-all"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-black text-indigo-600 dark:text-indigo-400 text-base">
                    {splitPages[activePageIndex].title}
                  </h4>
                  <span className="text-xs font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    Page {splitPages[activePageIndex].pageNumber}
                  </span>
                </div>

                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                  {splitPages[activePageIndex].excerpt}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="italic">[Official Textbook Edition • {pdfTitle}]</span>
                  <button
                    onClick={() => onOpenAITutor(`${splitPages[activePageIndex].title} (${pdfTitle})`)}
                    className="text-purple-600 dark:text-purple-400 hover:underline font-bold flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Explain this page with AI</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Fallback Text Document Reader */
            <div 
              className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-3xl w-full space-y-6 transition-all"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            >
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-1">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Document View • {subjectName}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {pdfTitle}
                </h2>
              </div>

              <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-4 text-sm font-medium">
                <p>
                  {pdf.previewText || "This PDF document is stored securely under your subject library."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    Have questions about this document?
                  </span>
                </div>
                <button
                  onClick={() => onOpenAITutor(`${pdfTitle} (${subjectName})`)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-500 transition-colors shadow-sm"
                >
                  Ask AI Tutor
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-500">
          <span>{subjectName} • Digital Document</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
