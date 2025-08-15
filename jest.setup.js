jest.mock('expo-sqlite', () => ({
  openDatabase: () => ({
    transaction: (fn) => fn({
      executeSql: (_q, _p, success) => success && success(null, { rows: { _array: [], length: 0 }, insertId: 1 })
    })
  })
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(async () => ({})),
  cancelScheduledNotificationAsync: jest.fn(async () => ({}))
}));

jest.mock('expo-file-system', () => ({
  writeAsStringAsync: jest.fn(async () => {}),
  readAsStringAsync: jest.fn(async () => '{}'),
  documentDirectory: '/mock'
}));