import { useState, useEffect } from 'react';
import {
  UserProfile,
  DsaTopic,
  AptitudeTopic,
  CgpaRecord,
  ExamPlanner,
  CoreSubject,
  Internship,
  Project,
  MistakeLog,
  ExternalCourse,
  StudySession,
  StudyPlan,
  LinkedInTask,
  Quote,
} from '../types';
import { DSA_SYLLABUS } from '../data/dsaSyllabus';
import { APTITUDE_TOPICS } from '../data/aptitudeTopics';
import { CORE_SUBJECTS } from '../data/coreSubjects';
import { LINKEDIN_TASKS } from '../data/linkedinTasks';
import { QUOTES } from '../data/quotes';
import { getSupabaseClient } from './supabase';

const STORAGE_KEYS = {
  PROFILE: 'c2c_profile_v2',
  DSA: 'c2c_dsa_v2',
  APTITUDE: 'c2c_aptitude_v2',
  CGPA: 'c2c_cgpa_v2',
  EXAMS: 'c2c_exams_v2',
  CORE_SUBJECTS: 'c2c_core_subjects_v2',
  INTERNSHIPS: 'c2c_internships_v2',
  PROJECTS: 'c2c_projects_v2',
  MISTAKES: 'c2c_mistakes_v2',
  COURSES: 'c2c_courses_v2',
  SESSIONS: 'c2c_sessions_v2',
  PLANS: 'c2c_plans_v2',
  LINKEDIN: 'c2c_linkedin_v2',
  QUOTES: 'c2c_quotes_v2',
  ACTIVE_STREAK: 'c2c_active_streak_v2',
};

// Initial realistic pre-seeded profile
const INITIAL_PROFILE: UserProfile = {
  id: 'usr-student-2027',
  name: 'Bhagyashree Sharma',
  email: 'msbhagyashree4@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  college: 'National Institute of Technology (NIT)',
  branch: 'Computer Science & Engineering',
  graduationYear: 2027,
  githubUsername: 'bhagyashree-dev',
  leetcodeUsername: 'bhagyashree_code',
  targetCompanies: ['Google', 'Microsoft', 'Atlassian', 'Amazon', 'Adobe', 'Uber'],
  bio: '2nd Year B.Tech CSE | SDE Aspirant | 250+ LeetCode Solved | Building scalable systems & mastering DSA.',
  isSupabaseSynced: false,
};

const INITIAL_CGPA_RECORDS: CgpaRecord[] = [
  { id: 'cg-1', semester: 1, sgpa: 8.85, credits: 22, academicYear: '2023-2024' },
  { id: 'cg-2', semester: 2, sgpa: 9.15, credits: 24, academicYear: '2023-2024' },
  { id: 'cg-3', semester: 3, sgpa: 8.95, credits: 23, academicYear: '2024-2025' },
  { id: 'cg-4', semester: 4, sgpa: 9.30, credits: 24, academicYear: '2024-2025' },
];

const INITIAL_EXAM_PLANNERS: ExamPlanner[] = [
  {
    id: 'ex-1',
    semester: 5,
    subjectCode: 'CS501',
    subjectName: 'Design and Analysis of Algorithms (DAA)',
    examDate: '2026-09-18',
    examTime: '09:30 AM',
    credits: 4,
    difficulty: 'Hard',
    status: 'Upcoming',
    revisionPlan: [
      { day: 'Day 1', topic: 'Asymptotic Notations & Recurrence Relations (Master Theorem)', done: true },
      { day: 'Day 2', topic: 'Divide and Conquer: Strassen, Median of Medians, Quickselect', done: true },
      { day: 'Day 3', topic: 'Greedy Algorithms: Huffman Coding, Activity Selection, Prim/Kruskal', done: false },
      { day: 'Day 4', topic: 'Dynamic Programming: Matrix Chain Multi, 0/1 Knapsack, LCS', done: false },
      { day: 'Day 5', topic: 'NP-Completeness: Reduction, 3-SAT, Vertex Cover, Clique', done: false },
    ],
  },
  {
    id: 'ex-2',
    semester: 5,
    subjectCode: 'CS502',
    subjectName: 'Database Management Systems (DBMS)',
    examDate: '2026-09-22',
    examTime: '02:00 PM',
    credits: 4,
    difficulty: 'Medium',
    status: 'Upcoming',
    revisionPlan: [
      { day: 'Day 1', topic: 'Relational Algebra & Tuple Relational Calculus', done: true },
      { day: 'Day 2', topic: 'Normalization: 1NF to BCNF and Lossless Join Decomposition', done: true },
      { day: 'Day 3', topic: 'Transaction Management: Serializability, Conflict vs View', done: false },
      { day: 'Day 4', topic: 'Concurrency Control: 2PL, Timestamp Ordering, Lock Escalation', done: false },
    ],
  },
  {
    id: 'ex-3',
    semester: 5,
    subjectCode: 'CS503',
    subjectName: 'Computer Networks (CN)',
    examDate: '2026-09-26',
    examTime: '09:30 AM',
    credits: 3,
    difficulty: 'Medium',
    status: 'Upcoming',
    revisionPlan: [
      { day: 'Day 1', topic: 'Data Link Layer: Sliding Window, CRC, CSMA/CD', done: true },
      { day: 'Day 2', topic: 'Network Layer: Subnetting, Dijkstra Routing, Distance Vector', done: false },
      { day: 'Day 3', topic: 'Transport Layer: TCP Congestion Control (Tahoe, Reno)', done: false },
      { day: 'Day 4', topic: 'Application Layer: DNS, HTTP, SMTP, TLS', done: false },
    ],
  },
];

