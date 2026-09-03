import React, { useState } from 'react';
import { Database, X, Copy, Check, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose, isDark }) => {
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const sqlSchemaSnippet = `-- Campus2Career Supabase Postgres Schema + Row-Level Security (RLS)
-- Run this in your Supabase SQL Editor:

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  college TEXT,
  branch TEXT,
  graduation_year INT DEFAULT 2026,
  target_role TEXT DEFAULT 'Software Engineer (SDE-1)',
  leetcode_username TEXT,
  github_username TEXT,
  streak_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DSA Topics Table
CREATE TABLE IF NOT EXISTS dsa_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  leetcode_url TEXT,
  key_pattern TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ
);

-- 3. Aptitude Topics Table
CREATE TABLE IF NOT EXISTS aptitude_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Quantitative', 'Reasoning', 'Verbal')),
  key_concept TEXT,
  practice_solved INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dsa_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE aptitude_topics ENABLE ROW LEVEL SECURITY;

-- 5. Strict User Access Policies
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can manage their own DSA items" 
ON dsa_topics FOR ALL USING (auth.uid() = user_id);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl p-6 rounded-2xl border shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar ${
          isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className={`flex items-center justify-between pb-4 border-b mb-5 ${isDark ? 'border-[#748D92]/30' : 'border-slate-800/60'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-[#124E66] text-emerald-300 border border-[#748D92]/40' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Supabase Cloud Database & RLS Architecture</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  Ready
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                Full PostgreSQL schema with user-scoped Row-Level Security for multi-device sync.
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

        <div className="space-y-4 text-xs">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#212A31] border-[#748D92]/30' : 'bg-emerald-50/50 border-emerald-100'}`}>
            <h4 className="font-bold text-sm text-emerald-400 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Production Database Setup Guide:
            </h4>
            <ol className={`list-decimal list-inside space-y-1.5 text-[11px] mt-2 ${isDark ? 'text-[#D3D9D4]' : 'text-slate-300'}`}>
              <li>Create a new project on <strong>Supabase</strong> (Free tier).</li>
              <li>Navigate to the <strong>SQL Editor</strong> tab on your Supabase dashboard.</li>
              <li>Paste and execute the schema script below (included in root <code className={isDark ? 'text-cyan-300' : 'text-indigo-300'}>supabase-schema.sql</code>).</li>
              <li>Set <code className={isDark ? 'text-cyan-300' : 'text-indigo-300'}>VITE_SUPABASE_URL</code> and <code className={isDark ? 'text-cyan-300' : 'text-indigo-300'}>VITE_SUPABASE_ANON_KEY</code> in your environment variables.</li>
            </ol>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-bold text-xs ${isDark ? 'text-[#D3D9D4]' : 'text-slate-300'}`}>SQL Schema (Tables & RLS Policies)</span>
              <button
                onClick={handleCopy}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isDark ? 'border-[#748D92]/40 text-[#D3D9D4] hover:bg-[#212A31]' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className={`p-4 rounded-xl border font-mono text-[11px] max-h-64 overflow-y-auto custom-scrollbar ${
              isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              {sqlSchemaSnippet}
            </pre>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-semibold text-xs shadow-xs transition-all ${
                isDark
                  ? 'bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] border border-[#748D92]/40 shadow-[#124E66]/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
