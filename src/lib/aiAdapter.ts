import { Category, AIAdapterResult } from '../types/savedfeed';
import { supabase, isSupabaseConfigured } from './supabase';

export async function processSaveWithAI(payload: {
  url?: string;
  title: string;
  description?: string;
  rawText?: string;
}): Promise<AIAdapterResult> {
  // If Supabase is connected, call the Edge Function process-save
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('process-save', {
        body: payload,
      });
      if (!error && data) {
        return data as AIAdapterResult;
      }
    } catch (e) {
      console.warn('Edge Function process-save failed, falling back to client simulation:', e);
    }
  }

  // Client-side simulation fallback (100% working offline mode)
  await new Promise((resolve) => setTimeout(resolve, 800));

  const text = `${payload.title} ${payload.description || ''} ${payload.rawText || ''}`.toLowerCase();

  let category: Category = 'uncategorized';
  let tags: string[] = ['saved', 'article'];

  if (text.includes('ml') || text.includes('ai') || text.includes('gpt') || text.includes('learning')) {
    category = 'ai_ml';
    tags = ['machine learning', 'ai', 'roadmap', 'tech'];
  } else if (text.includes('system') || text.includes('code') || text.includes('python') || text.includes('react') || text.includes('flutter')) {
    category = 'programming';
    tags = ['programming', 'developer', 'guide'];
  } else if (text.includes('figma') || text.includes('design') || text.includes('ui') || text.includes('ux')) {
    category = 'design';
    tags = ['design', 'figma', 'ui design'];
  } else if (text.includes('income') || text.includes('career') || text.includes('developer') || text.includes('job')) {
    category = 'career';
    tags = ['career', 'freelancing', 'growth'];
  } else if (text.includes('cs50') || text.includes('course') || text.includes('tutorial')) {
    category = 'courses';
    tags = ['course', 'learning', 'education'];
  } else if (text.includes('feynman') || text.includes('study') || text.includes('productivity') || text.includes('vs code')) {
    category = 'productivity';
    tags = ['productivity', 'hacks', 'focus'];
  } else if (text.includes('finance') || text.includes('money') || text.includes('stock')) {
    category = 'finance';
    tags = ['finance', 'investing'];
  } else if (text.includes('health') || text.includes('run') || text.includes('fitness')) {
    category = 'health';
    tags = ['health', 'wellness'];
  } else if (text.includes('tech') || text.includes('tool') || text.includes('extension')) {
    category = 'technology';
    tags = ['technology', 'tools'];
  }

  return {
    category,
    tags,
    summary: `AI auto-summary: Key takeaways from ${payload.title}.`,
  };
}
