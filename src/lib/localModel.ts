import { useEffect } from 'react';
import { models, useLLMChatSession } from 'react-native-executorch';
import { CATEGORY_LIST } from './categories';
import { Category } from '../types/savedfeed';

export type LocalModelSession = ReturnType<typeof useLLMChatSession>;

/*
 * On-device AI (Phase C #2).
 *
 * The loaded LLM session lives at module scope so non-React code
 * (`aiAdapter.processSaveWithAI`) can reach it. `useLocalModel()` is mounted
 * once in App.tsx and keeps this reference in sync.
 *
 * Model: Qwen2.5 0.5B Instruct, 8da4w-quantized for the XNNPACK CPU backend.
 * Runs entirely on the phone — no network, no data leaves the device. The
 * keyword classifier in aiAdapter.ts stays as the fallback when the model
 * isn't loaded yet (first run, download in progress, low memory).
 */
let activeSession: LocalModelSession | null = null;

export const getLocalModelSession = (): LocalModelSession | null => activeSession;

export const isLocalModelReady = (): boolean =>
  Boolean(activeSession?.isReady && activeSession.sendMessage);

export const LOCAL_MODEL = models.llm.QWEN2_5_0_5B.DEFAULT;

export const CATEGORY_IDS = CATEGORY_LIST.map((c) => c.id);

/** "AI & ML" -> ai_ml, so label output from the model still resolves. */
const LABEL_TO_ID: Record<string, Category> = CATEGORY_LIST.reduce(
  (acc, c) => {
    acc[c.label.toLowerCase()] = c.id;
    return acc;
  },
  {} as Record<string, Category>
);

const SYSTEM_PROMPT =
  'You are a strict text classifier. You reply with a single JSON object and nothing else. ' +
  'Never explain, never add prose, never use markdown.';

export function useLocalModel() {
  const session = useLLMChatSession(LOCAL_MODEL, {
    initialMessages: [{ role: 'system', content: SYSTEM_PROMPT }],
    generationConfig: { maxNewTokens: 96, temperature: 0.1 },
  });

  useEffect(() => {
    activeSession = session;
  }, [session]);

  return session;
}

export function buildCategorizePrompt(input: {
  title: string;
  description?: string | null;
  url?: string | null;
}): string {
  return [
    'Classify the saved link below into exactly one category.',
    `Allowed categories: ${CATEGORY_IDS.join(', ')}.`,
    'Answer with ONLY a JSON object of the form {"category":"<category>","tags":["tag1","tag2"]}.',
    'Example answer: {"category":"ai_ml","tags":["llm","transformers","tutorial"]}',
    '',
    `Title: ${input.title}`,
    `Description: ${input.description ?? ''}`,
    `URL: ${input.url ?? ''}`,
    '',
    'JSON:',
  ].join('\n');
}

/** Pull the assistant's reply text out of a chat turn result. */
export function extractAssistantText(turn: unknown): string {
  const messages = (turn as { messages?: Array<{ role?: string; content?: unknown }> })?.messages;
  if (!Array.isArray(messages)) return '';
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message?.role === 'assistant' && typeof message.content === 'string') {
      return message.content;
    }
  }
  return '';
}

/**
 * Tolerant categorization parse. Small quantized models are inconsistent, so we
 * try strict JSON first, then fall back to scanning the reply for a known
 * category id or label.
 */
export function parseCategorization(raw: string): { category: Category; tags: string[] } | null {
  if (!raw) return null;
  const text = raw.trim();

  const resolve = (value: string): Category | null => {
    const key = value.trim().toLowerCase();
    if (CATEGORY_IDS.includes(key as Category)) return key as Category;
    if (LABEL_TO_ID[key]) return LABEL_TO_ID[key];
    return null;
  };

  const cleanTags = (value: unknown): string[] =>
    Array.isArray(value)
      ? value
          .map((t) => String(t).trim().toLowerCase())
          .filter((t) => t.length > 0 && t.length < 28)
          .slice(0, 4)
      : [];

  // 1. Strict JSON (bare or fenced).
  const jsonMatch = text.match(/\{[\s\S]*?\}/);
  if (jsonMatch) {
    try {
      const obj = JSON.parse(jsonMatch[0]) as { category?: unknown; tags?: unknown };
      const category = resolve(String(obj.category ?? ''));
      if (category) {
        const tags = cleanTags(obj.tags);
        return { category, tags: tags.length > 0 ? tags : ['saved'] };
      }
    } catch {
      // fall through to the scan below
    }
  }

  // 2. Scan for a known category id or label anywhere in the reply.
  const lower = text.toLowerCase();
  const matchedId = CATEGORY_IDS.find((id) => lower.includes(id));
  const matchedLabel = Object.keys(LABEL_TO_ID).find((label) => lower.includes(label));
  const category = matchedId ? (matchedId as Category) : matchedLabel ? LABEL_TO_ID[matchedLabel] : null;
  if (!category) return null;

  // Crude tag recovery: quoted short strings that aren't the category itself.
  const quoted = [...text.matchAll(/"([^"]{2,24})"/g)]
    .map((m) => m[1].trim().toLowerCase())
    .filter((t) => !CATEGORY_IDS.includes(t as Category) && t !== matchedLabel && !LABEL_TO_ID[t]);

  const tags = quoted.slice(0, 3);
  return { category, tags: tags.length > 0 ? tags : ['saved'] };
}