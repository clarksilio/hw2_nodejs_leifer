import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useGoalsStore } from '@store/useGoalsStore';
import GoalCard from '@components/GoalCard';

export default function GoalsScreen() {
  const { goals, load } = useGoalsStore();

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Цели</Text>
      <FlatList
        data={goals}
        keyExtractor={(g) => `${g.id}`}
        renderItem={({ item }) => <GoalCard goal={item} />}
      />
    </View>
  );
}