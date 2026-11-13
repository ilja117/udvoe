import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SECTIONS } from '../../data';
import { useT } from '../../i18n';
import { levelInfo, pointsOf, useStore } from '../../store';
import { APP_NAME, C } from '../../theme';
import { Card, Grid, Screen, Tile } from '../../ui';

export default function Home() {
  const { s } = useStore();
  const { t, tr } = useT();
  const pts = pointsOf(s);
  const lv = levelInfo(pts);
  return (
    <Screen>
      <Text style={st.logo}>{APP_NAME}</Text>
      <Card>
        <View style={st.lvRow}>
          <Text style={st.lvName}>
            {lv.cur.emoji} {t(lv.cur.key)}
          </Text>
          <Text style={st.lvPts}>✦ {pts}</Text>
        </View>
        <View style={st.track}>
          <View style={[st.fill, { width: `${Math.round(lv.progress * 100)}%` }]} />
        </View>
        <Text style={st.lvNext}>{lv.next ? `${t('toNext')} · ${lv.left} ✦` : t('maxLevel')}</Text>
      </Card>
      {!s.premium && <Text style={st.note}>{t('freeNote')}</Text>}
      <Grid>
        {SECTIONS.map((sec) => (
          <Tile key={sec.id} title={tr(sec.title)} sub={tr(sec.sub)} ion={sec.ion} onPress={() => router.push(`/section/${sec.id}`)} />
        ))}
      </Grid>
    </Screen>
  );
}

const st = StyleSheet.create({
  logo: { color: C.text, fontSize: 34, fontWeight: '300', fontStyle: 'italic', textAlign: 'center', marginTop: 18, marginBottom: 22, letterSpacing: 1 },
  lvRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lvName: { color: C.accent, fontSize: 18, fontWeight: '700' },
  lvPts: { color: C.gold, fontSize: 18, fontWeight: '700' },
  track: { height: 8, borderRadius: 4, backgroundColor: C.cardHi, marginVertical: 12, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: C.accent },
  lvNext: { color: C.muted, fontSize: 15 },
  note: { color: C.accent, opacity: 0.8, fontSize: 14.5, lineHeight: 20, textAlign: 'center', marginBottom: 18, paddingHorizontal: 20 },
});
