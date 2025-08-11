import { create } from 'zustand';
import { GoalService } from '@services/GoalService';

interface GoalWithProgress {
  id: number;
  title: string;
  description?: string;
  category: string;
  targetDate?: string;
  createdAt: string;
  progress: number;
  stepsDone: number;
  stepsTotal: number;
}

interface GoalsState {
  goals: GoalWithProgress[];
  load: () => Promise<void>;
}

export const useGoalsStore = create<GoalsState>((set) => ({
  goals: [],
  async load() {
    const goals = await GoalService.listGoalsWithProgress();
    set({ goals });
  },
}));