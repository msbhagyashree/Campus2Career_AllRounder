import React, { useState } from 'react';
import {
  User,
  X,
  GraduationCap,
  Building2,
  Github,
  Code2,
  Briefcase,
  Save,
  Download,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onResetData: () => void;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onUpdateProfile,
  onResetData,
  isOpen,
  onClose,
  isDark,
}) => {
  const [name, setName] = useState(profile.name);
  const [college, setCollege] = useState(profile.college);
  const [branch, setBranch] = useState(profile.branch);
  const [gradYear, setGradYear] = useState(profile.graduationYear);
  const [targetRole, setTargetRole] = useState(profile.targetRole);
  const [leetcodeUsername, setLeetcodeUsername] = useState(profile.leetcodeUsername);
  const [githubUsername, setGithubUsername] = useState(profile.githubUsername);
  const [targetCompanies, setTargetCompanies] = useState(profile.targetCompanies.join(', '));
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const companies = targetCompanies
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    onUpdateProfile({
      name: name.trim(),
      college: college.trim(),
      branch: branch.trim(),
      graduationYear: gradYear,
      targetRole: targetRole.trim(),
      leetcodeUsername: leetcodeUsername.trim(),
      githubUsername: githubUsername.trim(),
      targetCompanies: companies.length > 0 ? companies : ['Google', 'Microsoft', 'Amazon'],
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(localStorage.getItem('campus2career_data_v1') || '{}');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `campus2career_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`w-full max-w-xl p-6 rounded-2xl border shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar ${
          isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className={`flex items-center justify-between pb-4 border-b mb-5 ${isDark ? 'border-[#748D92]/30' : 'border-slate-800/60'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40' : 'bg-indigo-600/20 text-indigo-400'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Engineering Student Profile & Settings</h3>
              <p className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                Personalize your placement targets and sync settings.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-[#748D92] hover:text-[#D3D9D4] hover:bg-[#212A31]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Student Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                  isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Graduation Year</label>
              <input
                type="number"
                value={gradYear}
                onChange={(e) => setGradYear(parseInt(e.target.value) || 2026)}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                  isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                  isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Branch / Major</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                  isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>LeetCode Username</label>
              <input
                type="text"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                placeholder="bhagyashree_code"
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                  isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>GitHub Username</label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="bhagyashree-dev"
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                  isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Target SDE Roles</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Software Engineer (SDE-1), Backend Developer"
              className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Target Companies (comma separated)</label>
            <input
              type="text"
              value={targetCompanies}
              onChange={(e) => setTargetCompanies(e.target.value)}
              placeholder="Google, Microsoft, Amazon, Atlassian, Uber"
              className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
              }`}
            />
          </div>

          {/* Backup and Storage options */}
          <div className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'border-[#748D92]/30' : 'border-slate-800/60'
          }`}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1 font-medium transition-colors ${
                  isDark ? 'border-[#748D92]/40 text-[#D3D9D4] hover:bg-[#212A31]' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Download className="w-3.5 h-3.5" /> Export JSON Backup
              </button>
              <button
                type="button"
                onClick={onResetData}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1 font-medium transition-colors ${
                  isDark
                    ? 'border-rose-500/40 text-rose-300 hover:bg-rose-950/30'
                    : 'border-rose-900/50 text-rose-400 hover:bg-rose-950/30'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Curriculum
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl border font-medium ${
                  isDark ? 'border-[#748D92]/40 text-[#D3D9D4] hover:bg-[#212A31]' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 shadow-md ${
                  isDark
                    ? 'bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] border border-[#748D92]/40 shadow-[#124E66]/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                }`}
              >
                {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                <span>{savedSuccess ? 'Saved!' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
