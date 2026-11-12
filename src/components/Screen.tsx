/**
 * Screen shell: background + safe area + padding, with optional scroll.
 * Plus a TopBar for headers (back, title, trailing).
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Colors, Spacing } from '@/constants/theme';
import { Icon } from '@/components/ui';

type ScreenProps = ViewProps & {
  bg?: string;
  scroll?: boolean;
  padding?: number;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function Screen({ bg = Colors.background, scroll = false, padding = Spacing.four, edges = ['top', 'bottom'], style, children, ...rest }: ScreenProps) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, { padding }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, { padding }]}>
      {children}
    </View>
  );

  return (
    <View style={[{ flex: 1, backgroundColor: bg, width: '100%', height: '100%' }, style]} {...rest}>
      <SafeAreaView edges={edges} style={{ flex: 1 }}>
        {content}
      </SafeAreaView>
    </View>
  );
}

type TopBarProps = {
  title?: string;
  accent?: string;
  back?: boolean;
  trailing?: React.ReactNode;
  onBack?: () => void;
};

export function TopBar({ title, accent = Colors.text, back, trailing, onBack }: TopBarProps) {
  return (
    <View style={styles.bar}>
      {back ? (
        <Pressable
          accessibilityRole="button"
          onPress={onBack ?? (() => router.back())}
          hitSlop={10}
          style={({ pressed }) => [
            styles.back,
            { opacity: pressed ? 0.5 : 1 },
          ]}>
          <Icon name="chevron-back" size={22} color={accent} />
        </Pressable>
      ) : null}

      {title ? <Text style={[styles.title, { color: accent }]}>{title}</Text> : <View style={styles.spacer} />}

      {trailing ?? <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.three, minHeight: 44 },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600' },
  spacer: { width: 40 },
  back: { backgroundColor: Colors.controlInactive, borderRadius: 999, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