const INITIAL_INTERNSHIPS: Internship[] = [
  {
    id: 'int-1',
    companyName: 'Google',
    roleTitle: 'Software Engineering Intern (Summer 2027)',
    location: 'Bangalore / Hyderabad',
    stipendOrCtc: '₹1,25,000 / month',
    applicationDate: '2026-08-01',
    deadline: '2026-08-30',
    duration: '2 Months (May - July)',
    status: 'Online Assessment',
    roundsInfo: [
      { roundName: 'Resume Screening', date: '2026-08-05', status: 'Cleared', notes: 'Shortlisted with ATS score 92%' },
      { roundName: 'Google Online Challenge (GOC)', date: '2026-08-20', status: 'Pending', notes: '2 DP + Graph questions' },
      { roundName: 'Technical Interview 1', date: 'TBD', status: 'Pending', notes: 'DSA & problem solving' },
      { roundName: 'Technical Interview 2', date: 'TBD', status: 'Pending', notes: 'DSA + System reasoning' },
    ],
    notes: 'Focus on Graph BFS/DFS, Disjoint Set Union (DSU), and 2D dynamic programming.',
    jobLink: 'https://careers.google.com/students',
  },
  {
    id: 'int-2',
    companyName: 'Microsoft',
    roleTitle: 'SDE Intern',
    location: 'Noida / Hyderabad / Remote',
    stipendOrCtc: '₹1,00,000 / month',
    applicationDate: '2026-08-05',
    deadline: '2026-09-05',
    duration: '2 Months',
    status: 'Applied',
    roundsInfo: [
      { roundName: 'Application Submission', date: '2026-08-05', status: 'Cleared', notes: 'Applied via employee referral' },
      { roundName: 'Codility OA', date: '2026-08-28', status: 'Pending', notes: '3 coding questions in 90 mins' },
    ],
    notes: 'Tree traversals and string manipulation are high probability.',
    jobLink: 'https://careers.microsoft.com',
  },
  {
    id: 'int-3',
    companyName: 'Atlassian',
    roleTitle: 'Software Engineer Intern (Platform)',
    location: 'Bengaluru (Remote-First)',
    stipendOrCtc: '₹1,20,000 / month',
    applicationDate: '2026-07-25',
    deadline: '2026-08-15',
    duration: '2 Months',
    status: 'Interviewing',
    roundsInfo: [
      { roundName: 'HackerRank OA', date: '2026-08-02', status: 'Cleared', notes: 'Solved 3/3 questions with optimal O(n)' },
      { roundName: 'Values & Technical Round 1', date: '2026-08-19', status: 'Pending', notes: 'Data structures + concurrency' },
      { roundName: 'System Design / Craft Round', date: 'TBD', status: 'Pending', notes: 'LLD (Parking Lot / Rate Limiter)' },
    ],
    notes: 'Revise Atlassian values: "Open company, no bullshit", "Build with heart & balance".',
    jobLink: 'https://www.atlassian.com/company/careers',
  },
  {
    id: 'int-4',
    companyName: 'Amazon',
    roleTitle: 'Software Development Engineer Intern',
    location: 'Bangalore / Chennai',
    stipendOrCtc: '₹1,10,000 / month',
    applicationDate: '2026-07-10',
    deadline: '2026-07-31',
    duration: '2 Months',
    status: 'Applied',
    roundsInfo: [
      { roundName: 'Amazon OA1 (Debugging & Logic)', date: '2026-07-18', status: 'Cleared', notes: '7/7 debugged' },
      { roundName: 'Amazon OA2 (Coding & Work Simulation)', date: '2026-07-22', status: 'Cleared', notes: 'Passed all hidden test cases' },
    ],
    notes: 'Master the 16 Leadership Principles (Customer Obsession, Bias for Action, Deliver Results).',
    jobLink: 'https://www.amazon.jobs',
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Distributed In-Memory Cache Engine',
    shortDescription: 'High-concurrency distributed key-value store with LRU eviction policy, TCP socket communication, and Redis-compatible protocol serialization.',
    techStack: ['Go', 'TCP/IP', 'Concurrency', 'Docker', 'Redis Protocol'],
    githubRepoUrl: 'https://github.com/bhagyashree-dev/Distributed-Cache-Engine',
    liveDemoUrl: 'https://github.com/bhagyashree-dev/Distributed-Cache-Engine#benchmarks',
    highlights: [
      'Engineered an in-memory key-value cache in Go delivering 45,000+ QPS under concurrent load.',
      'Implemented segmented mutex locking reducing lock contention by 65% across 16 worker threads.',
      'Constructed custom RESP (Redis Serialization Protocol) parser for seamless client interoperability.',
    ],
    starsCount: 34,
    status: 'Completed',
  },
  {
    id: 'proj-2',
    title: 'Campus2Career: Placement Readiness Hub',
    shortDescription: 'Modern dashboard for engineering students tracking DSA, Academic CGPA, core CS confidence, aptitude drills, and AI-driven personalized revision plans.',
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Gemini AI', 'Supabase', 'Recharts'],
    githubRepoUrl: 'https://github.com/bhagyashree-dev/Campus2Career',
    liveDemoUrl: 'https://campus2career.app',
    highlights: [
      'Integrated Gemini 3.7 Flash for instant AI interview coaching and multi-day curriculum generation.',
      'Designed responsive dashboard with real-time LeetCode & GitHub stats and streak computation.',
      'Implemented complete PostgreSQL schema with strict Row Level Security (RLS) policies.',
    ],
    starsCount: 48,
    status: 'Deployed',
  },
  {
    id: 'proj-3',
    title: 'Smart ATS Resume & Job Description Matcher',
    shortDescription: 'NLP-powered full-stack application analyzing candidate resumes against job descriptions with semantic similarity scoring and missing keyword recommendation.',
    techStack: ['Python', 'FastAPI', 'spaCy', 'React', 'Tailwind CSS'],
    githubRepoUrl: 'https://github.com/bhagyashree-dev/Smart-ATS-Resume-Analyzer',
    liveDemoUrl: 'https://github.com/bhagyashree-dev/Smart-ATS-Resume-Analyzer',
    highlights: [
      'Processed 500+ resume PDFs extracting entities, skills, and work experience using spaCy NLP pipelines.',
      'Generated actionable bullet point rewrite suggestions boosting recruiter ATS pass rates.',
    ],
    starsCount: 22,
    status: 'Completed',
  },
];

