import { Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import * as Haptics from 'expo-haptics';

import { Colors, Radius } from '@/constants/theme';
import { Screen, TopBar } from '@/components/Screen';
import { Button, Card, Chip, Icon, Row, Text } from '@/components/ui';
import { products, routines } from '@/data/mock';

const creatorSteps = [
  { id: 'warm', label: 'Warm floor', icon: 'thermometer-outline' as const },
  { id: 'light', label: 'Mirror glow', icon: 'bulb-outline' as const },
  { id: 'shower', label: '40° shower', icon: 'water-outline' as const },
  { id: 'seat', label: 'Seat warm', icon: 'flame-outline' as const },
];

export default function Routines() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products[id];

  const [active, setActive] = useState<Set<string>>(() => new Set(routines.filter((r) => r.active).map((r) => r.id)));
  const [recommended, setRecommended] = useState(true);
  const [name, setName] = useState('My morning');
  const [chosen, setChosen] = useState<Set<string>>(() => new Set(['warm', 'shower']));
  const [previewing, setPreviewing] = useState(false);

  if (!product) return <Redirect href="/home" />;

  const accent = product.accent;

  const toggleRoutine = (rid: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(rid)) {
        next.delete(rid);
      } else {
        next.add(rid);
      }
      return next;
    });
  };

  const toggleStep = (sid: string) => {
    Haptics.selectionAsync();
    setChosen((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) {
        next.delete(sid);
      } else {
        next.add(sid);
      }
      return next;
    });
  };

  const approve = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setRecommended(false);
    setPreviewing(false);
  };

  return (
    <Screen scroll edges={['top', 'left', 'right']} padding={24}>
      <TopBar back title={`Routines · ${product.name}`} trailing={<View style={styles.spacer} />} />

      <Text variant="label" tone="secondary" style={styles.sectionLabel}>
        CURRENT ROUTINES
      </Text>
      <View style={styles.list}>
        {routines.map((r, i) => (
          <Animated.View key={r.id} entering={FadeInUp.delay(i * 55).springify()}>
            <Row style={styles.routineRow}>
              <View style={[styles.swatch, { backgroundColor: active.has(r.id) ? accent : 'transparent', borderColor: active.has(r.id) ? accent : Colors.surfaceStroke }]}>
                {active.has(r.id) ? <Icon name="checkmark" size={16} color="#fff" /> : null}
              </View>
              <Pressable style={styles.routineBody} onPress={() => toggleRoutine(r.id)}>
                <View>
                  <Text variant="subheading" style={{ opacity: active.has(r.id) ? 1 : 0.6 }}>
                    {r.name}
                  </Text>
                  <Text variant="caption" tone="secondary">
                    {r.when} · {r.desc}
                  </Text>
                </View>
              </Pressable>
            </Row>
          </Animated.View>
        ))}
      </View>

      {recommended ? (
        <View style={styles.recCard}>
          <Row style={styles.recHeader}>
            <Icon name="sparkles" size={18} color={Colors.energy} />
            <Text variant="label" tone="secondary" style={{ letterSpacing: 1, marginLeft: 8 }}>
              RECOMMENDED
            </Text>
          </Row>
          <Text variant="subheading" style={styles.recTitle}>
            Calm evenings
          </Text>
          <Text variant="caption" tone="secondary" style={styles.recDesc}>
            Restore soak, dim the mirror, warm the seat — suggested from your last 7 nights.
          </Text>
          <Row style={styles.recActions}>
            <Button label="Approve" tint={accent} onPress={approve} style={{ flex: 1 }} />
            <View style={styles.recGap} />
            <Button label="Dismiss" variant="secondary" onPress={() => setRecommended(false)} style={{ flex: 1 }} />
          </Row>
        </View>
      ) : null}

      <Text variant="label" tone="secondary" style={styles.sectionLabel}>
        CREATE MY OWN
      </Text>
      <Card style={styles.creator}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name your routine"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />
        <Row style={styles.creatorSteps}>
          {creatorSteps.map((s) => (
            <Chip key={s.id} label={s.label} icon={s.icon} on={chosen.has(s.id)} tint={accent} onPress={() => toggleStep(s.id)} />
          ))}
        </Row>
        {previewing ? (
          <View style={styles.preview}>
            <Text variant="caption" tone="secondary">
              “{name}” — {chosen.size} action{chosen.size === 1 ? '' : 's'} scheduled daily.
            </Text>
            <Row style={styles.recActions}>
              <Button label="Approve" tint={accent} onPress={approve} style={{ flex: 1 }} />
              <View style={styles.recGap} />
              <Button label="Edit" variant="secondary" onPress={() => setPreviewing(false)} style={{ flex: 1 }} />
            </Row>
          </View>
        ) : (
          <Button label="Preview routine" icon="eye-outline" variant="secondary" block onPress={() => setPreviewing(true)} />
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  spacer: { width: 40 },
  sectionLabel: { letterSpacing: 1, marginTop: 6, marginBottom: 14 },
  list: { gap: 10, marginBottom: 8 },
  routineRow: { alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.surfaceStroke, padding: 14, gap: 12 },
  swatch: { width: 26, height: 26, borderRadius: 8, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  routineBody: { flex: 1 },
  recCard: { backgroundColor: `${Colors.energy}14`, borderRadius: Radius.lg, borderWidth: 1, borderColor: `${Colors.energy}33`, padding: 16, marginBottom: 8 },
  recHeader: { marginBottom: 10 },
  recTitle: { marginBottom: 4 },
  recDesc: { marginBottom: 14, lineHeight: 19 },
  recActions: { gap: 0 },
  recGap: { width: 10 },
  creator: { padding: 16, gap: 14 },
  input: { color: Colors.text, fontSize: 18, fontWeight: '600', backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 2 },
  creatorSteps: { flexWrap: 'wrap', gap: 8 },
  preview: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, padding: 14, gap: 12 },
});
