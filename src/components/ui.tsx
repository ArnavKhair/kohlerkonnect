/**
 * Reusable building blocks for Kohler Konnect.
 * Small, dark-only, tuned to the Figma palette.
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
  type TextProps,
  type ViewProps,
} from 'react-native';

import { Colors, Radius, Spacing, Type } from '@/constants/theme';

type Tone = 'primary' | 'secondary' | 'muted';

function colorOf(tone: Tone) {
  return tone === 'primary' ? Colors.text : tone === 'secondary' ? Colors.textSecondary : Colors.textMuted;
}

type TextProps_ = TextProps & {
  variant?: keyof typeof Type;
  tone?: Tone;
};

export function Text({ variant = 'body', tone = 'primary', style, ...rest }: TextProps_) {
  return <RNText style={[{ color: colorOf(tone) }, Type[variant], style]} {...rest} />;
}

export type IconName = keyof typeof Ionicons.glyphMap;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: object;
};

export function Icon({ name, size = 22, color = Colors.text, style }: IconProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}

export function Card({ style, ...rest }: ViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.surface,
          borderRadius: Radius.lg,
          borderWidth: 1,
          borderColor: Colors.surfaceStroke,
        },
        style,
      ]}
      {...rest}
    />
  );
}

export function Row({ style, ...rest }: ViewProps) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]} {...rest} />;
}

export function SectionHeader({ label, right }: { label: string; right?: React.ReactNode }) {
  return (
    <Row style={styles.sectionHeader}>
      <Text variant="label" tone="secondary" style={styles.sectionLabel}>
        {label.toUpperCase()}
      </Text>
      {right}
    </Row>
  );
}

type ButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'ghost';
  tint?: string;
  disabled?: boolean;
  block?: boolean;
  style?: object;
};

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  tint = Colors.primary,
  disabled,
  block,
  style,
}: ButtonProps) {
  const palette =
    variant === 'primary'
      ? { bg: tint, fg: '#FFFFFF' }
      : variant === 'secondary'
        ? { bg: Colors.surfaceRaised, fg: Colors.text }
        : { bg: 'transparent', fg: tint };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: palette.bg,
          opacity: disabled ? 0.45 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: variant === 'ghost' ? Colors.surfaceStroke : 'transparent',
        },
        block && styles.btnBlock,
        style,
      ]}>
      {icon ? (
        <Icon name={icon} size={18} color={palette.fg} style={styles.btnIcon} />
      ) : null}
      <RNText style={[{ color: palette.fg, fontSize: 17, fontWeight: '600' }]}>{label}</RNText>
    </Pressable>
  );
}

type ChipProps = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  on?: boolean;
  tint?: string;
  onPress?: () => void;
};

export function Chip({ label, icon, on, tint = Colors.primary, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: on ? tint : Colors.controlInactive,
          borderColor: on ? tint : Colors.surfaceStroke,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}>
      {icon ? <Icon name={icon} size={16} color={on ? '#FFFFFF' : Colors.textSecondary} /> : null}
      <RNText style={[styles.chipLabel, { color: on ? '#FFFFFF' : Colors.textSecondary }]}>{label}</RNText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { justifyContent: 'space-between', marginTop: Spacing.four, marginBottom: Spacing.two },
  sectionLabel: { letterSpacing: 1 },
  btn: {
    height: 54,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
  },
  btnBlock: { alignSelf: 'stretch' },
  btnIcon: { marginRight: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  chipLabel: { marginLeft: 7, fontSize: 14, fontWeight: '600' },
});
