import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { SaveItem } from '../types/savedfeed';
import { isDueForResurface } from './resurface';

/*
 * Anki-style local reminders (Phase C #3).
 *
 * These are *local* notifications — no push server, no network, and they fire
 * with the app closed. We keep exactly one daily reminder scheduled at the
 * user's nudge time and refresh its text whenever the save list changes, so it
 * reflects the current number of due items.
 */

const CHANNEL_ID = 'resurface';
const DAILY_REMINDER_ID = 'savedfeed-daily-resurface';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Review reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

function parseNudgeTime(nudgeTime: string): { hour: number; minute: number } {
  const [rawHour, rawMinute] = nudgeTime.split(':');
  const hour = Number.parseInt(rawHour ?? '', 10);
  const minute = Number.parseInt(rawMinute ?? '', 10);
  return {
    hour: Number.isFinite(hour) ? hour : 9,
    minute: Number.isFinite(minute) ? minute : 0,
  };
}

/**
 * Cancels and re-creates the single daily resurface reminder so its body
 * reflects the current due count.
 */
export async function syncResurfaceReminder(
  saves: SaveItem[],
  nudgeTime = '09:00'
): Promise<void> {
  const granted = await ensureNotificationPermission();
  if (!granted) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
  } catch {
    // nothing scheduled yet
  }

  const active = saves.filter((s) => !s.is_archived);
  if (active.length === 0) return;

  const due = active.filter((s) => isDueForResurface(s.next_resurface_at)).length;
  const { hour, minute } = parseNudgeTime(nudgeTime);

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'Time to resurface',
      body:
        due > 0
          ? `${due} saved ${due === 1 ? 'item is' : 'items are'} ready for review.`
          : 'Keep your streak alive — open MyFeed to see what’s next.',
      data: { tab: 'home' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: CHANNEL_ID,
    },
  });
}

/** Fires one immediately — handy for demoing the reminder without waiting. */
export async function sendTestReminder(): Promise<boolean> {
  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to resurface',
      body: 'This is how your spaced-repetition nudge will look.',
      data: { tab: 'home' },
    },
    trigger: null,
  });
  return true;
}

/** How many reminders are currently scheduled (used by the Profile screen). */
export async function getScheduledReminderCount(): Promise<number> {
  try {
    return (await Notifications.getAllScheduledNotificationsAsync()).length;
  } catch {
    return 0;
  }
}