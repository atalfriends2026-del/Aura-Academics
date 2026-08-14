import React, { useState, useEffect } from "react";
import { ViewMode, DashboardTab, Course, Assignment, ScheduleEvent, NotificationItem, AchievementBadge, AttendanceRecord } from "./types";
import {
  initialProfile,
  initialCourses,
  initialAssignments,
  initialScheduleEvents,
  initialNotifications,
  initialAttendanceRecords,
} from "./data/initialData";
import { INITIAL_BADGES, evaluateBadges } from "./data/badgeData";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { LandingPage } from "./components/LandingPage";
import { MySubjectsTab } from "./components/MySubjectsTab";
import { BookLibraryTab } from "./components/BookLibraryTab";
import { VideoLibraryTab } from "./components/VideoLibraryTab";
import { OverviewTab } from "./components/OverviewTab";
import { CoursesTab } from "./components/CoursesTab";
import { AssignmentsTab } from "./components/AssignmentsTab";
import { ScheduleTab } from "./components/ScheduleTab";
import { GoogleClassroomTab } from "./components/GoogleClassroomTab";
import { AnalyticsTab } from "./components/AnalyticsTab";
import { FocusTab } from "./components/FocusTab";
import { LearningPathsTab } from "./components/LearningPathsTab";
import { QuizTab } from "./components/QuizTab";
import { SchoolFinderTab } from "./components/SchoolFinderTab";
import { VideoAnimatorTab } from "./components/VideoAnimatorTab";
import { AITutorModal } from "./components/AITutorModal";
import { VoiceCompanionModal } from "./components/VoiceCompanionModal";
import { TaskModal } from "./components/TaskModal";
import { CourseModal } from "./components/CourseModal";
import { NotificationDrawer } from "./components/NotificationDrawer";
import { BadgeGalleryModal } from "./components/BadgeGalleryModal";
import { NewBadgeUnlockedModal } from "./components/NewBadgeUnlockedModal";

