import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Pressable, StyleSheet, View } from 'react-native';

import * as Haptics from 'expo-haptics';

import { Colors, Radius } from '@/constants/theme';
import { Screen, TopBar } from '@/components/Screen';
import { TemperatureControl } from '@/components/TemperatureControl';
import { Button, Chip, Icon, Row, Text, type IconName } from '@/components/ui';
import { products, rooms } from '@/data/mock';

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products[id];

  const [value, setValue] = useState<number>(() =>
    product ? product.steps[Math.floor(product.steps.length / 2)] : 0,
  );
  const [quick, setQuick] = useState<Set<string>>(() => new Set((product?.quick ?? []).filter((q) => q.on).map((q) => q.id)));
  const [justSet, setJustSet] = useState(false);

  if (!product) return <Redirect href="/home" />;

  const room = rooms.find((r) => r.id === product.roomId);
  const accent = product.accent;

  const toggleQuick = (qid: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuick((prev) => {
      const next = new Set(prev);
      if (next.has(qid)) {
        next.delete(qid);
      } else {
        next.add(qid);
      }
      return next;
    });
  };

  const commit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setJustSet(true);
    setTimeout(() => setJustSet(false), 1300);
  };

  return (
    <Screen edges={['top', 'left', 'right']} bg={Colors.background} style={styles.root}>
      <View style={[styles.accentOverlay, { backgroundColor: accent }]} pointerEvents="none" />

      <TopBar
        back
        title={product.name}
        accent={Colors.text}
        trailing={
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/home/routines/${product.id}`)}
            hitSlop={10}
            style={({ pressed }) => [styles.gear, { opacity: pressed ? 0.5 : 1 }]}>
            <Icon name="list-outline" size={22} color={Colors.textSecondary} />
          </Pressable>
        }
      />

      <Animated.View entering={FadeInUp.springify()} style={styles.hero}>
        <Text variant="label" tone="secondary" style={styles.center}>
          {product.unit === '%' ? 'BRIGHTNESS' : 'SET POINT'}
        </Text>

        <TemperatureControl
          steps={product.steps}
          value={value}
          onChange={(v) => setValue(v)}
          accent={accent}
        />

        <Button
          label={justSet ? 'Set ✓' : 'Set'}
          icon={justSet ? 'checkmark' : undefined}
          tint={accent}
          onPress={commit}
          style={styles.setBtn}
        />
      </Animated.View>

      <Text variant="label" tone="secondary" style={styles.sectionLabel}>
        QUICK CONTROLS
      </Text>
      <Row style={styles.quickRow}>
        {product.quick.map((q) => (
          <Chip
            key={q.id}
            label={q.label}
            icon={q.icon as IconName}
            on={quick.has(q.id)}
            tint={accent}
            onPress={() => toggleQuick(q.id)}
          />
        ))}
      </Row>

      <View style={styles.footnote}>
        <Icon name="flash" size={14} color={Colors.energy} />
        <Text variant="caption" tone="muted">
          {room?.name} · {product.blurb}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  accentOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 420, backgroundColor: Colors.primary, opacity: 0.1, overflow: 'hidden' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center', letterSpacing: 1.5, marginBottom: 6 },
  setBtn: { marginTop: 8, alignSelf: 'stretch', maxHeight: 52 },
  sectionLabel: { letterSpacing: 1, marginBottom: 12, marginTop: 4 },
  quickRow: { flexWrap: 'wrap', gap: 10 },
  gear: { backgroundColor: Colors.controlInactive, borderRadius: Radius.full, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  footnote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 },
});
