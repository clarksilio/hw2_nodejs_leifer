import { SettingsRepository } from '@repositories/SettingsRepository';
import { TaskRepository } from '@repositories/TaskRepository';
import { GoalRepository } from '@repositories/GoalRepository';
import { formatISO, format } from 'date-fns';

export async function seedIfNeeded() {
  await SettingsRepository.ensureDefaultCategories();
  const settings = await SettingsRepository.loadSettings();
  // Check if there are tasks already
  const today = format(new Date(), 'yyyy-MM-dd');
  const existing = await TaskRepository.getByDate(today);
  if (existing.length > 0) return;

  // Create demo tasks
  const categories = ['study', 'sport', 'social', 'rest', 'projects'] as const;
  const now = new Date();
  const todayStr = format(now, 'yyyy-MM-dd');
  const tomorrowStr = format(new Date(now.getTime() + 24 * 3600 * 1000), 'yyyy-MM-dd');

  const demoTasks = [
    { title: 'Лекция по алгоритмам', category: 'study', start: '09:00', end: '10:30', pr: 2 },
    { title: 'Тренировка: бег 5 км', category: 'sport', start: '07:30', end: '08:10', pr: 3, min: true },
    { title: 'Позвонить родителям', category: 'social', start: '20:00', end: '20:20', pr: 1 },
    { title: 'Чтение книги', category: 'rest', start: '21:00', end: '21:40', pr: 1 },
    { title: 'Проект: прототип', category: 'projects', start: '11:00', end: '12:30', pr: 3 },
    { title: 'Английский: слова', category: 'study', start: '18:00', end: '18:30', pr: 2, repeat: { type: 'DAILY', interval: 1 } },
    { title: 'Йога', category: 'sport', start: '08:30', end: '09:00', pr: 2, repeat: { type: 'WEEKLY', interval: 1, byWeekday: [2,4] } },
    { title: 'Созвон с командой', category: 'projects', start: '15:00', end: '15:45', pr: 2, repeat: { type: 'WEEKLY', interval: 1, byWeekday: [1] } },
    { title: 'Кино вечер', category: 'rest', start: '22:00', end: '23:30', pr: 1, repeat: { type: 'MONTHLY_BY_DATE', interval: 1, day: 15 } },
    { title: 'Нетворкинг', category: 'social', start: '19:00', end: '20:30', pr: 2 },
  ];

  for (const t of demoTasks) {
    await TaskRepository.create({
      id: 0 as any,
      title: t.title,
      category: t.category as any,
      note: undefined,
      tags: [],
      priority: t.pr as any,
      date: todayStr,
      startTime: t.start,
      endTime: t.end,
      isDone: false,
      isSkipped: false,
      isMinimum: !!t.min,
      repeatRule: (t as any).repeat ?? null,
    });
  }

  // A few for tomorrow
  await TaskRepository.create({
    id: 0 as any,
    title: 'План на неделю',
    category: 'projects' as any,
    note: undefined,
    tags: ['plan'],
    priority: 3,
    date: tomorrowStr,
    startTime: '10:00',
    endTime: '10:30',
    isDone: false,
    isSkipped: false,
    isMinimum: false,
    repeatRule: null,
  });

  // Goals with steps
  const g1 = await GoalRepository.create({
    id: 0 as any,
    title: 'Подготовиться к экзамену',
    description: '5 билетов в неделю',
    category: 'study' as any,
    targetDate: format(new Date(now.getTime() + 30 * 86400000), 'yyyy-MM-dd'),
    createdAt: formatISO(now),
  });
  const g2 = await GoalRepository.create({
    id: 0 as any,
    title: 'Полумарафон',
    description: 'Пробежать 21 км',
    category: 'sport' as any,
    targetDate: format(new Date(now.getTime() + 90 * 86400000), 'yyyy-MM-dd'),
    createdAt: formatISO(now),
  });
  const g3 = await GoalRepository.create({
    id: 0 as any,
    title: 'MVP pet-проекта',
    description: 'LifeFlow v1',
    category: 'projects' as any,
    targetDate: format(new Date(now.getTime() + 60 * 86400000), 'yyyy-MM-dd'),
    createdAt: formatISO(now),
  });

  const steps = [
    { goalId: g1, title: 'Повторить главы 1-3', plannedDate: todayStr },
    { goalId: g1, title: 'Решить 20 задач', plannedDate: tomorrowStr },
    { goalId: g2, title: 'Пробежать 8 км', plannedDate: todayStr },
    { goalId: g2, title: 'Интервалы 6x800м', plannedDate: tomorrowStr },
    { goalId: g3, title: 'Собрать карту экранов', plannedDate: todayStr },
    { goalId: g3, title: 'Тесты репозиториев', plannedDate: tomorrowStr },
  ];
  for (const s of steps) {
    await GoalRepository.addStep({ id: 0 as any, goalId: s.goalId, title: s.title, isDone: false, plannedDate: s.plannedDate });
  }
}