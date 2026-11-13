import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'uk' | 'en';

export type State = {
  lang: Lang | null;
  onboarded: boolean;
  role: 'main' | 'partner';
  pairCode: string;
  partnerCode: string | null;
  focus: 'm' | 'f' | null;
  done: Record<string, true>;
  mini: Record<string, number[]>; // date -> done task indexes
  miniRate: Record<string, number>; // date -> 1..5
  sentence: { idx: number; at: number };
  mood: Record<string, number>; // date -> mood index
  cycle: Record<string, true>; // date -> period day
};

const initial: State = {
  lang: null,
  onboarded: false,
  role: 'main',
  pairCode: '',
  partnerCode: null,
  focus: null,
  done: {},
  mini: {},
  miniRate: {},
  sentence: { idx: 0, at: 0 },
  mood: {},
  cycle: {},
};

const KEY = 'poruch.state.v1';

type Ctx = {
  s: State;
  ready: boolean;
  set: (patch: Partial<State> | ((s: State) => Partial<State>)) => void;
  reset: () => void;
};

const StoreCtx = createContext<Ctx>({ s: initial, ready: false, set: () => {}, reset: () => {} });

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setS({ ...initial, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const set = useCallback<Ctx['set']>((patch) => {
    setS((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    AsyncStorage.removeItem(KEY).catch(() => {});
    setS(initial);
  }, []);

  const value = useMemo(() => ({ s, ready, set, reset }), [s, ready, set, reset]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const newPairCode = () => String(Math.floor(100000 + Math.random() * 900000));

// Levels: points are earned by finishing practices.
export const LEVELS = [
  { at: 0, emoji: '🌱', key: 'lvl0' },
  { at: 14, emoji: '✨', key: 'lvl1' },
  { at: 40, emoji: '🔥', key: 'lvl2' },
  { at: 80, emoji: '💞', key: 'lvl3' },
  { at: 140, emoji: '👑', key: 'lvl4' },
] as const;

export function levelInfo(points: number) {
  let i = 0;
  while (i + 1 < LEVELS.length && points >= LEVELS[i + 1].at) i++;
  const cur = LEVELS[i];
  const next = LEVELS[i + 1];
  const progress = next ? (points - cur.at) / (next.at - cur.at) : 1;
  return { cur, next, progress, left: next ? next.at - points : 0 };
}

export const pointsOf = (s: State) =>
  Object.keys(s.done).length + Object.values(s.mini).reduce((a, b) => a + b.length, 0);
