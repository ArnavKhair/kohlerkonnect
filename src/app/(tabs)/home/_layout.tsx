import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="room/[id]" />
      <Stack.Screen name="product/[id]" />
      <Stack.Screen name="routines/[id]" />
    </Stack>
  );
}
