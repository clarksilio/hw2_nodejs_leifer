import { getDb } from './Database';
import { Goal } from '@models/Goal';
import { GoalStep } from '@models/GoalStep';

function rowToGoal(row: any): Goal {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    category: row.category,
    targetDate: row.targetDate ?? undefined,
    createdAt: row.createdAt,
  };
}

function rowToGoalStep(row: any): GoalStep {
  return {
    id: row.id,
    goalId: row.goalId,
    title: row.title,
    isDone: !!row.isDone,
    plannedDate: row.plannedDate ?? undefined,
  };
}

export const GoalRepository = {
  async create(goal: Omit<Goal, 'id'>): Promise<number> {
    const db = getDb();
    const res = await db.runAsync(
      `INSERT INTO goals (title, description, category, targetDate, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [goal.title, goal.description ?? null, goal.category, goal.targetDate ?? null, goal.createdAt]
    );
    return res.lastInsertRowId as number;
  },
  async update(goal: Goal): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `UPDATE goals SET title=?, description=?, category=?, targetDate=? WHERE id=?`,
      [goal.title, goal.description ?? null, goal.category, goal.targetDate ?? null, goal.id]
    );
  },
  async delete(id: number): Promise<void> {
    const db = getDb();
    await db.runAsync(`DELETE FROM goals WHERE id=?`, [id]);
    await db.runAsync(`DELETE FROM goal_steps WHERE goalId=?`, [id]);
  },
  async list(): Promise<Goal[]> {
    const db = getDb();
    const rows = await db.getAllAsync(`SELECT * FROM goals ORDER BY createdAt DESC`);
    return rows.map(rowToGoal);
  },
  async get(id: number): Promise<Goal | null> {
    const db = getDb();
    const row = await db.getFirstAsync(`SELECT * FROM goals WHERE id=?`, [id]);
    return row ? rowToGoal(row) : null;
  },

  async listSteps(goalId: number): Promise<GoalStep[]> {
    const db = getDb();
    const rows = await db.getAllAsync(`SELECT * FROM goal_steps WHERE goalId=? ORDER BY id ASC`, [goalId]);
    return rows.map(rowToGoalStep);
  },
  async addStep(step: Omit<GoalStep, 'id'>): Promise<number> {
    const db = getDb();
    const res = await db.runAsync(
      `INSERT INTO goal_steps (goalId, title, isDone, plannedDate) VALUES (?, ?, ?, ?)`,
      [step.goalId, step.title, step.isDone ? 1 : 0, step.plannedDate ?? null]
    );
    return res.lastInsertRowId as number;
  },
  async updateStep(step: GoalStep): Promise<void> {
    const db = getDb();
    await db.runAsync(`UPDATE goal_steps SET title=?, isDone=?, plannedDate=? WHERE id=?`, [
      step.title,
      step.isDone ? 1 : 0,
      step.plannedDate ?? null,
      step.id,
    ]);
  },
  async deleteStep(id: number): Promise<void> {
    const db = getDb();
    await db.runAsync(`DELETE FROM goal_steps WHERE id=?`, [id]);
  },
};