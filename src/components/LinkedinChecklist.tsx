import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  Circle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Award,
  Copy,
  Check,
} from 'lucide-react';
import { LinkedinTask } from '../types';
import confetti from 'canvas-confetti';

interface LinkedinChecklistProps {
  tasks: LinkedinTask[];
  onToggleTask: (id: string) => void;
  isDark: boolean;
}

export const LinkedinChecklist: React.FC<LinkedinChecklistProps> = ({
  tasks,
  onToggleTask,
  isDark,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const categories = ['All', 'Profile Polish', 'Weekly Outreach', 'Content & Proof-of-Work', 'Resume & Assets'];

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = Math.round((completedCount / (tasks.length || 1)) * 100);

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    onToggleTask(id);
    if (!currentlyCompleted) {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    }
  };

  const filteredTasks = tasks.filter((t) =>
    activeCategory === 'All' ? true : t.category === activeCategory
  );

  const coldDmTemplate = `Hi [Name],

I saw your recent engineering post on [Topic] and loved your insights. I'm a final-year CS student actively preparing for SDE roles and recently built a [Project Name: e.g. Distributed Task Queue] using [Tech Stack].

I'd love to learn from your experience at [Company]. If you have 5 minutes sometime, I would deeply appreciate any advice on how new grads can stand out for [Role].

Here is my GitHub & portfolio: [Link]

Thank you so much for your time!
- Bhagyashree`;

  const handleCopyDm = () => {
    navigator.clipboard.writeText(coldDmTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">LinkedIn & Placement Readiness Checklist</h2>
          <p className={`text-sm ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
            Manual checklist to optimize your professional presence and maximize alumni referral conversions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl border ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-white border-slate-200 text-indigo-700'
          }`}>
            {completedCount} / {tasks.length} Completed ({progressPct}%)
          </span>
        </div>
      </div>

      {/* Progress Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex justify-between text-xs font-medium mb-2">
          <span className={isDark ? 'text-[#D3D9D4]' : 'text-slate-700'}>
            Overall Placement Readiness Score
          </span>
          <span className={`font-bold ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>{progressPct}%</span>
        </div>
        <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-[#212A31]' : 'bg-slate-700/30'}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${isDark ? 'bg-[#124E66]' : 'bg-gradient-to-r from-indigo-500 to-blue-500'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Grid: Tasks List + Cold DM Template */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? isDark
                      ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                      : 'bg-indigo-600 text-white shadow-xs'
                    : isDark
                    ? 'bg-[#212A31] border border-[#748D92]/30 text-[#748D92] hover:text-[#D3D9D4]'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div
            className={`p-6 rounded-2xl border divide-y transition-all ${
              isDark ? 'bg-[#2E3944] border-[#748D92]/30 divide-[#748D92]/20' : 'bg-white border-slate-200 divide-slate-800/40 shadow-xs'
            }`}
          >
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`py-3.5 flex items-start gap-3.5 transition-colors ${
                  task.completed ? 'opacity-70' : ''
                }`}
              >
                <button
                  onClick={() => handleToggle(task.id, task.completed)}
                  className="shrink-0 mt-0.5 transition-transform active:scale-90"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className={`w-5 h-5 ${isDark ? 'text-[#748D92] hover:text-[#D3D9D4]' : 'text-slate-300 hover:text-slate-500'}`} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${task.completed ? 'line-through text-[#748D92]' : isDark ? 'text-[#D3D9D4]' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${isDark ? 'bg-[#212A31] text-[#D3D9D4] border-[#748D92]/30' : 'bg-slate-100 text-slate-600'}`}>
                      {task.category}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                    {task.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Conversion Alumni Referral Template */}
        <div
          className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className={`w-4 h-4 ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`} />
                <h3 className="font-bold text-sm">Alumni Cold Outreach Script</h3>
              </div>
              <button
                onClick={handleCopyDm}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                  isDark ? 'border-[#748D92]/40 text-[#D3D9D4] hover:bg-[#212A31]' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTemplate ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className={`text-xs mb-3 ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
              Use this high-conversion cold DM template to connect with seniors & hiring managers.
            </p>

            <pre className={`p-4 rounded-xl border font-mono text-[11px] leading-relaxed whitespace-pre-wrap ${
              isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              {coldDmTemplate}
            </pre>
          </div>

          <div className={`mt-4 p-3 rounded-xl border text-xs ${
            isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
          }`}>
            <span className="font-bold">Golden Rule:</span> Never ask for a referral on the first message. Ask for advice on project tech stack first.
          </div>
        </div>
      </div>
    </div>
  );
};
