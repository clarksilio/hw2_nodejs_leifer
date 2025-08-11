import * as SQLite from 'expo-sqlite';

interface AsyncDatabase {
  runAsync: (sql: string, params?: any[]) => Promise<{ rowsAffected: number; insertId?: number }>;
  getAllAsync: (sql: string, params?: any[]) => Promise<any[]>;
  getFirstAsync: (sql: string, params?: any[]) => Promise<any | undefined>;
  execAsync: (sql: string) => Promise<void>;
}

let db: AsyncDatabase | null = null;

function openDatabase(): SQLite.SQLiteDatabase {
  // Non-async API compatible with Expo SDK 51
  return SQLite.openDatabase('lifeflow.db');
}

function promisify<T = any>(dbNative: SQLite.SQLiteDatabase, sql: string, params: any[] = []): Promise<T> {
  return new Promise((resolve, reject) => {
    dbNative.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_tx, result) => {
          // @ts-ignore
          resolve(result);
        },
        (_tx, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
}

export function getDb(): AsyncDatabase {
  if (!db) throw new Error('DB not initialized');
  return db;
}

export async function initDatabase() {
  const nativeDb = openDatabase();
  db = {
    async runAsync(sql: string, params: any[] = []) {
      const res: any = await promisify(nativeDb, sql, params);
      return { rowsAffected: res.rowsAffected ?? 0, insertId: res.insertId };
    },
    async getAllAsync(sql: string, params: any[] = []) {
      const res: any = await promisify(nativeDb, sql, params);
      const out: any[] = res.rows?._array ?? [];
      return out;
    },
    async getFirstAsync(sql: string, params: any[] = []) {
      const res: any = await promisify(nativeDb, sql, params);
      const out: any[] = res.rows?._array ?? [];
      return out[0];
    },
    async execAsync(sql: string) {
      // Split multiple statements by ; and run sequentially
      const statements = sql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const stmt of statements) {
        await promisify(nativeDb, stmt, []);
      }
    },
  };
  await db.execAsync(`PRAGMA journal_mode = WAL;`);
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