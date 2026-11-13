import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useGuard } from '../../../access';
import { findCat } from '../../../data';
import { FREE_ITEMS } from '../../../data/types';
import { useT } from '../../../i18n';
import { useStore } from '../../../store';
import { C, R } from '../../../theme';
import { Btn, PremiumBadge, Screen, st as ui } from '../../../ui';

export default function CatScreen() {
  const { sid, cid } = useLocalSearchParams<{ sid: string; cid: string }>();
  const cat = findCat(sid, cid);
  const { s, set } = useStore();
  const { t, tr } = useT();
  const guard = useGuard();
  if (!cat) return <Screen title="" back children={null} />;

  // The course asks once who is reading; the answer stays on this phone.
  if (sid === 'sexology' && cid === 'course' && !s.focus) {
    return (
      <Screen title={t('focusTitle')} back>
        <Text style={[ui.h2, { fontSize: 26, marginBottom: 10 }]}>{t('focusQ')}</Text>
        <Text style={[ui.p, { marginBottom: 20 }]}>{t('focusS')}</Text>
        <Btn kind="ghost" label={t('man')} onPress={() => set({ focus: 'm' })} style={st.choice} />
        <Btn kind="ghost" label={t('woman')} onPress={() => set({ focus: 'f' })} style={st.choice} />
      </Screen>
    );
  }

  return (
    <Screen title={tr(cat.title)} back sub={tr(cat.sub)}>
      {(cat.items ?? []).map((it, idx) => {
        const locked = !s.premium && idx >= FREE_ITEMS;
        const done = !!s.done[`${sid}/${cid}/${idx}`];
        return (
          <Pressable
            key={idx}
            style={({ pressed }) => [st.item, pressed && { opacity: 0.75 }]}
            accessibilityRole="button"
            onPress={() => guard(locked, () => router.push(`/item/${sid}/${cid}/${idx}`))}>
            <View style={{ flex: 1 }}>
              <Text style={[st.t, locked && { color: C.muted }]}>{it.t}</Text>
              <Text style={[st.d, locked && { color: C.dim }]} numberOfLines={2}>
                {it.d}
              </Text>
            </View>
            {locked ? <PremiumBadge /> : <Ionicons name={done ? 'checkmark-circle' : 'chevron-forward'} size={done ? 24 : 18} color={done ? C.gold : C.muted} />}
          </Pressable>
        );
      })}
    </Screen>
  );
}

const st = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: R.card, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 12 },
  t: { color: C.text, fontSize: 17, fontWeight: '700' },
  d: { color: C.muted, fontSize: 14, lineHeight: 20, marginTop: 4 },
  choice: { alignItems: 'flex-start', marginBottom: 10 },
});
