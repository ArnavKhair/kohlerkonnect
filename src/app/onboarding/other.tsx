import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { HeroMark, StepBar } from '@/components/Onboard';
import { Screen } from '@/components/Screen';
import { Button, Text } from '@/components/ui';

export default function ConnectOther() {
  const finish = () => router.replace('/home');
  return (
    <Screen padding={28}>
      <View style={styles.fill}>
        <StepBar step={4} total={4} />

        <Animated.View entering={FadeInUp.springify()} style={styles.body}>
          <HeroMark icon="watch-outline" tint={Colors.primary} size={116} />
          <View style={styles.gap20} />
          <Text variant="title" style={styles.center}>
            Connect other devices?
          </Text>
          <View style={styles.gap10} />
          <Text variant="body" tone="secondary" style={styles.center}>
            Add an Apple Watch or another health device to enrich your Health insights. You can always do this later from Account.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(90).springify()} style={styles.actions}>
          <Button label="Yes, connect later" block onPress={finish} />
          <View style={styles.gap10} />
          <Button label="Skip for now" variant="secondary" block onPress={finish} />
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: 'space-between' },
  body: { alignItems: 'center' },
  actions: { gap: 0 },
  gap20: { height: 20 },
  gap10: { height: 10 },
  center: { textAlign: 'center' },
});
