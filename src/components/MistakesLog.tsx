import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Sparkles,
  ShieldAlert,
  Flame,
  Search,
  Filter,
  Eye,
} from 'lucide-react';
import { MistakeItem } from '../types';

interface MistakesLogProps {
  mistakes: MistakeItem[];
  onAddMistake: (mistake: Omit<MistakeItem, 'id'>) => void;
  onToggleResolve: (id: string) => void;
  onDeleteMistake: (id: string) => void;
  isDark: boolean;
}

export const MistakesLog: React.FC<MistakesLogProps> = ({
  mistakes,
  onAddMistake,
  onToggleResolve,
  onDeleteMistake,
  isDark,
}) => {
  const [filterCat, setFilterCat] = useState<string>('All');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPreInterviewMode, setIsPreInterviewMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MistakeItem['category']>('DSA');
  const [severity, setSeverity] = useState<MistakeItem['severity']>('Critical');
  const [problemName, setProblemName] = useState('');
  const [mistakeMade, setMistakeMade] = useState('');
  const [correctApproach, setCorrectApproach] = useState('');
  const [trapToAvoid, setTrapToAvoid] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddMistake({
      title: title.trim(),
      category: category,
      severity: severity,
      problemOrCompany: problemName.trim() || 'Online Assessment',
      dateLogged: new Date().toISOString().split('T')[0],
      mistakeMade: mistakeMade.trim(),
      correctApproach: correctApproach.trim(),
      trapToAvoid: trapToAvoid.trim(),
      resolved: false,
    });

    setTitle('');
    setProblemName('');
    setMistakeMade('');
    setCorrectApproach('');
    setTrapToAvoid('');
    setShowAddModal(false);
  };

  const filteredMistakes = mistakes.filter((m) => {
    const matchesCat = filterCat === 'All' || m.category === filterCat;
    const matchesSev = filterSeverity === 'All' || m.severity === filterSeverity;
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.trapToAvoid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.problemOrCompany.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSev && matchesSearch;
  });

  const unresolvedCount = mistakes.filter((m) => !m.resolved).length;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mistakes-to-Avoid & Interview Pitfalls Log</h2>
          <p className={`text-sm ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
            Convert every failed test case and interview slip into permanent wisdom. Review before every real interview.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPreInterviewMode(!isPreInterviewMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isPreInterviewMode
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20 animate-pulse'
                : isDark
                ? 'bg-[#2E3944] border-[#748D92]/40 text-amber-300 hover:bg-[#212A31]'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isPreInterviewMode ? 'Exit Rapid Mode' : 'Pre-Interview 30m Mode'}</span>
          </button>

          <button
            id="add-mistake-btn"
            onClick={() => setShowAddModal(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md transition-all ${
              isDark
                ? 'bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] border border-[#748D92]/40 shadow-[#124E66]/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Log Mistake</span>
          </button>
        </div>
      </div>

      {/* Pre-interview banner notice if active */}
      {isPreInterviewMode && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-3 shadow-lg shadow-amber-950/20">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-sm text-amber-300 block">Pre-Interview High-Yield Revision Mode</span>
            Quickly scan the highlighted traps below. Do not repeat these common patterns in your upcoming round!
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#748D92]" />
            <input
              type="text"
              placeholder="Search mistakes or traps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
                isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4] placeholder-[#748D92]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
              }`}
            />
          </div>

          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
              isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="All">All Categories</option>
            <option value="DSA">DSA</option>
            <option value="Aptitude">Aptitude</option>
            <option value="Core CS">Core CS</option>
            <option value="System Design">System Design</option>
            <option value="HR & Behavioral">HR & Behavioral</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
              isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>

        <span className={`text-xs font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
          {unresolvedCount} active traps to keep in mind
        </span>
      </div>

      {/* Mistakes List */}
      <div className="space-y-4">
        {filteredMistakes.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all ${
              item.resolved
                ? isDark
                  ? 'bg-[#212A31]/40 border-[#748D92]/20 opacity-60'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
                : item.severity === 'Critical'
                ? isDark
                  ? 'bg-rose-950/20 border-rose-900/40 shadow-xs'
                  : 'bg-rose-50/40 border-rose-200 shadow-xs'
                : isDark
                ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleResolve(item.id)}
                  className="shrink-0 transition-transform active:scale-90"
                  title={item.resolved ? 'Mark active' : 'Mark internalized / resolved'}
                >
                  {item.resolved ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className={`w-5 h-5 ${isDark ? 'text-[#748D92] hover:text-[#D3D9D4]' : 'text-slate-300 hover:text-slate-500'}`} />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-sm ${item.resolved ? 'line-through text-[#748D92]' : isDark ? 'text-[#D3D9D4]' : 'text-slate-900'}`}>
                      {item.title}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isDark
                          ? item.severity === 'Critical'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : 'bg-[#124E66] text-[#D3D9D4] border-[#748D92]/40'
                          : item.severity === 'Critical'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : item.severity === 'High'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {item.severity}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border ${isDark ? 'bg-[#212A31] text-[#D3D9D4] border-[#748D92]/30' : 'bg-slate-100 text-slate-600'}`}>
                      {item.category}
                    </span>
                  </div>
                  <span className={`text-[11px] ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                    Context: {item.problemOrCompany} • Logged on {item.dateLogged}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onDeleteMistake(item.id)}
                className={`transition-colors p-1 ${isDark ? 'text-[#748D92] hover:text-rose-400' : 'text-slate-500 hover:text-rose-400'}`}
                title="Delete entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trap Callout Box */}
            <div className={`p-3 rounded-xl border my-3 text-xs ${isDark ? 'bg-[#212A31] border-[#748D92]/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
              <span className="font-bold">⚠️ The Trap to Avoid:</span> {item.trapToAvoid}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#212A31]/70 border-[#748D92]/30 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-semibold text-rose-400 block mb-1">What went wrong:</span>
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#D3D9D4]/90' : 'text-slate-300'}`}>{item.mistakeMade}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#212A31]/70 border-[#748D92]/30 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-semibold text-emerald-400 block mb-1">Correct Golden Rule:</span>
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#D3D9D4]/90' : 'text-slate-300'}`}>{item.correctApproach}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredMistakes.length === 0 && (
          <div className={`py-16 text-center text-sm ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>
            No mistakes found matching your filter criteria.
          </div>
        )}
      </div>

      {/* Add Mistake Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-lg font-bold mb-4">Log Placement / Interview Mistake</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Mistake Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Forgot modulo 10^9+7 in DP transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="DSA">DSA</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Core CS">Core CS</option>
                    <option value="System Design">System Design</option>
                    <option value="HR & Behavioral">HR & Behavioral</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Critical">Critical (Immediate Rejection Risk)</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Problem / Company Context</label>
                <input
                  type="text"
                  placeholder="e.g. Amazon OA / LeetCode 322 Coin Change"
                  value={problemName}
                  onChange={(e) => setProblemName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Golden Rule / Trap to Avoid</label>
                <input
                  type="text"
                  placeholder="Always initialize DP base case with INT_MAX - 1 to prevent overflow on +1."
                  value={trapToAvoid}
                  onChange={(e) => setTrapToAvoid(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>What went wrong?</label>
                <textarea
                  rows={2}
                  placeholder="Explain the failure in detail..."
                  value={mistakeMade}
                  onChange={(e) => setMistakeMade(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Correct Approach</label>
                <textarea
                  rows={2}
                  placeholder="How to solve it cleanly next time..."
                  value={correctApproach}
                  onChange={(e) => setCorrectApproach(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 text-xs font-medium rounded-xl border ${
                    isDark ? 'border-[#748D92]/40 text-[#D3D9D4] hover:bg-[#212A31]' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-xs ${
                    isDark ? 'bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] border border-[#748D92]/40' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  Save Mistake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
