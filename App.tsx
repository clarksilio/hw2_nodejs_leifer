import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodayScreen from '@screens/TodayScreen';
import GoalsScreen from '@screens/GoalsScreen';
import CalendarScreen from '@screens/CalendarScreen';
import StatsScreen from '@screens/StatsScreen';
import SettingsScreen from '@screens/SettingsScreen';
import { initDatabase } from '@repositories/Database';
import { useSettingsStore } from '@store/useSettingsStore';
import { seedIfNeeded } from '@services/SeedService';
import { StatusBar } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    (async () => {
      await initDatabase();
      await seedIfNeeded();
    })();
  }, []);

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <Tab.Navigator>
        <Tab.Screen name="Сегодня" component={TodayScreen} />
        <Tab.Screen name="Цели" component={GoalsScreen} />
        <Tab.Screen name="Календарь" component={CalendarScreen} />
        <Tab.Screen name="Статистика" component={StatsScreen} />
        <Tab.Screen name="Настройки" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}