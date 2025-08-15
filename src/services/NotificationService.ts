import * as Notifications from 'expo-notifications';
import { SettingsRepository } from '@repositories/SettingsRepository';

export const NotificationService = {
  async ensurePermissions() {
    const perms = await Notifications.getPermissionsAsync();
    if (perms.status !== 'granted') await Notifications.requestPermissionsAsync();
  },

  async scheduleReminder(identifier: string, date: Date, title: string, body: string) {
    const settings = await SettingsRepository.loadSettings();
    if (settings.quietMode) return;
    await this.ensurePermissions();
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: date,
      identifier,
    } as any);
  },

  async cancelReminder(identifier: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier as any);
    } catch (e) {}
  },
};