import React, { useState } from 'react';
import {
  Brain,
  Calculator,
  Compass,
  BookOpen,
  CheckCircle2,
  Circle,
  Flame,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Award,
} from 'lucide-react';
import { AptitudeTopic } from '../types';
import confetti from 'canvas-confetti';

interface AptitudeTrackerProps {
  aptitudeList: AptitudeTopic[];
  onToggleComplete: (id: string) => void;
  onUpdatePractice: (id: string, count: number) => void;
  isDark: boolean;
}

export const AptitudeTracker: React.FC<AptitudeTrackerProps> = ({
  aptitudeList,
  onToggleComplete,
  onUpdatePractice,
  isDark,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Quantitative' | 'Reasoning' | 'Verbal'>('All');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // Sub-trackers grouped by category
  const quantTopics = aptitudeList.filter((a) => a.category === 'Quantitative');
  const reasoningTopics = aptitudeList.filter((a) => a.category === 'Reasoning');
  const verbalTopics = aptitudeList.filter((a) => a.category === 'Verbal');

  // Compute category streaks & completion stats
  const getStats = (list: AptitudeTopic[]) => {
    const completed = list.filter((a) => a.completed).length;
    const total = list.length || 1;
    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
  };

  const quantStats = getStats(quantTopics);
  const reasoningStats = getStats(reasoningTopics);
  const verbalStats = getStats(verbalTopics);

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    onToggleComplete(id);
    if (!currentlyCompleted) {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  const filteredTopics = aptitudeList.filter((item) =>
    activeCategory === 'All' ? true : item.category === activeCategory
  );

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Aptitude & Reasoning Hub</h2>
          <p className={`text-sm ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
            Master company-specific aptitude rounds (TCS NQT, Cognizant, Infosys, Amazon, Capgemini).
          </p>
        </div>

        {/* Category Tabs */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border self-start ${
          isDark ? 'bg-[#212A31] border-[#748D92]/30' : 'bg-slate-800/40 border-slate-700/60'
        }`}>
          {(['All', 'Quantitative', 'Reasoning', 'Verbal'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? isDark
                    ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                  ? 'text-[#748D92] hover:text-[#D3D9D4]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Sub-Tracker Category Cards with Streaks & Daily Focus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Quantitative Aptitude Card */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40' : 'bg-blue-500/10 text-blue-400'
              }`}>
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Quantitative Aptitude</h3>
                <span className={`text-[11px] ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>Math & Numeracy</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-[#124E66] text-[#D3D9D4] border-[#748D92]/40' : 'text-amber-500 bg-amber-500/10'
            }`}>
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4d Streak</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className={isDark ? 'text-[#748D92]' : 'text-slate-500'}>Progress</span>
              <span className={`font-semibold ${isDark ? 'text-[#D3D9D4]' : 'text-blue-400'}`}>
                {quantStats.completed}/{quantStats.total} ({quantStats.percent}%)
              </span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-[#212A31]' : 'bg-slate-700/30'}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${isDark ? 'bg-[#124E66]' : 'bg-blue-500'}`}
                style={{ width: `${quantStats.percent}%` }}
              />
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-blue-50/50 border-blue-100'}`}>
            <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${isDark ? 'text-[#D3D9D4]' : 'text-blue-400'}`}>
              <Sparkles className="w-3 h-3 text-amber-400" /> Topic of the Day
            </div>
            <div className="font-semibold truncate">{quantTopics[1]?.title || 'Time & Work'}</div>
            <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Speed = Distance / Time (Relative Speed)</p>
          </div>
        </div>

        {/* 2. Logical Reasoning Card */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40' : 'bg-purple-500/10 text-purple-400'
              }`}>
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Logical Reasoning</h3>
                <span className={`text-[11px] ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>Analytical & Puzzles</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-[#124E66] text-[#D3D9D4] border-[#748D92]/40' : 'text-amber-500 bg-amber-500/10'
            }`}>
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>5d Streak</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className={isDark ? 'text-[#748D92]' : 'text-slate-500'}>Progress</span>
              <span className={`font-semibold ${isDark ? 'text-[#D3D9D4]' : 'text-purple-400'}`}>
                {reasoningStats.completed}/{reasoningStats.total} ({reasoningStats.percent}%)
              </span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-[#212A31]' : 'bg-slate-700/30'}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${isDark ? 'bg-[#124E66]' : 'bg-purple-500'}`}
                style={{ width: `${reasoningStats.percent}%` }}
              />
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-purple-50/50 border-purple-100'}`}>
            <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${isDark ? 'text-[#D3D9D4]' : 'text-purple-400'}`}>
              <Sparkles className="w-3 h-3 text-amber-400" /> Topic of the Day
            </div>
            <div className="font-semibold truncate">{reasoningTopics[1]?.title || 'Blood Relations'}</div>
            <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Family Tree generation & generational offsets</p>
          </div>
        </div>

        {/* 3. Verbal Ability Card */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Verbal Ability</h3>
                <span className={`text-[11px] ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>Grammar & RC</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-[#124E66] text-[#D3D9D4] border-[#748D92]/40' : 'text-amber-500 bg-amber-500/10'
            }`}>
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>3d Streak</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className={isDark ? 'text-[#748D92]' : 'text-slate-500'}>Progress</span>
              <span className={`font-semibold ${isDark ? 'text-[#D3D9D4]' : 'text-emerald-400'}`}>
                {verbalStats.completed}/{verbalStats.total} ({verbalStats.percent}%)
              </span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-[#212A31]' : 'bg-slate-700/30'}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${isDark ? 'bg-[#124E66]' : 'bg-emerald-500'}`}
                style={{ width: `${verbalStats.percent}%` }}
              />
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-emerald-50/50 border-emerald-100'}`}>
            <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${isDark ? 'text-[#D3D9D4]' : 'text-emerald-400'}`}>
              <Sparkles className="w-3 h-3 text-amber-400" /> Topic of the Day
            </div>
            <div className="font-semibold truncate">{verbalTopics[1]?.title || 'Sentence Correction'}</div>
            <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Subject-verb agreement & modifier placement</p>
          </div>
        </div>
      </div>

      {/* Interactive Topics & Practice Drill Table */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="font-bold text-base">Topic Drill Checklist & Key Formulas</h4>
            <p className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
              Review formula shortcuts and log solved questions per day.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            return (
              <div
                key={topic.id}
                className={`rounded-xl border transition-all ${
                  topic.completed
                    ? isDark
                      ? 'bg-[#212A31]/40 border-[#748D92]/20'
                      : 'bg-slate-50/70 border-slate-200'
                    : isDark
                    ? 'bg-[#212A31] border-[#748D92]/30'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggle(topic.id, topic.completed)}
                      className="shrink-0 transition-transform active:scale-90"
                    >
                      {topic.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className={`w-5 h-5 ${isDark ? 'text-[#748D92] hover:text-[#D3D9D4]' : 'text-slate-300 hover:text-slate-500'}`} />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm truncate ${topic.completed ? 'line-through text-[#748D92]' : isDark ? 'text-[#D3D9D4]' : 'text-slate-900'}`}>
                          {topic.title}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isDark
                              ? 'bg-[#124E66] text-[#D3D9D4] border-[#748D92]/40'
                              : topic.category === 'Quantitative'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : topic.category === 'Reasoning'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {topic.category}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                        {topic.keyConcept}
                      </p>
                    </div>
                  </div>

                  {/* Practice Solved Counter + Expand formulas */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className={isDark ? 'text-[#748D92]' : 'text-slate-500'}>Drill:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={topic.practiceSolved}
                        onChange={(e) => onUpdatePractice(topic.id, parseInt(e.target.value) || 0)}
                        className={`w-12 px-2 py-1 text-center font-semibold text-xs rounded-lg border focus:outline-none ${
                          isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-1 focus:ring-indigo-500'
                        }`}
                      />
                      <span className={isDark ? 'text-[#748D92]' : 'text-slate-500'}>/{topic.practiceTarget}</span>
                    </div>

                    <button
                      onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isDark ? 'border-[#748D92]/40 text-[#748D92] hover:text-[#D3D9D4]' : 'border-slate-300 text-slate-600 hover:text-slate-900'
                      }`}
                      title="View formulas and cheat-sheet"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Formula Drawer */}
                {isExpanded && (
                  <div className={`px-4 pb-4 pt-2 border-t text-xs ${isDark ? 'border-[#748D92]/30 bg-[#212A31]/90' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div className={`font-semibold mb-2 ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>High-Yield Shortcuts & Formulas:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {topic.formulas.map((formula, fIdx) => (
                        <li key={fIdx} className={`font-mono text-[11px] ${isDark ? 'text-[#D3D9D4]' : 'text-slate-300'}`}>
                          {formula}
                        </li>
                      ))}
                    </ul>
                    <div className={`mt-3 p-2.5 rounded-lg border text-[11px] ${
                      isDark ? 'bg-[#124E66]/40 border-[#748D92]/40 text-[#D3D9D4]' : 'bg-indigo-950/40 border-indigo-900/50 text-indigo-200'
                    }`}>
                      <span className="font-bold">Pro Tip:</span> In placement online assessments, spend no more than 75 seconds per question. Eliminate choices with impossible units.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
