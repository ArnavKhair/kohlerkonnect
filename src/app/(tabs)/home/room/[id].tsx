import { Redirect, router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { Screen, TopBar } from '@/components/Screen';
import { Card, Icon, Text, type IconName } from '@/components/ui';
import { products, roomProducts, rooms } from '@/data/mock';

const productIcon: Record<string, IconName> = {
  shower: 'water-outline',
  tub: 'sparkles-outline',
  vanity: 'bulb-outline',
  toilet: 'home-outline',
  faucet: 'restaurant-outline',
};

function ProductRow({ pid, index }: { pid: string; index: number }) {
  const p = products[pid];
  if (!p) return null;
  return (
    <Animated.View entering={FadeInUp.delay(40 + index * 60).springify()}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(`/home/product/${p.id}`)}
        style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.985 : 1 }], opacity: pressed ? 0.9 : 1 }]}>
        <Card style={styles.row}>
          <View style={[styles.tile, { backgroundColor: `${p.accent}1F` }]}>
            <Icon name={productIcon[p.id] ?? 'home-outline'} size={22} color={p.accent} />
          </View>
          <View style={styles.rowText}>
            <Text variant="subheading">{p.name}</Text>
            <Text variant="caption" tone="secondary">
              {p.blurb}
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color={Colors.textMuted} />
        </Card>
      </Pressable>
    </Animated.View>
  );
}

export default function RoomDetail() {
  const { id } = useLocalSearchParams();
  const room = rooms.find((r) => r.id === id);
  if (!room) return <Redirect href="/home" />;

  const productIds = roomProducts[room.id] ?? [];

  return (
    <Screen scroll edges={['top', 'left', 'right']} padding={24}>
      <TopBar back title={room.name} accent={room.accent} trailing={<View style={styles.barSpacer} />} />

      <Text variant="label" tone="secondary" style={styles.sectionLabel}>
        DEVICES IN {room.name.toUpperCase()}
      </Text>

      <View style={styles.list}>
        {productIds.map((pid, i) => (
          <ProductRow key={pid} pid={pid} index={i} />
        ))}
      </View>

      <View style={styles.hint}>
        <Text variant="caption" tone="muted">
          Tap a device to open its quick controls and routines.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { letterSpacing: 1, marginBottom: 14 },
  list: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  tile: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  barSpacer: { width: 40 },
  hint: { marginTop: 18, alignItems: 'center' },
});
