const KEY_ENABLED = 'reminders_enabled';
const KEY_LAST = 'reminders_last_meter_notify';

export const remindersSupported = () => 'Notification' in window;
export const remindersEnabled = () =>
  remindersSupported() && localStorage.getItem(KEY_ENABLED) === '1';

export async function enableReminders(): Promise<boolean> {
  if (!remindersSupported()) return false;
  let perm = Notification.permission;
  if (perm === 'default') perm = await Notification.requestPermission();
  if (perm !== 'granted') return false;
  localStorage.setItem(KEY_ENABLED, '1');
  return true;
}

// При запуску: якщо сьогодні 1–5 число і цього місяця
// ще не нагадували — показуємо сповіщення
export function maybeNotifyMeterReadings(body: string) {
  if (!remindersEnabled()) return;
  const now = new Date();
  if (now.getDate() > 5) return;
  const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
  if (localStorage.getItem(KEY_LAST) === monthKey) return;
  localStorage.setItem(KEY_LAST, monthKey);
  new Notification('📊 Сам собі мама', { body });
}
