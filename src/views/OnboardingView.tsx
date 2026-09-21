import React, { useState } from 'react';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { Bookmark, Inbox, Bell, ArrowRight } from 'lucide-react';

export const OnboardingView: React.FC = () => {
  const { setScreen } = useSavedFeedStore();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: (
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#7C6EF6]/20 to-[#EC4899]/20 border border-[#7C6EF6]/30 flex items-center justify-center text-[#7C6EF6] shadow-glow">
          <Bookmark className="w-12 h-12" />
        </div>
      ),
      heading: 'You save everything.',
      subtext: 'Articles, courses, tutorials, reels. All of it — going nowhere in your bookmarks.',
    },
    {
      icon: (
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#3B82F6]/20 to-[#8B5CF6]/20 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6] shadow-glow">
          <Inbox className="w-12 h-12" />
        </div>
      ),
      heading: 'SavedFeed collects them all.',
      subtext: 'One clean inbox for every link you save from Instagram, YouTube, Reddit, or the Web.',
    },
    {
      icon: (
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#4ADE80]/20 to-[#7C6EF6]/20 border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80] shadow-glow">
          <Bell className="w-12 h-12" />
        </div>
      ),
      heading: 'We bring them back at the right time.',
      subtext: 'Smart spaced repetition nudges so you actually learn and retain what you save.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0D0D0D] text-[#F2F2F2] animate-fadeIn">
      {/* Top brand header */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#7C6EF6] flex items-center justify-center text-white font-bold text-xs">
            SF
          </div>
          <span className="font-bold text-sm tracking-tight text-white">SavedFeed</span>
        </div>
        <button
          onClick={() => setScreen('signup')}
          className="text-xs text-[#9A9A9A] hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide content carousel */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-8 animate-bounceIn">{slides[activeSlide].icon}</div>
        <h1 className="text-2xl font-bold text-[#F2F2F2] mb-3 leading-tight max-w-[280px]">
          {slides[activeSlide].heading}
        </h1>
        <p className="text-xs text-[#9A9A9A] max-w-[290px] leading-relaxed">
          {slides[activeSlide].subtext}
        </p>
      </div>

      {/* Bottom controls */}
      <div className="pb-6 space-y-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === idx ? 'w-8 bg-[#7C6EF6]' : 'w-2 bg-[#2E2E2E]'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        {activeSlide === 2 ? (
          <button
            onClick={() => setScreen('signup')}
            className="w-full h-[52px] bg-[#7C6EF6] hover:bg-[#9585F8] text-white font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-glow transition-all active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setActiveSlide((prev) => prev + 1)}
            className="w-full h-[52px] bg-[#1A1A1A] hover:bg-[#242424] border border-[#2E2E2E] text-white font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 text-[#9A9A9A]" />
          </button>
        )}

        <div className="text-center">
          <button
            onClick={() => setScreen('signup')}
            className="text-xs text-[#9A9A9A] hover:text-[#7C6EF6] transition-colors"
          >
            Already have an account? <span className="text-[#7C6EF6] font-semibold">Log in</span>
          </button>
        </div>
      </div>
    </div>
  );
};
