/**
 * A circular progress ring built with react-native-svg (included in Expo Go).
 * Rendered statically so it never depends on SVG animation plugins.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Colors } from '@/constants/theme';

type RingProps = {
  size?: number;
  stroke?: number;
  progress?: number; // 0..1
  color?: string;
  track?: string;
  children?: React.ReactNode;
};

export function Ring({
  size = 64,
  stroke = 6,
  progress = 0,
  color = Colors.energy,
  track = Colors.ringTrack,
  children,
}: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = c * (1 - clamped);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children ? <View>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({ svg: { position: 'absolute' } });
