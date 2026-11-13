import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { findCat } from '../../../../data';
import { useT } from '../../../../i18n';
import { useStore } from '../../../../store';
import { C } from '../../../../theme';
import { Btn, Card, Screen, st as ui } from '../../../../ui';

export default function ItemScreen() {
  const { sid, cid, idx } = useLocalSearchParams<{ sid: string; cid: string; idx: string }>();
  const cat = findCat(sid, cid);
  const n = Number(idx);
  const it = cat?.items?.[n];
  const { s, set } = useStore();
  const { t, tr } = useT();
  if (!cat || !it) return <Screen title="" back children={null} />;
  const key = `${sid}/${cid}/${n}`;
  const done = !!s.done[key];
  return (
    <Screen title={tr(cat.title)} back>
      <Text style={st.t}>{it.t}</Text>
      <Text style={[ui.p, { marginBottom: 18 }]}>{it.d}</Text>
      {it.steps?.map((step, k) => (
        <Card key={k} style={st.step}>
          <View style={st.num}>
            <Text style={st.numT}>{k + 1}</Text>
          </View>
          <Text style={st.stepT}>{step}</Text>
        </Card>
      ))}
      <Btn
        kind={done ? 'ghost' : 'primary'}
        label={done ? `✓ ${t('done')}` : `${t('markDone')} · +1 ✦`}
        style={{ marginTop: 8 }}
        onPress={() => {
          if (!done) set((p) => ({ done: { ...p.done, [key]: true } }));
          router.back();
        }}
      />
    </Screen>
  );
}

const st = StyleSheet.create({
  t: { color: C.text, fontSize: 26, fontWeight: '700', marginBottom: 8 },
  step: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 10, padding: 14 },
  num: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.iconBg, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  numT: { color: C.gold, fontWeight: '700', fontSize: 13 },
  stepT: { color: C.text, fontSize: 16, lineHeight: 23, flex: 1 },
});
