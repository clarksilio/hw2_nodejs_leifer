export function calculateStreak(days: { date: string; hasMinimumDone: boolean }[]): number {
  let streak = 0;
  for (const d of days) {
    if (d.hasMinimumDone) streak += 1; else break;
  }
  return streak;
}

export function isIdeal(planned: number, done: number) {
  return planned > 0 && planned === done;
}