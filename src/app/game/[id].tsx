import { useLocalSearchParams } from 'expo-router';
import { Redirect } from '../../redirect';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { findCat } from '../../data';
import { GAMES, Game } from '../../data/games';
import { useT } from '../../i18n';
import { useStore } from '../../store';
import { C, R } from '../../theme';
import { Btn, Card, Screen } from '../../ui';

const rnd = (n: number) => Math.floor(Math.random() * n);
const shuffled = <T,>(a: T[]) => {
  const r = [...a];
  for (let k = r.length - 1; k > 0; k--) {
    const j = rnd(k + 1);
    [r[k], r[j]] = [r[j], r[k]];
  }
  return r;
};

function Turn({ p }: { p: number }) {
  const { t } = useT();
  return (
    <Text style={st.turn}>
      {t('player')} {p + 1}
    </Text>
  );
}

function BigCard({ label, text }: { label?: string; text: string }) {
  return (
    <Card style={st.big}>
      {label ? <Text style={st.label}>{label}</Text> : null}
      <Text style={st.bigT}>{text}</Text>
    </Card>
  );
}

function Tod({ g }: { g: Extract<Game, { engine: 'tod' }> }) {
  const { t } = useT();
  const [p, setP] = useState(0);
  const [card, setCard] = useState<{ label: string; text: string } | null>(null);
  const draw = (kind: 'truth' | 'dare') => {
    setCard({ label: t(kind), text: g[kind][rnd(g[kind].length)] });
  };
  return (
    <>
      <Turn p={p} />
      <BigCard label={card?.label} text={card?.text ?? t('gameStart')} />
      {card ? (
        <Btn
          label={t('nextCard')}
          onPress={() => {
            setCard(null);
            setP((v) => 1 - v);
          }}
        />
      ) : (
        <View style={st.two}>
          <Btn kind="ghost" label={t('truth')} onPress={() => draw('truth')} style={{ flex: 1 }} />
          <Btn label={t('dare')} onPress={() => draw('dare')} style={{ flex: 1 }} />
        </View>
      )}
    </>
  );
}

function Deck({ g }: { g: Extract<Game, { engine: 'deck' }> }) {
  const { t } = useT();
  const cards = useMemo(() => (g.shuffle ? shuffled(g.cards) : g.cards), [g]);
  const [n, setN] = useState(0);
  const last = n >= cards.length - 1;
  return (
    <>
      <Turn p={n % 2} />
      <BigCard label={cards[n].label} text={cards[n].text} />
      <Text style={st.count}>
        {n + 1} {t('of')} {cards.length}
      </Text>
      <Btn label={last ? t('again') : t('nextCard')} onPress={() => setN(last ? 0 : n + 1)} />
    </>
  );
}

function Paths({ g }: { g: Extract<Game, { engine: 'paths' }> }) {
  const { t } = useT();
  const [n, setN] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  if (n >= g.pairs.length) {
    return (
      <>
        <Card>
          {picks.map((p, k) => (
            <Text key={k} style={st.pick}>
              {k + 1}. {p}
            </Text>
          ))}
        </Card>
        <Btn
          label={t('again')}
          onPress={() => {
            setN(0);
            setPicks([]);
          }}
        />
      </>
    );
  }
  const choose = (v: string) => {
    setPicks((p) => [...p, v]);
    setN(n + 1);
  };
  return (
    <>
      <Turn p={n % 2} />
      <Text style={st.count}>
        {t('choose')} · {n + 1} {t('of')} {g.pairs.length}
      </Text>
      {g.pairs[n].map((v) => (
        <Btn key={v} kind="ghost" label={v} onPress={() => choose(v)} style={st.path} textStyle={{ fontSize: 19 }} />
      ))}
    </>
  );
}

