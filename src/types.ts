export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  college: string;
  branch: string;
  graduationYear: number;
  githubUsername: string;
  leetcodeUsername: string;
  targetRole?: string;
  targetCompanies: string[];
  bio?: string;
  streakCount?: number;
  isSupabaseSynced?: boolean;
}

export interface Quote {
  id: string;
  quote: string;
  author: string;
  designation: string;
  category: 'Determination' | 'Wisdom' | 'Hard Work' | 'Leadership' | 'Vision';
  favorite?: boolean;
}

export interface DsaTopic {
  id: string;
  category: 'Arrays' | 'Strings' | 'Two Pointers' | 'Sliding Window' | 'Linked Lists' | 'Stacks & Queues' | 'Trees & BST' | 'Graphs' | 'Dynamic Programming' | 'Greedy' | 'Backtracking' | 'Bit Manipulation' | 'Trie';
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcodeSlug?: string;
  leetcodeUrl?: string;
  keyPattern?: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface DsaStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  acceptanceRate: number;
  submissionCalendar: Record<string, number>;
  isLive: boolean;
}

export interface AptitudeTopic {
  id: string;
  category: 'Quantitative' | 'Reasoning' | 'Verbal';
  title: string;
  dayNumber?: number;
  formulas?: string[];
  keyConcept?: string;
  completed: boolean;
  completedDate?: string;
  practiceTarget?: number;
  practiceSolved?: number;
}

export interface CgpaRecord {
  id: string;
  semester: number;
  sgpa: number;
  credits: number;
  academicYear?: string;
}

export interface ExamPlanner {
  id: string;
  semester: number;
  subjectCode: string;
  subjectName: string;
  examDate: string; // YYYY-MM-DD
  examTime?: string;
  credits?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  status: 'Upcoming' | 'Revising' | 'Completed';
  revisionPlan: {
    day: string;
    topic: string;
    done: boolean;
  }[];
}

export interface CoreSubject {
  id: string;
  subjectName: string;
  category: 'Core CS' | 'Systems' | 'Software Engineering';
  confidenceLevel: number; // 1 to 5
  status: 'Not Started' | 'Learning' | 'Confident' | 'Mastered';
  keyTopics: {
    name: string;
    completed: boolean;
  }[];
  notes?: string;
  frequentlyAskedQuestions?: string[];
}

export interface Internship {
  id: string;
  companyName: string;
  roleTitle: string;
  location?: string;
  stipendOrCtc?: string;
  applicationDate?: string;
  deadline?: string;
  duration?: string;
  status:
    | 'Bookmarked'
    | 'Applied'
    | 'Online Assessment'
    | 'OA Scheduled'
    | 'Technical Round'
    | 'HR Round'
    | 'Interviewing'
    | 'Offered'
    | 'Offer'
    | 'Rejected'
    | 'Completed';
  roundsInfo?: {
    roundName: string;
    date: string;
    status: 'Pending' | 'Cleared' | 'Failed';
    notes: string;
  }[];
  notes?: string;
  jobLink?: string;
}
export type InternshipApplication = Internship;

export interface Project {
  id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  techStack: string[];
  githubRepoUrl?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  liveUrl?: string;
  highlights?: string[];
  starBulletPoints?: string[];
  starsCount?: number;
  lastUpdated?: string;
  status?: 'In Progress' | 'Completed' | 'Deployed';
}
export type ProjectItem = Project;

export interface MistakeLog {
  id: string;
  date?: string;
  logDate?: string;
  context?: string;
  contextOrCompany?: string; // e.g. "Mock Interview - Amazon", "LeetCode Contest 390", "OS Viva"
  mistakeDescription?: string;
  mistake?: string;
  lessonLearned?: string;
  lesson?: string;
  tags?: string[];
  tag?: string;
  category?: string;
  severity?: 'High' | 'Medium' | 'Low';
  resolved: boolean;
}
export type MistakeItem = MistakeLog;

export interface ExternalCourse {
  id: string;
  platform: 'Coursera' | 'Infosys Springboard' | 'HackerRank' | 'Udemy' | 'NPTEL' | 'AWS/GCP' | 'Other' | string;
  courseTitle?: string;
  title?: string;
  credentialId?: string;
  completionDate?: string;
  certificateUrl?: string;
  skillsAcquired?: string[];
  isVerified?: boolean;
  status?: 'In Progress' | 'Completed';
  progress?: number;
  totalModules?: number;
  completedModules?: number;
}
export type CourseCertificate = ExternalCourse;

export interface StudySession {
  id: string;
  category: 'DSA' | 'Aptitude' | 'Academics' | 'Projects' | 'Core CS' | 'Interview Prep' | string;
  topicName?: string;
  durationMinutes: number;
  sessionDate?: string;
  date?: string;
  notes?: string;
}

export interface StudyPlanDay {
  day: number;
  title: string;
  durationHours: number;
  subtopics: string[];
  practiceProblems: string[];
  keyTakeaway: string;
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  topicName: string;
  totalDays: number;
  difficulty: string;
  estimatedTotalHours: number;
  summary: string;
  days: StudyPlanDay[];
  isActive: boolean;
  createdAt: string;
}

export interface LinkedInTask {
  id: string;
  taskKey?: string;
  taskTitle?: string;
  title?: string;
  description: string;
  category: string;
  isCompleted?: boolean;
  completed?: boolean;
  frequency?: string;
}
export type LinkedinTask = LinkedInTask;

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export type TabType =
  | 'overview'
  | 'dsa'
  | 'aptitude'
  | 'academics'
  | 'internships'
  | 'projects'
  | 'mistakes'
  | 'courses'
  | 'productivity'
  | 'ai-mentor'
  | 'ai-planner'
  | 'linkedin';