const INITIAL_MISTAKES_LOG: MistakeLog[] = [
  {
    id: 'mst-1',
    logDate: '2026-08-10',
    contextOrCompany: 'LeetCode Weekly Contest 410 - Q3 (Dynamic Programming)',
    mistakeDescription: 'Initialized DP array with 0 instead of -1 for memoization, which caused TLE when subproblem legitimate answer was 0 (recalculating identical states repeatedly).',
    lessonLearned: 'Always initialize memoization tables with -1 (or null) so legitimate 0 return values are recognized as solved states.',
    tags: ['DSA', 'Dynamic Programming', 'Memoization', 'Contest'],
    resolved: true,
  },
  {
    id: 'mst-2',
    logDate: '2026-08-04',
    contextOrCompany: 'Mock Interview (Operating Systems)',
    mistakeDescription: 'Confused Semaphore and Mutex ownership; stated that any thread can unlock a Mutex.',
    lessonLearned: 'A Mutex is an ownership lock (only the thread that locked it can unlock it). A Binary Semaphore is a signaling mechanism (any thread can post/signal it).',
    tags: ['Core CS', 'Operating Systems', 'Concurrency', 'Interview'],
    resolved: true,
  },
  {
    id: 'mst-3',
    logDate: '2026-07-28',
    contextOrCompany: 'HackerRank Online Assessment (Atlassian)',
    mistakeDescription: 'Forgot to handle 32-bit integer overflow when calculating prefix sum products (used standard int instead of long long / BigInt).',
    lessonLearned: 'When constraints state array size up to 10^5 and values up to 10^9, intermediate products or sums will overflow standard integer limits.',
    tags: ['DSA', 'Integer Overflow', 'Edge Cases'],
    resolved: false,
  },
  {
    id: 'mst-4',
    logDate: '2026-07-15',
    contextOrCompany: 'DBMS Technical Viva',
    mistakeDescription: 'Could not clearly explain why B+ Trees are preferred over B-Trees for database indexing.',
    lessonLearned: 'B+ Trees store actual record pointers only in leaf nodes (linked together in a doubly linked list), making sequential range scans extremely fast without traversing intermediate nodes.',
    tags: ['Core CS', 'DBMS', 'Indexing', 'Interview'],
    resolved: true,
  },
];

