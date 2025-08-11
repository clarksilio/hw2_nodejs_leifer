export interface Category {
  key: CategoryKey;
  name: string;
  color: string;
  icon: string; // emoji or icon name
}

export type CategoryKey = 'study' | 'sport' | 'social' | 'rest' | 'projects';

export const DEFAULT_CATEGORIES: Category[] = [
  { key: 'study', name: 'Учёба', color: '#3B82F6', icon: '📘' },
  { key: 'sport', name: 'Спорт', color: '#10B981', icon: '🏃' },
  { key: 'social', name: 'Общение', color: '#F59E0B', icon: '💬' },
  { key: 'rest', name: 'Отдых', color: '#8B5CF6', icon: '🌙' },
  { key: 'projects', name: 'Проекты', color: '#F97316', icon: '💡' }
];