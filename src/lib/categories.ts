import { Category } from '../types/savedfeed';

export const CATEGORIES: Record<Category, { label: string; emoji: string; color: string }> = {
  technology:    { label: 'Technology',    emoji: '💻', color: '#6366F1' },
  ai_ml:         { label: 'AI & ML',       emoji: '🤖', color: '#8B5CF6' },
  programming:   { label: 'Programming',   emoji: '⌨️',  color: '#3B82F6' },
  design:        { label: 'Design',        emoji: '🎨', color: '#EC4899' },
  career:        { label: 'Career',        emoji: '🚀', color: '#F59E0B' },
  courses:       { label: 'Courses',       emoji: '📚', color: '#10B981' },
  science:       { label: 'Science',       emoji: '🔬', color: '#06B6D4' },
  business:      { label: 'Business',      emoji: '📊', color: '#F97316' },
  finance:       { label: 'Finance',       emoji: '💰', color: '#22C55E' },
  health:        { label: 'Health',        emoji: '🏃', color: '#EF4444' },
  productivity:  { label: 'Productivity',  emoji: '⚡', color: '#EAB308' },
  entertainment: { label: 'Entertainment', emoji: '🎮', color: '#A855F7' },
  news:          { label: 'News',          emoji: '📰', color: '#64748B' },
  uncategorized: { label: 'Other',         emoji: '📌', color: '#6B7280' },
};

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(([id, info]) => ({
  id: id as Category,
  ...info,
}));
