import { Goal } from '@models/Goal';
import { GoalRepository } from '@repositories/GoalRepository';

export const GoalService = {
  async listGoalsWithProgress(): Promise<(Goal & { progress: number; stepsDone: number; stepsTotal: number })[]> {
    const goals = await GoalRepository.list();
    const result: (Goal & { progress: number; stepsDone: number; stepsTotal: number })[] = [];
    for (const g of goals) {
      const steps = await GoalRepository.listSteps(g.id);
      const total = steps.length;
      const done = steps.filter((s) => s.isDone).length;
      result.push({ ...g, progress: total ? Math.round((done / total) * 100) : 0, stepsDone: done, stepsTotal: total });
    }
    return result;
  },
};