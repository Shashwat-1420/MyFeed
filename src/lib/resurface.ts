const INTERVALS_DAYS = [1, 3, 7, 14, 30, 60];

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
