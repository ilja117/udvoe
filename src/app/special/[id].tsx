import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Redirect } from '../../redirect';
import React, { useEffect, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { findCat } from '../../data';
import { MINI_TASKS, MOODS, SENTENCES, SENTENCE_GAP_MS } from '../../data/closeness';
import { useT } from '../../i18n';
import { today, useStore } from '../../store';
import { C, R } from '../../theme';
import { Btn, Card, Screen, st as ui } from '../../ui';

const pad = (n: number) => String(n).padStart(2, '0');
const dkey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function Mini() {
  const { s, set } = useStore();
  const { t } = useT();
  const day = today();
  // Three tasks a day, rotating through the list by day number.
  const base = Math.floor(new Date(day).getTime() / 86400000) * 3;
  const tasks = [0, 1, 2].map((k) => (base + k) % MINI_TASKS.length);
  const done = s.mini[day] ?? [];
  const toggle = (k: number) =>
    set((p) => {
      const cur = p.mini[day] ?? [];
      return { mini: { ...p.mini, [day]: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k] } };
    });
  return (
    <>
      <Text style={[ui.h2, { marginBottom: 14 }]}>
        {t('todayTasks')} · {done.length}/3
      </Text>
      {tasks.map((ti, k) => {
        const on = done.includes(k);
        return (
          <Pressable key={k} style={st.task} onPress={() => toggle(k)} accessibilityRole="checkbox" accessibilityState={{ checked: on }}>
            <Ionicons name={on ? 'checkbox' : 'square-outline'} size={26} color={on ? C.gold : C.muted} />
            <Text style={[st.taskT, on && { color: C.muted, textDecorationLine: 'line-through' }]}>{MINI_TASKS[ti]}</Text>
          </Pressable>
        );
      })}
      {done.length === 3 && (
        <Card style={{ alignItems: 'center', marginTop: 8 }}>
          <Text style={[ui.p, { marginBottom: 12 }]}>{t('rateDay')}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable
                key={n}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={`${n}`}
                onPress={() => set((p) => ({ miniRate: { ...p.miniRate, [day]: n } }))}>
                <Ionicons name={(s.miniRate[day] ?? 0) >= n ? 'heart' : 'heart-outline'} size={34} color={C.accent} />
              </Pressable>
            ))}
          </View>
        </Card>
      )}
    </>
  );
}

function Sentence() {
  const { s, set } = useStore();
  const { t } = useT();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  // First visit starts the clock on the first sentence.
  useEffect(() => {
    if (!s.sentence.at) set({ sentence: { idx: 0, at: Date.now() } });
  }, [s.sentence.at, set]);
  const left = Math.max(0, s.sentence.at + SENTENCE_GAP_MS - now);
  const text = SENTENCES[s.sentence.idx % SENTENCES.length];
  const mins = Math.ceil(left / 60000);
  return (
    <>
      <Card style={st.sentence}>
        <Text style={st.sentenceT}>«{text}»</Text>
      </Card>
      <Text style={[ui.p, { textAlign: 'center', marginBottom: 16 }]}>{t('sentenceHint')}</Text>
      <Btn label={t('send')} onPress={() => Share.share({ message: text }).catch(() => {})} />
      <Btn
        kind="ghost"
        style={{ marginTop: 10 }}
        disabled={left > 0}
        label={left > 0 ? `${t('sentenceNext')} ${Math.floor(mins / 60)}:${pad(mins % 60)}` : t('sentenceNew')}
        onPress={() => {
          set((p) => ({ sentence: { idx: (p.sentence.idx + 1) % SENTENCES.length, at: Date.now() } }));
          setNow(Date.now());
        }}
      />
    </>
  );
}

