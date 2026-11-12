/**
 * Small shared pieces for the onboarding flow: a step progress bar and a
 * hero mark (icon in an accent ring).
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Colors, Radius, Spacing } from '@/constants/theme';
import { Icon, Text, type IconName } from '@/components/ui';

type StepBarProps = {
  step: number;
  total: number;
  canBack?: boolean;
};

export function StepBar({ step, total, canBack = true }: StepBarProps) {
  return (
    <View style={styles.wrap}>
      <Row>
        {canBack ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            hitSlop={10}
            style={({ pressed }) => [styles.back, { opacity: pressed ? 0.5 : 1 }]}>
            <Icon name="chevron-back" size={22} color={Colors.text} />
          </Pressable>
        ) : (
          <View style={styles.spacer} />
        )}
        <Text variant="label" tone="secondary">
          {step} of {total}
        </Text>
      </Row>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(step / total) * 100}%`, backgroundColor: Colors.primary }]} />
      </View>
    </View>
  );
}

type HeroMarkProps = {
  icon: IconName;
  tint?: string;
  size?: number;
};

export function HeroMark({ icon, tint = Colors.primary, size = 120 }: HeroMarkProps) {
  return (
    <View style={[styles.hero, { width: size, height: size, borderColor: tint, backgroundColor: `${tint}1A` }]}>
      <Icon name={icon} size={size * 0.42} color={tint} />
    </View>
  );
}

function Row({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.four },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.two },
  back: { backgroundColor: Colors.controlInactive, borderRadius: Radius.full, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  spacer: { width: 40 },
  track: { height: 4, backgroundColor: Colors.controlInactive, borderRadius: Radius.full, overflow: 'hidden' },
  fill: { height: 4, borderRadius: Radius.full },
  hero: { borderRadius: Radius.full, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
