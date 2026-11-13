import type { L } from '../i18n';
import type { IonName } from '../ui';

export type Item = { t: string; d: string; steps?: string[] };

export type Cat = {
  id: string;
  title: L;
  sub?: L;
  ion?: IonName;
  emoji?: string;
  premium?: boolean;
  /** list: items → detail; guide: single step-by-step ritual; game / special: custom screen */
  kind: 'list' | 'guide' | 'game' | 'special';
  items?: Item[];
  mins?: string;
};

export type Section = {
  id: string;
  title: L;
  sub: L;
  intro?: L;
  ion: IonName;
  cats: Cat[];
};

export const i = (t: string, d: string, ...steps: string[]): Item => ({ t, d, steps: steps.length ? steps : undefined });

/** In free list categories the first FREE_ITEMS entries are open without Premium. */
export const FREE_ITEMS = 2;
