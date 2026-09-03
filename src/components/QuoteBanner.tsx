import React, { useState, useEffect } from 'react';
import { Quote } from '../types';
import { Sparkles, ChevronLeft, ChevronRight, Heart, Quote as QuoteIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuoteBannerProps {
  quotes: Quote[];
  onToggleFavorite: (id: string) => void;
  isDark: boolean;
  cgpa?: number;
  streak?: number;
}

export const QuoteBanner: React.FC<QuoteBannerProps> = ({
  quotes,
  onToggleFavorite,
  isDark,
  cgpa = 8.92,
  streak = 14,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotation every 10 seconds unless hovered
  useEffect(() => {
    if (isPaused || quotes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isPaused, quotes.length]);

  const currentQuote = quotes[currentIndex] || quotes[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  if (!currentQuote) return null;

  return (
    <div
      id="motivation-quote-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-r from-[#212A31] via-[#2E3944]/70 to-[#124E66] border-[#748D92]/30 shadow-lg shadow-[#124E66]/20'
          : 'bg-gradient-to-r from-indigo-50 via-white to-blue-50 border-indigo-100 shadow-xs'
      } p-5 sm:p-6 mb-6`}
    >
      {/* Clean radial ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(18,78,102,0.18),transparent)] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Quote content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-md ${
                isDark
                  ? 'bg-[#124E66]/40 text-[#D3D9D4] border border-[#748D92]/40'
                  : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}
            >
              {currentQuote.category}
            </span>
            <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
              <Sparkles className="w-3 h-3 text-[#D3D9D4]" />
              Daily Inspiration
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <p className={`text-base sm:text-lg font-serif italic leading-relaxed ${isDark ? 'text-[#D3D9D4]' : 'text-slate-800'}`}>
                &lsquo;{currentQuote.quote}&rsquo;
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <p className={`text-[10px] uppercase tracking-widest font-semibold ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>
                  — {currentQuote.author}
                </p>
                <span className={`text-xs ${isDark ? 'text-[#748D92]' : 'text-slate-600'}`}>•</span>
                <span className={`text-[11px] ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>{currentQuote.designation}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side: Quick stats and carousel buttons */}
        <div className={`flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 ${isDark ? 'border-[#748D92]/30' : 'border-slate-800/80'}`}>
          {/* Quick metric stats from Clean Minimalism header */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="text-right">
              <p className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>Current CGPA</p>
              <p className={`text-lg font-bold leading-none ${isDark ? 'text-[#D3D9D4]' : 'text-teal-400'}`}>{cgpa.toFixed(2)}</p>
            </div>
            <div className={`w-[1px] h-7 ${isDark ? 'bg-[#748D92]/30' : 'bg-slate-800'}`} />
            <div className="text-right">
              <p className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-[#748D92]' : 'text-slate-500'}`}>Streak</p>
              <p className={`text-lg font-bold leading-none ${isDark ? 'text-[#D3D9D4]' : 'text-orange-400'}`}>{streak} 🔥</p>
            </div>
            <div className={`w-[1px] h-7 ${isDark ? 'bg-[#748D92]/30' : 'bg-slate-800'}`} />
          </div>

          {/* Quote Controls */}
          <div className="flex items-center gap-1.5">
            <button
              id="quote-prev-button"
              onClick={handlePrev}
              aria-label="Previous quote"
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? 'border-[#748D92]/30 bg-[#2E3944]/80 hover:bg-[#124E66] text-[#D3D9D4]'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1 px-1">
              {quotes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to quote ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    idx === currentIndex
                      ? isDark
                        ? 'w-4 bg-[#D3D9D4]'
                        : 'w-4 bg-indigo-600'
                      : isDark
                      ? 'w-1.5 bg-[#748D92]/40 hover:bg-[#748D92]'
                      : 'w-1.5 bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <button
              id="quote-next-button"
              onClick={handleNext}
              aria-label="Next quote"
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? 'border-[#748D92]/30 bg-[#2E3944]/80 hover:bg-[#124E66] text-[#D3D9D4]'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              id="quote-fav-button"
              onClick={() => onToggleFavorite(currentQuote.id)}
              aria-label="Favorite quote"
              className={`p-1.5 rounded-lg border ml-1 transition-colors ${
                currentQuote.favorite
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                  : isDark
                  ? 'border-[#748D92]/30 bg-[#2E3944]/80 text-[#748D92] hover:text-[#D3D9D4] hover:bg-[#124E66]'
                  : 'border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${currentQuote.favorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
