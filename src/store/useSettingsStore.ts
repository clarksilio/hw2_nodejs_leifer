import { create } from 'zustand';
import { SettingsRepository, Settings } from '@repositories/SettingsRepository';

interface SettingsState extends Settings {
  theme: 'light' | 'dark' | 'system';
  setTheme: (t: SettingsState['theme']) => Promise<void>;
  toggleQuiet: () => Promise<void>;
  toggleStreak: () => Promise<void>;
  load: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'system',
  quietMode: false,
  streakEnabled: true,
  async setTheme(t) {
    set({ theme: t });
    const s = get();
    await SettingsRepository.saveSettings({ theme: t, quietMode: s.quietMode, streakEnabled: s.streakEnabled });
  },
  async toggleQuiet() {
    const s = get();
    const quietMode = !s.quietMode;
    set({ quietMode });
    await SettingsRepository.saveSettings({ theme: s.theme, quietMode, streakEnabled: s.streakEnabled });
  },
  async toggleStreak() {
    const s = get();
    const streakEnabled = !s.streakEnabled;
    set({ streakEnabled });
    await SettingsRepository.saveSettings({ theme: s.theme, quietMode: s.quietMode, streakEnabled });
  },
  async load() {
    const s = await SettingsRepository.loadSettings();
    set(s);
  },
}));