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
  BrainCircuit,
  Image as ImageIcon,
  Zap,
  Globe,
  Trash2,
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
        : "Hello Elena! I am Aura AI Tutor, your multi-model study companion. Ask me any coursework question, upload a homework picture, enable High Thinking for complex proofs, or search real-time web info!",
      timestamp: "Just now",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"general" | "quiz" | "summary" | "plan" | "feedback" | "fast" | "search">("general");
  const [enableThinking, setEnableThinking] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (textToSend?: string, selectedMode?: "general" | "quiz" | "summary" | "plan" | "feedback" | "fast" | "search") => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() && !imagePreview) return;

    const currentMode = selectedMode || mode;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: promptText + (imagePreview ? " [Uploaded Image Attached]" : ""),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt("");
    const attachedImage = imagePreview;
    setImagePreview(null);
    setLoading(true);

    try {
      let apiEndpoint = "/api/ai/tutor";
      let requestBody: any = {
        prompt: promptText,
        courseContext: initialCourseContext,
        mode: currentMode,
        enableThinking,
        history: messages.map((m) => ({ role: m.sender, text: m.text })),
      };

      if (attachedImage) {
        requestBody.imageBase64 = attachedImage.split(",")[1];
        requestBody.imageMimeType = attachedImage.split(";")[0].replace("data:", "");
      }

      if (currentMode === "search") {
        apiEndpoint = "/api/ai/search-grounding";
        requestBody = { query: promptText };
      }

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      let aiResponseText = data.text || "I'm having trouble fetching a response. Please try asking again.";

      if (data.sources && data.sources.length > 0) {
        const sourcesList = data.sources
          .map((s: any) => `- [${s.title || s.uri}](${s.uri})`)
          .join("\n");
        aiResponseText += `\n\n**Sources & Web Grounding:**\n${sourcesList}`;
      }

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
          text: "Sorry, I ran into a connection error. Please try again.",
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
                {initialCourseContext ? `Context: ${initialCourseContext}` : "Multi-Model Syllabus Companion"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* High Thinking Toggle */}
            <button
              onClick={() => setEnableThinking(!enableThinking)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center space-x-1 transition-all ${
                enableThinking
                  ? "bg-amber-400 text-amber-950 shadow-md animate-pulse"
                  : "bg-white/10 text-indigo-200 hover:bg-white/20"
              }`}
              title="High Thinking Mode using gemini-3.1-pro-preview (ThinkingLevel.HIGH)"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>{enableThinking ? "High Thinking ON" : "Thinking Mode"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="p-2 border-b border-white/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-around text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setMode("general")}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ${
              mode === "general"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Q&A</span>
          </button>

          <button
            onClick={() => setMode("search")}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ${
              mode === "search"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title="Google Search Grounding (gemini-3.5-flash)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>

          <button
            onClick={() => setMode("fast")}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ${
              mode === "fast"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title="Fast Mode (gemini-3.1-flash-lite)"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fast</span>
          </button>

          <button
            onClick={() => setMode("quiz")}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ${
              mode === "quiz"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </button>

          <button
            onClick={() => setMode("summary")}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ${
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
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ${
              mode === "plan"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Plan</span>
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
              <span>
                {enableThinking
                  ? "Gemini 3.1 Pro (High Thinking) is solving step-by-step..."
                  : "Aura AI is generating response..."}
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Image Attachment Preview Badge */}
        {imagePreview && (
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/80 border-t border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-8 h-8 rounded-md object-cover border border-indigo-200"
              />
              <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                Photo attached for Multimodal Analysis
              </span>
            </div>
            <button
              onClick={() => setImagePreview(null)}
              className="p-1 text-slate-400 hover:text-rose-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Preset Prompt Chips */}
        <div className="p-2 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-bold shrink-0">Try:</span>
          <button
            onClick={() => {
              setEnableThinking(true);
              handleSendMessage("Solve step-by-step: Prove that the halting problem is undecidable", "general");
            }}
            className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold shrink-0"
          >
            🧠 High Thinking: Prove Halting Problem
          </button>
          <button
            onClick={() => handleSendMessage("What are the latest breakthroughs in quantum computing in 2026?", "search")}
            className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold shrink-0"
          >
            🌐 Web Search Grounding
          </button>
          <button
            onClick={() => handleSendMessage("Give me a quick 1-sentence tip for active recall study technique", "fast")}
            className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold shrink-0"
          >
            ⚡ Fast Tip: Active Recall
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
              title="Upload Photo for Image Analysis (gemini-3.1-pro-preview)"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

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
              placeholder={
                enableThinking
                  ? "High Thinking ON: Ask complex proofs, math or logic..."
                  : mode === "search"
                  ? "Search Web: Ask for current news, paper citations..."
                  : "Ask Aura AI or paste homework..."
              }
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