const INITIAL_EXTERNAL_COURSES: ExternalCourse[] = [
  {
    id: 'crs-1',
    platform: 'Coursera',
    courseTitle: 'Algorithms Specialization (Stanford University)',
    credentialId: 'COURSERA-STF-ALG-89412',
    completionDate: '2026-05-15',
    certificateUrl: 'https://coursera.org/verify/SAMPLE123',
    skillsAcquired: ['Divide & Conquer', 'Master Theorem', 'Greedy Algorithms', 'Dynamic Programming', 'NP-Completeness'],
    isVerified: true,
  },
  {
    id: 'crs-2',
    platform: 'Infosys Springboard',
    courseTitle: 'Enterprise Java & Spring Boot Microservices Development',
    credentialId: 'INFY-SPB-2026-778',
    completionDate: '2026-06-20',
    certificateUrl: 'https://infyspringboard.onwingspan.com',
    skillsAcquired: ['Spring Boot', 'REST APIs', 'JPA/Hibernate', 'Microservices', 'Docker'],
    isVerified: true,
  },
  {
    id: 'crs-3',
    platform: 'HackerRank',
    courseTitle: 'Problem Solving (Advanced) & SQL (Advanced) Certificate',
    credentialId: 'HR-ADV-PS-992144',
    completionDate: '2026-07-02',
    certificateUrl: 'https://www.hackerrank.com/certificates/sample',
    skillsAcquired: ['Advanced SQL', 'Window Functions', 'Graph Algorithms', 'Complexity Optimization'],
    isVerified: true,
  },
  {
    id: 'crs-4',
    platform: 'Udemy',
    courseTitle: 'Mastering System Design for FAANG SDE Interviews',
    credentialId: 'UDE-SYSD-44510',
    completionDate: '2026-07-28',
    certificateUrl: 'https://udemy.com/certificate/sample',
    skillsAcquired: ['Distributed Systems', 'Load Balancing', 'Consistent Hashing', 'Kafka', 'Database Sharding'],
    isVerified: true,
  },
];

const INITIAL_STUDY_SESSIONS: StudySession[] = [
  { id: 'ss-1', category: 'DSA', topicName: 'Graph BFS & Topological Sort (Course Schedule)', durationMinutes: 90, sessionDate: '2026-08-15', notes: 'Solved 2 Medium LeetCode problems with Kahn algorithm.' },
  { id: 'ss-2', category: 'Aptitude', topicName: 'Time, Speed & Distance Drills', durationMinutes: 45, sessionDate: '2026-08-15', notes: 'Solved 15 train & relative speed questions.' },
  { id: 'ss-3', category: 'Core CS', topicName: 'DBMS Concurrency & 2PL Locks', durationMinutes: 60, sessionDate: '2026-08-14', notes: 'Reviewed strict 2PL vs rigorous 2PL.' },
  { id: 'ss-4', category: 'DSA', topicName: 'Binary Tree Level Order & LCA', durationMinutes: 120, sessionDate: '2026-08-14', notes: 'Mastered recursive and iterative LCA.' },
  { id: 'ss-5', category: 'Projects', topicName: 'Campus2Career AI Planner Implementation', durationMinutes: 150, sessionDate: '2026-08-13', notes: 'Wrote Gemini API prompts and schema.' },
  { id: 'ss-6', category: 'Interview Prep', topicName: 'Mock Behavioral (STAR Method) Practice', durationMinutes: 40, sessionDate: '2026-08-12', notes: 'Framed stories for conflict resolution and technical challenges.' },
  { id: 'ss-7', category: 'Academics', topicName: 'DAA Master Theorem Recurrences', durationMinutes: 75, sessionDate: '2026-08-11', notes: 'Solved 10 previous year university exam questions.' },
];

