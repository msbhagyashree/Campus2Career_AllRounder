import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Building2,
  Brain,
  Download,
  Copy,
  Check,
  RefreshCw,
  Award,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiStudyPlannerProps {
  isDark: boolean;
}

export const AiStudyPlanner: React.FC<AiStudyPlannerProps> = ({ isDark }) => {
  const [targetCompany, setTargetCompany] = useState('Google / Microsoft Tier-1 SDE');
  const [timeHorizon, setTimeHorizon] = useState('4 Weeks Sprint');
  const [hoursPerDay, setHoursPerDay] = useState(5);
  const [weakAreas, setWeakAreas] = useState('Dynamic Programming, Graphs, System Design Basics');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCompany,
          timeHorizon,
          hoursPerDay,
          weakAreas,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setGeneratedPlan(data.plan);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error('Planner error:', err);
      setGeneratedPlan(
        `### 4-Week SDE Placement Roadmap for ${targetCompany}\n\n` +
          `**Week 1: High-Yield Arrays, Two Pointers & Sliding Window**\n` +
          `- Daily Goal: 3 LeetCode Mediums + 20 Quantitative Aptitude questions\n` +
          `- Focus Topics: 3Sum, Container With Most Water, Minimum Window Substring\n\n` +
          `**Week 2: Trees, Graphs & BFS/DFS Patterns**\n` +
          `- Daily Goal: Number of Islands, Course Schedule, Lowest Common Ancestor\n` +
          `- Core CS: OS Process Scheduling & Deadlock Coffman conditions\n\n` +
          `**Week 3: Dynamic Programming & Matrix Traversal**\n` +
          `- Focus: 0/1 Knapsack, Coin Change, Longest Increasing Subsequence\n` +
          `- DBMS: Indexing (B+ Trees), Normalization (3NF/BCNF) & ACID\n\n` +
          `**Week 4: Mock Online Assessments & Full-length Interviews**\n` +
          `- 2 Full timed Online Assessments per week\n` +
          `- STAR resume walkthrough preparation`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPlan) return;
    navigator.clipboard.writeText(generatedPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[#D3D9D4] shadow-lg ${
            isDark
              ? 'bg-[#124E66] border border-[#748D92]/40 shadow-[#124E66]/25'
              : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 shadow-indigo-500/25 text-white'
          }`}>
            <Sparkles className={`w-6 h-6 ${isDark ? 'text-[#D3D9D4]' : 'text-amber-300'}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">AI Customized Placement Study Planner</h2>
            <p className={`text-sm ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
              Generate tailored day-by-day study timetables based on your target company and available hours.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Configuration Card */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`} /> Roadmap Parameters
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Target Company / Tier</label>
              <select
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                  isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                }`}
              >
                <option value="Google / Microsoft Tier-1 SDE">Tier-1 FAANG/MAMAA (Google, Microsoft, Amazon)</option>
                <option value="Atlassian / Uber / Goldman Sachs">High-Pay Product (Atlassian, Uber, Goldman)</option>
                <option value="TCS NQT / Infosys / Cognizant Mass Drives">Service / Mass Hiring (TCS NQT, Infosys, Wipro)</option>
                <option value="High Growth Series-B/C Fintech Startup">Fast Startups (Razorpay, CRED, Zepto)</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Time Horizon</label>
              <select
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                  isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                }`}
              >
                <option value="2 Weeks Crash Preparation">2 Weeks Crash Sprint (Upcoming Drive)</option>
                <option value="4 Weeks Sprint">4 Weeks Comprehensive Sprint</option>
                <option value="8 Weeks Mastery">8 Weeks Deep Mastery</option>
                <option value="12 Weeks Semester Long">12 Weeks Full SDE Semester Roadmap</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>
                Daily Study Hours Available: <span className={`font-bold ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>{hoursPerDay} hrs/day</span>
              </label>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                className={`w-full ${isDark ? 'accent-[#124E66]' : 'accent-indigo-600'}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Current Weak / Focus Areas</label>
              <textarea
                rows={3}
                value={weakAreas}
                onChange={(e) => setWeakAreas(e.target.value)}
                placeholder="e.g. Graphs, Dynamic Programming, DBMS Concurrency..."
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                  isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 ${
                isDark
                  ? 'bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] border border-[#748D92]/40 shadow-[#124E66]/20'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/20'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#D3D9D4]' : 'text-amber-300'}`} /> Generate AI Study Roadmap
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated Output Card */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between transition-all ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Brain className={`w-4 h-4 ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`} /> Personalized Timetable & Strategy
              </h3>

              {generatedPlan && (
                <button
                  onClick={handleCopy}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                    isDark ? 'border-[#748D92]/40 text-[#D3D9D4] hover:bg-[#212A31]' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Plan'}</span>
                </button>
              )}
            </div>

            {generatedPlan ? (
              <div
                className={`p-5 rounded-xl border text-xs sm:text-sm leading-relaxed overflow-y-auto max-h-[480px] custom-scrollbar whitespace-pre-wrap ${
                  isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-slate-50/80 border-slate-200 text-slate-800'
                }`}
              >
                {generatedPlan}
              </div>
            ) : (
              <div className={`h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed rounded-xl ${
                isDark ? 'border-[#748D92]/40 text-[#748D92]' : 'border-slate-700/60 text-slate-400'
              }`}>
                <Sparkles className={`w-8 h-8 mb-2 opacity-60 ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`} />
                <p className={`font-semibold text-sm ${isDark ? 'text-[#D3D9D4]' : ''}`}>No Roadmap Generated Yet</p>
                <p className="text-xs max-w-sm mt-1">
                  Configure your target company and available hours on the left, then click &ldquo;Generate AI Study Roadmap&rdquo;.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
