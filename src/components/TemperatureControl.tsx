/**
 * Vertical "pan to set" temperature / value stepper.
 * Matches the Figma Thermostat frame: a column of values you swipe up/down to
 * change, the active one enlarged, snapping to the nearest step with a spring
 * + haptic. Built with react-native-gesture-handler + reanimated.
 */
/* eslint-disable react-hooks/immutability -- shared value mutation (`.value`) is the intended reanimated API */
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  clamp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';

import * as Haptics from 'expo-haptics';

import { Colors, Spring } from '@/constants/theme';
import { Text } from '@/components/ui';

const ROW = 66; // px between steps

function TempItem({ step, index, pos, accent }: { step: number; index: number; pos: SharedValue<number>; accent: string }) {
  const style = useAnimatedStyle(() => {
    const delta = pos.value - index;
    const scale = interpolate(pos.value, [index - 4, index - 2, index, index + 2, index + 4], [0.55, 0.78, 1, 0.78, 0.55], Extrapolation.CLAMP);
    const opacity = interpolate(pos.value, [index - 4, index - 1, index, index + 1, index + 4], [0.15, 0.5, 1, 0.5, 0.15], Extrapolation.CLAMP);
    return {
      transform: [{ translateY: delta * ROW }, { scale }],
      opacity,
    };
  });

  const active = Math.round(pos.value) === index;
  return (
    <Animated.View style={[styles.item, style]}>
      <Text
        variant="body"
        style={[
          { fontSize: 46, fontWeight: '300', lineHeight: 52 },
          { color: active ? accent : Colors.textSecondary },
        ]}>
        {step}
      </Text>
    </Animated.View>
  );
}

type TemperatureControlProps = {
  steps: number[];
  value: number;
  onChange?: (v: number) => void;
  accent?: string;
};

export function TemperatureControl({ steps, value, onChange, accent = Colors.primary }: TemperatureControlProps) {
  const height = ROW * 5;
  const pos = useSharedValue(Math.max(0, steps.indexOf(value)));

  // keep pos in sync if the committed value is set externally
  useEffect(() => {
    const i = steps.indexOf(value);
    if (i >= 0 && i !== Math.round(pos.value)) {
      pos.value = withSpring(i, Spring.gentle);
    }
  }, [value, steps, pos]);

  const base = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetY([-8, 8])
    .onBegin(() => {
      'worklet';
      base.value = pos.value;
    })
    .onChange((e) => {
      'worklet';
      pos.value = clamp(base.value - e.translationY / ROW, 0, steps.length - 1);
    })
    .onEnd(() => {
      'worklet';
      const target = clamp(Math.round(pos.value), 0, steps.length - 1);
      pos.value = withSpring(target, Spring.snappy);
      if (target !== Math.round(base.value)) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
      runOnJS(onChange ?? (() => {}))(steps[target]);
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={[styles.window, { height }]} pointerEvents="box-none">
        {steps.map((s, i) => (
          <TempItem key={i} step={s} index={i} pos={pos} accent={accent} />
        ))}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  window: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingHorizontal: 24 },
  item: { position: 'absolute', left: 0, right: 0, top: '50%', height: ROW, alignItems: 'center', justifyContent: 'center' },
});
