import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { initAuth, googleSignIn, logoutGoogle, getAccessToken } from "../lib/firebaseAuth";
import {
  fetchClassroomCourses,
  fetchCourseWork,
  fetchAnnouncements,
  fetchCourseMembers,
  postClassroomAnnouncement,
  ClassroomCourse,
  ClassroomCourseWork,
  ClassroomAnnouncement,
  ClassroomUser,
} from "../lib/googleClassroom";
import { Assignment } from "../types";
import {
  School,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  LogOut,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  Users,
  FileText,
  Sparkles,
  ArrowRight,
  Send,
  Award,
} from "lucide-react";

interface GoogleClassroomTabProps {
  onImportAssignment?: (assignment: Assignment) => void;
}

// Fallback demo Google Classroom data for instant interactivity
const DEMO_COURSES: ClassroomCourse[] = [
  {
    id: "demo-cs401",
    name: "CS 401: Advanced Data Structures & Algorithms",
    section: "Section A - Fall 2026",
    descriptionHeading: "Computer Science Department",
    description: "In-depth analysis of graph theory, dynamic programming, and memory-optimized algorithms.",
    room: "Science Hall 304",
    courseState: "ACTIVE",
    enrollmentCode: "cs401-2026",
    alternateLink: "https://classroom.google.com",
  },
  {
    id: "demo-math302",
    name: "MATH 302: Applied Linear Algebra & Vectors",
    section: "Section B - Fall 2026",
    descriptionHeading: "Mathematics Department",
    description: "Vector spaces, linear transformations, matrix decompositions, and eigenvalues.",
    room: "Math Annex 102",
    courseState: "ACTIVE",
    enrollmentCode: "math302-vc",
    alternateLink: "https://classroom.google.com",
  },
  {
    id: "demo-phys201",
    name: "PHYS 201: Classical & Electromag Physics",
    section: "Section C - Fall 2026",
    descriptionHeading: "Physics Department",
    description: "Maxwell's equations, electromagnetic waves, optics, and experimental lab reports.",
    room: "Physics Aud 1",
    courseState: "ACTIVE",
    enrollmentCode: "phys201-lab",
    alternateLink: "https://classroom.google.com",
  },
];

const DEMO_COURSEWORK: Record<string, ClassroomCourseWork[]> = {
  "demo-cs401": [
    {
      id: "cw-1",
      courseId: "demo-cs401",
      title: "Problem Set 4: Dijkstra & A* Pathfinding Algorithms",
      description: "Implement Dijkstra and A* pathfinding algorithms in C++/TypeScript. Include complexity benchmark tables.",
      maxPoints: 100,
      workType: "ASSIGNMENT",
      dueDate: { year: 2026, month: 8, day: 18 },
      dueTime: { hours: 23, minutes: 59 },
      alternateLink: "https://classroom.google.com",
    },
    {
      id: "cw-2",
      courseId: "demo-cs401",
      title: "Midterm Algorithm Review Quiz",
      description: "Short answer questions on time complexity, AVL tree rotations, and hash collisions.",
      maxPoints: 50,
      workType: "SHORT_ANSWER_QUESTION",
      dueDate: { year: 2026, month: 8, day: 22 },
      alternateLink: "https://classroom.google.com",
    },
  ],
  "demo-math302": [
    {
      id: "cw-3",
      courseId: "demo-math302",
      title: "Matrix Diagonalization & Eigenvalues Lab",
      description: "Solve Systems of Differential Equations using SVD and Matrix Diagonalization.",
      maxPoints: 100,
      workType: "ASSIGNMENT",
      dueDate: { year: 2026, month: 8, day: 20 },
      alternateLink: "https://classroom.google.com",
    },
  ],
  "demo-phys201": [
    {
      id: "cw-4",
      courseId: "demo-phys201",
      title: "Lab Report 3: Faraday's Law of Induction",
      description: "Submit PDF report detailing voltage induced across magnetic flux coils.",
      maxPoints: 80,
      workType: "ASSIGNMENT",
      dueDate: { year: 2026, month: 8, day: 25 },
      alternateLink: "https://classroom.google.com",
    },
  ],
};

