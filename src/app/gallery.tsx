import { router } from 'expo-router';
import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';
import { BarChart } from '@/components/BarChart';
import { Ring } from '@/components/Ring';
import { Screen, TopBar } from '@/components/Screen';
import { TemperatureControl } from '@/components/TemperatureControl';
import { Button, Card, Chip, Icon, Row, Text } from '@/components/ui';

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View>
      <Text variant="label" tone="secondary" style={styles.blockLabel}>
        {title.toUpperCase()}
      </Text>
      <View style={styles.blockBody}>{children}</View>
    </View>
  );
}

export default function Gallery() {
  return (
    <Screen scroll edges={['top', 'bottom']} padding={24}>
      <TopBar back title="Component gallery" trailing={<View style={styles.spacer} />} />

      <Block title="Type">
        <Text variant="display" style={styles.mt}>
          Display
        </Text>
        <Text variant="title">Title — a heading</Text>
        <Text variant="subheading">Subheading</Text>
        <Text variant="body" tone="secondary">
          Body text in the secondary tone.
        </Text>
        <Text variant="caption" tone="muted">
          Caption / muted text.
        </Text>
      </Block>

      <Block title="Buttons">
        <Button label="Primary" block onPress={() => router.back()} />
        <View style={styles.gap10} />
        <Button label="Secondary" variant="secondary" block />
        <View style={styles.gap10} />
        <Button label="Ghost" variant="ghost" block />
        <View style={styles.gap10} />
        <Row style={styles.gapRow}>
          <Button label="With icon" icon="add" tint={Colors.success} style={{ flex: 1 }} />
          <View style={styles.gap10} />
          <Button label="Disabled" variant="secondary" disabled style={{ flex: 1 }} />
        </Row>
      </Block>

      <Block title="Chips">
        <Row style={styles.gapRow}>
          <Chip label="On" on tint={Colors.primary} />
          <Chip label="Off" />
          <Chip label="Success" icon="checkmark" on tint={Colors.success} />
        </Row>
      </Block>

      <Block title="Rings">
        <Row style={styles.ringRow}>
          <View style={styles.ringCol}>
            <Ring size={64} stroke={6} progress={0.85} color={Colors.energy}>
              <Icon name="flash" size={22} color={Colors.energy} />
            </Ring>
            <Text variant="caption" tone="secondary">
              85%
            </Text>
          </View>
          <View style={styles.ringCol}>
            <Ring size={64} stroke={6} progress={0.5} color={Colors.primary}>
              <Icon name="water" size={22} color={Colors.primary} />
            </Ring>
            <Text variant="caption" tone="secondary">
              50%
            </Text>
          </View>
          <View style={styles.ringCol}>
            <Ring size={64} stroke={6} progress={1} color={Colors.success}>
              <Icon name="checkmark" size={22} color={Colors.success} />
            </Ring>
            <Text variant="caption" tone="secondary">
              100%
            </Text>
          </View>
          <View style={styles.ringCol}>
            <Ring size={64} stroke={6} progress={0.25} color={Colors.danger}>
              <Icon name="warning" size={22} color={Colors.danger} />
            </Ring>
            <Text variant="caption" tone="secondary">
              25%
            </Text>
          </View>
        </Row>
      </Block>

      <Block title="Temperature control (swipe)">
        <Card>
          <TemperatureControl steps={[34, 36, 38, 40, 42, 44]} value={40} accent={Colors.primary} />
        </Card>
      </Block>

      <Block title="Bar chart">
        <Card>
          <BarChart
            data={[
              { label: 'M', value: 60 },
              { label: 'T', value: 45 },
              { label: 'W', value: 72 },
              { label: 'T', value: 55 },
              { label: 'F', value: 80 },
              { label: 'S', value: 38 },
              { label: 'S', value: 66 },
            ]}
            height={120}
            color={Colors.success}
            activeIndex={4}
          />
        </Card>
      </Block>

      <Block title="Card + badge">
        <Card style={styles.demoCard}>
          <Row style={styles.demoRow}>
            <View style={[styles.demoTile, { backgroundColor: `${Colors.primary}1F` }]}>
              <Icon name="home" size={20} color={Colors.primary} />
            </View>
            <Text variant="subheading" style={styles.flex}>
              Sample card
            </Text>
            <Text variant="label" style={{ color: Colors.success }}>
              Active
            </Text>
          </Row>
        </Card>
      </Block>
    </Screen>
  );
}

const styles = StyleSheet.create({
  spacer: { width: 40 },
  blockLabel: { letterSpacing: 1, marginTop: 26, marginBottom: 12 },
  blockBody: { gap: 6 },
  gap10: { height: 10 },
  gapRow: { gap: 10 },
  ringRow: { gap: 22, justifyContent: 'space-between' },
  ringCol: { alignItems: 'center', gap: 8 },
  mt: { marginBottom: 4 },
  demoCard: { padding: 16 },
  demoRow: { gap: 12 },
  demoTile: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
});
