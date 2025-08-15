import { CategoryKey } from './Task';

export interface Goal {
  id: number;
  title: string;
  description?: string;
  category: CategoryKey;
  targetDate?: string; // YYYY-MM-DD
  createdAt: string; // ISO
}