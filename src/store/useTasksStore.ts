import { create } from 'zustand';
import { Task } from '@models/Task';
import { TaskService } from '@services/TaskService';
import { TaskRepository } from '@repositories/TaskRepository';

interface TasksState {
  date: string; // YYYY-MM-DD
  tasks: Task[];
  load: (date: string) => Promise<void>;
  toggleDone: (task: Task, done: boolean) => Promise<void>;
  toggleSkipped: (task: Task, skipped: boolean) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  date: '',
  tasks: [],
  async load(date) {
    const tasks = await TaskService.getTasksForDate(date);
    set({ date, tasks });
  },
  async toggleDone(task, done) {
    if (task.id > 0) await TaskRepository.toggleDone(task.id, done);
    const date = get().date;
    await get().load(date);
  },
  async toggleSkipped(task, skipped) {
    if (task.id > 0) await TaskRepository.toggleSkipped(task.id, skipped);
    const date = get().date;
    await get().load(date);
  },
}));