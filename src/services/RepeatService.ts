import { RepeatRule } from '@models/Task';
import { parseISO, differenceInCalendarDays } from 'date-fns';

export function occursOn(rule: RepeatRule, startDate: string, targetDate: string): boolean {
  const start = parseISO(startDate);
  const target = parseISO(targetDate);
  const interval = (rule as any).interval ?? 1;

  switch (rule.type) {
    case 'DAILY': {
      const diff = differenceInCalendarDays(target, start);
      return diff >= 0 && diff % interval === 0;
    }
    case 'WEEKLY': {
      const diff = differenceInCalendarDays(target, start);
      if (diff < 0) return false;
      const weeks = Math.floor(diff / 7);
      const weekday = target.getDay();
      return weeks % interval === 0 && rule.byWeekday.includes(weekday);
    }
    case 'MONTHLY_BY_DATE': {
      const s = start;
      const t = target;
      if (t < s) return false;
      const monthsApart = (t.getFullYear() - s.getFullYear()) * 12 + (t.getMonth() - s.getMonth());
      return monthsApart % interval === 0 && t.getDate() === rule.day;
    }
    case 'MONTHLY_BY_NTH_WEEKDAY': {
      const t = target;
      const s = start;
      if (t < s) return false;
      const monthsApart = (t.getFullYear() - s.getFullYear()) * 12 + (t.getMonth() - s.getMonth());
      if (monthsApart % interval !== 0) return false;
      const weekday = rule.weekday;
      const nth = rule.week;
      const firstDay = new Date(t.getFullYear(), t.getMonth(), 1);
      const firstWeekday = firstDay.getDay();
      let dayOfMonth = 1 + ((7 + weekday - firstWeekday) % 7) + (nth - 1) * 7;
      if (nth === -1) {
        const lastDay = new Date(t.getFullYear(), t.getMonth() + 1, 0);
        const lastWeekday = lastDay.getDay();
        dayOfMonth = lastDay.getDate() - ((7 + lastWeekday - weekday) % 7);
      }
      return t.getDate() === dayOfMonth;
    }
    default:
      return false;
  }
}