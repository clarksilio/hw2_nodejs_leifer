import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export function getDb() {
  if (!db) throw new Error('DB not initialized');
  return db;
}

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('lifeflow.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
  `);
  await createSchema();
}

async function createSchema() {
  if (!db) return;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      note TEXT,
      category TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      priority INTEGER NOT NULL,
      date TEXT NOT NULL,
      startTime TEXT,
      endTime TEXT,
      isDone INTEGER NOT NULL DEFAULT 0,
      isSkipped INTEGER NOT NULL DEFAULT 0,
      isMinimum INTEGER NOT NULL DEFAULT 0,
      repeatRule TEXT
    );

    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      targetDate TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS goal_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goalId INTEGER NOT NULL,
      title TEXT NOT NULL,
      isDone INTEGER NOT NULL DEFAULT 0,
      plannedDate TEXT,
      FOREIGN KEY(goalId) REFERENCES goals(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      key TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      icon TEXT NOT NULL
    );
  `);
}