function Calendar() {
  const { s, set } = useStore();
  const { t, lang } = useT();
  const [mode, setMode] = useState<'mood' | 'cycle'>('mood');
  const [ym, setYm] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const first = (new Date(ym.y, ym.m, 1).getDay() + 6) % 7; // Monday-first offset
  const days = new Date(ym.y, ym.m + 1, 0).getDate();
  const title = new Date(ym.y, ym.m, 1).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'ru' ? 'ru-RU' : 'uk-UA', { month: 'long', year: 'numeric' });
  const shift = (d: number) => setYm(({ y, m }) => ({ y: m + d < 0 ? y - 1 : m + d > 11 ? y + 1 : y, m: (m + d + 12) % 12 }));
  const tap = (k: string) =>
    set((p) => {
      if (mode === 'cycle') {
        const c = { ...p.cycle };
        if (c[k]) delete c[k];
        else c[k] = true;
        return { cycle: c };
      }
      const m = { ...p.mood };
      const next = (m[k] ?? -1) + 1;
      if (next >= MOODS.length) delete m[k];
      else m[k] = next;
      return { mood: m };
    });

  // Estimate: 28 days after the first day of the most recent marked period.
  const marked = Object.keys(s.cycle).sort();
  let nextStart: string | null = null;
  if (marked.length) {
    let start = marked[marked.length - 1];
    for (let k = marked.length - 2; k >= 0; k--) {
      if ((new Date(start).getTime() - new Date(marked[k]).getTime()) / 86400000 <= 1.5) start = marked[k];
      else break;
    }
    const d = new Date(new Date(start).getTime() + 28 * 86400000);
    nextStart = `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
  }

  return (
    <>
      <View style={st.seg}>
        {(['mood', 'cycle'] as const).map((m) => (
          <Pressable key={m} style={[st.segBtn, mode === m && st.segOn]} onPress={() => setMode(m)} accessibilityRole="tab" accessibilityState={{ selected: mode === m }}>
            <Text style={[st.segT, mode === m && { color: C.onAccent }]}>{t(m)}</Text>
          </Pressable>
        ))}
      </View>
      <Card>
        <View style={st.calHead}>
          <Pressable hitSlop={12} onPress={() => shift(-1)} accessibilityRole="button" accessibilityLabel="Previous month">
            <Ionicons name="chevron-back" size={22} color={C.gold} />
          </Pressable>
          <Text style={st.calTitle}>{title}</Text>
          <Pressable hitSlop={12} onPress={() => shift(1)} accessibilityRole="button" accessibilityLabel="Next month">
            <Ionicons name="chevron-forward" size={22} color={C.gold} />
          </Pressable>
        </View>
        <View style={st.calGrid}>
          {Array.from({ length: first }).map((_, k) => (
            <View key={`e${k}`} style={st.day} />
          ))}
          {Array.from({ length: days }).map((_, k) => {
            const key = dkey(ym.y, ym.m, k + 1);
            const period = !!s.cycle[key];
            const mood = s.mood[key];
            return (
              <Pressable key={key} style={st.day} onPress={() => tap(key)} accessibilityRole="button" accessibilityLabel={key}>
                <View style={[st.dayIn, mode === 'cycle' && period && { backgroundColor: '#7A2A3C', borderColor: '#D0507A' }, key === today() && { borderColor: C.accent }]}>
                  <Text style={st.dayN}>{k + 1}</Text>
                  {mode === 'mood' && mood != null ? <Text style={{ fontSize: 13 }}>{MOODS[mood]}</Text> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Card>
      <Text style={[ui.p, { textAlign: 'center' }]}>{t(mode === 'mood' ? 'calMoodS' : 'calCycleS')}</Text>
      {mode === 'cycle' && nextStart && (
        <Text style={[ui.p, { textAlign: 'center', color: C.gold, marginTop: 10 }]}>
          {t('cycleNext')}: {nextStart}
        </Text>
      )}
    </>
  );
}

export default function SpecialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { s } = useStore();
  const { tr } = useT();
  const cat = findCat('closeness', id);
  if (!cat) return <Screen title="" back children={null} />;
  if (cat.premium && !s.premium) return <Redirect href="/profile" />;
  return (
    <Screen title={tr(cat.title)} back>
      {id === 'mini' && <Mini />}
      {id === 'sentence' && <Sentence />}
      {id === 'calendar' && <Calendar />}
    </Screen>
  );
}

const st = StyleSheet.create({
  task: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.card, padding: 16, marginBottom: 12 },
  taskT: { color: C.text, fontSize: 16.5, lineHeight: 23, flex: 1 },
  sentence: { minHeight: 200, alignItems: 'center', justifyContent: 'center', padding: 26 },
  sentenceT: { color: C.text, fontSize: 24, lineHeight: 34, textAlign: 'center', fontWeight: '600' },
  seg: { flexDirection: 'row', backgroundColor: C.card, borderRadius: R.btn, borderWidth: 1, borderColor: C.border, padding: 4, marginBottom: 16 },
  segBtn: { flex: 1, minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: C.accent },
  segT: { color: C.muted, fontWeight: '700', fontSize: 15 },
  calHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calTitle: { color: C.text, fontSize: 17, fontWeight: '700' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  day: { width: `${100 / 7}%`, aspectRatio: 0.9, padding: 2 },
  dayIn: { flex: 1, borderRadius: 10, borderWidth: 1, borderColor: C.borderSoft, alignItems: 'center', justifyContent: 'center' },
  dayN: { color: C.text, fontSize: 13 },
});