const INITIAL_STUDY_PLANS: StudyPlan[] = [
  {
    id: 'pln-1',
    topicName: 'Dynamic Programming: 1D & 2D Grid Patterns',
    totalDays: 7,
    difficulty: 'Medium-Hard',
    estimatedTotalHours: 21,
    summary: 'Master the 5 essential DP paradigms: 1D recurrence, 0/1 Knapsack, Unbounded Knapsack, LCS, and Matrix Chain Multiplication.',
    isActive: true,
    createdAt: '2026-08-12',
    days: [
      {
        day: 1,
        title: 'Day 1: 1D State Transitions & Fibonacci Variants',
        durationHours: 3,
        subtopics: ['Climbing Stairs', 'House Robber I & II', 'Frog Jump'],
        practiceProblems: ['LeetCode 70 (Climbing Stairs)', 'LeetCode 198 (House Robber)', 'LeetCode 213 (House Robber II)'],
        keyTakeaway: 'Express state as dp[i] = max(dp[i-1], dp[i-2] + val[i]). Optimize space from O(n) to O(1).',
        completed: true,
      },
      {
        day: 2,
        title: 'Day 2: 0/1 Knapsack & Subset Sum',
        durationHours: 3,
        subtopics: ['Subset Sum Equals Target', 'Partition Equal Subset Sum', 'Count Subsets with Sum K'],
        practiceProblems: ['LeetCode 416 (Partition Equal Subset Sum)', 'LeetCode 494 (Target Sum)'],
        keyTakeaway: 'Process items from right to left when using 1D space optimized array.',
        completed: true,
      },
      {
        day: 3,
        title: 'Day 3: Unbounded Knapsack & Coin Change',
        durationHours: 3,
        subtopics: ['Coin Change I (Min Coins)', 'Coin Change II (Total Ways)', 'Rod Cutting Problem'],
        practiceProblems: ['LeetCode 322 (Coin Change)', 'LeetCode 518 (Coin Change II)'],
        keyTakeaway: 'Unbounded knapsack allows picking same denomination multiple times (left to right transition).',
        completed: true,
      },
      {
        day: 4,
        title: 'Day 4: Longest Common Subsequence (LCS) & Strings',
        durationHours: 3,
        subtopics: ['LCS Length', 'Print Longest Common Subsequence', 'Shortest Common Supersequence'],
        practiceProblems: ['LeetCode 1143 (Longest Common Subsequence)', 'LeetCode 1092 (Shortest Common Supersequence)'],
        keyTakeaway: 'dp[i][j] compares prefixes s1[0..i] and s2[0..j].',
        completed: false,
      },
      {
        day: 5,
        title: 'Day 5: Edit Distance & Wildcard Matching',
        durationHours: 3,
        subtopics: ['Insert, Delete, Replace operations', 'Wildcard matching (* and ?)', 'Regular Expression Matching'],
        practiceProblems: ['LeetCode 72 (Edit Distance)', 'LeetCode 44 (Wildcard Matching)'],
        keyTakeaway: 'Carefully handle base cases where one string is empty (indices 0).',
        completed: false,
      },
      {
        day: 6,
        title: 'Day 6: Longest Increasing Subsequence (LIS) & Binary Search',
        durationHours: 3,
        subtopics: ['O(n^2) DP approach', 'O(n log n) Patience Sorting with lower_bound', 'Russian Doll Envelopes'],
        practiceProblems: ['LeetCode 300 (Longest Increasing Subsequence)', 'LeetCode 354 (Russian Doll Envelopes)'],
        keyTakeaway: 'Maintain an array of smallest tail values for increasing subsequences of various lengths.',
        completed: false,
      },
      {
        day: 7,
        title: 'Day 7: DP on Trees & Path Maximums',
        durationHours: 3,
        subtopics: ['Binary Tree Maximum Path Sum', 'Diameter of Binary Tree', 'House Robber III'],
        practiceProblems: ['LeetCode 124 (Binary Tree Maximum Path Sum)', 'LeetCode 337 (House Robber III)'],
        keyTakeaway: 'Postorder traversal returning (val_including_node, val_excluding_node).',
        completed: false,
      },
    ],
  },
];

