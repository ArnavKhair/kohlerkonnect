import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function HealthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="stat/[id]" />
    </Stack>
  );
}
