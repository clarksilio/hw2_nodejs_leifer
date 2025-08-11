import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { useTasksStore } from '@store/useTasksStore';
import TaskItem from '@components/TaskItem';

export default function TodayScreen() {
  const [date] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const { tasks, load, toggleDone, toggleSkipped } = useTasksStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load(date);
  }, [date]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load(date);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Сегодня</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => `${item.id}-${item.title}-${item.date}`}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onDone={(v) => toggleDone(item, v)}
            onSkip={(v) => toggleSkipped(item, v)}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text>Нет задач на сегодня</Text>}
      />
      <TouchableOpacity style={{ backgroundColor: '#3B82F6', padding: 12, borderRadius: 8, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: '600' }}>Добавить задачу</Text>
      </TouchableOpacity>
    </View>
  );
}