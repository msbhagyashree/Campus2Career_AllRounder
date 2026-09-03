import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  Clock,
  ChevronRight,
  ExternalLink,
  Trash2,
  Edit3,
  Award,
  Sparkles,
} from 'lucide-react';
import { InternshipApplication } from '../types';
import confetti from 'canvas-confetti';

interface InternshipsTrackerProps {
  applications: InternshipApplication[];
  onAddApplication: (app: Omit<InternshipApplication, 'id'>) => void;
  onUpdateStatus: (id: string, status: InternshipApplication['status']) => void;
  onDeleteApplication: (id: string) => void;
  isDark: boolean;
}

export const InternshipsTracker: React.FC<InternshipsTrackerProps> = ({
  applications,
  onAddApplication,
  onUpdateStatus,
  onDeleteApplication,
  isDark,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<InternshipApplication | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('Software Engineering Intern');
  const [locationVal, setLocationVal] = useState('Bengaluru / Remote');
  const [stipendVal, setStipendVal] = useState('₹1,00,000 / month');
  const [appStatus, setAppStatus] = useState<InternshipApplication['status']>('Applied');
  const [appUrl, setAppUrl] = useState('');
  const [referralContact, setReferralContact] = useState('');
  const [notesVal, setNotesVal] = useState('');

  const statuses: InternshipApplication['status'][] = [
    'Bookmarked',
    'Applied',
    'OA Scheduled',
    'Technical Round',
    'HR Round',
    'Offer',
    'Rejected',
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    onAddApplication({
      companyName: companyName.trim(),
      roleTitle: roleTitle.trim(),
      location: locationVal.trim(),
      stipend: stipendVal.trim(),
      status: appStatus,
      appliedDate: new Date().toISOString().split('T')[0],
      applicationUrl: appUrl.trim() || undefined,
      referralContact: referralContact.trim() || undefined,
      notes: notesVal.trim(),
      rounds: [
        {
          roundName: 'Online Assessment (OA)',
          scheduledDate: '2026-09-15',
          status: appStatus === 'Applied' ? 'Pending' : 'Completed',
          feedback: '2 LeetCode Mediums (Graph DFS + Sliding Window)',
        },
      ],
    });

    if (appStatus === 'Offer') {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    }

    setCompanyName('');
    setShowAddModal(false);
  };

  const filteredApps = applications.filter((app) =>
    filterStatus === 'All' ? true : app.status === filterStatus
  );

  const getStatusColor = (status: InternshipApplication['status']) => {
    if (isDark) {
      switch (status) {
        case 'Offer':
          return 'bg-[#124E66] text-emerald-300 border border-[#748D92]/40';
        case 'Technical Round':
        case 'HR Round':
          return 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40';
        case 'OA Scheduled':
          return 'bg-[#124E66] text-amber-300 border border-[#748D92]/40';
        case 'Applied':
          return 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40';
        case 'Rejected':
          return 'bg-[#212A31] text-rose-400 border border-rose-900/50';
        default:
          return 'bg-[#212A31] text-[#748D92] border border-[#748D92]/30';
      }
    }
    switch (status) {
      case 'Offer':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Technical Round':
      case 'HR Round':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'OA Scheduled':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Applied':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Internships & Placement Pipeline</h2>
          <p className={`text-sm ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
            Track company hiring drives, online assessments, interview rounds, and job offers.
          </p>
        </div>

        <button
          id="add-internship-app-btn"
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-auto ${
            isDark
              ? 'bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] border border-[#748D92]/40 shadow-[#124E66]/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Summary Pipeline Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className={`text-xs font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Total Applied</div>
          <div className={`text-2xl font-extrabold mt-1 ${isDark ? 'text-[#D3D9D4]' : 'text-blue-400'}`}>{applications.length}</div>
        </div>
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className={`text-xs font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Active In-Process</div>
          <div className={`text-2xl font-extrabold mt-1 ${isDark ? 'text-amber-300' : 'text-amber-400'}`}>
            {applications.filter((a) => ['OA Scheduled', 'Technical Round', 'HR Round'].includes(a.status)).length}
          </div>
        </div>
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className={`text-xs font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Interviews Reached</div>
          <div className={`text-2xl font-extrabold mt-1 ${isDark ? 'text-[#D3D9D4]' : 'text-purple-400'}`}>
            {applications.filter((a) => ['Technical Round', 'HR Round', 'Offer'].includes(a.status)).length}
          </div>
        </div>
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className={`text-xs font-medium ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Offers Received</div>
          <div className={`text-2xl font-extrabold mt-1 flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-400'}`}>
            {applications.filter((a) => a.status === 'Offer').length}
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', ...statuses].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === st
                ? isDark
                  ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                  : 'bg-indigo-600 text-white shadow-xs'
                : isDark
                ? 'bg-[#212A31] border border-[#748D92]/30 text-[#748D92] hover:text-[#D3D9D4]'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st} {st !== 'All' ? `(${applications.filter((a) => a.status === st).length})` : ''}
          </button>
        ))}
      </div>

      {/* Applications Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
              isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
                    isDark ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40' : 'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    {app.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{app.companyName}</h3>
                    <p className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>{app.roleTitle}</p>
                  </div>
                </div>

                <select
                  value={app.status}
                  onChange={(e) => onUpdateStatus(app.id, e.target.value as any)}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-lg border focus:outline-none ${getStatusColor(app.status)}`}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`space-y-2 text-xs my-4 ${isDark ? 'text-[#D3D9D4]/80' : 'text-slate-400'}`}>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span className={`font-medium ${isDark ? 'text-[#D3D9D4]' : 'text-slate-200'}`}>{app.stipend}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`} />
                  <span>{app.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`} />
                  <span>Applied on {app.appliedDate}</span>
                </div>
                {app.referralContact && (
                  <div className={`text-[11px] font-medium ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>
                    Ref: {app.referralContact}
                  </div>
                )}
              </div>

              {/* Rounds breakdown */}
              {app.rounds && app.rounds.length > 0 && (
                <div className={`p-3 rounded-xl border mb-4 text-xs ${isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`font-semibold mb-1.5 ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>Interview Milestones:</div>
                  <div className="space-y-1.5">
                    {app.rounds.map((r, rIdx) => (
                      <div key={rIdx} className="flex items-center justify-between text-[11px]">
                        <span className={isDark ? 'text-[#D3D9D4]' : 'text-slate-300'}>{r.roundName}</span>
                        <span className={`font-semibold ${r.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`flex items-center justify-between pt-3 border-t text-xs ${isDark ? 'border-[#748D92]/30 text-[#D3D9D4]' : 'border-slate-800/60'}`}>
              {app.applicationUrl ? (
                <a
                  href={app.applicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`font-semibold flex items-center gap-1 transition-colors ${
                    isDark ? 'text-[#D3D9D4] hover:underline' : 'text-indigo-400 hover:text-indigo-300'
                  }`}
                >
                  Portal <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className={isDark ? 'text-[#748D92]' : 'text-slate-500'}>Internal Referral</span>
              )}

              <button
                onClick={() => onDeleteApplication(app.id)}
                className={`transition-colors p-1 ${
                  isDark ? 'text-[#748D92] hover:text-rose-400' : 'text-slate-500 hover:text-rose-400'
                }`}
                title="Delete application"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className={`col-span-full py-16 text-center text-sm ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>
            No internship applications found under this status filter.
          </div>
        )}
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-lg font-bold mb-4">Add Internship / Job Application</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Atlassian"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Role Title</label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Stipend / CTC</label>
                  <input
                    type="text"
                    value={stipendVal}
                    onChange={(e) => setStipendVal(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Initial Status</label>
                  <select
                    value={appStatus}
                    onChange={(e) => setAppStatus(e.target.value as any)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Location</label>
                  <input
                    type="text"
                    value={locationVal}
                    onChange={(e) => setLocationVal(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Referral / Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Alum @ LinkedIn"
                    value={referralContact}
                    onChange={(e) => setReferralContact(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Application URL</label>
                <input
                  type="url"
                  placeholder="https://careers.google.com/..."
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
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
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
