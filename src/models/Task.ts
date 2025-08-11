export type Priority = 1 | 2 | 3;

export type CategoryKey = 'study' | 'sport' | 'social' | 'rest' | 'projects';

export interface RepeatDailyRule {
  type: 'DAILY';
  interval?: number; // every N days
}

export interface RepeatWeeklyRule {
  type: 'WEEKLY';
  interval?: number; // every N weeks
  byWeekday: number[]; // 0-6 Sun-Sat
}

export interface RepeatMonthlyByDateRule {
  type: 'MONTHLY_BY_DATE';
  interval?: number; // every N months
  day: number; // 1-31
}

export interface RepeatMonthlyByNthWeekdayRule {
  type: 'MONTHLY_BY_NTH_WEEKDAY';
  interval?: number;
  week: number; // 1-5 or -1 for last
  weekday: number; // 0-6
}

export type RepeatRule =
  | RepeatDailyRule
  | RepeatWeeklyRule
  | RepeatMonthlyByDateRule
  | RepeatMonthlyByNthWeekdayRule;

export interface Task {
  id: number;
  title: string;
  note?: string;
  category: CategoryKey;
  tags: string[];
  priority: Priority;
  date: string; // YYYY-MM-DD planned date or due date
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  isDone: boolean;
  isSkipped: boolean;
  isMinimum: boolean;
  repeatRule?: RepeatRule | null;
}