const DEMO_ANNOUNCEMENTS: Record<string, ClassroomAnnouncement[]> = {
  "demo-cs401": [
    {
      id: "ann-1",
      courseId: "demo-cs401",
      text: "📢 Office hours shifted to Wednesday 3:00 PM in Science Hall 304. We will review heap allocation & memory leaks.",
      creationTime: "2026-08-11T14:30:00Z",
    },
    {
      id: "ann-2",
      courseId: "demo-cs401",
      text: "Uploaded lecture slides for Module 5: Red-Black Trees & B-Trees to class Drive folder.",
      creationTime: "2026-08-09T09:15:00Z",
    },
  ],
  "demo-math302": [
    {
      id: "ann-3",
      courseId: "demo-math302",
      text: "Please complete Practice Sheet 3 before Thursday's lecture on Gram-Schmidt orthogonalization.",
      creationTime: "2026-08-10T11:00:00Z",
    },
  ],
  "demo-phys201": [
    {
      id: "ann-4",
      courseId: "demo-phys201",
      text: "Safety goggles required for tomorrow's electromagnetic coil lab experiment!",
      creationTime: "2026-08-08T16:20:00Z",
    },
  ],
};

export const GoogleClassroomTab: React.FC<GoogleClassroomTabProps> = ({ onImportAssignment }) => {
  // Auth state
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken());
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Classroom Live API States
  const [courses, setCourses] = useState<ClassroomCourse[]>(DEMO_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse>(DEMO_COURSES[0]);
  const [activeSubView, setActiveSubView] = useState<"coursework" | "announcements" | "roster">("coursework");

  const [courseWorkMap, setCourseWorkMap] = useState<Record<string, ClassroomCourseWork[]>>(DEMO_COURSEWORK);
  const [announcementMap, setAnnouncementMap] = useState<Record<string, ClassroomAnnouncement[]>>(DEMO_ANNOUNCEMENTS);
  const [membersMap, setMembersMap] = useState<Record<string, { students: ClassroomUser[]; teachers: ClassroomUser[] }>>({});

  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Post Announcement Modal & State
  const [showPostModal, setShowPostModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [importedAssignmentIds, setImportedAssignmentIds] = useState<string[]>([]);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setAuthError(null);
        loadLiveClassroomData(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch real Google Classroom Courses
  const loadLiveClassroomData = async (token: string) => {
    setIsLoadingCourses(true);
    setApiError(null);
    try {
      const liveCourses = await fetchClassroomCourses(token);
      if (liveCourses.length > 0) {
        setCourses(liveCourses);
        setSelectedCourse(liveCourses[0]);
        await loadCourseDetails(token, liveCourses[0].id);
      }
    } catch (err: any) {
      console.warn("Classroom API load notice:", err);
      setApiError(err.message || "Loaded default interactive course stream.");
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Fetch CourseWork & Announcements for selected course
  const loadCourseDetails = async (token: string, courseId: string) => {
    setIsLoadingDetails(true);
    try {
      const [cwList, annList, members] = await Promise.all([
        fetchCourseWork(token, courseId).catch(() => []),
        fetchAnnouncements(token, courseId).catch(() => []),
        fetchCourseMembers(token, courseId).catch(() => ({ students: [], teachers: [] })),
      ]);

      if (cwList.length > 0) {
        setCourseWorkMap((prev) => ({ ...prev, [courseId]: cwList }));
      }
      if (annList.length > 0) {
        setAnnouncementMap((prev) => ({ ...prev, [courseId]: annList }));
      }
      setMembersMap((prev) => ({ ...prev, [courseId]: members }));
    } catch (err: any) {
      console.error("Error loading course details:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // On course selection change
  const handleSelectCourse = (course: ClassroomCourse) => {
    setSelectedCourse(course);
    if (accessToken && !course.id.startsWith("demo-")) {
      loadCourseDetails(accessToken, course.id);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setAccessToken(res.accessToken);
        await loadLiveClassroomData(res.accessToken);
      }
    } catch (err: any) {
      console.error("Sign in failed:", err);
      setAuthError(err.message || "Failed to sign in with Google.");
    } finally {
      setIsSigningIn(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setAccessToken(null);
  };

  // Import CourseWork into student's main assignment planner
  const handleImportToAssignments = (cw: ClassroomCourseWork) => {
    if (!onImportAssignment) return;

    let dueDateStr = "2026-08-25";
    if (cw.dueDate) {
      const m = cw.dueDate.month.toString().padStart(2, "0");
      const d = cw.dueDate.day.toString().padStart(2, "0");
      dueDateStr = `${cw.dueDate.year}-${m}-${d}`;
    }

    const newAssignment: Assignment = {
      id: "asgn-gc-" + cw.id,
      courseId: selectedCourse.id,
      courseCode: selectedCourse.name.split(":")[0] || "GC 101",
      title: cw.title,
      dueDate: dueDateStr,
      dueTime: "11:59 PM",
      priority: "High",
      status: "Pending",
      maxScore: cw.maxPoints || 100,
      notes: cw.description || "Imported directly from Google Classroom.",
    };

    onImportAssignment(newAssignment);
    setImportedAssignmentIds((prev) => [...prev, cw.id]);
  };

  // Post Announcement Handler
  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    setIsPosting(true);
    try {
      if (accessToken && !selectedCourse.id.startsWith("demo-")) {
        const created = await postClassroomAnnouncement(accessToken, selectedCourse.id, announcementText);
        setAnnouncementMap((prev) => ({
          ...prev,
          [selectedCourse.id]: [created, ...(prev[selectedCourse.id] || [])],
        }));
      } else {
        // Local demo post
        const demoAnn: ClassroomAnnouncement = {
          id: "ann-" + Date.now(),
          courseId: selectedCourse.id,
          text: announcementText,
          creationTime: new Date().toISOString(),
        };
        setAnnouncementMap((prev) => ({
          ...prev,
          [selectedCourse.id]: [demoAnn, ...(prev[selectedCourse.id] || [])],
        }));
      }

      setAnnouncementText("");
      setShowPostModal(false);
    } catch (err: any) {
      alert("Error posting announcement: " + err.message);
    } finally {
      setIsPosting(false);
    }
  };

  const currentCourseWork = courseWorkMap[selectedCourse.id] || [];
  const currentAnnouncements = announcementMap[selectedCourse.id] || [];
  const currentMembers = membersMap[selectedCourse.id] || { students: [], teachers: [] };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Google Account Connection Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-emerald-100 border border-white/30">
            <School className="w-4 h-4 text-amber-300" />
            <span>Official Google Classroom Integration</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black leading-tight">
            Google Classroom Portal
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
            Sync enrolled courses, view coursework assignments, read class stream announcements, and manage student rosters directly with Google Classroom APIs.
          </p>
        </div>

        {/* Google Authentication Box */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/30 p-5 rounded-2xl relative z-10 shrink-0 space-y-3 min-w-[280px]">
          {googleUser && accessToken ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.displayName || "User"}
                    className="w-10 h-10 rounded-full border-2 border-emerald-300 shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-400 text-slate-900 font-black flex items-center justify-center">
                    {googleUser.displayName?.charAt(0) || "U"}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <h4 className="font-extrabold text-xs text-white truncate">
                      {googleUser.displayName || "Google User"}
                    </h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  </div>
                  <p className="text-[10px] text-emerald-100 truncate">
                    {googleUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs">
                <span className="text-[10px] font-bold text-emerald-200 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Classroom Connected</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[10px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold text-emerald-100">
                Sign in with Google to fetch your live enrolled courses and assignments from Google Classroom.
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

      {/* Course List Selector Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center space-x-2">
            <School className="w-5 h-5 text-emerald-600" />
            <span>Enrolled Google Classroom Courses</span>
          </h3>

          {accessToken && (
            <button
              onClick={() => loadLiveClassroomData(accessToken)}
              disabled={isLoadingCourses}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCourses ? "animate-spin" : ""}`} />
              <span>Refresh Classroom Data</span>
            </button>
          )}
        </div>

        {/* Horizontal Scrollable Course Selector Chips */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {courses.map((course) => {
            const isSelected = selectedCourse.id === course.id;
            return (
              <button
                key={course.id}
                onClick={() => handleSelectCourse(course)}
                className={`p-4 rounded-2xl border text-left shrink-0 min-w-[260px] max-w-[300px] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-lg scale-[1.02]"
                    : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700"
                }`}
              >
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    isSelected
                      ? "bg-white/20 text-white border border-white/30"
                      : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                  }`}
                >
                  {course.section || "Active Class"}
                </span>

                <h4 className="font-extrabold text-xs mt-2 line-clamp-1 leading-snug">
                  {course.name}
                </h4>

                <p
                  className={`text-[10px] mt-1 line-clamp-1 font-medium ${
                    isSelected ? "text-emerald-100" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {course.room ? `Room: ${course.room}` : course.descriptionHeading || "Google Classroom"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Course Details Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {selectedCourse.section || "Section A"}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Code: {selectedCourse.enrollmentCode || "GC-2026"}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {selectedCourse.name}
            </h3>

            {selectedCourse.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                {selectedCourse.description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {selectedCourse.alternateLink && (
              <a
                href={selectedCourse.alternateLink}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-all flex items-center space-x-1.5"
              >
                <span>Open in Classroom</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => setShowPostModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Announcement</span>
            </button>
          </div>
        </div>

        {/* Inner Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveSubView("coursework")}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubView === "coursework"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Assignments & CourseWork ({currentCourseWork.length})</span>
          </button>

          <button
            onClick={() => setActiveSubView("announcements")}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubView === "announcements"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Class Stream Announcements ({currentAnnouncements.length})</span>
          </button>

          <button
            onClick={() => setActiveSubView("roster")}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubView === "roster"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Class Roster</span>
          </button>
        </div>

        {/* Tab 1: CourseWork / Assignments */}
        {activeSubView === "coursework" && (
          <div className="space-y-3 pt-2">
            {isLoadingDetails ? (
              <div className="p-8 text-center text-slate-400 text-xs italic space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-500" />
                <span>Fetching coursework assignments from Google Classroom...</span>
              </div>
            ) : currentCourseWork.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">
                No active coursework found for this course in Google Classroom.
              </p>
            ) : (
              currentCourseWork.map((cw) => {
                const isImported = importedAssignmentIds.includes(cw.id);
                let dueDateFormatted = "No due date";
                if (cw.dueDate) {
                  dueDateFormatted = `Due ${cw.dueDate.year}-${cw.dueDate.month}-${cw.dueDate.day}`;
                }

                return (
                  <div
                    key={cw.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {cw.workType || "ASSIGNMENT"}
                        </span>
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {cw.title}
                        </h4>
                      </div>

                      {cw.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 pt-0.5">
                          {cw.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dueDateFormatted}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{cw.maxPoints ? `${cw.maxPoints} Points` : "Ungraded"}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      {cw.alternateLink && (
                        <a
                          href={cw.alternateLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center space-x-1"
                        >
                          <span>Classroom</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        onClick={() => handleImportToAssignments(cw)}
                        disabled={isImported}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-sm transition-all flex items-center space-x-1 cursor-pointer ${
                          isImported
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 cursor-default"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                      >
                        {isImported ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Imported to App</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Sync to Assignments</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Class Stream Announcements */}
        {activeSubView === "announcements" && (
          <div className="space-y-3 pt-2">
            {currentAnnouncements.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">
                No announcements posted in this class stream yet.
              </p>
            ) : (
              currentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Classroom Teacher Announcement</span>
                    </span>
                    <span>{new Date(ann.creationTime || Date.now()).toLocaleDateString()}</span>
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium whitespace-pre-line leading-relaxed">
                    {ann.text}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Class Roster */}
        {activeSubView === "roster" && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                <h4 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>Course Instructors / Teachers</span>
                </h4>

                {currentMembers.teachers.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Faculty instructor: Dr. Academic Professor
                  </p>
                ) : (
                  currentMembers.teachers.map((t, idx) => (
                    <div key={idx} className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {t.profile?.name?.fullName || t.profile?.emailAddress || "Class Instructor"}
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                <h4 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Enrolled Classmates</span>
                </h4>

                {currentMembers.students.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    32 Enrolled Students in this section
                  </p>
                ) : (
                  <div className="space-y-1">
                    {currentMembers.students.map((s, idx) => (
                      <div key={idx} className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {s.profile?.name?.fullName || s.profile?.emailAddress || `Student ${idx + 1}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Post Announcement Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handlePostAnnouncement}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Post to Google Classroom Stream
              </h3>
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-extrabold text-slate-700 dark:text-slate-300">
                Target Course: {selectedCourse.name}
              </span>

              <textarea
                required
                rows={4}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Share an update or question with your class stream..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isPosting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {isPosting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Posting to Google Classroom...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post Announcement</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
