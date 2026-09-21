import { PlatformSource } from '../types/savedfeed';

export interface ScrapedMetadata {
  title: string;
  description: string;
  image_url: string;
  domain: string;
  platform: PlatformSource;
}

export function detectPlatformFromUrl(url: string): PlatformSource {
  const lower = url.toLowerCase();
  if (lower.includes('instagram.com') || lower.includes('instagr.am')) return 'instagram';
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('reddit.com') || lower.includes('redd.it')) return 'reddit';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
  return 'web';
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '');
  } catch {
    return 'web.link';
  }
}

export async function fetchUrlMetadata(url: string): Promise<ScrapedMetadata> {
  // Simulate network fetch latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const domain = extractDomain(url);
  const platform = detectPlatformFromUrl(url);

  // Intelligent mock extraction based on URL content
  let title = `Saved content from ${domain}`;
  let description = `Interactive content saved via SavedFeed intent collector from ${domain}.`;
  let image_url = `https://picsum.photos/seed/${encodeURIComponent(domain)}/600/340`;

  const lower = url.toLowerCase();
  if (lower.includes('ml') || lower.includes('ai') || lower.includes('gpt')) {
    title = 'Mastering AI & Machine Learning Workflows';
    description = 'Comprehensive overview of practical AI models, prompt engineering, and LLM architecture.';
    image_url = 'https://picsum.photos/seed/aiml/600/340';
  } else if (lower.includes('react') || lower.includes('flutter') || lower.includes('code')) {
    title = 'Modern Mobile Engineering Guide 2024';
    description = 'In-depth comparison of React Native, Flutter, and native Android performance optimization.';
    image_url = 'https://picsum.photos/seed/mobilecode/600/340';
  } else if (lower.includes('design') || lower.includes('figma')) {
    title = 'Advanced Figma Layouts & UI Components';
    description = 'Learn auto-layout v5, design tokens, and smooth micro-animations.';
    image_url = 'https://picsum.photos/seed/uiuxdesign/600/340';
  }

  return {
    title,
    description,
    image_url,
    domain,
    platform,
  };
}
