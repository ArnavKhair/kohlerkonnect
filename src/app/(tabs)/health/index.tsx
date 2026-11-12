import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { Screen } from '@/components/Screen';
import { Button, Card, Icon, Row, Text, type IconName } from '@/components/ui';
import { stats } from '@/data/mock';

function toneColor(tone: string) {
  return tone === 'success' ? Colors.success : tone === 'energy' ? Colors.energy : Colors.primary;
}

function StatTile({ stat, index }: { stat: (typeof stats)[number]; index: number }) {
  const color = toneColor(stat.tone);
  return (
    <Animated.View entering={FadeInUp.delay(40 + index * 60).springify()} style={styles.tileWrap}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(`/health/stat/${stat.id}`)}
        style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }], opacity: pressed ? 0.9 : 1 }]}>
        <Card style={styles.tile}>
          <Row style={styles.tileHead}>
            <Icon name={stat.icon as IconName} size={16} color={color} />
            <Text variant="label" tone="secondary">
              {stat.name}
            </Text>
          </Row>
          <Text variant="title" style={{ color, marginTop: 10 }}>
            {stat.value}
            {stat.unit ? <Text style={{ fontSize: 18, color: Colors.textSecondary }}> {stat.unit}</Text> : null}
          </Text>
          <Row style={styles.delta}>
            <Icon name={stat.delta.startsWith('Up') || stat.delta.startsWith('Down') ? 'trending-up' : 'remove'} size={13} color={color} />
            <Text variant="caption" tone="secondary" style={{ color }}>
              {stat.delta}
            </Text>
          </Row>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

export default function HealthScreen() {
  const recovery = stats.find((s) => s.id === 'recovery')!;
  const color = toneColor(recovery.tone);

  return (
    <Screen scroll edges={['top', 'left', 'right']} padding={24}>
      <View style={styles.header}>
        <View>
          <Text variant="label" tone="secondary">
            YOUR HEALTH
          </Text>
          <Text variant="title" style={styles.title}>
            Today
          </Text>
        </View>
        <Icon name="shield-checkmark-outline" size={24} color={Colors.textSecondary} />
      </View>

      <Animated.View entering={FadeInUp.springify()}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/health/stat/recovery`)}
          style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.985 : 1 }], opacity: pressed ? 0.92 : 1 }]}>
          <Card style={[styles.hero, { borderColor: `${color}44` }]}>
            <View style={[styles.heroIcon, { backgroundColor: `${color}1F` }]}>
              <Icon name={recovery.icon as IconName} size={22} color={color} />
            </View>
            <View style={styles.heroText}>
              <Text variant="caption" tone="secondary">
                Recovery · morning read
              </Text>
              <Text variant="title" style={{ color }}>
                {recovery.value}
              </Text>
              <Text variant="caption" tone="secondary">
                {recovery.delta} · from {recovery.source}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.textMuted} />
          </Card>
        </Pressable>
      </Animated.View>

      <Text variant="label" tone="secondary" style={styles.sectionLabel}>
        SCORE CARDS
      </Text>
      <View style={styles.grid}>
        {stats.map((s, i) => (
          <StatTile key={s.id} stat={s} index={i} />
        ))}
      </View>

      <Text variant="label" tone="secondary" style={styles.sectionLabel}>
        DAILY INSIGHT
      </Text>
      <Card style={styles.insight}>
        <Text variant="body" tone="secondary" style={styles.insightText}>
          Your recovery is trending up. A calm evening — Restore soak and a warm floor — matches your best mornings.
        </Text>
        <Button label="Try Restore tonight" icon="sparkles-outline" tint={color} style={{ marginTop: 14 }} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 },
  title: { marginTop: 2 },
  hero: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  heroIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  heroText: { flex: 1 },
  sectionLabel: { letterSpacing: 1, marginTop: 22, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tileWrap: { width: '47.6%' },
  tile: { padding: 16 },
  tileHead: { gap: 7 },
  delta: { gap: 5, marginTop: 10 },
  insight: { padding: 18 },
  insightText: { lineHeight: 24 },
});
