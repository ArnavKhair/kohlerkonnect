import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { HeroMark, StepBar } from '@/components/Onboard';
import { Screen } from '@/components/Screen';
import { Button, Text } from '@/components/ui';

export default function CreateAccount() {
  const go = () => router.push('/onboarding/connect');
  return (
    <Screen padding={28}>
      <View style={styles.fill}>
        <StepBar step={2} total={4} />

        <Animated.View entering={FadeInUp.springify()} style={styles.body}>
          <HeroMark icon="person-circle" tint={Colors.primary} size={96} />
          <View style={styles.gap16} />
          <Text variant="title">Create your account</Text>
          <View style={styles.gap10} />
          <Text variant="body" tone="secondary">
            Sign in with Apple or Google, or continue as a guest to explore the prototype.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(90).springify()} style={styles.actions}>
          <Button label="Continue with Apple" icon="logo-apple" variant="secondary" block onPress={go} />
          <View style={styles.gap10} />
          <Button label="Continue with Google" icon="logo-google" variant="secondary" block onPress={go} />
          <View style={styles.gap10} />
          <Button label="Continue as guest" variant="ghost" block onPress={go} />
        </Animated.View>

        <Text variant="label" tone="muted" style={styles.footnote}>
          Prototype only — no real account or data is created.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: 'space-between' },
  body: { alignItems: 'center' },
  actions: { gap: 0 },
  gap16: { height: 16 },
  gap10: { height: 10 },
  footnote: { textAlign: 'center', marginTop: 12 },
});
