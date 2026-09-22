export type AIProvider = 'anthropic' | 'openai' | 'google' | 'mistral' | 'ollama';

export type Category =
  | 'technology'
  | 'ai_ml'
  | 'programming'
  | 'design'
  | 'career'
  | 'courses'
  | 'science'
  | 'business'
  | 'finance'
  | 'health'
  | 'productivity'
  | 'entertainment'
  | 'news'
  | 'uncategorized';

export type PlatformSource = 'instagram' | 'twitter' | 'youtube' | 'reddit' | 'web' | 'manual';

export interface SaveItem {
  id: string;
  user_id: string;
  url: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  domain: string | null;
  source_platform: PlatformSource | null;
  category: Category;
  tags: string[];
  created_at: string;
  updated_at: string;
  next_resurface_at: string | null;
  resurface_count: number;
  times_viewed: number;
  is_archived: boolean;
  is_favourite: boolean;
  embedding?: number[];
}

export interface CategoryInfo {
  id: Category;
  label: string;
  emoji: string;
  color: string;
  save_count: number;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  streak_days: number;
  daily_nudge_time: string; // "09:00"
  dark_mode: boolean;
}

export interface AppConfig {
  AI_PROVIDER: AIProvider;
  AI_MODEL_CATEGORISE: string;
  AI_MODEL_EMBED: string;
  AI_MODEL_SUMMARY: string;
}

export interface AIAdapterResult {
  category: Category;
  tags: string[];
  embedding?: number[];
  summary?: string;
  /** Which engine produced this result — surfaced in the UI for the demo. */
  engine?: 'on-device' | 'edge' | 'keywords';
}
