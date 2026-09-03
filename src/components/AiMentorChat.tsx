import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Copy,
  Check,
  Code2,
  Brain,
  Award,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface AiMentorChatProps {
  profile: UserProfile;
  isDark: boolean;
}

export const AiMentorChat: React.FC<AiMentorChatProps> = ({ profile, isDark }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: `Hello ${profile.name}! 👋 I am your **Campus2Career AI Placement Mentor**.\n\nI'm here to help you crack Tier-1 SDE roles at companies like Google, Microsoft, Amazon, and Atlassian. You can ask me to:\n- 🎯 **Conduct a live 15-min mock technical interview** on any DSA pattern or Core CS subject\n- 📝 **Refine your STAR resume bullet points** to highlight metrics and business impact\n- 💡 **Explain tricky CS concepts** (OS page replacement, Database locks, Raft consensus, TCP handshakes)\n- 🤝 **Prepare smart behavioral answers** (handling conflict, explaining gaps, HR questions)\n\nWhat would you like to practice today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '🎯 Give me a 15-minute mock DSA problem on Sliding Window',
    '📝 Review & polish my backend project resume bullet point',
    '🧠 Explain ACID properties & Deadlock prevention in OS with interview examples',
    '🏢 What are the top filtering traps in Amazon & TCS NQT assessments?',
    '💼 How do I answer "Tell me about a time you failed a technical design"?',
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      // Build history payload for Gemini API
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: history,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const modelReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.reply || 'I am ready to help you with your next placement query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `I encountered an issue connecting to the Gemini mentor service: ${err.message || 'Please check your GEMINI_API_KEY in the environment.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: '1',
        role: 'model',
        content: `Chat history cleared. How can I assist your placement preparation next, ${profile.name}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[#D3D9D4] shadow-lg ${
            isDark
              ? 'bg-[#124E66] border border-[#748D92]/40 shadow-[#124E66]/25'
              : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 shadow-indigo-500/25 text-white'
          }`}>
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">AI Placement & SDE Mentor</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-[#124E66] text-[#D3D9D4] border-[#748D92]/40'
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}>
                Powered by Gemini 3.7 Flash
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
              Your 24/7 personal career coach for live mock technical interviews, DSA patterns, and resume audits.
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors ${
            isDark ? 'border-[#748D92]/40 text-[#748D92] hover:text-[#D3D9D4] hover:bg-[#2E3944]' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Quick Starter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isDark
                ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] hover:border-[#124E66] hover:bg-[#124E66]/40'
                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div
        className={`h-[520px] rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg transition-all ${
          isDark ? 'bg-[#212A31] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-slate-50/70 border-slate-200'
        }`}
      >
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? isDark
                        ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : isDark
                      ? 'bg-[#2E3944] text-[#D3D9D4] border border-[#748D92]/40 shadow-xs'
                      : 'bg-gradient-to-tr from-indigo-500 to-blue-500 text-white shadow-md shadow-indigo-500/20'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? isDark
                        ? 'bg-[#124E66] text-[#D3D9D4] rounded-tr-xs border border-[#748D92]/40 shadow-xs'
                        : 'bg-indigo-600 text-white rounded-tr-xs shadow-md shadow-indigo-600/20'
                      : isDark
                      ? 'bg-[#2E3944] border border-[#748D92]/30 text-[#D3D9D4] rounded-tl-xs shadow-md'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-sm'
                  }`}
                >
                  {/* Markdown formatted content */}
                  <div className="whitespace-pre-wrap space-y-2 font-normal">
                    {m.content}
                  </div>

                  <div
                    className={`mt-2.5 pt-2 flex items-center justify-between text-[10px] border-t ${
                      isUser
                        ? isDark ? 'border-[#748D92]/40 text-[#D3D9D4]/70' : 'border-indigo-500/40 text-indigo-200'
                        : isDark ? 'border-[#748D92]/30 text-[#748D92]' : 'border-slate-100 text-slate-400'
                    }`}
                  >
                    <span>{m.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => handleCopy(m.content, m.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          isDark ? 'hover:text-[#D3D9D4]' : 'hover:text-indigo-400'
                        }`}
                        title="Copy message"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center animate-pulse ${
                isDark ? 'bg-[#124E66] text-[#D3D9D4] border border-[#748D92]/40' : 'bg-gradient-to-tr from-indigo-500 to-blue-500 text-white'
              }`}>
                <Bot className="w-4 h-4" />
              </div>
              <div className={`p-4 rounded-2xl rounded-tl-xs border text-xs flex items-center gap-2 ${
                isDark ? 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]' : 'bg-white border-slate-200 text-slate-600'
              }`}>
                <RefreshCw className={`w-3.5 h-3.5 animate-spin ${isDark ? 'text-[#D3D9D4]' : 'text-indigo-400'}`} />
                <span>Thinking & architecting your placement response...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className={`p-3 sm:p-4 border-t ${isDark ? 'bg-[#2E3944] border-[#748D92]/30' : 'bg-white border-slate-200'}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask your placement mentor anything (DSA pattern, mock question, resume review)..."
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none ${
                isDark
                  ? 'bg-[#212A31] border-[#748D92]/40 text-[#D3D9D4] placeholder-[#748D92]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500'
              }`}
            />

            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className={`px-4 py-2.5 rounded-xl disabled:opacity-50 font-semibold text-xs flex items-center gap-2 shadow-md transition-all shrink-0 ${
                isDark
                  ? 'bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] border border-[#748D92]/40 shadow-[#124E66]/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