function Dice({ g }: { g: Extract<Game, { engine: 'dice' }> }) {
  const { t } = useT();
  const [roll, setRoll] = useState<number[] | null>(null);
  const [p, setP] = useState(0);
  return (
    <>
      <Turn p={p} />
      <View style={{ gap: 10, marginBottom: 16 }}>
        {g.dice.map((d, k) => (
          <Card key={k} style={st.die}>
            <Text style={st.dieT}>{roll ? d[roll[k]] : '?'}</Text>
          </Card>
        ))}
      </View>
      <Btn
        label={t('rollAll')}
        onPress={() => {
          setRoll(g.dice.map((d) => rnd(d.length)));
          if (roll) setP((v) => 1 - v);
        }}
      />
    </>
  );
}

function Board({ g }: { g: Extract<Game, { engine: 'board' }> }) {
  const { t } = useT();
  const last = g.cells.length - 1;
  const [pos, setPos] = useState([0, 0]);
  const [p, setP] = useState(0);
  const [die, setDie] = useState<number | null>(null);
  const [msg, setMsg] = useState(g.cells[0]);
  const won = pos.some((v) => v === last);
  const roll = () => {
    if (won) {
      setPos([0, 0]);
      setP(0);
      setDie(null);
      setMsg(g.cells[0]);
      return;
    }
    const d = 1 + rnd(6);
    const to = Math.min(last, pos[p] + d);
    setDie(d);
    setPos((v) => v.map((x, k) => (k === p ? to : x)));
    setMsg(to === last ? t('finishLine') : g.cells[to]);
    if (to !== last) setP(1 - p);
  };
  return (
    <>
      {!won && <Turn p={p} />}
      <View style={st.board}>
        {g.cells.map((_, k) => (
          <View key={k} style={[st.cell, (k === 0 || k === last) && { borderColor: C.accent }]}>
            <Text style={st.cellN}>{k === last ? '🏁' : k + 1}</Text>
            <View style={st.tokens}>
              {pos[0] === k && <View style={[st.token, { backgroundColor: C.gold }]} />}
              {pos[1] === k && <View style={[st.token, { backgroundColor: '#D0507A' }]} />}
            </View>
          </View>
        ))}
      </View>
      <BigCard label={die ? `🎲 ${die}` : undefined} text={msg} />
      <Btn label={won ? t('again') : t('roll')} onPress={roll} />
    </>
  );
}

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { s } = useStore();
  const { t, tr } = useT();
  const cat = findCat('games', id);
  const g = GAMES[id ?? ''];
  if (!cat || !g) return <Screen title="" back children={null} />;
  if (cat.premium && !s.premium) return <Redirect href="/profile" />;
  return (
    <Screen title={tr(cat.title)} back>
      {g.engine === 'tod' && <Tod g={g} />}
      {g.engine === 'deck' && <Deck g={g} />}
      {g.engine === 'paths' && <Paths g={g} />}
      {g.engine === 'dice' && <Dice g={g} />}
      {g.engine === 'board' && <Board g={g} />}
      <Text style={st.rule}>{t('gameRule')}</Text>
    </Screen>
  );
}

const st = StyleSheet.create({
  turn: { color: C.accent, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 },
  big: { minHeight: 200, alignItems: 'center', justifyContent: 'center', padding: 24 },
  label: { color: C.accent, fontSize: 12.5, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' },
  bigT: { color: C.text, fontSize: 21, lineHeight: 30, textAlign: 'center', fontWeight: '600' },
  two: { flexDirection: 'row', gap: 12 },
  count: { color: C.muted, fontSize: 14, textAlign: 'center', marginBottom: 14 },
  path: { minHeight: 110, marginBottom: 14, borderRadius: R.card },
  pick: { color: C.text, fontSize: 16.5, lineHeight: 28 },
  die: { marginBottom: 0, alignItems: 'center', paddingVertical: 20 },
  dieT: { color: C.text, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  board: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  cell: { width: '15%', aspectRatio: 1, borderRadius: 10, borderWidth: 1, borderColor: C.borderSoft, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  cellN: { color: C.muted, fontSize: 12 },
  tokens: { flexDirection: 'row', gap: 3, height: 10, marginTop: 2 },
  token: { width: 10, height: 10, borderRadius: 5 },
  rule: { color: C.dim, fontSize: 12.5, lineHeight: 18, textAlign: 'center', marginTop: 20 },
});
