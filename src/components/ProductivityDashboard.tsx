import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Flame,
  CheckCircle2,
  TrendingUp,
  BarChart2,
  Plus,
  Coffee,
  Brain,
  Sparkles,
} from 'lucide-react';
import { StudySession } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import confetti from 'canvas-confetti';

interface ProductivityDashboardProps {
  sessions: StudySession[];
  onAddSession: (session: Omit<StudySession, 'id'>) => void;
  isDark: boolean;
}

export const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({
  sessions,
  onAddSession,
  isDark,
}) => {
  // Pomodoro States
  const [timerMode, setTimerMode] = useState<'work' | 'short_break' | 'long_break'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<StudySession['category']>('DSA');
  const [sessionNotes, setSessionNotes] = useState('');

  // Mode durations
  const durations = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Auto-log session
      if (timerMode === 'work') {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        onAddSession({
          date: new Date().toISOString().split('T')[0],
          durationMinutes: 25,
          category: selectedCategory,
          notes: sessionNotes || 'Focused 25m Pomodoro Study Session',
        });
        setSessionNotes('');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerMode, selectedCategory, sessionNotes, onAddSession]);

  const handleModeChange = (mode: 'work' | 'short_break' | 'long_break') => {
    setTimerMode(mode);
    setTimeLeft(durations[mode]);
    setIsRunning(false);
  };

  const toggleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durations[timerMode]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Weekly study data for Recharts (past 7 days)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = daysOfWeek.map((day, idx) => {
    // Generate realistic stacked distribution
    return {
      day,
      DSA: idx % 2 === 0 ? 3.5 : 2.5,
      Aptitude: 1.0,
      'Core CS': idx === 3 || idx === 5 ? 2.0 : 1.0,
      Projects: idx >= 5 ? 3.0 : 1.5,
    };
  });

  const totalMinutesStudied = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = (totalMinutesStudied / 60).toFixed(1);

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Productivity, Focus & Time Analytics</h2>
          <p className={`text-sm ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
            Track your deep-work hours, run Pomodoro placement sprints, and analyze weekly prep allocation.
          </p>
        </div>
      </div>

      {/* Top Grid: Interactive Pomodoro Timer + Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Pomodoro Focus Timer */}
        <div
          className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 shadow-xs' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            {/* Mode Switcher */}
            <div className={`flex items-center justify-center gap-1.5 p-1 rounded-xl border mb-6 ${
              isDark ? 'bg-[#212A31] border-[#748D92]/30' : 'bg-slate-800/40 border-slate-700/60'
            }`}>
              <button
                onClick={() => handleModeChange('work')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timerMode === 'work'
                    ? isDark
                      ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                      : 'bg-indigo-600 text-white shadow-xs'
                    : isDark ? 'text-[#748D92] hover:text-[#D3D9D4]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => handleModeChange('short_break')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timerMode === 'short_break'
                    ? isDark
                      ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                      : 'bg-indigo-600 text-white shadow-xs'
                    : isDark ? 'text-[#748D92] hover:text-[#D3D9D4]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Short (5m)
              </button>
              <button
                onClick={() => handleModeChange('long_break')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timerMode === 'long_break'
                    ? isDark
                      ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                      : 'bg-indigo-600 text-white shadow-xs'
                    : isDark ? 'text-[#748D92] hover:text-[#D3D9D4]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Long (15m)
              </button>
            </div>

            {/* Timer Display Circle */}
            <div className="flex flex-col items-center justify-center my-4">
              <div
                className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                  isRunning
                    ? isDark
                      ? 'border-[#124E66] shadow-xl shadow-[#124E66]/30 animate-pulse'
                      : 'border-indigo-500 shadow-xl shadow-indigo-500/20 animate-pulse'
                    : isDark ? 'border-[#748D92]/40 bg-[#212A31]/50' : 'border-slate-200'
                }`}
              >
                <span className={`text-4xl font-extrabold font-mono tracking-tight ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>
                  {formatTime(timeLeft)}
                </span>
                <span className={`text-xs mt-1 uppercase font-semibold ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                  {timerMode === 'work' ? 'Deep Focus Sprint' : 'Rest Break'}
                </span>
              </div>
            </div>

            {/* Category Select for work mode */}
            {timerMode === 'work' && (
              <div className="mb-4">
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Session Activity Tag</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                >
                  <option value="DSA">DSA & LeetCode</option>
                  <option value="Aptitude">Aptitude & Drills</option>
                  <option value="Core CS">Core CS Revision</option>
                  <option value="Projects">Projects & Coding</option>
                  <option value="College Academics">College Exam Prep</option>
                </select>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={toggleStartPause}
              className={`px-6 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-md transition-all ${
                isRunning
                  ? isDark
                    ? 'bg-[#748D92] hover:bg-[#748D92]/80 text-[#212A31]'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                  : isDark
                  ? 'bg-[#124E66] hover:bg-[#165b77] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className={`w-4 h-4 ${isDark ? 'fill-[#D3D9D4]' : 'fill-white'}`} />}
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>

            <button
              onClick={handleReset}
              className={`p-2.5 rounded-xl border transition-colors ${
                isDark ? 'border-[#748D92]/40 text-[#748D92] hover:text-[#D3D9D4] hover:bg-[#212A31]' : 'border-slate-300 text-slate-600 hover:text-slate-900'
              }`}
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekly Stacked Time Chart */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 shadow-xs' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className={`font-bold text-base ${isDark ? 'text-[#D3D9D4]' : ''}`}>Weekly Study Allocation (Hours)</h4>
              <p className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                Target: 35 hours / week (5 hrs/day) for Tier-1 company preparation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xl font-extrabold ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>{totalHours} hrs</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                isDark ? 'text-[#D3D9D4] bg-[#124E66] border-[#748D92]/40' : 'text-emerald-400 bg-emerald-500/10'
              }`}>
                On Target (88%)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#748D9233' : '#e2e8f0'} />
                <XAxis dataKey="day" stroke={isDark ? '#748D92' : '#64748b'} fontSize={12} />
                <YAxis stroke={isDark ? '#748D92' : '#64748b'} fontSize={12} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#2E3944' : '#ffffff',
                    borderColor: isDark ? '#748D92' : '#cbd5e1',
                    borderRadius: '12px',
                    color: isDark ? '#D3D9D4' : '#0f172a',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="DSA" stackId="a" fill={isDark ? '#124E66' : '#6366f1'} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Aptitude" stackId="a" fill={isDark ? '#748D92' : '#a855f7'} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Core CS" stackId="a" fill={isDark ? '#165b77' : '#3b82f6'} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Projects" stackId="a" fill={isDark ? '#D3D9D4' : '#10b981'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Logged Sessions Feed */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isDark ? 'bg-[#2E3944] border-[#748D92]/30 shadow-xs' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className={`font-bold text-sm ${isDark ? 'text-[#D3D9D4]' : ''}`}>Recent Logged Focus Sessions</h4>
          <span className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
            {sessions.length} total logged sessions
          </span>
        </div>

        <div className={`divide-y ${isDark ? 'divide-[#748D92]/30' : 'divide-slate-800/40'}`}>
          {sessions.slice(0, 6).map((s) => (
            <div key={s.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                  isDark ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40' : 'bg-indigo-500/10 text-indigo-400'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>{s.category}</span>
                    <span className={`text-[10px] font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>• {s.durationMinutes} minutes</span>
                  </div>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>{s.notes}</p>
                </div>
              </div>

              <span className={`text-[11px] font-mono shrink-0 ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>{s.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
