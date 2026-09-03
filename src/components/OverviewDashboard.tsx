import React, { useState } from 'react';
import {
  Code2,
  Brain,
  GraduationCap,
  Briefcase,
  FolderGit2,
  AlertTriangle,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  Send,
  Flame,
  CheckCircle2,
  Calendar,
  Zap,
  ArrowUpRight,
  Target,
} from 'lucide-react';
import { QuoteBanner } from './QuoteBanner';
import {
  UserProfile,
  Quote,
  DsaTopic,
  AptitudeTopic,
  CgpaRecord,
  ExamPlanner,
  InternshipApplication,
  ProjectItem,
  MistakeItem,
  TabType,
} from '../types';

interface OverviewDashboardProps {
  profile: UserProfile;
  quotes: Quote[];
  onToggleFavoriteQuote: (id: string) => void;
  dsaList: DsaTopic[];
  aptitudeList: AptitudeTopic[];
  cgpaInfo: { runningCgpa: number; totalCredits: number };
  examPlanners: ExamPlanner[];
  applications: InternshipApplication[];
  projects: ProjectItem[];
  mistakes: MistakeItem[];
  onSelectTab: (tab: TabType) => void;
  onStartPomodoro: () => void;
  isDark: boolean;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  profile,
  quotes,
  onToggleFavoriteQuote,
  dsaList,
  aptitudeList,
  cgpaInfo,
  examPlanners,
  applications,
  projects,
  mistakes,
  onSelectTab,
  onStartPomodoro,
  isDark,
}) => {
  const [quickMentorInput, setQuickMentorInput] = useState('');
  const [mentorChatHistory, setMentorChatHistory] = useState([
    {
      role: 'assistant',
      text: 'Based on your LeetCode heatmap, your consistency is improving! I suggest focusing on Graph Algorithms this week as they appear in 70% of Google interviews.',
    },
    {
      role: 'user',
      text: 'Thanks! Can you generate a 3-day study plan for Dijkstra\'s and A* Search?',
    },
    {
      role: 'assistant',
      text: 'Plan generated in the AI Study Planner tab. Start with BFS/DFS foundations today.',
    },
  ]);

  // DSA Solved breakdown
  const dsaSolved = dsaList.filter((d) => d.completed).length;
  const easySolved = dsaList.filter((d) => d.completed && d.difficulty === 'Easy').length;
  const mediumSolved = dsaList.filter((d) => d.completed && d.difficulty === 'Medium').length;
  const hardSolved = dsaList.filter((d) => d.completed && d.difficulty === 'Hard').length;

  const aptSolved = aptitudeList.filter((a) => a.completed).length;
  const activeApps = applications.filter((a) => a.status !== 'Rejected');
  const activeMistakes = mistakes.filter((m) => !m.resolved);

  const handleQuickMentorSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickMentorInput.trim()) return;

    setMentorChatHistory((prev) => [
      ...prev,
      { role: 'user', text: quickMentorInput },
      {
        role: 'assistant',
        text: `Great question regarding "${quickMentorInput.slice(0, 30)}...". Let's deep-dive into this inside the full AI Placement Mentor!`,
      },
    ]);
    setQuickMentorInput('');
  };

  return (
    <div className="space-y-6">
      {/* Motivational Quote Banner styled according to Clean Minimalism */}
      <QuoteBanner
        quotes={quotes}
        onToggleFavorite={onToggleFavoriteQuote}
        isDark={isDark}
        cgpa={cgpaInfo.runningCgpa || 8.92}
        streak={profile.streakCount || 14}
      />

      {/* Main Clean Minimalism 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Metric Cards, 2-Col Sub-grid, and Aptitude Banner */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {/* Top 3 Progress Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* LeetCode Progress */}
            <div
              onClick={() => onSelectTab('dsa')}
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all hover:border-[#748D92]/60 ${
                isDark ? 'bg-[#2E3944] border-[#748D92]/30 shadow-xs' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                  LeetCode Progress
                </p>
                <Code2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`} />
              </div>
              <div className="flex items-baseline space-x-2 my-2">
                <span className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-[#D3D9D4]' : 'text-slate-900'}`}>
                  {dsaSolved || 139}
                </span>
                <span className={`text-xs font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>/ 2200</span>
              </div>
              <div>
                <div className={`flex gap-1 h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-[#212A31]' : 'bg-slate-800/80'}`}>
                  <div style={{ width: '50%' }} className="bg-[#124E66] rounded-full" title="Easy" />
                  <div style={{ width: '35%' }} className="bg-[#748D92] rounded-full" title="Medium" />
                  <div style={{ width: '15%' }} className="bg-[#D3D9D4] rounded-full" title="Hard" />
                </div>
                <div className="flex justify-between text-[9px] mt-1.5 font-medium">
                  <span className={isDark ? 'text-[#D3D9D4]' : 'text-emerald-400'}>{easySolved || 65} Easy</span>
                  <span className={isDark ? 'text-[#748D92]' : 'text-amber-400'}>{mediumSolved || 58} Med</span>
                  <span className={isDark ? 'text-[#D3D9D4]' : 'text-rose-400'}>{hardSolved || 16} Hard</span>
                </div>
              </div>
            </div>

            {/* Git Contributions */}
            <div
              onClick={() => onSelectTab('projects')}
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all hover:border-[#748D92]/60 ${
                isDark ? 'bg-[#2E3944] border-[#748D92]/30 shadow-xs' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                  Git Contributions
                </p>
                <FolderGit2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#D3D9D4]' : 'text-teal-400'}`} />
              </div>
              <div className="flex items-baseline space-x-2 my-2">
                <span className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-[#D3D9D4]' : 'text-slate-900'}`}>
                  42
                </span>
                <span className={`text-xs font-medium ${isDark ? 'text-[#D3D9D4]' : 'text-teal-400'}`}>This Month</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-3 h-3 rounded-xs ${isDark ? 'bg-[#212A31]' : 'bg-slate-800'}`} />
                <div className="w-3 h-3 rounded-xs bg-[#748D92]/40" />
                <div className="w-3 h-3 rounded-xs bg-[#748D92]" />
                <div className="w-3 h-3 rounded-xs bg-[#124E66]" />
                <div className="w-3 h-3 rounded-xs bg-[#165b77]" />
                <div className="w-3 h-3 rounded-xs bg-[#D3D9D4]" />
                <div className="w-3 h-3 rounded-xs bg-[#124E66]" />
                <div className={`w-3 h-3 rounded-xs ${isDark ? 'bg-[#212A31]' : 'bg-slate-800'}`} />
              </div>
            </div>

            {/* Time Today / Productivity */}
            <div
              onClick={onStartPomodoro}
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all hover:border-[#748D92]/60 ${
                isDark ? 'bg-[#2E3944] border-[#748D92]/30 shadow-xs' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                  Time Today
                </p>
                <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-[#D3D9D4]' : 'text-orange-400'}`} />
              </div>
              <div className="flex items-baseline space-x-2 my-2">
                <span className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-[#D3D9D4]' : 'text-slate-900'}`}>
                  4h 20m
                </span>
              </div>
              <p className={`text-[10px] font-semibold flex items-center gap-1 ${isDark ? 'text-[#D3D9D4]' : 'text-teal-400'}`}>
                <span>+12% vs yesterday</span>
                <span className={`font-normal ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>• 3 Pomodoros</span>
              </p>
            </div>
          </div>

          {/* 2-Column Middle Grid: Upcoming Interviews & Major Projects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Upcoming Interviews */}
            <div
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                isDark ? 'bg-[#2E3944] border-[#748D92]/30' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>
                    <Briefcase className={`w-4 h-4 ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`} /> Upcoming Interviews
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${
                    isDark ? 'bg-[#124E66]/40 text-[#D3D9D4] border-[#748D92]/40' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {activeApps.length || 3} Active
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Google */}
                  <div
                    onClick={() => onSelectTab('internships')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/30 hover:bg-[#124E66]/30' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isDark ? 'bg-[#124E66] text-[#D3D9D4]' : 'bg-blue-500/15 text-blue-400'
                      }`}>
                        G
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>Google</p>
                        <p className={`text-[10px] ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>STEP Intern • Tomorrow</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isDark ? 'text-[#D3D9D4] bg-[#124E66] border-[#748D92]/40' : 'text-teal-400 bg-teal-500/10 border-teal-500/20'
                    }`}>
                      Technical
                    </span>
                  </div>

                  {/* Meta */}
                  <div
                    onClick={() => onSelectTab('internships')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/30 hover:bg-[#124E66]/30' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isDark ? 'bg-[#124E66] text-[#D3D9D4]' : 'bg-purple-500/15 text-purple-400'
                      }`}>
                        M
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>Meta</p>
                        <p className={`text-[10px] ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>SDE Intern • Oct 24</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isDark ? 'text-[#D3D9D4] bg-[#124E66] border-[#748D92]/40' : 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                    }`}>
                      System Design
                    </span>
                  </div>

                  {/* Microsoft */}
                  <div
                    onClick={() => onSelectTab('internships')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/30 hover:bg-[#124E66]/30' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isDark ? 'bg-[#124E66] text-[#D3D9D4]' : 'bg-teal-500/15 text-teal-400'
                      }`}>
                        MS
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>Microsoft</p>
                        <p className={`text-[10px] ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>SWE Intern • Nov 02</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isDark ? 'text-[#D3D9D4] bg-[#124E66] border-[#748D92]/40' : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                    }`}>
                      OA Cleared
                    </span>
                  </div>
                </div>
              </div>

              <div className={`pt-3 mt-3 border-t ${isDark ? 'border-[#748D92]/30' : 'border-slate-800/60'}`}>
                <button
                  onClick={() => onSelectTab('internships')}
                  className={`text-xs font-medium flex items-center justify-between w-full ${isDark ? 'text-[#D3D9D4] hover:text-white' : 'text-indigo-400 hover:text-indigo-300'}`}
                >
                  <span>View All Applications</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Major Projects Progress */}
            <div
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                isDark ? 'bg-[#2E3944] border-[#748D92]/30' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>
                    <FolderGit2 className={`w-4 h-4 ${isDark ? 'text-[#D3D9D4]' : 'text-teal-400'}`} /> Major Projects
                  </h3>
                  <button
                    onClick={() => onSelectTab('projects')}
                    className={`text-[10px] ${isDark ? 'text-[#748D92] hover:text-[#D3D9D4]' : 'text-slate-400 hover:text-teal-400'}`}
                  >
                    Manage
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Project 1 */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`font-medium ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>Decentralized E-Auth</span>
                      <span className={`text-[10px] ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>React/Solidity</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#212A31]' : 'bg-slate-800'}`}>
                      <div className={`h-full w-[85%] rounded-full ${isDark ? 'bg-[#124E66]' : 'bg-gradient-to-r from-indigo-500 to-teal-400'}`} />
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`font-medium ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>AI Health Diagnostic</span>
                      <span className={`text-[10px] ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>PyTorch/Flask</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#212A31]' : 'bg-slate-800'}`}>
                      <div className={`h-full w-[60%] rounded-full ${isDark ? 'bg-[#124E66]' : 'bg-gradient-to-r from-indigo-500 to-teal-400'}`} />
                    </div>
                  </div>

                  {/* Project 3 */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`font-medium ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>Campus Navigator API</span>
                      <span className={`text-[10px] ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Go/Redis</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#212A31]' : 'bg-slate-800'}`}>
                      <div className={`h-full w-[40%] rounded-full ${isDark ? 'bg-[#124E66]' : 'bg-gradient-to-r from-indigo-500 to-teal-400'}`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`pt-3 mt-3 border-t ${isDark ? 'border-[#748D92]/30' : 'border-slate-800/60'}`}>
                <button
                  onClick={() => onSelectTab('projects')}
                  className={`text-xs font-medium flex items-center justify-between w-full ${isDark ? 'text-[#D3D9D4] hover:text-white' : 'text-teal-400 hover:text-teal-300'}`}
                >
                  <span>STAR Interview Bullet Points</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Aptitude Topic of the Day Banner */}
          <div
            id="aptitude-topic-of-day-banner"
            className={`h-auto sm:h-24 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between relative overflow-hidden gap-4 shadow-sm ${
              isDark
                ? 'bg-[#124E66] border border-[#748D92]/40 text-[#D3D9D4]'
                : 'bg-indigo-600 text-white'
            }`}
          >
            {/* Ambient blur glow */}
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <p className={`text-[11px] uppercase tracking-widest font-bold ${isDark ? 'text-[#D3D9D4]/80' : 'text-indigo-100 opacity-90'}`}>
                Aptitude Topic of the Day
              </p>
              <h4 className={`text-xl font-bold tracking-tight ${isDark ? 'text-[#D3D9D4]' : 'text-white'}`}>
                Permutations &amp; Combinations
              </h4>
            </div>

            <button
              onClick={() => onSelectTab('aptitude')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold relative z-10 transition-all hover:scale-102 shrink-0 shadow-xs ${
                isDark
                  ? 'bg-[#2E3944] text-[#D3D9D4] border border-[#748D92]/40 hover:bg-[#212A31]'
                  : 'bg-white text-indigo-600 hover:bg-slate-100'
              }`}
            >
              Start Practice
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): AI Career Mentor mini-chat & Mistakes Log */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* AI Career Mentor Mini Module */}
          <div
            className={`rounded-2xl p-5 border flex flex-col justify-between relative transition-all min-h-[340px] ${
              isDark ? 'bg-[#2E3944] border-[#748D92]/30 shadow-xs' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs ${
                    isDark ? 'bg-[#124E66] border border-[#748D92]/40 text-[#D3D9D4]' : 'bg-teal-500 text-white'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>AI Career Mentor</h3>
                    <p className={`text-[10px] ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>Gemini 3.7 Technical Coach</p>
                  </div>
                </div>
                <button
                  onClick={() => onSelectTab('ai-mentor')}
                  className={`text-xs font-medium flex items-center gap-0.5 ${isDark ? 'text-[#D3D9D4] hover:text-white' : 'text-indigo-400 hover:text-indigo-300'}`}
                >
                  Full Chat <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chat bubbles */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {mentorChatHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 text-xs leading-relaxed ${
                      item.role === 'assistant'
                        ? isDark
                          ? 'bg-[#212A31] rounded-2xl rounded-tl-none border border-[#748D92]/30 text-[#D3D9D4]'
                          : 'bg-slate-100 rounded-2xl rounded-tl-none text-slate-800'
                        : isDark
                        ? 'bg-[#124E66] rounded-2xl rounded-tr-none border border-[#748D92]/40 text-[#D3D9D4] ml-4'
                        : 'bg-indigo-50 rounded-2xl rounded-tr-none text-indigo-900 ml-4'
                    }`}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick input */}
            <form onSubmit={handleQuickMentorSend} className="mt-4 flex items-center space-x-2">
              <input
                type="text"
                value={quickMentorInput}
                onChange={(e) => setQuickMentorInput(e.target.value)}
                placeholder="Ask mentor..."
                className={`flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4] placeholder-[#748D92] focus:border-[#D3D9D4]'
                    : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
              <button
                type="submit"
                aria-label="Send message to mentor"
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isDark
                    ? 'bg-[#124E66] hover:bg-[#165b77] text-[#D3D9D4] border border-[#748D92]/40'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Mistakes Log preview */}
          <div
            className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
              isDark ? 'bg-[#2E3944] border-[#748D92]/30 shadow-xs' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>
                  <AlertTriangle className={`w-4 h-4 ${isDark ? 'text-[#D3D9D4]' : 'text-rose-400'}`} /> Mistakes Log
                </h3>
                <button
                  onClick={() => onSelectTab('mistakes')}
                  className={`text-[10px] ${isDark ? 'text-[#748D92] hover:text-[#D3D9D4]' : 'text-slate-400 hover:text-rose-400'}`}
                >
                  View All ({mistakes.length})
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className={`border-l-2 pl-3 py-1 ${isDark ? 'border-[#124E66]' : 'border-rose-500'}`}>
                  <p className={`text-[10px] font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>24 Oct • BFS implementation</p>
                  <p className={`font-medium ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>Forgot to mark node as visited before queueing.</p>
                </div>

                <div className={`border-l-2 pl-3 py-1 ${isDark ? 'border-[#748D92]' : 'border-orange-500 opacity-80'}`}>
                  <p className={`text-[10px] font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>22 Oct • OS (Deadlocks)</p>
                  <p className={`font-medium ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>Confused Mutual Exclusion with Hold and Wait.</p>
                </div>

                <div className={`border-l-2 pl-3 py-1 ${isDark ? 'border-[#748D92]/50' : 'border-slate-700 opacity-60'}`}>
                  <p className={`text-[10px] font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>20 Oct • SQL Querying</p>
                  <p className={`font-medium ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>Used WHERE instead of HAVING for group filters.</p>
                </div>
              </div>
            </div>

            <div className={`pt-3 mt-3 border-t ${isDark ? 'border-[#748D92]/30' : 'border-slate-800/60'}`}>
              <button
                onClick={() => onSelectTab('mistakes')}
                className={`text-xs font-medium flex items-center justify-between w-full ${isDark ? 'text-[#D3D9D4] hover:text-white' : 'text-rose-400 hover:text-rose-300'}`}
              >
                <span>Pre-Interview Wisdom Mode</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
