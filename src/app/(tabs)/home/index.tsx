import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Pressable, StyleSheet, View } from 'react-native';

import * as Haptics from 'expo-haptics';

import { Colors, Radius } from '@/constants/theme';
import { Ring } from '@/components/Ring';
import { Screen } from '@/components/Screen';
import { Card, Icon, Row, Text, type IconName } from '@/components/ui';
import { rooms } from '@/data/mock';

function DialBadge({ value, unit, accent }: { value: number; unit: string; accent: string }) {
  return (
    <View style={[styles.dial, { backgroundColor: accent }]}>
      <Text variant="hero" style={{ color: '#FFFFFF', fontSize: 30, lineHeight: 34 }}>
        {value}
      </Text>
      <Text style={{ color: '#FFFFFFAA', fontSize: 12, marginTop: 2 }}>{unit}</Text>
    </View>
  );
}

function RingStat({ label, icon, progress, color }: { label: string; icon: IconName; progress: number; color: string }) {
  return (
    <View style={styles.ringStat}>
      <Ring size={58} stroke={5} progress={progress} color={color}>
        <Icon name={icon} size={22} color={color} />
      </Ring>
      <Text variant="caption" tone="secondary" style={styles.ringLabel}>
        {label}
      </Text>
    </View>
  );
}

function RoomCard({ room, index }: { room: (typeof rooms)[number]; index: number }) {
  return (
    <Animated.View entering={FadeInUp.delay(index * 70).springify()}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(`/home/room/${room.id}`)}
        style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.985 : 1 }], opacity: pressed ? 0.9 : 1 }]}>
        <Card style={styles.card}>
          <Row style={styles.cardTop}>
            <Row style={styles.roomName}>
              <Icon name={room.icon as IconName} size={20} color={room.accent} />
              <Text variant="subheading">{room.name}</Text>
            </Row>
            <Text variant="caption" tone="secondary">
              {room.headline}
            </Text>
          </Row>

          <View style={styles.cardBody}>
            <DialBadge value={room.value} unit={room.unit} accent={room.accent} />
            <Row style={styles.rings}>
              <RingStat label={room.energyLabel} icon="flash" progress={room.energy} color={Colors.energy} />
              <RingStat label={room.status} icon={room.statusIcon as IconName} progress={1} color={Colors.text} />
            </Row>
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  return (
    <Screen scroll edges={['top', 'left', 'right']} padding={24} style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text variant="label" tone="secondary">
            YOUR HOME
          </Text>
          <Text variant="title" style={styles.title}>
            Good evening
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/account')}
          hitSlop={10}
          style={({ pressed }) => [styles.gear, { opacity: pressed ? 0.5 : 1 }]}>
          <Icon name="settings-outline" size={22} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.list}>
        {rooms.map((room, i) => (
          <RoomCard key={room.id} room={room} index={i} />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        style={({ pressed }) => [styles.fab, { transform: [{ scale: pressed ? 0.92 : 1 }], opacity: pressed ? 0.9 : 1 }]}>
        <Icon name="add" size={26} color={Colors.text} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 },
  title: { marginTop: 2 },
  list: { gap: 16 },
  card: { padding: 20 },
  cardTop: { justifyContent: 'space-between', alignItems: 'center' },
  roomName: { gap: 9 },
  cardBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 },
  dial: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center' },
  rings: { gap: 22 },
  ringStat: { alignItems: 'center', gap: 8 },
  ringLabel: { textAlign: 'center' },
  gear: { backgroundColor: Colors.controlInactive, borderRadius: Radius.full, width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.surfaceStroke,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
});
