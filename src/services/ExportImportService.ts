import * as FileSystem from 'expo-file-system';
import { getDb } from '@repositories/Database';

export const ExportImportService = {
  async exportJson(): Promise<string> {
    const db = getDb();
    const tasks = await db.getAllAsync(`SELECT * FROM tasks`);
    const goals = await db.getAllAsync(`SELECT * FROM goals`);
    const steps = await db.getAllAsync(`SELECT * FROM goal_steps`);
    const categories = await db.getAllAsync(`SELECT * FROM categories`);
    const settings = await db.getAllAsync(`SELECT * FROM settings`);
    const data = { tasks, goals, steps, categories, settings };
    const path = `${FileSystem.documentDirectory}lifeflow_backup.json`;
    await FileSystem.writeAsStringAsync(path, JSON.stringify(data, null, 2));
    return path;
  },

  async importJson(json: string) {
    const db = getDb();
    const data = JSON.parse(json);
    await db.execAsync('BEGIN');
    try {
      await db.execAsync('DELETE FROM tasks');
      await db.execAsync('DELETE FROM goals');
      await db.execAsync('DELETE FROM goal_steps');
      await db.execAsync('DELETE FROM categories');
      await db.execAsync('DELETE FROM settings');

      for (const r of data.tasks || []) {
        await db.runAsync(
          `INSERT INTO tasks (id, title, note, category, tags, priority, date, startTime, endTime, isDone, isSkipped, isMinimum, repeatRule) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            r.id,
            r.title,
            r.note,
            r.category,
            r.tags,
            r.priority,
            r.date,
            r.startTime,
            r.endTime,
            r.isDone,
            r.isSkipped,
            r.isMinimum,
            r.repeatRule,
          ]
        );
      }
      for (const r of data.goals || []) {
        await db.runAsync(
          `INSERT INTO goals (id, title, description, category, targetDate, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
          [r.id, r.title, r.description, r.category, r.targetDate, r.createdAt]
        );
      }
      for (const r of data.steps || []) {
        await db.runAsync(
          `INSERT INTO goal_steps (id, goalId, title, isDone, plannedDate) VALUES (?, ?, ?, ?, ?)`,
          [r.id, r.goalId, r.title, r.isDone, r.plannedDate]
        );
      }
      for (const r of data.categories || []) {
        await db.runAsync(
          `INSERT INTO categories (key, name, color, icon) VALUES (?, ?, ?, ?)`,
          [r.key, r.name, r.color, r.icon]
        );
      }
      for (const r of data.settings || []) {
        await db.runAsync(`INSERT INTO settings (key, value) VALUES (?, ?)`, [r.key, r.value]);
      }
      await db.execAsync('COMMIT');
    } catch (e) {
      await db.execAsync('ROLLBACK');
      throw e;
    }
  },
};