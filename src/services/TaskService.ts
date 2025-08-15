import { Task } from '@models/Task';
import { TaskRepository, TaskFilters } from '@repositories/TaskRepository';
import { occursOn } from './RepeatService';

export const TaskService = {
  async getTasksForDate(date: string, filters?: TaskFilters): Promise<Task[]> {
    const stored = await TaskRepository.getByDate(date, filters);
    // Generate repeated tasks that have different stored date but should occur on this date
    // For simplicity, find repeated tasks stored with the earliest start date in range up to this date
    const rangeStart = '2000-01-01';
    const more = await TaskRepository.listInRange(rangeStart, date);
    const virtuals: Task[] = [];
    for (const t of more) {
      if (!t.repeatRule) continue;
      if (occursOn(t.repeatRule, t.date, date)) {
        if (t.date !== date) {
          virtuals.push({ ...t, id: -t.id * 10000 - date.split('-').join('').length, date });
        }
      }
    }
    const all = [...stored, ...virtuals];
    all.sort((a, b) => {
      const aNull = a.startTime ? 0 : 1;
      const bNull = b.startTime ? 0 : 1;
      if (aNull !== bNull) return aNull - bNull;
      if (a.startTime && b.startTime && a.startTime !== b.startTime) return a.startTime < b.startTime ? -1 : 1;
      return b.priority - a.priority;
    });
    return all;
  },
};