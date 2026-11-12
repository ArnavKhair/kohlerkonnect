import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { HeroMark, StepBar } from '@/components/Onboard';
import { Screen } from '@/components/Screen';
import { Button, Text } from '@/components/ui';

export default function LetsKonnect() {
  return (
    <Screen padding={28}>
      <View style={styles.fill}>
        <Animated.View entering={FadeInDown.springify()}>
          <StepBar step={1} total={4} canBack={false} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(90).springify()} style={styles.hero}>
          <HeroMark icon="sparkles" tint={Colors.primary} />
          <View style={styles.gap24} />
          <Text variant="title" style={styles.center}>
            Let’s Konnect
          </Text>
          <View style={styles.gap10} />
          <Text variant="body" tone="secondary" style={styles.center}>
            One home for your Kohler bathroom — control, comfort, and the health signal it senses, all in your pocket.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(180).springify()}>
          <Button label="Continue" block onPress={() => router.push('/onboarding/account')} />
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: 'space-between' },
  hero: { alignItems: 'center', gap: 0 },
  gap24: { height: 24 },
  gap10: { height: 10 },
  center: { textAlign: 'center' },
});
