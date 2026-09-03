import React, { useState } from 'react';
import {
  FolderGit2,
  Github,
  ExternalLink,
  Star,
  Plus,
  Trash2,
  CheckCircle,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectsTrackerProps {
  projects: ProjectItem[];
  onAddProject: (project: Omit<ProjectItem, 'id'>) => void;
  onDeleteProject: (id: string) => void;
  isDark: boolean;
}

export const ProjectsTracker: React.FC<ProjectsTrackerProps> = ({
  projects,
  onAddProject,
  onDeleteProject,
  isDark,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [stars, setStars] = useState(12);
  const [status, setStatus] = useState<ProjectItem['status']>('Production');
  const [bullet1, setBullet1] = useState('');
  const [bullet2, setBullet2] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const resumeBullets = [bullet1.trim(), bullet2.trim()].filter(Boolean);

    onAddProject({
      title: title.trim(),
      description: description.trim(),
      techStack: tags.length > 0 ? tags : ['React', 'TypeScript', 'Node.js'],
      repoUrl: repoUrl.trim() || 'https://github.com/bhagyashree-dev/project',
      liveUrl: liveUrl.trim() || undefined,
      stars: stars || 0,
      status: status,
      resumeBullets:
        resumeBullets.length > 0
          ? resumeBullets
          : ['Architected scalable full-stack system with sub-100ms API response time.'],
    });

    setTitle('');
    setDescription('');
    setTechStack('');
    setRepoUrl('');
    setLiveUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Major Engineering Projects</h2>
          <p className={`text-sm ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
            Showcase your best software engineering projects, GitHub repositories, and STAR-format resume bullet points.
          </p>
        </div>

        <button
          id="add-project-btn"
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-auto ${
            isDark
              ? 'bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] border border-[#748D92]/40 shadow-[#124E66]/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
              isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] shadow-xs' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isDark ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40' : 'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{proj.title}</h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isDark
                          ? 'bg-[#124E66] text-[#D3D9D4] border-[#748D92]/40'
                          : proj.status === 'Production'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                </div>

                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                  isDark ? 'bg-[#124E66] text-[#D3D9D4] border-[#748D92]/40' : 'text-amber-400 bg-amber-500/10'
                }`}>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{proj.stars}</span>
                </div>
              </div>

              <p className={`text-xs mb-4 line-clamp-2 ${isDark ? 'text-[#D3D9D4]/90' : 'text-slate-600'}`}>
                {proj.description}
              </p>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {proj.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      isDark ? 'bg-[#212A31] text-[#D3D9D4] border-[#748D92]/30' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Resume STAR Bullets */}
              <div className={`p-3 rounded-xl border mb-4 text-xs ${isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`font-semibold mb-1.5 flex items-center gap-1 ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`}>
                  <Sparkles className="w-3 h-3 text-amber-400" /> Resume STAR Bullet Points:
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  {proj.resumeBullets.map((bullet, bIdx) => (
                    <li key={bIdx} className={`line-clamp-2 ${isDark ? 'text-[#D3D9D4]' : 'text-slate-300'}`}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Links and Actions */}
            <div className={`flex items-center justify-between pt-4 border-t text-xs ${
              isDark ? 'border-[#748D92]/30 text-[#D3D9D4]' : 'border-slate-800/60'
            }`}>
              <div className="flex items-center gap-3">
                <a
                  href={proj.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`font-semibold flex items-center gap-1 transition-colors ${
                    isDark ? 'text-[#D3D9D4] hover:text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Github className="w-3.5 h-3.5" /> Code
                </a>
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`font-semibold flex items-center gap-1 transition-colors ${
                      isDark ? 'text-[#D3D9D4] hover:underline' : 'text-indigo-400 hover:text-indigo-300'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                  </a>
                )}
              </div>

              <button
                onClick={() => onDeleteProject(proj.id)}
                className={`transition-colors p-1 ${
                  isDark ? 'text-[#748D92] hover:text-rose-400' : 'text-slate-500 hover:text-rose-400'
                }`}
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl ${
            isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-lg font-bold mb-4">Add Major Resume Project</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Key-Value Store"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Description</label>
                <textarea
                  rows={2}
                  placeholder="High-level architecture and problem solved..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Go, Raft, Docker, gRPC"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>GitHub Stars</label>
                  <input
                    type="number"
                    min="0"
                    value={stars}
                    onChange={(e) => setStars(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://my-app.vercel.app"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#748D92]' : 'text-slate-400'}`}>Resume STAR Bullet Point 1</label>
                <input
                  type="text"
                  placeholder="Implemented Raft consensus protocol, decreasing failover election time to 150ms."
                  value={bullet1}
                  onChange={(e) => setBullet1(e.target.value)}
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
