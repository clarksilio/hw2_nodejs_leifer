import React, { useEffect, useState } from 'react';
import { View, Text, SegmentedControlIOS, Platform } from 'react-native';
import { VictoryPie } from 'victory-native';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { StatsService } from '@services/StatsService';
import { DEFAULT_CATEGORIES } from '@models/Category';

export default function StatsScreen() {
  const [range, setRange] = useState<'week' | 'month'>('week');
  const [data, setData] = useState<{ x: string; y: number; color: string }[]>([]);

  const load = async () => {
    const now = new Date();
    let start: string, end: string;
    if (range === 'week') {
      start = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      end = format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    } else {
      start = format(startOfMonth(now), 'yyyy-MM-dd');
      end = format(endOfMonth(now), 'yyyy-MM-dd');
    }
    const dist = await StatsService.weeklyStats(start, end);
    const mapped = dist.map((d) => {
      const cat = DEFAULT_CATEGORIES.find((c) => c.key === d.category)!;
      return { x: cat.name, y: d.doneCount, color: cat.color };
    });
    setData(mapped.length ? mapped : [{ x: 'Нет данных', y: 1, color: '#e5e7eb' }]);
  };

  useEffect(() => {
    load();
  }, [range]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Статистика</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <Text onPress={() => setRange('week')} style={{ padding: 8, color: range==='week'?'#3B82F6':'#6b7280' }}>Неделя</Text>
        <Text onPress={() => setRange('month')} style={{ padding: 8, color: range==='month'?'#3B82F6':'#6b7280' }}>Месяц</Text>
      </View>
      <VictoryPie
        data={data}
        colorScale={data.map((d) => d.color)}
        innerRadius={60}
        labelRadius={({ innerRadius }) => innerRadius + 20}
      />
    </View>
  );
}