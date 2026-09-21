import React, { useState } from 'react';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { Bookmark, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export const SignupView: React.FC = () => {
  const { setScreen } = useSavedFeedStore();
  const [email, setEmail] = useState('arjun.sharma@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setScreen('tabs');
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0D0D0D] text-[#F2F2F2] animate-fadeIn">
      {/* Header */}
      <div className="pt-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#7C6EF6]/20 border border-[#7C6EF6]/40 flex items-center justify-center text-[#7C6EF6] mx-auto mb-4 shadow-glow">
          <Bookmark className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#F2F2F2]">Create your account</h2>
        <p className="text-xs text-[#9A9A9A] mt-1">Start organizing your saves with AI</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-[320px] mx-auto w-full">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9A] mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#5A5A5A] absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 bg-[#1A1A1A] border border-[#2E2E2E] focus:border-[#7C6EF6] rounded-xl pl-10 pr-4 text-xs text-[#F2F2F2] outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9A] mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#5A5A5A] absolute left-3.5 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 bg-[#1A1A1A] border border-[#2E2E2E] focus:border-[#7C6EF6] rounded-xl pl-10 pr-10 text-xs text-[#F2F2F2] outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-[#5A5A5A] hover:text-[#9A9A9A]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[52px] bg-[#7C6EF6] hover:bg-[#9585F8] text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-glow transition-all active:scale-95 mt-6"
        >
          {isSubmitting ? (
            <span>Creating account...</span>
          ) : (
            <>
              <span>Sign Up & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center pb-6">
        <button
          onClick={() => setScreen('tabs')}
          className="text-xs text-[#9A9A9A] hover:text-white transition-colors"
        >
          Already have an account? <span className="text-[#7C6EF6] font-semibold">Log in</span>
        </button>
      </div>
    </div>
  );
};
