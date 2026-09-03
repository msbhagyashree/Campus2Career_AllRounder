import React, { useState } from 'react';
import {
  GraduationCap,
  TrendingUp,
  Calendar,
  Star,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  HelpCircle,
  Award,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CgpaRecord, ExamPlanner, CoreSubject } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface AcademicTrackerProps {
  cgpaRecords: CgpaRecord[];
  onAddCgpaRecord: (rec: Omit<CgpaRecord, 'id'>) => void;
  onDeleteCgpaRecord: (id: string) => void;
  calculateCGPA: () => { runningCgpa: number; totalCredits: number };
  examPlanners: ExamPlanner[];
  onAddExamPlanner: (exam: Omit<ExamPlanner, 'id'>) => void;
  onToggleRevisionItem: (examId: string, dayIndex: number) => void;
  coreSubjects: CoreSubject[];
  onUpdateCoreSubject: (id: string, updates: Partial<CoreSubject>) => void;
  onToggleCoreTopic: (subjectId: string, topicIndex: number) => void;
  isDark: boolean;
}

export const AcademicTracker: React.FC<AcademicTrackerProps> = ({
  cgpaRecords,
  onAddCgpaRecord,
  onDeleteCgpaRecord,
  calculateCGPA,
  examPlanners,
  onAddExamPlanner,
  onToggleRevisionItem,
  coreSubjects,
  onUpdateCoreSubject,
  onToggleCoreTopic,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'cgpa' | 'exams' | 'core_cs'>('cgpa');

  // New CGPA form
  const [semNumber, setSemNumber] = useState<number>(5);
  const [sgpaVal, setSgpaVal] = useState<string>('9.20');
  const [creditsVal, setCreditsVal] = useState<number>(24);

  // New Exam Planner form
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [examSubCode, setExamSubCode] = useState('CS504');
  const [examSubName, setExamSubName] = useState('');
  const [examDate, setExamDate] = useState('2026-09-30');
  const [examCredits, setExamCredits] = useState(4);
  const [examDifficulty, setExamDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const { runningCgpa, totalCredits } = calculateCGPA();

  // Chart data
  const chartData = cgpaRecords.map((r) => ({
    name: `Sem ${r.semester}`,
    sgpa: r.sgpa,
    semester: r.semester,
    credits: r.credits,
  }));

  const handleAddCgpa = (e: React.FormEvent) => {
    e.preventDefault();
    const sgpaNum = parseFloat(sgpaVal);
    if (isNaN(sgpaNum) || sgpaNum < 0 || sgpaNum > 10) return;

    onAddCgpaRecord({
      semester: semNumber,
      sgpa: sgpaNum,
      credits: creditsVal,
      academicYear: '2025-2026',
    });
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubName.trim()) return;

    onAddExamPlanner({
      semester: 5,
      subjectCode: examSubCode.trim() || 'CS500',
      subjectName: examSubName.trim(),
      examDate: examDate,
      examTime: '09:30 AM',
      credits: examCredits,
      difficulty: examDifficulty,
      status: 'Upcoming',
      revisionPlan: [
        { day: 'Day 1', topic: 'Unit 1: Core Fundamentals & Principles', done: false },
        { day: 'Day 2', topic: 'Unit 2: Standard Theorems & Implementations', done: false },
        { day: 'Day 3', topic: 'Unit 3: Numerical Problems & Edge Cases', done: false },
        { day: 'Day 4', topic: 'Unit 4 & 5: Advanced Modules & Past Papers', done: false },
      ],
    });

    setExamSubName('');
    setShowAddExamModal(false);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Academics & Core CS Matrix</h2>
          <p className={`text-sm ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
            Track your semester CGPA, active exam revision roadmap, and core CS interview readiness.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border self-start ${
          isDark ? 'bg-[#212A31] border-[#748D92]/30' : 'bg-slate-800/40 border-slate-700/60'
        }`}>
          <button
            onClick={() => setActiveTab('cgpa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cgpa'
                ? isDark
                  ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                  : 'bg-indigo-600 text-white shadow-xs'
                : isDark ? 'text-[#748D92] hover:text-[#D3D9D4]' : 'text-slate-300'
            }`}
          >
            CGPA & SGPAs
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'exams'
                ? isDark
                  ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                  : 'bg-indigo-600 text-white shadow-xs'
                : isDark ? 'text-[#748D92] hover:text-[#D3D9D4]' : 'text-slate-300'
            }`}
          >
            Semester Exam Planner
          </button>
          <button
            onClick={() => setActiveTab('core_cs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'core_cs'
                ? isDark
                  ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                  : 'bg-indigo-600 text-white shadow-xs'
                : isDark ? 'text-[#748D92] hover:text-[#D3D9D4]' : 'text-slate-300'
            }`}
          >
            Core CS Matrix (OS/DBMS/CN)
          </button>
        </div>
      </div>

      {/* TAB 1: CGPA TRACKER */}
      {activeTab === 'cgpa' && (
        <div className="space-y-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                Cumulative CGPA
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>{runningCgpa.toFixed(2)}</span>
                <span className={`text-xs font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>/ 10.00</span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Eligible for 100% of Tier-1 Companies (Cutoff: &gt;7.5)
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                Total Credits Earned
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${isDark ? 'text-[#D3D9D4]' : 'text-blue-400'}`}>{totalCredits}</span>
                <span className={`text-xs font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>Credits</span>
              </div>
              <p className={`text-[11px] mt-1 ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                Across {cgpaRecords.length} completed semesters
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                Highest SGPA
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${isDark ? 'text-[#D3D9D4]' : 'text-amber-400'}`}>
                  {Math.max(...cgpaRecords.map((r) => r.sgpa), 0).toFixed(2)}
                </span>
                <span className={`text-xs font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>Semester {cgpaRecords.reduce((max, r) => r.sgpa > (max?.sgpa || 0) ? r : max, cgpaRecords[0])?.semester || 4}</span>
              </div>
              <p className={`text-[11px] mt-1 ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                Consistently maintaining top 5% batch percentile
              </p>
            </div>
          </div>

          {/* Running CGPA Line Chart */}
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'}`}>
            <h4 className="font-bold text-base mb-1">Semester-wise SGPA Progression</h4>
            <p className={`text-xs mb-6 ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
              Visual progression of academic consistency across engineering semesters.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#748D9233' : '#e2e8f0'} />
                  <XAxis dataKey="name" stroke={isDark ? '#748D92' : '#64748b'} fontSize={12} />
                  <YAxis domain={[7.0, 10.0]} stroke={isDark ? '#748D92' : '#64748b'} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#2E3944' : '#ffffff',
                      borderColor: isDark ? '#748D92' : '#cbd5e1',
                      borderRadius: '12px',
                      color: isDark ? '#D3D9D4' : '#0f172a',
                      fontSize: '12px',
                    }}
                  />
                  <ReferenceLine y={8.0} stroke={isDark ? '#748D92' : '#10b981'} strokeDasharray="3 3" label={{ value: 'Target 8.0+', fill: isDark ? '#D3D9D4' : '#10b981', fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="sgpa"
                    stroke={isDark ? '#124E66' : '#6366f1'}
                    strokeWidth={3}
                    dot={{ r: 6, fill: isDark ? '#124E66' : '#6366f1', strokeWidth: 2, stroke: isDark ? '#D3D9D4' : '#ffffff' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SGPA Input Form & History Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'}`}>
              <h4 className="font-bold text-sm mb-4">Log Semester SGPA</h4>
              <form onSubmit={handleAddCgpa} className="space-y-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Semester Number</label>
                  <select
                    value={semNumber}
                    onChange={(e) => setSemNumber(parseInt(e.target.value))}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>SGPA (0.00 - 10.00)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={sgpaVal}
                    onChange={(e) => setSgpaVal(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Semester Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    required
                    value={creditsVal}
                    onChange={(e) => setCreditsVal(parseInt(e.target.value) || 20)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded-xl text-xs font-semibold shadow-md transition-all ${
                    isDark
                      ? 'bg-[#124E66] hover:bg-[#165b77] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                  }`}
                >
                  Save Semester Record
                </button>
              </form>
            </div>

            {/* Semester History Table */}
            <div className={`lg:col-span-2 p-6 rounded-2xl border ${isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'}`}>
              <h4 className="font-bold text-sm mb-4">Semester Breakdown</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-[#748D92]/30 text-[#748D92]' : 'border-slate-200 text-slate-500'}`}>
                      <th className="py-2.5 px-3">Semester</th>
                      <th className="py-2.5 px-3">SGPA</th>
                      <th className="py-2.5 px-3">Credits</th>
                      <th className="py-2.5 px-3">Weighted Total</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#748D92]/30' : 'divide-slate-800/40'}`}>
                    {cgpaRecords.map((rec) => (
                      <tr key={rec.id} className={isDark ? 'hover:bg-[#212A31]/40' : 'hover:bg-slate-50'}>
                        <td className={`py-3 px-3 font-semibold ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>Semester {rec.semester}</td>
                        <td className="py-3 px-3 font-bold">{rec.sgpa.toFixed(2)}</td>
                        <td className="py-3 px-3">{rec.credits}</td>
                        <td className="py-3 px-3 font-mono">{(rec.sgpa * rec.credits).toFixed(1)}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onDeleteCgpaRecord(rec.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE SEMESTER EXAM PLANNER */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">Active Semester Exam Schedule & Revision Roadmap</h3>
              <p className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                Prepare systematically for university examinations without sacrificing placement coding time.
              </p>
            </div>
            <button
              onClick={() => setShowAddExamModal(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-auto ${
                isDark
                  ? 'bg-[#124E66] hover:bg-[#165b77] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              <Plus className="w-4 h-4" /> Add Subject Exam
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examPlanners.map((exam) => {
              const examDateObj = new Date(exam.examDate);
              const daysLeft = Math.ceil((examDateObj.getTime() - Date.now()) / (1000 * 3600 * 24));
              const doneCount = exam.revisionPlan.filter((r) => r.done).length;
              const progressPct = Math.round((doneCount / (exam.revisionPlan.length || 1)) * 100);

              return (
                <div
                  key={exam.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border ${
                        isDark ? 'text-[#D3D9D4] bg-[#124E66] border-[#748D92]/40' : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                      }`}>
                        {exam.subjectCode}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          daysLeft > 14
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : daysLeft > 5
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400 font-bold animate-pulse'
                        }`}
                      >
                        {daysLeft > 0 ? `${daysLeft} Days Left` : 'Exam Today'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm mb-1">{exam.subjectName}</h4>
                    <div className={`flex items-center gap-3 text-[11px] mb-4 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {exam.examDate}
                      </span>
                      <span>•</span>
                      <span>{exam.credits} Credits</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className={isDark ? 'text-[#748D92]' : 'text-slate-400'}>Revision Roadmap</span>
                        <span className={`font-semibold ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>
                          {doneCount}/{exam.revisionPlan.length} ({progressPct}%)
                        </span>
                      </div>
                      <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-[#212A31]' : 'bg-slate-700/30'}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${isDark ? 'bg-[#124E66]' : 'bg-indigo-500'}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Day-wise steps */}
                    <div className="space-y-2">
                      {exam.revisionPlan.map((step, idx) => (
                        <div
                          key={idx}
                          onClick={() => onToggleRevisionItem(exam.id, idx)}
                          className={`p-2 rounded-lg border text-xs flex items-start gap-2 cursor-pointer transition-colors ${
                            step.done
                              ? isDark ? 'bg-[#212A31]/40 border-[#748D92]/20 text-[#748D92] line-through' : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                              : isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <button className="shrink-0 mt-0.5">
                            {step.done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-[#748D92]" />}
                          </button>
                          <div className="min-w-0">
                            <span className={`font-semibold text-[10px] block ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>{step.day}</span>
                            <span className="text-[11px] leading-tight">{step.topic}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Exam Modal */}
          {showAddExamModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${isDark ? 'bg-[#2E3944] border-[#748D92]/50 text-[#D3D9D4]' : 'bg-white border-slate-200 text-slate-900'}`}>
                <h3 className="text-lg font-bold mb-4">Add Semester Exam Subject</h3>
                <form onSubmit={handleAddExam} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Subject Code</label>
                      <input
                        type="text"
                        placeholder="CS501"
                        value={examSubCode}
                        onChange={(e) => setExamSubCode(e.target.value)}
                        className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                          isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Credits</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={examCredits}
                        onChange={(e) => setExamCredits(parseInt(e.target.value) || 4)}
                        className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                          isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Subject Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Compiler Design"
                      value={examSubName}
                      onChange={(e) => setExamSubName(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                        isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Exam Date</label>
                      <input
                        type="date"
                        required
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                          isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Difficulty</label>
                      <select
                        value={examDifficulty}
                        onChange={(e) => setExamDifficulty(e.target.value as any)}
                        className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                          isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                        }`}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddExamModal(false)}
                      className={`px-4 py-2 text-xs font-medium rounded-xl border ${
                        isDark ? 'border-[#748D92]/40 text-[#748D92] hover:bg-[#212A31]' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-xs ${
                        isDark
                          ? 'bg-[#124E66] hover:bg-[#165b77] text-[#D3D9D4] border border-[#748D92]/40'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      Create Plan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CORE CS SUBJECTS KNOWLEDGE MATRIX */}
      {activeTab === 'core_cs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Core CS Technical Interview Knowledge Matrix</h3>
              <p className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                Rate your confidence (1–5 Stars) across OS, DBMS, Computer Networks, OOP, and System Design.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {coreSubjects.map((subject) => {
              const completedTopics = subject.keyTopics.filter((t) => t.completed).length;
              const totalTopics = subject.keyTopics.length;
              const percent = Math.round((completedTopics / totalTopics) * 100);

              return (
                <div
                  key={subject.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-base">{subject.subjectName}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isDark ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {subject.category}
                        </span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                        {completedTopics} of {totalTopics} topics mastered ({percent}%)
                      </p>
                    </div>

                    {/* 5-Star Confidence Rating */}
                    <div className={`flex items-center gap-1 shrink-0 p-1.5 rounded-xl border ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40' : 'bg-slate-800/40 border-slate-700/50'
                    }`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => onUpdateCoreSubject(subject.id, { confidenceLevel: star })}
                          className="p-0.5 hover:scale-115 transition-transform"
                          title={`Set confidence: ${star}/5`}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= subject.confidenceLevel
                                ? 'text-amber-400 fill-amber-400'
                                : isDark ? 'text-[#748D92]' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topics Checklist */}
                  <div className="space-y-1.5 mb-4 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {subject.keyTopics.map((topic, tIdx) => (
                      <div
                        key={tIdx}
                        onClick={() => onToggleCoreTopic(subject.id, tIdx)}
                        className={`p-2 rounded-lg text-xs flex items-center gap-2.5 cursor-pointer transition-colors ${
                          topic.completed
                            ? isDark ? 'bg-[#212A31]/30 text-[#748D92]' : 'bg-slate-50 text-slate-400'
                            : isDark ? 'bg-[#212A31] text-[#D3D9D4] hover:bg-[#212A31]/80 border border-[#748D92]/20' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        <button className="shrink-0">
                          {topic.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#748D92]" />
                          )}
                        </button>
                        <span className={`truncate ${topic.completed ? 'line-through' : ''}`}>
                          {topic.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Frequently Asked Interview Questions */}
                  <div className={`p-3 rounded-xl text-xs border ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-indigo-50/40 border-indigo-100 text-slate-700'
                  }`}>
                    <div className={`font-semibold mb-1.5 flex items-center gap-1 ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>
                      <HelpCircle className="w-3.5 h-3.5 text-[#124E66]" /> High-Probability Interview Questions:
                    </div>
                    <ul className={`list-disc list-inside space-y-1 text-[11px] ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>
                      {subject.frequentlyAskedQuestions.slice(0, 2).map((faq, fIdx) => (
                        <li key={fIdx} className="truncate">
                          {faq}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
