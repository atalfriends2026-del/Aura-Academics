import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Copy,
  Check,
  BookOpen,
  HelpCircle,
  FileText,
  Calendar,
} from "lucide-react";

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseContext?: string;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  initialCourseContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "ai",
      text: initialCourseContext
        ? `Hello! I am Aura AI Tutor. I see you are studying **${initialCourseContext}**. How can I assist you with this subject today?`
        : "Hello Elena! I am Aura AI Tutor, your intelligent study companion. Ask me any coursework question, request practice quiz questions, or ask for a study schedule!",
      timestamp: "Just now",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"general" | "quiz" | "summary" | "plan" | "feedback">("general");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string, selectedMode?: "general" | "quiz" | "summary" | "plan" | "feedback") => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim()) return;

    const currentMode = selectedMode || mode;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          courseContext: initialCourseContext,
          mode: currentMode,
        }),
      });

      const data = await res.json();
      const aiResponseText = data.text || "I'm having trouble fetching a response. Please try asking again.";

      const aiMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "ai",
          text: "Sorry, I ran into a connection error. Please make sure your server is running.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl h-full shadow-2xl flex flex-col justify-between border-l border-white/50 dark:border-slate-800/50 animate-slideIn">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Aura AI Tutor</h3>
              <p className="text-[10px] text-indigo-200">
                {initialCourseContext ? `Context: ${initialCourseContext}` : "Syllabus AI Companion"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-2 border-b border-white/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-around text-xs font-semibold">
          <button
            onClick={() => setMode("general")}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1 ${
              mode === "general"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Q&A</span>
          </button>

          <button
            onClick={() => setMode("quiz")}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1 ${
              mode === "quiz"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practice Quiz</span>
          </button>

          <button
            onClick={() => setMode("summary")}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1 ${
              mode === "summary"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Summary</span>
          </button>

          <button
            onClick={() => setMode("plan")}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1 ${
              mode === "plan"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Study Plan</span>
          </button>

          <button
            onClick={() => setMode("feedback")}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1 ${
              mode === "feedback"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Feedback</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    AI
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] space-y-1 relative group ${
                    isUser
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/60"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="hover:text-indigo-400 transition-colors ml-2"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400 inline" />
                        ) : (
                          <Copy className="w-3 h-3 inline" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-indigo-500 font-semibold p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Aura AI is generating response...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Preset Prompt Chips */}
        <div className="p-2 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-bold shrink-0">Try:</span>
          <button
            onClick={() => handleSendMessage("Generate a 3-question practice quiz on Red-Black Trees", "quiz")}
            className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-indigo-100 text-slate-700 dark:text-slate-300 shrink-0"
          >
            Quiz: Red-Black Trees
          </button>
          <button
            onClick={() => handleSendMessage("Explain Singular Value Decomposition (SVD) simply", "general")}
            className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-indigo-100 text-slate-700 dark:text-slate-300 shrink-0"
          >
            Explain SVD Simply
          </button>
          <button
            onClick={() => handleSendMessage("Create a 3-day study schedule for Physics Midterm", "plan")}
            className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-indigo-100 text-slate-700 dark:text-slate-300 shrink-0"
          >
            Physics Study Plan
          </button>
          <button
            onClick={() => handleSendMessage("Can you review this paragraph and give me feedback on its clarity and structure?", "feedback")}
            className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-indigo-100 text-slate-700 dark:text-slate-300 shrink-0"
          >
            Review Paragraph
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
          <div className="flex items-center space-x-2">
            <textarea
              value={inputPrompt}
              onChange={(e) => {
                setInputPrompt(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                  e.currentTarget.style.height = 'auto';
                }
              }}
              placeholder="Ask Aura AI or paste your work for feedback..."
              rows={1}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-y-auto min-h-[40px]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
