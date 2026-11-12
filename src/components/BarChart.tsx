/**
 * Animated bar chart using reanimated Views (no SVG dependency).
 * Bars spring up on mount and re-animate when the value set changes.
 */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Colors } from '@/constants/theme';

type BarDatum = { label: string; value: number };

function Bar({ value, max, color, delay }: { value: number; max: number; color: string; delay: number }) {
  const target = Math.max(0.06, value / max) * 100;
  const h = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => {
      h.value = withTiming(target, { duration: 650, easing: Easing.out(Easing.ease) });
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay, h]);

  const style = useAnimatedStyle(() => ({ height: `${h.value}%` }));

  return <Animated.View style={[style, { backgroundColor: color, borderRadius: 5, width: '100%' }]} />;
}

type BarChartProps = {
  data: BarDatum[];
  height?: number;
  color?: string;
  activeIndex?: number; // highlight one bar
};

export function BarChart({ data, height = 150, color = Colors.primary, activeIndex }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <View>
      <View style={[styles.bars, { height }]}>
        {data.map((d, i) => (
          <View key={`${d.label}-${i}`} style={styles.barWrap}>
            <Bar value={d.value} max={max} color={i === activeIndex ? color : Colors.controlInactive} delay={i * 45} />
          </View>
        ))}
      </View>
      <View style={styles.labels}>
        {data.map((d, i) => (
          <Text key={`l-${i}`} style={[styles.label, { color: i === activeIndex ? Colors.textSecondary : Colors.textMuted }]}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingVertical: 6 },
  barWrap: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  labels: { flexDirection: 'row', gap: 10, marginTop: 8 },
  label: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '500' },
});
