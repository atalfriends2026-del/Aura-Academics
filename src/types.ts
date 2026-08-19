export type ViewMode = "landing" | "dashboard";

export type DashboardTab =
  | "my-subjects"
  | "book-library"
  | "video-library"
  | "overview"
  | "courses"
  | "assignments"
  | "schedule"
  | "classroom"
  | "analytics"
  | "focus"
  | "learning-path"
  | "quiz"
  | "school-finder"
  | "video-animator"
  | "theme-settings";

export type ThemeId =
  | "ocean-mode"
  | "aurora"
  | "ai-multiple-fields"
  | "ai-education"
  | "multiple-galaxy"
  | "starlight-andromeda"
  | "cosmic-nebula"
  | "supernova-gold"
  | "deep-void"
  | "light"
  | "dark";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  category: "ai-theme" | "galaxy" | "classic";
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentGlow: string;
  previewGradient: string;
  badgeLabel?: string;
  hasParticles: boolean;
  hasSpirals: boolean;
}

export interface UserThemeSettings {
  activeThemeId: ThemeId;
  enableStarParticles: boolean;
  enableCosmicGlow: boolean;
  enableSpiralRotation: boolean;
  enableShootingStars: boolean;
  enableAIHolograms?: boolean;
  enableCyberHUD?: boolean;
  galaxyWallpaperIntensity: number; // 20 to 100
  cardGlassmorphism: "crystal" | "frosted" | "solid";
  accentPalette: "cosmic-purple" | "starlight-cyan" | "celestial-gold" | "nebula-magenta" | "emerald-aurora" | "cyber-cyan" | "ocean-cyan";
  fontSizeScale: "compact" | "normal" | "spacious";
  soundEffects: boolean;
}


export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "short-answer";
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
}


export interface LearningNode {
  id: string;
  title: string;
  description: string;
  status: "locked" | "available" | "in-progress" | "completed";
  type: "concept" | "quiz" | "project" | "resource";
  estimatedMinutes: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  nodes: LearningNode[];
}

export interface CourseResource {
  id: string;
  title: string;
  url: string;
  type: "Lecture Material" | "Textbook" | "Research Paper" | "Other";
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  room: string;
  schedule: string;
  credits: number;
  gradePercentage: number;
  letterGrade: string;
  progress: number;
  color: string; // TailWind color key or hex
  bgGradient: string;
  syllabusProgress: number;
  nextLecture: string;
  announcement?: string;
  modules: CourseModule[];
  resources?: CourseResource[];
}

export interface CourseModule {
  id: string;
  title: string;
  topics: string[];
  isCompleted: boolean;
  dueDate?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  dueDate: string;
  dueTime: string;
  priority: "High" | "Medium" | "Normal";
  status: "Pending" | "Submitted" | "Graded";
  score?: string;
  maxScore?: number;
  notes?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  courseCode: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string;
  endTime: string;
  location: string;
  type: "Class" | "Lab" | "Exam" | "Study Group";
  color: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  mode?: "general" | "quiz" | "summary" | "plan";
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  major: string;
  degree: string;
  university: string;
  cumulativeGpa: number;
  targetGpa: number;
  completedCredits: number;
  totalRequiredCredits: number;
  attendanceRate: number;
  studyHoursThisWeek: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "grade" | "announcement" | "deadline" | "system";
  unread: boolean;
}

export interface AttendanceRecord {
  id: string;
  subjectTitle: string;
  subjectCode: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., 09:30 AM
  status: "Present" | "Absent" | "Excused" | "Late";
  location: string;
  syncedToGoogleCalendar?: boolean;
  googleCalendarEventId?: string;
  notes?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: "Milestone" | "Course Completion" | "Module Streak" | "Mastery";
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  currentValue: number;
  targetValue: number;
  progressPercentage: number;
  gradient: string;
  borderAccent: string;
  bgLight: string;
  textColor: string;
  xpPoints: number;
}

export interface UploadedSubjectPDF {
  id: string;
  subjectId: string;
  subjectName: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  fileDataUrl?: string;
  pageCount?: number;
  gradeStandard?: string;
  category?: "Homework" | "Notes" | "Question Paper" | "Textbook" | "Reference";
  description?: string;
  previewText?: string;
  splitPages?: Array<{ pageNumber: number; title: string; excerpt: string }>;
}


