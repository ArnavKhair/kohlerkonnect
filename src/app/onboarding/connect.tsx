import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';
import { StepBar } from '@/components/Onboard';
import { Screen } from '@/components/Screen';
import { Button, Card, Icon, Row, Text, type IconName } from '@/components/ui';

type Device = {
  icon: IconName;
  name: string;
  room: string;
  state: 'connected' | 'updating';
};

const devices: Device[] = [
  { icon: 'water-outline', name: 'Anthem+ Shower', room: 'Bathroom', state: 'connected' },
  { icon: 'sparkles-outline', name: 'Shore Bathtub', room: 'Bathroom', state: 'connected' },
  { icon: 'home-outline', name: 'Smart Wall · Mirror', room: 'Bathroom', state: 'connected' },
  { icon: 'thermometer-outline', name: 'PureWarmth Toilet', room: 'Bathroom', state: 'updating' },
  { icon: 'restaurant-outline', name: 'Smart Faucet', room: 'Kitchen', state: 'connected' },
];

function StatusPill({ state }: { state: Device['state'] }) {
  const on = state === 'connected';
  return (
    <Row style={[styles.pill, { backgroundColor: on ? `${Colors.success}1F` : `${Colors.energy}1F`, borderColor: on ? Colors.success : Colors.energy }]}>
      <View style={[styles.dot, { backgroundColor: on ? Colors.success : Colors.energy }]} />
      <Text variant="label" tone="secondary" style={{ color: on ? Colors.success : Colors.energy }}>
        {on ? 'Connected' : 'Updating…'}
      </Text>
    </Row>
  );
}

export default function ConnectDevices() {
  return (
    <Screen scroll padding={28}>
      <StepBar step={3} total={4} />
      <Text variant="title">Connect your Kohler devices</Text>
      <Text variant="body" tone="secondary" style={styles.copy}>
        We found these near your network. Everything is shown as ready for this prototype.
      </Text>

      <View style={styles.list}>
        {devices.map((d, i) => (
          <Animated.View key={d.name} entering={FadeInUp.delay(i * 60).springify()}>
            <Card style={styles.device}>
              <View style={[styles.tile, { backgroundColor: `${Colors.primary}1A` }]}>
                <Icon name={d.icon} size={22} color={Colors.primary} />
              </View>
              <View style={styles.deviceText}>
                <Text variant="subheading">{d.name}</Text>
                <Text variant="caption" tone="secondary">
                  {d.room}
                </Text>
              </View>
              <StatusPill state={d.state} />
            </Card>
          </Animated.View>
        ))}
      </View>

      <Button label="Scan for more" icon="scan-outline" variant="secondary" block />
      <View style={styles.gap12} />
      <Button label="Continue" block onPress={() => router.push('/onboarding/other')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { marginTop: 6, marginBottom: 20 },
  list: { gap: 12 },
  device: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  tile: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  deviceText: { flex: 1 },
  pill: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: Radius.full, borderWidth: 1 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  gap12: { height: 12 },
});
