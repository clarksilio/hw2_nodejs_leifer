import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Task } from '@models/Task';
import { DEFAULT_CATEGORIES } from '@models/Category';

export default function TaskItem({ task, onDone, onSkip }: {
  task: Task;
  onDone?: (v: boolean) => void;
  onSkip?: (v: boolean) => void;
}) {
  const cat = DEFAULT_CATEGORIES.find((c) => c.key === task.category);
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: cat?.color || '#e5e7eb' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{task.title}</Text>
          <Text style={{ color: '#6b7280' }}>{task.startTime ? `${task.startTime}–${task.endTime || ''}` : task.date}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {onSkip && (
            <TouchableOpacity onPress={() => onSkip(!task.isSkipped)} style={{ padding: 8, backgroundColor: '#F59E0B', borderRadius: 8 }}>
              <Text style={{ color: 'white' }}>{task.isSkipped ? 'Отменить' : 'Пропустить'}</Text>
            </TouchableOpacity>
          )}
          {onDone && (
            <TouchableOpacity onPress={() => onDone(!task.isDone)} style={{ padding: 8, backgroundColor: '#10B981', borderRadius: 8 }}>
              <Text style={{ color: 'white' }}>{task.isDone ? 'Снять' : 'Готово'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {task.isMinimum && <Text style={{ marginTop: 6, color: '#3B82F6' }}>Минимум дня</Text>}
    </View>
  );
}