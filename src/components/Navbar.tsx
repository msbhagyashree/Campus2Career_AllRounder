import React from 'react';
import {
  GraduationCap,
  Flame,
  Bot,
  Sun,
  Moon,
  Database,
  Timer,
  Settings,
  Menu,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  profile: UserProfile;
  streakCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenAiMentor: () => void;
  onOpenProfile: () => void;
  onOpenSupabase: () => void;
  onOpenTimer: () => void;
  onToggleMobileMenu: () => void;
  pomodoroActive: boolean;
  pomodoroTimeFormatted: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  streakCount,
  isDark,
  onToggleTheme,
  onOpenAiMentor,
  onOpenProfile,
  onOpenSupabase,
  onOpenTimer,
  onToggleMobileMenu,
  pomodoroActive,
  pomodoroTimeFormatted,
}) => {
  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200 ${
        isDark ? 'bg-[#212A31]/95 border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white/95 border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + App Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle"
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
            className={`p-2 rounded-xl lg:hidden ${
              isDark ? 'hover:bg-[#2E3944] text-[#748D92] hover:text-[#D3D9D4]' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#124E66] border border-[#748D92]/30 flex items-center justify-center text-[#D3D9D4] shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg tracking-tight ${isDark ? 'text-[#D3D9D4]' : 'bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-600 bg-clip-text text-transparent'}`}>
                  Campus2Career
                </span>
                <span className={`hidden sm:inline-block text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-md ${
                  isDark ? 'bg-[#124E66]/40 text-[#D3D9D4] border border-[#748D92]/40' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  Engineering Portal
                </span>
              </div>
              <p className={`text-[11px] font-medium hidden md:block ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                Placement & Career Engineering Hub
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right: Action Badges & Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak Pill */}
          <div
            id="streak-counter-badge"
            title="Current consecutive days of placement preparation"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isDark
                ? 'bg-[#2E3944] border-[#748D92]/40 text-[#D3D9D4]'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${isDark ? 'text-[#D3D9D4]' : 'text-orange-400 fill-orange-400'}`} />
            <span>{streakCount} Day Streak 🔥</span>
          </div>

          {/* Pomodoro Timer Quick Widget */}
          <button
            id="pomodoro-quick-toggle"
            onClick={onOpenTimer}
            title="Open Focus Pomodoro & Stopwatch Timer"
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              pomodoroActive
                ? isDark
                  ? 'bg-[#124E66] border-[#748D92]/50 text-[#D3D9D4] animate-pulse'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : isDark
                ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] hover:bg-[#124E66]/40 hover:border-[#748D92]/60'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Timer className={`w-4 h-4 ${pomodoroActive ? (isDark ? 'text-[#D3D9D4]' : 'text-teal-400') : (isDark ? 'text-[#748D92]' : 'text-slate-400')}`} />
            <span>{pomodoroActive ? pomodoroTimeFormatted : 'Pomodoro'}</span>
          </button>

          {/* Supabase Database Status Button */}
          <button
            id="supabase-status-btn"
            onClick={onOpenSupabase}
            title="Supabase Schema & Cloud Sync"
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              profile.isSupabaseSynced
                ? isDark
                  ? 'bg-[#124E66] border-[#748D92]/50 text-[#D3D9D4]'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : isDark
                ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] hover:bg-[#124E66]/40 hover:border-[#748D92]/60'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-indigo-300'
            }`}
          >
            <Database className={`w-3.5 h-3.5 ${isDark ? 'text-[#748D92]' : 'text-teal-400'}`} />
            <span>Supabase DB</span>
          </button>

          {/* AI Placement Mentor Trigger */}
          <button
            id="navbar-ai-mentor-btn"
            onClick={onOpenAiMentor}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-102 ${
              isDark
                ? 'bg-[#124E66] hover:bg-[#165b77] text-[#D3D9D4] border border-[#748D92]/40'
                : 'bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-[#D3D9D4]" />
            <span className="hidden sm:inline">AI Mentor</span>
            <Sparkles className="w-3 h-3 text-[#D3D9D4] opacity-80 hidden sm:inline" />
          </button>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle dark/light mode"
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] hover:bg-[#124E66]/40 hover:border-[#748D92]/60'
                : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-[#D3D9D4]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Pill & Settings */}
          <button
            id="navbar-profile-btn"
            onClick={onOpenProfile}
            title="Profile & Application Settings"
            className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all ${
              isDark
                ? 'bg-[#2E3944] border-[#748D92]/30 hover:bg-[#124E66]/40 hover:border-[#748D92]/60 text-[#D3D9D4]'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <img
              src={profile.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
              alt={profile.name}
              className="w-7 h-7 rounded-lg object-cover border border-[#748D92]/40"
              referrerPolicy="no-referrer"
            />
            <span className="hidden md:inline text-xs font-semibold max-w-[110px] truncate">{profile.name}</span>
            <Settings className={`w-3.5 h-3.5 hidden sm:inline ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
