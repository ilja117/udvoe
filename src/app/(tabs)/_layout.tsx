import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Redirect } from '../../redirect';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useT } from '../../i18n';
import { useStore } from '../../store';
import { C } from '../../theme';

function TabBar() {
  const ins = useSafeAreaInsets();
  const { t } = useT();
  const path = usePathname();
  const active = path === '/hint' ? 'hint' : path === '/profile' ? 'profile' : 'index';
  const go = (name: string) => router.navigate(name === 'index' ? '/' : `/${name}`);
  const side = (name: string, label: string, icon: 'grid-outline' | 'person-outline') => (
    <Pressable style={st.side} onPress={() => go(name)} accessibilityRole="tab" accessibilityState={{ selected: active === name }}>
      <Ionicons name={icon} size={24} color={active === name ? C.gold : C.muted} />
      <Text style={[st.sideText, active === name && { color: C.gold }]}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={[st.bar, { paddingBottom: Math.max(ins.bottom, 10) }]}>
      {side('index', t('menu'), 'grid-outline')}
      <Pressable
        style={[st.pill, active === 'hint' && { borderColor: C.accentEdge }]}
        onPress={() => go('hint')}
        accessibilityRole="tab"
        accessibilityState={{ selected: active === 'hint' }}>
        <View style={st.pillIcon}>
          <Ionicons name="heart-outline" size={18} color={C.gold} />
        </View>
        <Text style={st.pillText}>{t('hint')}</Text>
      </Pressable>
      {side('profile', t('profile'), 'person-outline')}
    </View>
  );
}

export default function TabsLayout() {
  const { s } = useStore();
  if (!s.onboarded) return <Redirect href="/onboarding" />;
  return (
    <Tabs screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: C.bg } }} tabBar={() => <TabBar />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="hint" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const st = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.borderSoft,
    paddingTop: 10,
    paddingHorizontal: 28,
  },
  side: { alignItems: 'center', minWidth: 72, minHeight: 44, justifyContent: 'center' },
  sideText: { color: C.muted, fontSize: 11, marginTop: 3 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.iconBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 6,
    paddingLeft: 7,
    paddingRight: 18,
  },
  pillIcon: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  pillText: { color: C.accent, fontSize: 15, fontWeight: '700' },
});
