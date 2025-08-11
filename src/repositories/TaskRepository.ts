import { getDb } from './Database';
import { Task, RepeatRule } from '@models/Task';

export interface TaskFilters {
  category?: string;
  status?: 'planned' | 'done' | 'skipped';
  priority?: 1 | 2 | 3;
}

function rowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    note: row.note ?? undefined,
    category: row.category,
    tags: JSON.parse(row.tags || '[]'),
    priority: row.priority,
    date: row.date,
    startTime: row.startTime ?? undefined,
    endTime: row.endTime ?? undefined,
    isDone: !!row.isDone,
    isSkipped: !!row.isSkipped,
    isMinimum: !!row.isMinimum,
    repeatRule: row.repeatRule ? (JSON.parse(row.repeatRule) as RepeatRule) : null,
  };
}

export const TaskRepository = {
  async create(task: Omit<Task, 'id'>): Promise<number> {
    const db = getDb();
    const result = await db.runAsync(
      `INSERT INTO tasks (title, note, category, tags, priority, date, startTime, endTime, isDone, isSkipped, isMinimum, repeatRule)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.title,
        task.note ?? null,
        task.category,
        JSON.stringify(task.tags ?? []),
        task.priority,
        task.date,
        task.startTime ?? null,
        task.endTime ?? null,
        task.isDone ? 1 : 0,
        task.isSkipped ? 1 : 0,
        task.isMinimum ? 1 : 0,
        task.repeatRule ? JSON.stringify(task.repeatRule) : null,
      ]
    );
    return result.lastInsertRowId as number;
  },

  async update(task: Task): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `UPDATE tasks SET title=?, note=?, category=?, tags=?, priority=?, date=?, startTime=?, endTime=?, isDone=?, isSkipped=?, isMinimum=?, repeatRule=? WHERE id=?`,
      [
        task.title,
        task.note ?? null,
        task.category,
        JSON.stringify(task.tags ?? []),
        task.priority,
        task.date,
        task.startTime ?? null,
        task.endTime ?? null,
        task.isDone ? 1 : 0,
        task.isSkipped ? 1 : 0,
        task.isMinimum ? 1 : 0,
        task.repeatRule ? JSON.stringify(task.repeatRule) : null,
        task.id,
      ]
    );
  },

  async delete(id: number): Promise<void> {
    const db = getDb();
    await db.runAsync(`DELETE FROM tasks WHERE id=?`, [id]);
  },

  async getByDate(date: string, filters?: TaskFilters): Promise<Task[]> {
    const db = getDb();
    let query = `SELECT * FROM tasks WHERE date = ?`;
    const params: any[] = [date];

    if (filters?.category) {
      query += ` AND category = ?`;
      params.push(filters.category);
    }
    if (filters?.status === 'done') query += ` AND isDone = 1`;
    if (filters?.status === 'skipped') query += ` AND isSkipped = 1`;
    if (filters?.status === 'planned') query += ` AND isDone = 0 AND isSkipped = 0`;
    if (filters?.priority) {
      query += ` AND priority = ?`;
      params.push(filters.priority);
    }

    query += ` ORDER BY (startTime IS NULL), startTime ASC, priority DESC`;

    const rows = await db.getAllAsync(query, params);
    return rows.map(rowToTask);
  },

  async listInRange(startDate: string, endDate: string): Promise<Task[]> {
    const db = getDb();
    const rows = await db.getAllAsync(`SELECT * FROM tasks WHERE date BETWEEN ? AND ?`, [
      startDate,
      endDate,
    ]);
    return rows.map(rowToTask);
  },

  async toggleDone(id: number, done: boolean): Promise<void> {
    const db = getDb();
    await db.runAsync(`UPDATE tasks SET isDone=? WHERE id=?`, [done ? 1 : 0, id]);
  },

  async toggleSkipped(id: number, skipped: boolean): Promise<void> {
    const db = getDb();
    await db.runAsync(`UPDATE tasks SET isSkipped=? WHERE id=?`, [skipped ? 1 : 0, id]);
  },

  async setMinimum(id: number, isMinimum: boolean): Promise<void> {
    const db = getDb();
    await db.runAsync(`UPDATE tasks SET isMinimum=? WHERE id=?`, [isMinimum ? 1 : 0, id]);
  },
};