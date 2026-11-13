import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useGuard } from '../../access';
import { findSection } from '../../data';
import { useT } from '../../i18n';
import { useStore } from '../../store';
import { Grid, Screen, Tile } from '../../ui';

export default function SectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sec = findSection(id);
  const { s } = useStore();
  const { t, tr } = useT();
  const guard = useGuard();
  if (!sec) return <Screen title="" back children={null} />;
  return (
    <Screen title={tr(sec.title)} back sub={tr(sec.intro)}>
      <Grid>
        {sec.cats.map((c) => {
          const locked = !!c.premium && !s.premium;
          const sub =
            c.kind === 'game'
              ? `${c.mins} ${t('min')}`
              : tr(c.sub);
          const go = () =>
            router.push(
              c.kind === 'game'
                ? `/game/${c.id}`
                : c.kind === 'special'
                  ? `/special/${c.id}`
                  : c.kind === 'guide'
                    ? `/item/${sec.id}/${c.id}/0`
                    : `/cat/${sec.id}/${c.id}`,
            );
          return (
            <Tile
              key={c.id}
              title={tr(c.title)}
              sub={sub}
              tag={c.kind === 'game' && !c.premium && !s.premium ? t('trialTag') : undefined}
              ion={c.ion}
              emoji={c.emoji}
              locked={locked}
              onPress={() => guard(c.premium, go)}
            />
          );
        })}
      </Grid>
    </Screen>
  );
}
