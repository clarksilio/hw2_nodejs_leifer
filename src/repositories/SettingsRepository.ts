import { getDb } from './Database';
import { Category, DEFAULT_CATEGORIES } from '@models/Category';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Settings {
  theme: ThemeMode;
  quietMode: boolean;
  streakEnabled: boolean;
}

const SETTINGS_KEY = 'app_settings_v1';

export const SettingsRepository = {
  async loadSettings(): Promise<Settings> {
    const db = getDb();
    const row = await db.getFirstAsync(`SELECT value FROM settings WHERE key=?`, [SETTINGS_KEY]);
    if (!row) {
      const defaults: Settings = { theme: 'system', quietMode: false, streakEnabled: true };
      await db.runAsync(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [
        SETTINGS_KEY,
        JSON.stringify(defaults),
      ]);
      return defaults;
    }
    return JSON.parse(row.value);
  },
  async saveSettings(settings: Settings): Promise<void> {
    const db = getDb();
    await db.runAsync(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [
      SETTINGS_KEY,
      JSON.stringify(settings),
    ]);
  },

  async ensureDefaultCategories(): Promise<void> {
    const db = getDb();
    for (const c of DEFAULT_CATEGORIES) {
      await db.runAsync(
        `INSERT OR IGNORE INTO categories (key, name, color, icon) VALUES (?, ?, ?, ?)`,
        [c.key, c.name, c.color, c.icon]
      );
    }
  },

  async listCategories(): Promise<Category[]> {
    const db = getDb();
    const rows = await db.getAllAsync(`SELECT * FROM categories`);
    return rows.map((r: any) => ({ key: r.key, name: r.name, color: r.color, icon: r.icon }));
  },

  async upsertCategory(category: Category): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `INSERT OR REPLACE INTO categories (key, name, color, icon) VALUES (?, ?, ?, ?)`,
      [category.key, category.name, category.color, category.icon]
    );
  },
};