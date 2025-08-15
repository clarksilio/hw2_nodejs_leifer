import React from 'react';
import { View, Text } from 'react-native';
import ProgressBar from '@components/ProgressBar';

export default function GoalCard({ goal }: { goal: any }) {
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: '700' }}>{goal.title}</Text>
      {goal.description ? <Text style={{ color: '#6b7280', marginTop: 4 }}>{goal.description}</Text> : null}
      <View style={{ marginTop: 8 }}>
        <ProgressBar progress={goal.progress / 100} />
        <Text style={{ color: '#6b7280', marginTop: 4 }}>{goal.stepsDone}/{goal.stepsTotal} шагов</Text>
      </View>
    </View>
  );
}