import { CategoryKey } from './Task';

export interface DaySummary {
  date: string; // YYYY-MM-DD
  doneCount: number;
  plannedCount: number;
  minutesByCategory: Record<CategoryKey, number>;
}