import React, { useState } from "react";
import { AttendanceRecord, ScheduleEvent } from "../types";
import { AttendanceSection } from "./AttendanceSection";
import { CalendarDays, MapPin, Clock, Plus, AlertTriangle, UserCheck, Grid } from "lucide-react";

interface ScheduleTabProps {
  events: ScheduleEvent[];
  onAddEvent: (event: ScheduleEvent) => void;
  attendanceRecords: AttendanceRecord[];
  onAddAttendanceRecord: (record: AttendanceRecord) => void;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  events,
  onAddEvent,
  attendanceRecords,
  onAddAttendanceRecord,
}) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
  const [activeSubTab, setActiveSubTab] = useState<"attendance" | "timetable">("attendance");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("CS 401");
  const [newDay, setNewDay] = useState<typeof days[number]>("Monday");
  const [newStartTime, setNewStartTime] = useState("10:00 AM");
  const [newLocation, setNewLocation] = useState("Science Hall 101");

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const created: ScheduleEvent = {
      id: "ev-" + Date.now(),
      title: newTitle,
      courseCode: newCourseCode,
      day: newDay,
      startTime: newStartTime,
      endTime: "11:30 AM",
      location: newLocation,
      type: "Study Group",
      color: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-400/40",
    };

    onAddEvent(created);
    setShowAddModal(false);
    setNewTitle("");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Mode Selector Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab("attendance")}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
            activeSubTab === "attendance"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Student Attendance & Google Calendar</span>
        </button>

        <button
          onClick={() => setActiveSubTab("timetable")}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
            activeSubTab === "timetable"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Weekly Class Timetable</span>
        </button>
      </div>

      {activeSubTab === "attendance" ? (
        <AttendanceSection
          attendanceRecords={attendanceRecords}
          onAddAttendanceRecord={onAddAttendanceRecord}
          scheduleEvents={events}
        />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-indigo-500" />
                <span>Academic Schedule & Timetable</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Weekly class lecture grid, laboratory blocks, exam schedules, and study groups.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md transition-all flex items-center space-x-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event / Study Block</span>
            </button>
          </div>

          {/* Countdown Exam Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center space-x-3 text-amber-800 dark:text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="font-bold">Upcoming Exam Alert:</span> MATH 302 Linear Algebra Midterm Exam is scheduled on <strong>Thursday at 4:00 PM</strong> in Math Annex 102.
            </div>
          </div>

          {/* Timetable Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {days.map((day) => {
              const dayEvents = events.filter((e) => e.day === day);

              return (
                <div
                  key={day}
                  className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 space-y-3 min-h-[300px] flex flex-col justify-between"
                >
                  <div>
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {day}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">
                        {dayEvents.length} Sessions
                      </span>
                    </div>

                    <div className="space-y-3 pt-3">
                      {dayEvents.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic text-center pt-8">
                          No classes scheduled.
                        </p>
                      ) : (
                        dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-3 rounded-xl border text-xs space-y-1.5 shadow-sm ${event.color}`}
                          >
                            <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-white/40 dark:bg-black/40">
                              {event.courseCode}
                            </span>
                            <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                              {event.title}
                            </h4>
                            <div className="flex items-center space-x-1 text-[10px] opacity-80">
                              <Clock className="w-3 h-3" />
                              <span>{event.startTime} - {event.endTime}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-[10px] opacity-80">
                              <MapPin className="w-3 h-3" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400">
                      {day === "Thursday" ? "⚠️ Midterm Day" : "Regular Schedule"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEvent}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl max-w-md w-full border border-white/50 dark:border-slate-800/50 shadow-2xl p-6 space-y-4"
          >
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Add Schedule Event / Class
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS 401 Algorithm Discussion"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Day
                  </label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Location / Room
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
