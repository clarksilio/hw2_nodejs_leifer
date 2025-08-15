import { StatsRepository } from '@repositories/StatsRepository';

export const StatsService = {
  async weeklyStats(weekStart: string, weekEnd: string) {
    const dist = await StatsRepository.categoryDistribution(weekStart, weekEnd);
    return dist;
  },
  async monthlyStats(monthStart: string, monthEnd: string) {
    const dist = await StatsRepository.categoryDistribution(monthStart, monthEnd);
    return dist;
  },
  async dayCompletion(date: string) {
    return StatsRepository.dayCompletion(date);
  },
  async minimumStreakUpTo(dateInclusive: string) {
    return StatsRepository.minimumStreakUpTo(dateInclusive);
  },
};