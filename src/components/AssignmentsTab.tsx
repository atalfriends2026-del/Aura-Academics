import React, { useState } from "react";
import { Assignment } from "../types";
import {
  CheckSquare,
  Plus,
  Filter,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Search,
} from "lucide-react";
import { triggerConfetti } from "../utils/confetti";

interface AssignmentsTabProps {
  assignments: Assignment[];
  onOpenNewTaskModal: () => void;
  onToggleAssignmentStatus: (id: string) => void;
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({
  assignments,
  onOpenNewTaskModal,
  onToggleAssignmentStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Submitted" | "Graded">("All");
  const [search, setSearch] = useState("");
  const [submissionSuccessModal, setSubmissionSuccessModal] = useState<string | null>(null);

  const filteredAssignments = assignments.filter((item) => {
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSimulateSubmit = (title: string, id: string) => {
    onToggleAssignmentStatus(id);
    triggerConfetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
    });
    setSubmissionSuccessModal(title);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-indigo-500" />
            <span>Assignments & Submission Portal</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track deadline urgency, submission statuses, instructor grades, and project deliverables.
          </p>
        </div>

        <button
          onClick={onOpenNewTaskModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Academic Task</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm">
        
        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(["All", "Pending", "Submitted", "Graded"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterStatus === status
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

      </div>

      {/* Assignment List Cards */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="p-12 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 text-slate-400 text-xs">
            No assignments match the selected filter.
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {assignment.courseCode}
                  </span>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded ${
                      assignment.status === "Pending"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : assignment.status === "Submitted"
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {assignment.status}
                  </span>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      assignment.priority === "High"
                        ? "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {assignment.priority} Priority
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {assignment.title}
                </h3>

                {assignment.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {assignment.notes}
                  </p>
                )}

                <p className="text-xs font-semibold text-pink-600 dark:text-pink-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due: {assignment.dueDate} at {assignment.dueTime}</span>
                </p>
              </div>

              {/* Action Column */}
              <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                {assignment.score ? (
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-semibold">Grade</span>
                    <span className="text-lg font-black text-emerald-500">{assignment.score}</span>
                  </div>
                ) : assignment.status === "Submitted" ? (
                  <span className="text-xs font-bold text-sky-500 flex items-center space-x-1 bg-sky-50 dark:bg-sky-950/60 px-3 py-2 rounded-xl border border-sky-200 dark:border-sky-800">
                    <CheckCircle className="w-4 h-4" />
                    <span>Awaiting Professor Grading</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleSimulateSubmit(assignment.title, assignment.id)}
                    className="px-4 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-xs shadow-md transition-all flex items-center space-x-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Submit Work</span>
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Submission Confirmation Toast Modal */}
      {submissionSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl max-w-sm w-full border border-white/50 dark:border-slate-800/50 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center mx-auto text-xl">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Assignment Submitted!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              "{submissionSuccessModal}" has been uploaded to the LMS portal.
            </p>
            <button
              onClick={() => setSubmissionSuccessModal(null)}
              className="w-full py-2.5 rounded-xl font-bold bg-indigo-600 text-white text-xs"
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
