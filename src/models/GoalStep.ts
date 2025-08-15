export interface GoalStep {
  id: number;
  goalId: number;
  title: string;
  isDone: boolean;
  plannedDate?: string; // YYYY-MM-DD
}