export default function App() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<ViewMode>("landing");
  const [activeTab, setActiveTab] = useState<DashboardTab>("my-subjects");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // App Datasets State
  const [userProfile, setUserProfile] = useState(initialProfile);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(initialScheduleEvents);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [badges, setBadges] = useState<AchievementBadge[]>(INITIAL_BADGES);

  // Modals & Drawers
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isVoiceCompanionOpen, setIsVoiceCompanionOpen] = useState(false);
  const [aiTutorContext, setAiTutorContext] = useState<string | undefined>(undefined);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBadgeGalleryOpen, setIsBadgeGalleryOpen] = useState(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<AchievementBadge | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Evaluate digital badges on course progress changes
  useEffect(() => {
    const { updatedBadges, newlyUnlockedBadges } = evaluateBadges(courses, badges);
    setBadges(updatedBadges);

    if (newlyUnlockedBadges.length > 0) {
      const firstUnlocked = newlyUnlockedBadges[0];
      setNewlyUnlockedBadge(firstUnlocked);

      // Post notification alert
      const newNotif: NotificationItem = {
        id: "notif-badge-" + Date.now(),
        title: `🎉 Badge Unlocked: ${firstUnlocked.title}`,
        message: `You earned the "${firstUnlocked.title}" digital achievement badge! +${firstUnlocked.xpPoints} XP`,
        timestamp: "Just now",
        type: "announcement",
        unread: true,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  }, [courses]);

  // Dark mode side effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handlers
  const handleToggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleToggleAssignmentStatus = (assignmentId: string) => {
    setAssignments((prev) =>
      prev.map((item) => {
        if (item.id === assignmentId) {
          const nextStatus =
            item.status === "Pending"
              ? "Submitted"
              : item.status === "Submitted"
              ? "Graded"
              : "Pending";
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleSaveNewTask = (newTask: Assignment) => {
    setAssignments((prev) => [newTask, ...prev]);
  };

  const handleAddScheduleEvent = (newEvent: ScheduleEvent) => {
    setScheduleEvents((prev) => [...prev, newEvent]);
  };

  const handleAddAttendanceRecord = (newRecord: AttendanceRecord) => {
    setAttendanceRecords((prev) => [newRecord, ...prev]);
  };

  const handleOpenAITutorWithContext = (courseTitle: string) => {
    setAiTutorContext(courseTitle);
    setIsAITutorOpen(true);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    if (selectedCourseForModal?.id === updatedCourse.id) {
      setSelectedCourseForModal(updatedCourse);
    }
  };

  const pendingAssignmentsCount = assignments.filter((a) => a.status === "Pending").length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors duration-200 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Ambient background blobs for frosted glass effect */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Global Header */}
      <Header
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        user={userProfile}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAITutor={() => {
          setAiTutorContext(undefined);
          setIsAITutorOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unlockedBadgesCount={badges.filter((b) => b.unlocked).length}
        onOpenBadgeGallery={() => setIsBadgeGalleryOpen(true)}
      />

      {/* Main Body View Switching */}
      {currentView === "landing" ? (
        <LandingPage
          onLaunchDashboard={() => {
            setCurrentView("dashboard");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden min-h-[calc(100vh-4rem)]">
          
          {/* Collapsible Maximizable/Minimizable Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onBack={() => {
              setActiveTab("my-subjects");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            user={userProfile}
            pendingAssignmentsCount={pendingAssignmentsCount}
            onOpenAITutor={() => {
              setAiTutorContext(undefined);
              setIsAITutorOpen(true);
            }}
          />

          {/* Dashboard Main Workspace Area */}
          <main className="flex-1 overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8 space-y-6 relative z-10">
            
            {activeTab === "my-subjects" && (
              <MySubjectsTab
                onOpenBookLibrary={() => setActiveTab("book-library")}
                onOpenVideoLibrary={() => setActiveTab("video-library")}
                onOpenAITutor={(ctx) => {
                  setAiTutorContext(ctx);
                  setIsAITutorOpen(true);
                }}
              />
            )}

            {activeTab === "book-library" && (
              <BookLibraryTab
                onOpenAITutor={(ctx) => {
                  setAiTutorContext(ctx);
                  setIsAITutorOpen(true);
                }}
              />
            )}

            {activeTab === "video-library" && (
              <VideoLibraryTab
                onOpenAITutor={(ctx) => {
                  setAiTutorContext(ctx);
                  setIsAITutorOpen(true);
                }}
              />
            )}

            {activeTab === "overview" && (
              <OverviewTab
                user={userProfile}
                courses={courses}
                assignments={assignments}
                onToggleAssignmentStatus={handleToggleAssignmentStatus}
                onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
                onOpenAITutor={() => {
                  setAiTutorContext(undefined);
                  setIsAITutorOpen(true);
                }}
                onOpenCourseModal={(course) => setSelectedCourseForModal(course)}
                onSwitchTab={setActiveTab}
                badges={badges}
                onOpenBadgeGallery={() => setIsBadgeGalleryOpen(true)}
              />
            )}

            {activeTab === "courses" && (
              <CoursesTab
                courses={courses}
                onOpenCourseModal={(course) => setSelectedCourseForModal(course)}
                onOpenAITutorWithContext={handleOpenAITutorWithContext}
                onUpdateCourse={handleUpdateCourse}
                badges={badges}
                onOpenBadgeGallery={() => setIsBadgeGalleryOpen(true)}
              />
            )}

            {activeTab === "assignments" && (
              <AssignmentsTab
                assignments={assignments}
                onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
                onToggleAssignmentStatus={handleToggleAssignmentStatus}
              />
            )}

            {activeTab === "schedule" && (
              <ScheduleTab
                events={scheduleEvents}
                onAddEvent={handleAddScheduleEvent}
                attendanceRecords={attendanceRecords}
                onAddAttendanceRecord={handleAddAttendanceRecord}
              />
            )}

            {activeTab === "classroom" && (
              <GoogleClassroomTab
                onImportAssignment={handleSaveNewTask}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsTab
                user={userProfile}
                courses={courses}
                assignments={assignments}
              />
            )}

            {activeTab === "focus" && <FocusTab />}
            {activeTab === "learning-path" && <LearningPathsTab />}
            {activeTab === "quiz" && <QuizTab courses={courses} />}
            {activeTab === "school-finder" && <SchoolFinderTab />}
            {activeTab === "video-animator" && <VideoAnimatorTab />}

          </main>
        </div>
      )}

      {/* Global Modals & Drawers */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        initialCourseContext={aiTutorContext}
      />

      <VoiceCompanionModal
        isOpen={isVoiceCompanionOpen}
        onClose={() => setIsVoiceCompanionOpen(false)}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaveTask={handleSaveNewTask}
      />

      <CourseModal
        course={selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        onOpenAITutor={handleOpenAITutorWithContext}
        onUpdateCourse={handleUpdateCourse}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      {/* Digital Badges Showcase Modal */}
      {isBadgeGalleryOpen && (
        <BadgeGalleryModal
          badges={badges}
          onClose={() => setIsBadgeGalleryOpen(false)}
        />
      )}

      {/* New Badge Unlocked Celebration Modal */}
      <NewBadgeUnlockedModal
        badge={newlyUnlockedBadge}
        onClose={() => setNewlyUnlockedBadge(null)}
      />

    </div>
  );
}
