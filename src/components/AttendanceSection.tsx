import React, { useState, useEffect } from "react";
import { AttendanceRecord, ScheduleEvent } from "../types";
import { initAuth, googleSignIn, logoutGoogle, getAccessToken } from "../lib/firebaseAuth";
import {
  fetchGoogleCalendarEvents,
  createGoogleCalendarEvent,
  GoogleCalendarEvent,
  deleteGoogleCalendarEvent,
} from "../lib/googleCalendar";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  RefreshCw,
  LogOut,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Sparkles,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { User } from "firebase/auth";

interface AttendanceSectionProps {
  attendanceRecords: AttendanceRecord[];
  onAddAttendanceRecord: (record: AttendanceRecord) => void;
  scheduleEvents?: ScheduleEvent[];
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({
  attendanceRecords,
  onAddAttendanceRecord,
  scheduleEvents = [],
}) => {
  // Google Auth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken());
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Live Calendar Events from Google
  const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  // Log Attendance Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [subjectTitle, setSubjectTitle] = useState("Computer Science - Data Structures");
  const [subjectCode, setSubjectCode] = useState("CS 401");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00 AM");
  const [status, setStatus] = useState<"Present" | "Absent" | "Late" | "Excused">("Present");
  const [location, setLocation] = useState("Science Hall 304");
  const [notes, setNotes] = useState("");
  const [syncToCalendar, setSyncToCalendar] = useState(true);

  // Confirmation modal for Google Calendar mutations
  const [confirmSyncData, setConfirmSyncData] = useState<{
    record: AttendanceRecord;
    startTimeISO: string;
    endTimeISO: string;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setAuthError(null);
        loadCalendarEvents(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Live Google Calendar Events
  const loadCalendarEvents = async (token: string) => {
    setIsLoadingEvents(true);
    setCalendarError(null);
    try {
      const events = await fetchGoogleCalendarEvents(token);
      setGoogleEvents(events);
    } catch (err: any) {
      console.error("Failed to load Google Calendar events:", err);
      setCalendarError(err.message || "Failed to load Google Calendar events.");
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Handle Google Sign-In click
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setAccessToken(result.accessToken);
        await loadCalendarEvents(result.accessToken);
      }
    } catch (err: any) {
      console.error("Sign in failed:", err);
      setAuthError(err.message || "Failed to sign in with Google.");
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setAccessToken(null);
    setGoogleEvents([]);
  };

  // Submit Log Attendance Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectTitle || !date) return;

    const newRecord: AttendanceRecord = {
      id: "att-" + Date.now(),
      subjectTitle,
      subjectCode,
      date,
      time,
      status,
      location,
      notes,
      syncedToGoogleCalendar: false,
    };

    if (syncToCalendar && accessToken) {
      // Calculate start & end ISO times
      const startDateTimeStr = `${date}T${convertTimeTo24h(time)}:00`;
      const startDateObj = new Date(startDateTimeStr);
      const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000);

      setConfirmSyncData({
        record: newRecord,
        startTimeISO: startDateObj.toISOString(),
        endTimeISO: endDateObj.toISOString(),
      });
      setShowLogModal(false);
    } else {
      onAddAttendanceRecord(newRecord);
      setShowLogModal(false);
      resetForm();
    }
  };

  // Confirm and Sync to Google Calendar
  const handleConfirmCalendarSync = async () => {
    if (!confirmSyncData || !accessToken) return;

    setIsSyncing(true);
    try {
      const createdEvent = await createGoogleCalendarEvent(accessToken, {
        title: `Attendance [${confirmSyncData.record.status}]: ${confirmSyncData.record.subjectCode} - ${confirmSyncData.record.subjectTitle}`,
        description: `Student Attendance Log\nStatus: ${confirmSyncData.record.status}\nLocation: ${confirmSyncData.record.location}\nNotes: ${confirmSyncData.record.notes || "None"}`,
        location: confirmSyncData.record.location,
        startTimeISO: confirmSyncData.startTimeISO,
        endTimeISO: confirmSyncData.endTimeISO,
      });

      const updatedRecord: AttendanceRecord = {
        ...confirmSyncData.record,
        syncedToGoogleCalendar: true,
        googleCalendarEventId: createdEvent.id,
      };

      onAddAttendanceRecord(updatedRecord);
      await loadCalendarEvents(accessToken);
    } catch (err: any) {
      alert("Failed to create event in Google Calendar: " + err.message);
      onAddAttendanceRecord(confirmSyncData.record);
    } finally {
      setIsSyncing(false);
      setConfirmSyncData(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setNotes("");
  };

  // Convert 12h time string (e.g., "10:00 AM") to 24h format "10:00"
  function convertTimeTo24h(time12h: string): string {
    const [timeStr, modifier] = time12h.split(" ");
    let [hours, minutes] = timeStr.split(":");
    let h = parseInt(hours, 10);
    if (modifier === "PM" && h < 12) h += 12;
    if (modifier === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${minutes || "00"}`;
  }

  // Attendance stats
  const totalClasses = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((r) => r.status === "Present").length;
  const lateCount = attendanceRecords.filter((r) => r.status === "Late").length;
  const absentCount = attendanceRecords.filter((r) => r.status === "Absent").length;
  const attendanceRate = totalClasses > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalClasses) * 100) : 100;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Google Calendar Connection Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-blue-100 border border-white/30">
            <CalendarIcon className="w-4 h-4 text-amber-300" />
            <span>Google Workspace Integration</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black leading-tight">
            Student Attendance & Google Calendar
          </h2>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
            Log class lecture attendance, track course presence rates, and automatically sync attendance check-ins directly with your personal Google Calendar.
          </p>
        </div>

        {/* Google Authentication Block */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/30 p-5 rounded-2xl relative z-10 shrink-0 space-y-3 min-w-[280px]">
          {googleUser && accessToken ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.displayName || "User"}
                    className="w-10 h-10 rounded-full border-2 border-amber-300 shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 font-black flex items-center justify-center">
                    {googleUser.displayName?.charAt(0) || "U"}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <h4 className="font-extrabold text-xs text-white truncate">
                      {googleUser.displayName || "Google User"}
                    </h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-blue-100 truncate">
                    {googleUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs">
                <span className="text-[10px] font-bold text-emerald-300 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Calendar Connected</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[10px] font-bold transition-all flex items-center space-x-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold text-blue-100">
                Connect your Google Account to enable Google Calendar synchronization for attendance logs.
              </p>

              {/* Official Google Sign-In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-800 hover:bg-slate-50 font-black text-xs shadow-lg transition-all flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isSigningIn ? "Signing in..." : "Sign in with Google"}</span>
              </button>

              {authError && (
                <p className="text-[10px] text-rose-200 font-bold leading-tight">
                  {authError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Attendance Stats Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">
            Attendance Rate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {attendanceRate}%
            </span>
            <span className="text-xs font-extrabold text-emerald-500">Good</span>
          </div>
          <p className="text-[10px] text-slate-500">Target requirement: 85%+</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">
            Sessions Attended
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {presentCount}
            </span>
            <span className="text-xs font-bold text-slate-400">of {totalClasses}</span>
          </div>
          <p className="text-[10px] text-slate-500">Classes marked Present</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">
            Late Arrivals
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {lateCount}
            </span>
            <span className="text-xs font-bold text-amber-500">Recorded</span>
          </div>
          <p className="text-[10px] text-slate-500">Within 15 mins allowance</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">
            Absences
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {absentCount}
            </span>
            <span className="text-xs font-bold text-slate-400">Absences</span>
          </div>
          <p className="text-[10px] text-slate-500">Requires medical leave letter</p>
        </div>
      </div>

      {/* Action Header & Log Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Class Attendance History</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Record subject attendance entries and sync check-ins to Google Calendar.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Attendance Entry</span>
        </button>
      </div>

      {/* Main Grid: Attendance Table + Live Google Calendar Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Records Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Recent Class Logs
            </h4>
            <span className="text-xs font-bold text-slate-400">
              {attendanceRecords.length} Entries
            </span>
          </div>

          <div className="space-y-3">
            {attendanceRecords.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">
                No attendance entries logged yet. Click "Log Attendance Entry" to begin tracking.
              </p>
            ) : (
              attendanceRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {record.subjectCode}
                      </span>
                      <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {record.subjectTitle}
                      </h5>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center space-x-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{record.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{record.time}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{record.location}</span>
                      </span>
                    </div>

                    {record.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic pt-1">
                        "{record.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1 ${
                        record.status === "Present"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                          : record.status === "Late"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
                      }`}
                    >
                      {record.status === "Present" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{record.status}</span>
                    </span>

                    {/* Google Calendar Sync Indicator */}
                    {record.syncedToGoogleCalendar && (
                      <span
                        title="Synced to Google Calendar"
                        className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                      >
                        <CalendarIcon className="w-4 h-4 text-blue-500" />
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Google Calendar Feed Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Live Google Calendar
                </h4>
              </div>

              {accessToken && (
                <button
                  onClick={() => loadCalendarEvents(accessToken)}
                  disabled={isLoadingEvents}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Refresh Google Calendar"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingEvents ? "animate-spin" : ""}`} />
                </button>
              )}
            </div>

            {!accessToken ? (
              <div className="p-6 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/60 text-center space-y-3">
                <CalendarIcon className="w-8 h-8 text-blue-500 mx-auto" />
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Sign in with Google to view live calendar events & class schedules directly in this panel.
                </p>
                <button
                  onClick={handleGoogleSignIn}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Connect Calendar
                </button>
              </div>
            ) : isLoadingEvents ? (
              <div className="p-8 text-center text-slate-400 text-xs italic space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-500" />
                <span>Fetching events from Google Calendar...</span>
              </div>
            ) : calendarError ? (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs space-y-1">
                <div className="font-extrabold flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>Calendar Fetch Error</span>
                </div>
                <p className="text-[11px] opacity-90">{calendarError}</p>
              </div>
            ) : googleEvents.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">
                No upcoming events found on your Google Calendar.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {googleEvents.map((evt) => {
                  const startTimeStr = evt.start.dateTime
                    ? new Date(evt.start.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : evt.start.date;

                  return (
                    <div
                      key={evt.id}
                      className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-extrabold text-slate-900 dark:text-white truncate">
                          {evt.summary || "(No Title)"}
                        </h5>
                        {evt.htmlLink && (
                          <a
                            href={evt.htmlLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 hover:text-blue-600 p-0.5"
                            title="Open in Google Calendar"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{startTimeStr}</span>
                        {evt.location && (
                          <>
                            <span>•</span>
                            <span className="truncate">{evt.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold">
              Synced via Google Calendar API v3
            </span>
          </div>
        </div>
      </div>

      {/* Log Attendance Entry Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Log Student Attendance Entry
              </h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-extrabold mb-1 text-slate-700 dark:text-slate-300">
                  Subject / Course
                </label>
                <input
                  type="text"
                  required
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold mb-1 text-slate-700 dark:text-slate-300">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-extrabold mb-1 text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                    <option value="Excused">Excused</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold mb-1 text-slate-700 dark:text-slate-300">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-extrabold mb-1 text-slate-700 dark:text-slate-300">
                    Time
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold mb-1 text-slate-700 dark:text-slate-300">
                  Classroom / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-extrabold mb-1 text-slate-700 dark:text-slate-300">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="Optional lecture notes or topic"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
                />
              </div>

              {accessToken && (
                <div className="pt-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncToCalendar}
                      onChange={(e) => setSyncToCalendar(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">
                      Sync entry to Google Calendar
                    </span>
                  </label>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all"
              >
                Save Attendance Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal for Google Calendar Mutation (Workspace Integration Constraint) */}
      {confirmSyncData && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-blue-300 dark:border-blue-700 shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center mx-auto">
              <CalendarIcon className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Confirm Google Calendar Event Creation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Are you sure you want to add this attendance log to your primary Google Calendar?
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="font-extrabold text-slate-900 dark:text-white">
                {confirmSyncData.record.subjectCode}: {confirmSyncData.record.subjectTitle}
              </div>
              <div className="text-slate-500 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {confirmSyncData.record.date} at {confirmSyncData.record.time}
                </span>
              </div>
              <div className="text-slate-500 flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{confirmSyncData.record.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => {
                  onAddAttendanceRecord(confirmSyncData.record);
                  setConfirmSyncData(null);
                  resetForm();
                }}
                disabled={isSyncing}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Skip Calendar Sync
              </button>

              <button
                onClick={handleConfirmCalendarSync}
                disabled={isSyncing}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <span>Confirm & Create</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
