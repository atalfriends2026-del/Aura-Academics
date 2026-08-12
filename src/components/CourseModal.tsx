import React, { useState } from "react";
import { Course, CourseResource } from "../types";
import { X, BookOpen, MapPin, Clock, User, Sparkles, CheckCircle2, Link, Plus, FileText, Bookmark, ExternalLink } from "lucide-react";

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onOpenAITutor: (contextTitle: string) => void;
  onUpdateCourse: (course: Course) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  onOpenAITutor,
  onUpdateCourse,
}) => {
  const [showAddResource, setShowAddResource] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<CourseResource["type"]>("Lecture Material");

  if (!course) return null;

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const resource: CourseResource = {
      id: "res-" + Date.now(),
      title: newTitle,
      url: newUrl,
      type: newType,
    };

    const updatedCourse = {
      ...course,
      resources: [...(course.resources || []), resource],
    };

    onUpdateCourse(updatedCourse);
    setNewTitle("");
    setNewUrl("");
    setShowAddResource(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Lecture Material": return <BookOpen className="w-3.5 h-3.5 text-indigo-500" />;
      case "Textbook": return <Bookmark className="w-3.5 h-3.5 text-amber-500" />;
      case "Research Paper": return <FileText className="w-3.5 h-3.5 text-sky-500" />;
      default: return <Link className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const handleToggleModuleInModal = (moduleId: string) => {
    let nowCompleted = false;
    const updatedModules = course.modules.map((m) => {
      if (m.id === moduleId) {
        nowCompleted = !m.isCompleted;
        return { ...m, isCompleted: nowCompleted };
      }
      return m;
    });

    const completedCount = updatedModules.filter((m) => m.isCompleted).length;
    const totalCount = updatedModules.length;
    const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const updatedCourse: Course = {
      ...course,
      modules: updatedModules,
      progress: newProgress,
      syllabusProgress: newProgress,
    };

    onUpdateCourse(updatedCourse);
  };

  const completedModulesCount = course.modules.filter((m) => m.isCompleted).length;
  const totalModulesCount = course.modules.length;
  const progressPct = totalModulesCount > 0 ? Math.round((completedModulesCount / totalModulesCount) * 100) : course.syllabusProgress;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl max-w-lg w-full border border-white/50 dark:border-slate-800/50 shadow-2xl overflow-hidden p-6 space-y-4 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3 shrink-0">
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {course.code} • {course.credits} Credits
            </span>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mt-1">
              {course.title}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 overflow-y-auto pr-2 pb-2">
          <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl space-y-1.5 border border-white/50 dark:border-slate-700/50">
            <p className="flex items-center space-x-2">
              <User className="w-4 h-4 text-indigo-500" />
              <span><strong>Instructor:</strong> {course.instructor}</span>
            </p>
            <p className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span><strong>Room:</strong> {course.room}</span>
            </p>
            <p className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span><strong>Schedule:</strong> {course.schedule}</span>
            </p>
          </div>

          <div className="p-3 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-slate-900 dark:text-white">
                Course Progress
              </p>
              <span className="font-black text-indigo-600 dark:text-indigo-400 text-xs">
                {progressPct}% ({completedModulesCount}/{totalModulesCount} Modules)
              </span>
            </div>
            <div className="w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {course.announcement && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1 text-indigo-900 dark:text-indigo-200">
              <p className="font-bold text-xs">Recent Instructor Announcement:</p>
              <p className="text-[11px] leading-relaxed">{course.announcement}</p>
            </div>
          )}

          <div className="space-y-1.5 pt-1">
            <p className="font-bold text-slate-900 dark:text-white">
              Syllabus Modules (Click to toggle completion):
            </p>
            <div className="space-y-1.5">
              {course.modules.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleToggleModuleInModal(m.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    m.isCompleted
                      ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200"
                      : "bg-white/40 dark:bg-slate-800/30 border-white/40 dark:border-slate-700/30 hover:border-indigo-400 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className={`text-[11px] font-bold ${m.isCompleted ? "line-through text-slate-500" : ""}`}>
                    {m.title}
                  </span>
                  {m.isCompleted ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center space-x-1 shrink-0 text-[10px] bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 font-bold shrink-0 text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      Click to Complete
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Link className="w-4 h-4 text-indigo-500" />
                <span>Course Resources</span>
              </p>
              <button 
                onClick={() => setShowAddResource(!showAddResource)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 text-[11px] font-bold"
              >
                <Plus className="w-3 h-3" />
                <span>Add Resource</span>
              </button>
            </div>

            {showAddResource && (
              <form onSubmit={handleAddResource} className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-indigo-500/30 space-y-2 mb-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Resource Title (e.g., Chapter 1 Slides)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-white/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none text-[11px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-white/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none text-[11px]"
                  />
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg border border-white/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none text-[11px]"
                  >
                    <option value="Lecture Material">Lecture Material</option>
                    <option value="Textbook">Textbook</option>
                    <option value="Research Paper">Research Paper</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end pt-1">
                  <button type="submit" className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold">
                    Save Resource
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-1.5">
              {!course.resources || course.resources.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No resources added yet.</p>
              ) : (
                course.resources.map((res) => (
                  <a
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white/40 dark:bg-slate-800/30 border border-white/30 dark:border-slate-700/30 hover:border-indigo-500/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      {getTypeIcon(res.type)}
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-[11px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{res.title}</p>
                        <p className="text-[10px] text-slate-500">{res.type}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-800/50 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenAITutor(course.title);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center space-x-1.5 shadow-md hover:opacity-90"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Quiz for this Course</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
