import { Link, router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';
import { Screen, TopBar } from '@/components/Screen';
import { Card, Icon, Row, Text, type IconName } from '@/components/ui';
import { accountSections } from '@/data/mock';

function Badge({ label, tone }: { label: string; tone?: string }) {
  const color = tone ?? Colors.textSecondary;
  return (
    <Row style={[styles.badge, { backgroundColor: `${color}1F`, borderColor: `${color}44` }]}>
      <Text variant="label" style={{ color }}>
        {label}
      </Text>
    </Row>
  );
}

function Section({ section, index }: { section: (typeof accountSections)[number]; index: number }) {
  return (
    <Animated.View entering={FadeInUp.delay(40 + index * 60).springify()}>
      <Card>
        <Row style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: `${Colors.primary}1A` }]}>
            <Icon name={section.icon as IconName} size={20} color={Colors.primary} />
          </View>
          <Text variant="subheading">{section.title}</Text>
        </Row>
        {section.items.map((item, i) => (
          <Row key={item.label} style={[styles.itemRow, i > 0 && { borderTopWidth: 1, borderTopColor: Colors.surfaceStroke }]}>
            <Text variant="body" tone="secondary" style={styles.itemLabel}>
              {item.label}
            </Text>
            <View style={styles.itemRight}>
              {item.badge ? <Badge label={item.badge} tone={item.badge.includes('…') ? Colors.energy : Colors.success} /> : null}
              <Text variant="body" tone={item.badge ? 'secondary' : 'primary'}>
                {item.value}
              </Text>
            </View>
          </Row>
        ))}
      </Card>
    </Animated.View>
  );
}

export default function AccountScreen() {
  return (
    <Screen scroll edges={['top', 'left', 'right']} padding={24}>
      <TopBar title="Account" trailing={<View style={styles.spacer} />} />

      <Animated.View entering={FadeInUp.springify()}>
        <Card style={styles.profile}>
          <View style={styles.avatar}>
            <Text variant="subheading">AK</Text>
          </View>
          <View style={styles.profileText}>
            <Text variant="subheading">Arnav</Text>
            <Text variant="caption" tone="secondary">
              Personal account · Kohler Konnect
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color={Colors.textMuted} />
        </Card>
      </Animated.View>

      <View style={styles.list}>
        {accountSections.map((s, i) => (
          <Section key={s.id} section={s} index={i} />
        ))}
      </View>

      <View style={styles.foot}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/onboarding')}
          style={({ pressed }) => [styles.footBtn, { opacity: pressed ? 0.7 : 1 }]}>
          <Icon name="refresh" size={18} color={Colors.textSecondary} />
          <Text variant="caption" tone="secondary" style={styles.footBtnText}>
            Start over
          </Text>
        </Pressable>

        <Link href="/gallery" asChild>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.footBtn, { opacity: pressed ? 0.7 : 1 }]}>
            <Icon name="apps-outline" size={18} color={Colors.textSecondary} />
            <Text variant="caption" tone="secondary" style={styles.footBtnText}>
              Component gallery
            </Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  spacer: { width: 40 },
  profile: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14, marginBottom: 20 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  profileText: { flex: 1 },
  list: { gap: 14 },
  sectionHeader: { gap: 12, marginBottom: 6 },
  sectionIcon: { width: 38, height: 38, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  itemRow: { paddingVertical: 14, alignItems: 'center' },
  itemLabel: { flex: 1 },
  itemRight: { gap: 8, alignItems: 'flex-end' },
  badge: { flexDirection: 'row', paddingVertical: 3, paddingHorizontal: 8, borderRadius: Radius.full, borderWidth: 1 },
  foot: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 28 },
  footBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: Colors.surface, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.surfaceStroke, paddingVertical: 10, paddingHorizontal: 16 },
  footBtnText: { fontWeight: '600' },
});
