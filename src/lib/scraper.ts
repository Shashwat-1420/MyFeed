import { PlatformSource } from '../types/savedfeed';

export interface ScrapedMetadata {
  title: string;
  description: string;
  image_url: string | null;
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
  // Hermes' `URL` support is partial, so parse the host with a regex instead.
  try {
    const withProto = url.startsWith('http') ? url : `https://${url}`;
    const match = withProto.match(/^https?:\/\/([^/?#]+)/i);
    if (!match) return 'web.link';
    return match[1].replace(/^www\./, '');
  } catch {
    return 'web.link';
  }
}

/** "LLMs-from-scratch" -> "LLMs from scratch" — a real title beats a placeholder. */
export function titleFromUrl(url: string): string {
  try {
    const withProto = url.startsWith('http') ? url : `https://${url}`;
    const path = withProto.replace(/^https?:\/\/[^/]+/i, '').replace(/[?#].*$/, '');
    const last = path.split('/').filter(Boolean).pop() || '';
    const cleaned = decodeURIComponent(last)
      .replace(/\.(html?|php|aspx?|jsp)$/i, '')
      .replace(/[-_+]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned.length > 3) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
  } catch {
    // fall through
  }
  return extractDomain(url);
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  apos: "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
};

function decodeEntities(input: string): string {
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&([a-z#0-9]+);/gi, (match, name) => ENTITIES[String(name).toLowerCase()] ?? match);
}

/** Reads a `<meta>` value by property/name, tolerating either attribute order. */
function metaContent(html: string, key: string): string | null {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${escaped}["']`, 'i'),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    const value = match?.[1] ? decodeEntities(match[1]).trim() : '';
    if (value) return value;
  }
  return null;
}

function firstTitleTag(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const value = match?.[1] ? decodeEntities(match[1]).trim() : '';
  return value || null;
}

function resolveUrl(maybeRelative: string, base: string): string {
  if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
  if (maybeRelative.startsWith('//')) return `https:${maybeRelative}`;
  const origin = base.match(/^https?:\/\/[^/]+/i)?.[0];
  if (!origin) return maybeRelative;
  return maybeRelative.startsWith('/') ? `${origin}${maybeRelative}` : `${origin}/${maybeRelative}`;
}

const FETCH_TIMEOUT_MS = 8000;
const MAX_HTML_CHARS = 400_000;
const BROWSER_UA =
  'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36';

/**
 * YouTube's oEmbed endpoint returns the *video's* title, channel and thumbnail
 * as JSON with no JavaScript — far better than the site-level og: tags YouTube
 * serves to a non-browser fetch.
 */
async function fetchYouTubeOEmbed(url: string): Promise<Partial<ScrapedMetadata> | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { headers: { Accept: 'application/json' }, signal: controller.signal }
    );
    clearTimeout(timer);
    if (!response.ok) return null;

    const json = (await response.json()) as {
      title?: unknown;
      author_name?: unknown;
      thumbnail_url?: unknown;
    };

    const title = typeof json.title === 'string' ? json.title.trim() : '';
    if (!title) return null;

    const author = typeof json.author_name === 'string' ? json.author_name.trim() : '';
    const thumbnail = typeof json.thumbnail_url === 'string' ? json.thumbnail_url : null;

    return {
      title,
      description: author ? `by ${author}` : '',
      image_url: thumbnail,
    };
  } catch {
    return null;
  }
}

/**
 * Real link preview via og:/twitter: card scraping.
 *
 * React Native's `fetch` has no CORS, so a public page can be read directly.
 * Sites that render client-side or block non-browser clients (Instagram, X)
 * expose no metadata — in that case the caller gets a readable slug-derived
 * title and no image, never a fabricated placeholder sentence.
 */
export async function fetchUrlMetadata(
  url: string,
  fallbackTitle?: string | null
): Promise<ScrapedMetadata> {
  const domain = extractDomain(url);
  const platform = detectPlatformFromUrl(url);

  const result: ScrapedMetadata = {
    title: (fallbackTitle || '').trim() || titleFromUrl(url),
    description: '',
    image_url: null,
    domain,
    platform,
  };

  // YouTube: oEmbed gives the actual video metadata (see above).
  if (platform === 'youtube') {
    const oembed = await fetchYouTubeOEmbed(url);
    if (oembed) return { ...result, ...oembed };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const response = await fetch(url.startsWith('http') ? url : `https://${url}`, {
      headers: {
        'User-Agent': BROWSER_UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) return result;

    const html = (await response.text()).slice(0, MAX_HTML_CHARS);

    const title =
      metaContent(html, 'og:title') ||
      metaContent(html, 'twitter:title') ||
      firstTitleTag(html);
    const description =
      metaContent(html, 'og:description') ||
      metaContent(html, 'twitter:description') ||
      metaContent(html, 'description');
    const image = metaContent(html, 'og:image') || metaContent(html, 'twitter:image');

    if (title) result.title = title;
    if (description) result.description = description;
    if (image) result.image_url = resolveUrl(image, url);
  } catch {
    // Offline, timed out, or blocked — the slug-derived fallbacks above stand.
  }

  return result;
}