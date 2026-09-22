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
    <div className="flex-1 flex flex-col justify-between p-6 bg-canvas text-ink animate-fadeIn">
      {/* Header */}
      <div className="pt-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#F0B31C]/20 border border-[#F0B31C]/40 flex items-center justify-center text-gold mx-auto mb-4 shadow-glow">
          <Bookmark className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-ink">Create your account</h2>
        <p className="text-xs text-muted mt-1">Start organizing your saves with AI</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-[320px] mx-auto w-full">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-dim absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 bg-chip border border-edge focus:border-[#F0B31C] rounded-xl pl-10 pr-4 text-xs text-ink outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-dim absolute left-3.5 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 bg-chip border border-edge focus:border-[#F0B31C] rounded-xl pl-10 pr-10 text-xs text-ink outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-dim hover:text-muted"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[52px] bg-[#F0B31C] hover:bg-[#FFCB14] text-black font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-glow transition-all active:scale-95 mt-6"
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
          className="text-xs text-muted hover:text-ink transition-colors"
        >
          Already have an account? <span className="text-gold font-semibold">Log in</span>
        </button>
      </div>
    </div>
  );
};
