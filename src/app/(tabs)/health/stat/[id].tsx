import { Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { BarChart } from '@/components/BarChart';
import { Screen, TopBar } from '@/components/Screen';
import { Card, Icon, Row, Text, type IconName } from '@/components/ui';
import { stats } from '@/data/mock';

type Range = '7D' | '30D' | '90D';

const RANGES: Range[] = ['7D', '30D', '90D'];
const LABELS: Record<Range, string[]> = {
  '7D': ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  '30D': ['1', '4', '7', '10', '13', '16', '19', '22', '25', '30'],
  '90D': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
};

function toneColor(tone: string) {
  return tone === 'success' ? Colors.success : tone === 'energy' ? Colors.energy : Colors.primary;
}

function expandSeries(base: number[], n: number): number[] {
  const first = base[0];
  const last = base[base.length - 1];
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const trend = first + (last - first) * t;
    const wob = Math.sin(i * 0.9) * 2.5 + Math.sin(i * 0.37) * 1.5;
    out.push(Math.max(0, Math.round(trend + wob)));
  }
  out[n - 1] = last;
  return out;
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.mini}>
      <Text variant="title" style={{ fontSize: 22 }}>
        {value}
      </Text>
      <Text variant="label" tone="secondary" style={styles.miniLabel}>
        {label}
      </Text>
    </View>
  );
}

export default function StatPage() {
  const { id } = useLocalSearchParams();
  const stat = stats.find((s) => s.id === id);
  const [range, setRange] = useState<Range>('7D');
  if (!stat) return <Redirect href="/health" />;

  const color = toneColor(stat.tone);

  const count = range === '7D' ? 7 : range === '30D' ? 10 : 12;
  const values = range === '7D' ? stat.series : expandSeries(stat.series, count);
  const data = values.map((v, i) => ({ label: LABELS[range][i] ?? '', value: v }));
  const last = stat.series[stat.series.length - 1];
  const weeklyAvg = Math.round(stat.series.reduce((a, b) => a + b, 0) / stat.series.length);
  const monthlyAvg = Math.round(expandSeries(stat.series, 30).reduce((a, b) => a + b, 0) / 30);

  return (
    <Screen scroll edges={['top', 'left', 'right']} padding={24}>
      <TopBar back title={stat.name} trailing={<View style={styles.spacer} />} />

      <Animated.View entering={FadeInUp.springify()} style={styles.readout}>
        <Row style={styles.readoutTop}>
          <View style={[styles.readoutIcon, { backgroundColor: `${color}1F` }]}>
            <Icon name={stat.icon as IconName} size={22} color={color} />
          </View>
          <Text variant="caption" tone="secondary">
            {stat.source}
          </Text>
        </Row>
        <Text variant="display" style={[{ color }, styles.bigValue]}>
          {stat.value}
          {stat.unit ? <Text style={{ fontSize: 26, color: Colors.textSecondary }}> {stat.unit}</Text> : null}
        </Text>
        <Row style={styles.delta}>
          <Icon name="trending-up" size={15} color={color} />
          <Text variant="caption" style={{ color }}>
            {stat.delta}
          </Text>
        </Row>
      </Animated.View>

      <Row style={styles.segment}>
        {RANGES.map((r) => (
          <Pressable
            key={r}
            accessibilityRole="button"
            onPress={() => setRange(r)}
            style={({ pressed }) => [
              styles.segBtn,
              {
                backgroundColor: range === r ? Colors.surfaceRaised : 'transparent',
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <Text variant="caption" style={{ color: range === r ? Colors.text : Colors.textSecondary }}>
              {r}
            </Text>
          </Pressable>
        ))}
      </Row>

      <Card style={styles.chartCard}>
        <BarChart data={data} height={150} color={color} activeIndex={data.length - 1} />
      </Card>

      <Row style={styles.minis}>
        <MiniStat label="Today" value={last} />
        <View style={styles.miniDivider} />
        <MiniStat label="7-day avg" value={weeklyAvg} />
        <View style={styles.miniDivider} />
        <MiniStat label="30-day avg" value={monthlyAvg} />
      </Row>

      <Text variant="label" tone="secondary" style={styles.sectionLabel}>
        HIGHLIGHTS
      </Text>
      <View style={styles.highlights}>
        {stat.highlights.map((h, i) => (
          <Row key={i} style={styles.highlightRow}>
            <Icon name="checkmark-circle" size={18} color={color} />
            <Text variant="caption" tone="secondary" style={styles.highlightText}>
              {h}
            </Text>
          </Row>
        ))}
      </View>

      <Text variant="label" tone="secondary" style={styles.sectionLabel}>
        {stat.sources.group.toUpperCase()}
      </Text>
      <Card style={styles.sources}>
        {stat.sources.items.map((s, i) => (
          <Row key={i} style={styles.sourceRow}>
            <Icon name="layers-outline" size={16} color={Colors.textSecondary} />
            <Text variant="caption" tone="secondary">
              {s}
            </Text>
          </Row>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  spacer: { width: 40 },
  readout: { alignItems: 'flex-start', marginBottom: 20 },
  readoutTop: { gap: 10, marginBottom: 14 },
  readoutIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  bigValue: { lineHeight: 60 },
  delta: { gap: 6, marginTop: 6 },
  segment: { alignSelf: 'stretch', backgroundColor: Colors.surface, borderRadius: 12, padding: 4, marginBottom: 16 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 9 },
  chartCard: { padding: 16 },
  minis: { justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 6 },
  mini: { flex: 1, alignItems: 'center' },
  miniLabel: { marginTop: 4, letterSpacing: 0.5 },
  miniDivider: { width: 1, height: 34, backgroundColor: Colors.surfaceStroke },
  sectionLabel: { letterSpacing: 1, marginTop: 24, marginBottom: 12 },
  highlights: { gap: 12 },
  highlightRow: { gap: 10 },
  highlightText: { flex: 1, lineHeight: 20 },
  sources: { padding: 6 },
  sourceRow: { paddingVertical: 12, paddingHorizontal: 12, gap: 10 },
});
