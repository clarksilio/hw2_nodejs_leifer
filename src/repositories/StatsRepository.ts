import { getDb } from './Database';
import { CategoryKey } from '@models/Task';

export interface CategoryStats {
  category: CategoryKey;
  doneCount: number;
  minutes: number;
}

export const StatsRepository = {
  async categoryDistribution(startDate: string, endDate: string): Promise<CategoryStats[]> {
    const db = getDb();
    const rows = await db.getAllAsync(
      `SELECT category, COUNT(*) as cnt, SUM(
          CASE WHEN startTime IS NOT NULL AND endTime IS NOT NULL THEN (
            CAST(substr(endTime,1,2) AS INTEGER)*60 + CAST(substr(endTime,4,2) AS INTEGER) -
            CAST(substr(startTime,1,2) AS INTEGER)*60 - CAST(substr(startTime,4,2) AS INTEGER)
          ) ELSE 0 END
        ) as minutes
        FROM tasks
        WHERE date BETWEEN ? AND ? AND isDone=1
        GROUP BY category`,
      [startDate, endDate]
    );

    return rows.map((r: any) => ({ category: r.category, doneCount: r.cnt, minutes: r.minutes || 0 }));
  },

  async dayCompletion(date: string): Promise<{ done: number; planned: number; ideal: boolean }>{
    const db = getDb();
    const row = await db.getFirstAsync(
      `SELECT SUM(isDone) as done, COUNT(*) as planned FROM tasks WHERE date=?`,
      [date]
    );
    const done = row?.done || 0;
    const planned = row?.planned || 0;
    return { done, planned, ideal: planned > 0 && done === planned };
  },

  async minimumStreakUpTo(dateInclusive: string): Promise<number> {
    const db = getDb();
    // Counts consecutive days up to the date where at least one task with isMinimum=1 is done
    const rows = await db.getAllAsync(
      `SELECT date, SUM(CASE WHEN isMinimum=1 AND isDone=1 THEN 1 ELSE 0 END) as min_done
       FROM tasks WHERE date <= ? GROUP BY date ORDER BY date DESC`,
      [dateInclusive]
    );
    let streak = 0;
    for (const r of rows) {
      if ((r.min_done || 0) > 0) streak += 1; else break;
    }
    return streak;
  },
};