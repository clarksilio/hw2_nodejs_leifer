import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useSettingsStore } from '@store/useSettingsStore';
import { ExportImportService } from '@services/ExportImportService';

export default function SettingsScreen() {
  const { theme, setTheme, quietMode, toggleQuiet, streakEnabled, toggleStreak } = useSettingsStore();
  const [importText, setImportText] = useState('');

  const exportData = async () => {
    const path = await ExportImportService.exportJson();
    Alert.alert('Экспорт JSON', `Файл сохранён: ${path}`);
  };

  const importData = async () => {
    try {
      await ExportImportService.importJson(importText);
      Alert.alert('Импорт', 'Данные импортированы');
    } catch (e) {
      Alert.alert('Ошибка импорта', String(e));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Настройки</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Тема: {theme}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => setTheme('light')}><Text>Светлая</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setTheme('dark')}><Text>Тёмная</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setTheme('system')}><Text>Системная</Text></TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Выходной режим (приглушить напоминания)</Text>
        <Switch value={quietMode} onValueChange={toggleQuiet} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Streak по минимуму дня</Text>
        <Switch value={streakEnabled} onValueChange={toggleStreak} />
      </View>

      <TouchableOpacity style={{ backgroundColor: '#10B981', padding: 12, borderRadius: 8 }} onPress={exportData}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Экспорт JSON</Text>
      </TouchableOpacity>

      <Text>Импорт JSON (вставьте содержимое):</Text>
      <TextInput
        value={importText}
        onChangeText={setImportText}
        placeholder="{ ... }"
        style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 8, minHeight: 80 }}
        multiline
      />
      <TouchableOpacity style={{ backgroundColor: '#3B82F6', padding: 12, borderRadius: 8 }} onPress={importData}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Импортировать</Text>
      </TouchableOpacity>
    </View>
  );
}