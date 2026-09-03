import React, { useState } from 'react';
import {
  Award,
  Plus,
  ExternalLink,
  Trash2,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { CourseCertificate } from '../types';

interface CoursesTrackerProps {
  courses: CourseCertificate[];
  onAddCourse: (course: Omit<CourseCertificate, 'id'>) => void;
  onUpdateProgress: (id: string, progress: number, status: CourseCertificate['status']) => void;
  onDeleteCourse: (id: string) => void;
  isDark: boolean;
}

export const CoursesTracker: React.FC<CoursesTrackerProps> = ({
  courses,
  onAddCourse,
  onUpdateProgress,
  onDeleteCourse,
  isDark,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [courseTitle, setCourseTitle] = useState('');
  const [platform, setPlatform] = useState<CourseCertificate['platform']>('Coursera');
  const [instructor, setInstructor] = useState('');
  const [skills, setSkills] = useState('');
  const [progressVal, setProgressVal] = useState(100);
  const [certUrl, setCertUrl] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const skillsArr = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const isComplete = progressVal >= 100;

    onAddCourse({
      courseTitle: courseTitle.trim(),
      platform: platform,
      instructor: instructor.trim() || undefined,
      progressPercentage: progressVal,
      status: isComplete ? 'Completed' : progressVal > 0 ? 'In Progress' : 'Enrolled',
      certificateUrl: certUrl.trim() || undefined,
      skillsAcquired: skillsArr.length > 0 ? skillsArr : ['Cloud Architecture', 'TypeScript'],
      completionDate: isComplete ? new Date().toISOString().split('T')[0] : undefined,
    });

    setCourseTitle('');
    setInstructor('');
    setSkills('');
    setCertUrl('');
    setShowAddModal(false);
  };

  const platforms: CourseCertificate['platform'][] = [
    'Coursera',
    'Infosys Springboard',
    'Udemy',
    'HackerRank',
    'NPTEL',
    'FreeCodeCamp',
    'Other',
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">External Courses & Certifications</h2>
          <p className={`text-sm ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
            Track your certificates from Infosys Springboard, Coursera, HackerRank, and NPTEL.
          </p>
        </div>

        <button
          id="add-course-btn"
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-auto ${
            isDark
              ? 'bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] border border-[#748D92]/40 shadow-[#124E66]/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Course / Certificate</span>
        </button>
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div
            key={c.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
              isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isDark
                      ? 'bg-[#124E66] text-[#D3D9D4] border-[#748D92]/40'
                      : c.platform === 'Infosys Springboard'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : c.platform === 'Coursera'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {c.platform}
                  </span>
                  <h3 className="font-bold text-base mt-1.5">{c.courseTitle}</h3>
                  {c.instructor && (
                    <span className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                      By {c.instructor}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border ${
                    isDark
                      ? c.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : c.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {c.status}
                </span>
              </div>

              {/* Progress Slider */}
              <div className="my-4">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className={isDark ? 'text-[#748D92]' : 'text-slate-500'}>Course Progress</span>
                  <span className={`font-semibold ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>{c.progressPercentage}%</span>
                </div>
                <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-[#212A31]' : 'bg-slate-700/30'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isDark ? 'bg-[#124E66]' : 'bg-indigo-500'}`}
                    style={{ width: `${c.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {c.skillsAcquired.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                      isDark ? 'bg-[#212A31] text-[#D3D9D4] border-[#748D92]/30' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between pt-4 border-t text-xs ${isDark ? 'border-[#748D92]/30 text-[#D3D9D4]' : 'border-slate-800/60'}`}>
              {c.certificateUrl ? (
                <a
                  href={c.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`font-semibold flex items-center gap-1 transition-colors ${
                    isDark ? 'text-emerald-300 hover:underline' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" /> View Certificate
                </a>
              ) : (
                <span className={isDark ? 'text-[#748D92]' : 'text-slate-500'}>In Progress</span>
              )}

              <button
                onClick={() => onDeleteCourse(c.id)}
                className={`transition-colors p-1 ${isDark ? 'text-[#748D92] hover:text-rose-400' : 'text-slate-500 hover:text-rose-400'}`}
                title="Delete course"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-lg font-bold mb-4">Add Course / Certification</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Progress % (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressVal}
                    onChange={(e) => setProgressVal(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Instructor / Provider</label>
                <input
                  type="text"
                  placeholder="e.g. Andrew Ng / Infosys Training Division"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Skills Acquired (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. AWS, S3, EC2, IAM, Lambda"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Certificate URL (if completed)</label>
                <input
                  type="url"
                  placeholder="https://coursera.org/verify/..."
                  value={certUrl}
                  onChange={(e) => setCertUrl(e.target.value)}
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
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