// Helper to safely read from localStorage
function readStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

// Custom hook providing full reactive state and persistence
export function useAppData() {
  const [profile, setProfileState] = useState<UserProfile>(() => readStorage(STORAGE_KEYS.PROFILE, INITIAL_PROFILE));
  const [dsaList, setDsaListState] = useState<DsaTopic[]>(() => readStorage(STORAGE_KEYS.DSA, DSA_SYLLABUS));
  const [aptitudeList, setAptitudeListState] = useState<AptitudeTopic[]>(() => readStorage(STORAGE_KEYS.APTITUDE, APTITUDE_TOPICS));
  const [cgpaRecords, setCgpaRecordsState] = useState<CgpaRecord[]>(() => readStorage(STORAGE_KEYS.CGPA, INITIAL_CGPA_RECORDS));
  const [examPlanners, setExamPlannersState] = useState<ExamPlanner[]>(() => readStorage(STORAGE_KEYS.EXAMS, INITIAL_EXAM_PLANNERS));
  const [coreSubjects, setCoreSubjectsState] = useState<CoreSubject[]>(() => readStorage(STORAGE_KEYS.CORE_SUBJECTS, CORE_SUBJECTS));
  const [internships, setInternshipsState] = useState<Internship[]>(() => readStorage(STORAGE_KEYS.INTERNSHIPS, INITIAL_INTERNSHIPS));
  const [projects, setProjectsState] = useState<Project[]>(() => readStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS));
  const [mistakesLog, setMistakesLogState] = useState<MistakeLog[]>(() => readStorage(STORAGE_KEYS.MISTAKES, INITIAL_MISTAKES_LOG));
  const [externalCourses, setExternalCoursesState] = useState<ExternalCourse[]>(() => readStorage(STORAGE_KEYS.COURSES, INITIAL_EXTERNAL_COURSES));
  const [studySessions, setStudySessionsState] = useState<StudySession[]>(() => readStorage(STORAGE_KEYS.SESSIONS, INITIAL_STUDY_SESSIONS));
  const [studyPlans, setStudyPlansState] = useState<StudyPlan[]>(() => readStorage(STORAGE_KEYS.PLANS, INITIAL_STUDY_PLANS));
  const [linkedinTasks, setLinkedinTasksState] = useState<LinkedInTask[]>(() => readStorage(STORAGE_KEYS.LINKEDIN, LINKEDIN_TASKS));
  const [quotes, setQuotesState] = useState<Quote[]>(() => readStorage(STORAGE_KEYS.QUOTES, QUOTES));

  // Persistence helpers
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(next));
      return next;
    });
  };

  const toggleDsaComplete = (id: string) => {
    setDsaListState((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed, completedAt: !item.completed ? new Date().toISOString() : undefined } : item
      );
      localStorage.setItem(STORAGE_KEYS.DSA, JSON.stringify(next));
      return next;
    });
  };

  const addDsaTopic = (topic: Omit<DsaTopic, 'id'>) => {
    const newTopic: DsaTopic = { ...topic, id: `dsa-${Date.now()}` };
    setDsaListState((prev) => {
      const next = [newTopic, ...prev];
      localStorage.setItem(STORAGE_KEYS.DSA, JSON.stringify(next));
      return next;
    });
  };

  const toggleAptitudeComplete = (id: string) => {
    setAptitudeListState((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed, completedDate: !item.completed ? new Date().toISOString().split('T')[0] : undefined } : item
      );
      localStorage.setItem(STORAGE_KEYS.APTITUDE, JSON.stringify(next));
      return next;
    });
  };

  const updateAptitudePractice = (id: string, count: number) => {
    setAptitudeListState((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, practiceSolved: count } : item));
      localStorage.setItem(STORAGE_KEYS.APTITUDE, JSON.stringify(next));
      return next;
    });
  };

  const addCgpaRecord = (rec: Omit<CgpaRecord, 'id'>) => {
    const newRec: CgpaRecord = { ...rec, id: `cg-${Date.now()}` };
    setCgpaRecordsState((prev) => {
      // replace if same semester exists
      const filtered = prev.filter((r) => r.semester !== rec.semester);
      const next = [...filtered, newRec].sort((a, b) => a.semester - b.semester);
      localStorage.setItem(STORAGE_KEYS.CGPA, JSON.stringify(next));
      return next;
    });
  };

  const deleteCgpaRecord = (id: string) => {
    setCgpaRecordsState((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.CGPA, JSON.stringify(next));
      return next;
    });
  };

  const addExamPlanner = (exam: Omit<ExamPlanner, 'id'>) => {
    const newExam: ExamPlanner = { ...exam, id: `ex-${Date.now()}` };
    setExamPlannersState((prev) => {
      const next = [...prev, newExam].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(next));
      return next;
    });
  };

  const toggleRevisionItem = (examId: string, dayIndex: number) => {
    setExamPlannersState((prev) => {
      const next = prev.map((exam) => {
        if (exam.id !== examId) return exam;
        const newPlan = exam.revisionPlan.map((step, idx) => (idx === dayIndex ? { ...step, done: !step.done } : step));
        return { ...exam, revisionPlan: newPlan };
      });
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(next));
      return next;
    });
  };

  const updateCoreSubject = (id: string, updates: Partial<CoreSubject>) => {
    setCoreSubjectsState((prev) => {
      const next = prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub));
      localStorage.setItem(STORAGE_KEYS.CORE_SUBJECTS, JSON.stringify(next));
      return next;
    });
  };

  const toggleCoreTopic = (subjectId: string, topicIndex: number) => {
    setCoreSubjectsState((prev) => {
      const next = prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const updatedTopics = sub.keyTopics.map((t, idx) => (idx === topicIndex ? { ...t, completed: !t.completed } : t));
        return { ...sub, keyTopics: updatedTopics };
      });
      localStorage.setItem(STORAGE_KEYS.CORE_SUBJECTS, JSON.stringify(next));
      return next;
    });
  };

  const addInternship = (internship: Omit<Internship, 'id'>) => {
    const newInt: Internship = { ...internship, id: `int-${Date.now()}` };
    setInternshipsState((prev) => {
      const next = [newInt, ...prev];
      localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(next));
      return next;
    });
  };

  const updateInternship = (id: string, updates: Partial<Internship>) => {
    setInternshipsState((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(next));
      return next;
    });
  };

  const deleteInternship = (id: string) => {
    setInternshipsState((prev) => {
      const next = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(next));
      return next;
    });
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProj: Project = { ...project, id: `proj-${Date.now()}` };
    setProjectsState((prev) => {
      const next = [newProj, ...prev];
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      return next;
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjectsState((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjectsState((prev) => {
      const next = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      return next;
    });
  };

  const addMistakeLog = (mistake: Omit<MistakeLog, 'id'>) => {
    const newMistake: MistakeLog = { ...mistake, id: `mst-${Date.now()}` };
    setMistakesLogState((prev) => {
      const next = [newMistake, ...prev];
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(next));
      return next;
    });
  };

  const toggleMistakeResolved = (id: string) => {
    setMistakesLogState((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, resolved: !m.resolved } : m));
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(next));
      return next;
    });
  };

  const deleteMistake = (id: string) => {
    setMistakesLogState((prev) => {
      const next = prev.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(next));
      return next;
    });
  };

  const addExternalCourse = (course: Omit<ExternalCourse, 'id'>) => {
    const newCourse: ExternalCourse = { ...course, id: `crs-${Date.now()}` };
    setExternalCoursesState((prev) => {
      const next = [newCourse, ...prev];
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(next));
      return next;
    });
  };

  const deleteExternalCourse = (id: string) => {
    setExternalCoursesState((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(next));
      return next;
    });
  };

  const addStudySession = (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = { ...session, id: `ss-${Date.now()}` };
    setStudySessionsState((prev) => {
      const next = [newSession, ...prev];
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(next));
      return next;
    });
  };

  const addStudyPlan = (plan: Omit<StudyPlan, 'id' | 'createdAt'>) => {
    const newPlan: StudyPlan = {
      ...plan,
      id: `pln-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStudyPlansState((prev) => {
      const next = [newPlan, ...prev];
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(next));
      return next;
    });
  };

  const toggleStudyPlanDay = (planId: string, dayIndex: number) => {
    setStudyPlansState((prev) => {
      const next = prev.map((plan) => {
        if (plan.id !== planId) return plan;
        const newDays = plan.days.map((d, idx) => (idx === dayIndex ? { ...d, completed: !d.completed } : d));
        return { ...plan, days: newDays };
      });
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(next));
      return next;
    });
  };

  const deleteStudyPlan = (planId: string) => {
    setStudyPlansState((prev) => {
      const next = prev.filter((p) => p.id !== planId);
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(next));
      return next;
    });
  };

  const toggleLinkedInTask = (id: string) => {
    setLinkedinTasksState((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
      localStorage.setItem(STORAGE_KEYS.LINKEDIN, JSON.stringify(next));
      return next;
    });
  };

  const toggleQuoteFavorite = (id: string) => {
    setQuotesState((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, favorite: !q.favorite } : q));
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(next));
      return next;
    });
  };

  // Reset to default pre-seeded state
  const resetToSampleData = () => {
    setProfileState(INITIAL_PROFILE);
    setDsaListState(DSA_SYLLABUS);
    setAptitudeListState(APTITUDE_TOPICS);
    setCgpaRecordsState(INITIAL_CGPA_RECORDS);
    setExamPlannersState(INITIAL_EXAM_PLANNERS);
    setCoreSubjectsState(CORE_SUBJECTS);
    setInternshipsState(INITIAL_INTERNSHIPS);
    setProjectsState(INITIAL_PROJECTS);
    setMistakesLogState(INITIAL_MISTAKES_LOG);
    setExternalCoursesState(INITIAL_EXTERNAL_COURSES);
    setStudySessionsState(INITIAL_STUDY_SESSIONS);
    setStudyPlansState(INITIAL_STUDY_PLANS);
    setLinkedinTasksState(LINKEDIN_TASKS);
    setQuotesState(QUOTES);

    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
    localStorage.setItem(STORAGE_KEYS.DSA, JSON.stringify(DSA_SYLLABUS));
    localStorage.setItem(STORAGE_KEYS.APTITUDE, JSON.stringify(APTITUDE_TOPICS));
    localStorage.setItem(STORAGE_KEYS.CGPA, JSON.stringify(INITIAL_CGPA_RECORDS));
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAM_PLANNERS));
    localStorage.setItem(STORAGE_KEYS.CORE_SUBJECTS, JSON.stringify(CORE_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(INITIAL_INTERNSHIPS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(INITIAL_MISTAKES_LOG));
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_EXTERNAL_COURSES));
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_STUDY_SESSIONS));
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(INITIAL_STUDY_PLANS));
    localStorage.setItem(STORAGE_KEYS.LINKEDIN, JSON.stringify(LINKEDIN_TASKS));
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(QUOTES));
  };

  // Export full user dataset as JSON
  const exportDataJSON = () => {
    const fullData = {
      profile,
      dsaList,
      aptitudeList,
      cgpaRecords,
      examPlanners,
      coreSubjects,
      internships,
      projects,
      mistakesLog,
      externalCourses,
      studySessions,
      studyPlans,
      linkedinTasks,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Campus2Career-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate Cumulative Grade Point Average (CGPA)
  const calculateCGPA = (): { runningCgpa: number; totalCredits: number } => {
    if (cgpaRecords.length === 0) return { runningCgpa: 0, totalCredits: 0 };
    let totalWeighted = 0;
    let totalCredits = 0;
    for (const rec of cgpaRecords) {
      totalWeighted += rec.sgpa * rec.credits;
      totalCredits += rec.credits;
    }
    const runningCgpa = totalCredits > 0 ? Number((totalWeighted / totalCredits).toFixed(2)) : 0;
    return { runningCgpa, totalCredits };
  };

  return {
    profile,
    updateProfile,
    dsaList,
    toggleDsaComplete,
    addDsaTopic,
    aptitudeList,
    toggleAptitudeComplete,
    updateAptitudePractice,
    cgpaRecords,
    addCgpaRecord,
    deleteCgpaRecord,
    calculateCGPA,
    examPlanners,
    addExamPlanner,
    toggleRevisionItem,
    coreSubjects,
    updateCoreSubject,
    toggleCoreTopic,
    internships,
    addInternship,
    updateInternship,
    deleteInternship,
    projects,
    addProject,
    updateProject,
    deleteProject,
    mistakesLog,
    addMistakeLog,
    toggleMistakeResolved,
    deleteMistake,
    externalCourses,
    addExternalCourse,
    deleteExternalCourse,
    studySessions,
    addStudySession,
    studyPlans,
    addStudyPlan,
    toggleStudyPlanDay,
    deleteStudyPlan,
    linkedinTasks,
    toggleLinkedInTask,
    quotes,
    toggleQuoteFavorite,
    resetToSampleData,
    exportDataJSON,
  };
}
