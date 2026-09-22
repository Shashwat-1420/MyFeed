/*
 * Spaced repetition (Phase C #3).
 *
 * The original prototype used a fixed ladder [1,3,7,14,30,60] days. This is a
 * real **SM-2** implementation (the algorithm behind Anki/SuperMemo), so the
 * interval adapts to how well the user recalls each item.
 */

/** Legacy fixed ladder — still used to seed new saves. */
const INTERVALS_DAYS = [1, 3, 7, 14, 30, 60];

export const SM2_DEFAULT_EASINESS = 2.5;
export const SM2_MIN_EASINESS = 1.3;
export const SM2_MAX_INTERVAL_DAYS = 365;

/** SM-2 recall grade. 0-2 = failed to recall, 3 = hard, 4 = good, 5 = easy. */
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface ResurfaceState {
  /** Number of consecutive successful recalls (SM-2 `n`). */
  repetitions: number;
  interval_days: number;
  easiness: number;
}

/** Maps the UI's binary actions onto SM-2 grades. */
export const QUALITY_REVIEWED: ReviewQuality = 5;
export const QUALITY_SKIPPED: ReviewQuality = 2;

/**
 * One SM-2 update.
 *   q < 3  -> reset repetitions, review again in 1 day
 *   n = 0  -> 1 day
 *   n = 1  -> 6 days
 *   n >= 2 -> round(interval * easiness)
 * and the easiness factor is adjusted and floored at 1.3.
 */
export function sm2Update(state: ResurfaceState, quality: ReviewQuality): ResurfaceState {
  const repetitions = Math.max(0, state.repetitions);
  const easiness = state.easiness || SM2_DEFAULT_EASINESS;
  const interval = state.interval_days > 0 ? state.interval_days : 1;

  let nextRepetitions: number;
  let nextInterval: number;

  if (quality < 3) {
    nextRepetitions = 0;
    nextInterval = 1;
  } else {
    if (repetitions === 0) nextInterval = 1;
    else if (repetitions === 1) nextInterval = 6;
    else nextInterval = Math.round(interval * easiness);
    nextRepetitions = repetitions + 1;
  }

  const nextEasiness = Math.max(
    SM2_MIN_EASINESS,
    easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  return {
    repetitions: nextRepetitions,
    interval_days: Math.min(Math.max(1, nextInterval), SM2_MAX_INTERVAL_DAYS),
    easiness: Number(nextEasiness.toFixed(3)),
  };
}

/** Due date for an SM-2 interval — always at 09:00 local. */
export function nextResurfaceDate(intervalDays: number): Date {
  const next = new Date();
  next.setDate(next.getDate() + Math.max(1, intervalDays));
  next.setHours(9, 0, 0, 0);
  return next;
}

/** Legacy helper kept for seeding new saves and for pre-SM-2 saves. */
export function calculateNextResurface(resurface_count: number): Date {
  const days = INTERVALS_DAYS[Math.min(resurface_count, INTERVALS_DAYS.length - 1)];
  const next = new Date();
  next.setDate(next.getDate() + days);
  next.setHours(9, 0, 0, 0); // Always 9am
  return next;
}

export function getResurfaceIntervalDays(resurface_count: number): number {
  return INTERVALS_DAYS[Math.min(resurface_count, INTERVALS_DAYS.length - 1)];
}

export function isDueForResurface(next_resurface_at: string | null): boolean {
  if (!next_resurface_at) return true;
  return new Date(next_resurface_at) <= new Date();
}

export function formatRelativeDaysAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}