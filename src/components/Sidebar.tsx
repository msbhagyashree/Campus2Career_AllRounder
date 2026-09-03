import React from 'react';
import {
  LayoutDashboard,
  Code2,
  Brain,
  GraduationCap,
  Briefcase,
  FolderGit2,
  AlertTriangle,
  Award,
  Clock,
  Bot,
  Sparkles,
  Share2,
  X,
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isDark: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  counts: {
    dsaPending: number;
    aptitudePending: number;
    upcomingExams: number;
    activeInternships: number;
    projectsCount: number;
    unresolvedMistakes: number;
  };
  profile?: {
    name: string;
    branch?: string;
    graduationYear?: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isDark,
  isOpenMobile,
  onCloseMobile,
  counts,
  profile,
}) => {
  const navSections = [
    {
      title: 'CORE DASHBOARD',
      items: [
        { id: 'overview' as TabType, label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'dsa' as TabType, label: 'DSA Tracker', icon: Code2, badge: `${counts.dsaPending} left` },
        { id: 'aptitude' as TabType, label: 'Aptitude Practice', icon: Brain, badge: `${counts.aptitudePending} drills` },
        { id: 'academics' as TabType, label: 'Academics & Core CS', icon: GraduationCap, badge: counts.upcomingExams > 0 ? `${counts.upcomingExams} exams` : null },
      ],
    },
    {
      title: 'CAREER & PORTFOLIO',
      items: [
        { id: 'internships' as TabType, label: 'Internships', icon: Briefcase, badge: `${counts.activeInternships} active` },
        { id: 'projects' as TabType, label: 'Projects', icon: FolderGit2, badge: `${counts.projectsCount}` },
        { id: 'mistakes' as TabType, label: 'Mistakes Log', icon: AlertTriangle, badge: counts.unresolvedMistakes > 0 ? `${counts.unresolvedMistakes} active` : null },
        { id: 'courses' as TabType, label: 'Courses & Certs', icon: Award, badge: null },
      ],
    },
    {
      title: 'AI & PRODUCTIVITY',
      items: [
        { id: 'productivity' as TabType, label: 'Productivity & Timer', icon: Clock, badge: null },
        { id: 'ai-mentor' as TabType, label: 'AI Career Mentor', icon: Bot, badge: 'Gemini' },
        { id: 'ai-planner' as TabType, label: 'AI Study Planner', icon: Sparkles, badge: 'Generator' },
        { id: 'linkedin' as TabType, label: 'LinkedIn Readiness', icon: Share2, badge: null },
      ],
    },
  ];

  const studentName = profile?.name || 'Aditya Sharma';
  const studentYear = profile?.branch ? `${profile.branch} • ${profile.graduationYear || 2026}` : 'Pre-Final Year';
  const studentInitials = studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AS';

  const sidebarContent = (
    <div className="flex flex-col h-full py-4">
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between px-4 pb-3 border-b border-[#748D92]/30 mb-3">
        <span className="font-bold text-sm text-[#D3D9D4]">Navigation Menu</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-[#748D92] hover:text-[#D3D9D4] hover:bg-[#2E3944]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-5 custom-scrollbar">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            <div className={`px-3 mb-2 text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>
              {section.title}
            </div>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                      isActive
                        ? isDark
                          ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40 font-medium shadow-xs'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium'
                        : isDark
                        ? 'text-[#748D92] hover:bg-[#2E3944] hover:text-[#D3D9D4]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                          isActive
                            ? isDark
                              ? 'bg-[#D3D9D4] shadow-xs'
                              : 'bg-indigo-500 shadow-xs'
                            : isDark
                            ? 'bg-[#748D92]/40'
                            : 'bg-slate-300'
                        }`}
                      />
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isDark ? 'text-[#D3D9D4]' : 'text-indigo-600') : isDark ? 'text-[#748D92]' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 ${
                          isActive
                            ? isDark
                              ? 'bg-[#2E3944] text-[#D3D9D4] border border-[#748D92]/30'
                              : 'bg-indigo-100 text-indigo-700'
                            : item.badge === 'Gemini' || item.badge === 'Generator'
                            ? isDark
                              ? 'bg-[#124E66]/40 text-[#D3D9D4] border border-[#748D92]/30'
                              : 'bg-teal-100 text-teal-700'
                            : isDark
                            ? 'bg-[#2E3944] text-[#748D92] border border-[#748D92]/20'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Clean Minimalism Student Profile bottom card */}
      <div className="p-3 border-t border-[#748D92]/30 mt-auto">
        <div className="flex items-center space-x-3 bg-[#2E3944] p-3 rounded-xl border border-[#748D92]/30">
          <div className="w-8 h-8 rounded-full bg-[#124E66] border border-[#748D92]/40 flex items-center justify-center text-xs font-bold text-[#D3D9D4] shrink-0 shadow-xs">
            {studentInitials}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold truncate text-[#D3D9D4]">{studentName}</p>
            <p className="text-[10px] text-[#748D92] truncate">{studentYear}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        id="desktop-sidebar"
        className={`hidden lg:block w-64 shrink-0 border-r min-h-[calc(100vh-4rem)] transition-colors duration-200 ${
          isDark ? 'bg-[#212A31] border-[#748D92]/30' : 'bg-white border-slate-200'
        }`}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)]">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside
            id="mobile-drawer"
            className={`relative z-10 w-72 max-w-[85vw] h-full shadow-2xl transition-colors duration-200 ${
              isDark ? 'bg-[#212A31] text-[#D3D9D4] border-r border-[#748D92]/30' : 'bg-white text-slate-900'
            }`}
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
