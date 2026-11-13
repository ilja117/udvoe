import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, R } from './theme';

export type IonName = React.ComponentProps<typeof Ionicons>['name'];

export function Screen({
  title,
  back,
  sub,
  children,
  scroll = true,
  pad = true,
}: {
  title?: string;
  back?: boolean;
  sub?: string;
  children: React.ReactNode;
  scroll?: boolean;
  pad?: boolean;
}) {
  const ins = useSafeAreaInsets();
  const body = (
    <>
      {title != null && (
        <View style={st.header}>
          {back && (
            <Pressable
              style={st.backBtn}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Back"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
              <Ionicons name="chevron-back" size={22} color={C.gold} />
            </Pressable>
          )}
          <Text style={st.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
      {sub ? <Text style={st.sub}>{sub}</Text> : null}
      {children}
    </>
  );
  const padStyle = { paddingTop: ins.top + 12, paddingBottom: ins.bottom + 24, paddingHorizontal: pad ? 16 : 0 };
  return (
    <View style={st.root}>
      {scroll ? (
        <ScrollView contentContainerStyle={padStyle} showsVerticalScrollIndicator={false}>
          {body}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, padStyle]}>{body}</View>
      )}
    </View>
  );
}

export function IconCircle({ ion, emoji, size = 48, dim }: { ion?: IonName; emoji?: string; size?: number; dim?: boolean }) {
  return (
    <View style={[st.iconCircle, { width: size, height: size, borderRadius: size / 2, opacity: dim ? 0.45 : 1 }]}>
      {emoji ? (
        <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
      ) : (
        <Ionicons name={ion ?? 'ellipse-outline'} size={size * 0.54} color={C.gold} />
      )}
    </View>
  );
}

export function PremiumBadge() {
  return (
    <View style={st.badge}>
      <Ionicons name="lock-closed" size={11} color={C.gold} />
      <Text style={st.badgeText}>Premium</Text>
    </View>
  );
}

export function Tile({
  title,
  sub,
  tag,
  ion,
  emoji,
  locked,
  onPress,
}: {
  title: string;
  sub?: string;
  tag?: string;
  ion?: IonName;
  emoji?: string;
  locked?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [st.tile, pressed && st.pressed]} onPress={onPress} accessibilityRole="button">
      {locked && (
        <View style={st.badgePos}>
          <PremiumBadge />
        </View>
      )}
      <IconCircle ion={ion} emoji={emoji} dim={locked} />
      <Text style={[st.tileTitle, locked && { color: C.muted }]}>{title}</Text>
      {sub ? (
        <Text style={[st.tileSub, locked && { color: C.dim }]} numberOfLines={2}>
          {sub}
        </Text>
      ) : null}
      {tag ? <Text style={st.tileTag}>{tag}</Text> : null}
    </Pressable>
  );
}

export function Grid({ children }: { children: React.ReactNode }) {
  return <View style={st.grid}>{children}</View>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[st.card, style]}>{children}</View>;
}

export function Btn({
  label,
  onPress,
  kind = 'primary',
  disabled,
  style,
  textStyle,
}: {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}) {
  const primary = kind === 'primary';
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        st.btn,
        primary ? st.btnPrimary : st.btnGhost,
        disabled && { opacity: 0.4 },
        pressed && st.pressed,
        style,
      ]}>
      <Text style={[st.btnText, { color: primary ? C.onAccent : C.text }, textStyle]}>{label}</Text>
    </Pressable>
  );
}

export function Row({ label, value, onPress, last }: { label: string; value?: string; onPress: () => void; last?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[st.row, !last && st.rowLine]} accessibilityRole="button">
      <Text style={st.rowLabel}>{label}</Text>
      {value ? <Text style={st.rowValue}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={18} color={C.muted} />
    </Pressable>
  );
}

export const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  backBtn: {
    position: 'absolute',
    left: 0,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.iconBg,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  title: { color: C.text, fontSize: 24, fontWeight: '700', paddingHorizontal: 52 },
  sub: { color: C.muted, fontSize: 17, lineHeight: 24, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 },
  tile: {
    width: '48%',
    minHeight: 158,
    backgroundColor: C.card,
    borderRadius: R.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 22,
  },
  tileTitle: { color: C.text, fontSize: 16.5, fontWeight: '700', marginTop: 12, textAlign: 'center' },
  tileSub: { color: C.muted, fontSize: 12.5, lineHeight: 17, marginTop: 6, textAlign: 'center' },
  tileTag: { color: C.accent, fontSize: 10.5, fontWeight: '700', letterSpacing: 1, marginTop: 8 },
  badgePos: { position: 'absolute', top: 8, right: 8, zIndex: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.card,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { color: C.gold, fontSize: 11, fontWeight: '600' },
  iconCircle: { backgroundColor: C.iconBg, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: C.card, borderRadius: R.card, borderWidth: 1, borderColor: C.border, padding: 18, marginBottom: 16 },
  btn: { minHeight: 54, borderRadius: R.btn, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, borderWidth: 1 },
  btnPrimary: { backgroundColor: C.accent, borderColor: C.accentEdge },
  btnGhost: { backgroundColor: C.card, borderColor: C.border },
  btnText: { fontSize: 16.5, fontWeight: '700', textAlign: 'center' },
  pressed: { opacity: 0.75 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 60, gap: 10 },
  rowLine: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.borderSoft },
  rowLabel: { color: C.text, fontSize: 17, fontWeight: '600', flex: 1 },
  rowValue: { color: C.gold, fontSize: 14.5, fontWeight: '600' },
  h2: { color: C.text, fontSize: 20, fontWeight: '700', marginBottom: 6 },
  p: { color: C.muted, fontSize: 16, lineHeight: 23 },
});
