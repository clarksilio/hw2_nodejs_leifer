import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { useTasksStore } from '@store/useTasksStore';
import TaskItem from '@components/TaskItem';

export default function CalendarScreen() {
  const [selected, setSelected] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const { tasks, load } = useTasksStore();

  useEffect(() => {
    load(selected);
  }, [selected]);

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        onDayPress={(d) => setSelected(d.dateString)}
        markedDates={{
          [selected]: { selected: true, selectedColor: '#3B82F6' },
        }}
        style={{ marginBottom: 8 }}
      />
      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>{selected}</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => `${item.id}-${item.title}-${item.date}`}
          renderItem={({ item }) => <TaskItem task={item} />}
          ListEmptyComponent={<Text>Нет элементов</Text>}
        />
      </View>
    </View>
  );
}