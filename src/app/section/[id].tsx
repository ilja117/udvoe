import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { findSection } from '../../data';
import { useT } from '../../i18n';
import { Grid, Screen, Tile } from '../../ui';

export default function SectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sec = findSection(id);
  const { t, tr } = useT();
  if (!sec) return <Screen title="" back children={null} />;
  return (
    <Screen title={tr(sec.title)} back sub={tr(sec.intro)}>
      <Grid>
        {sec.cats.map((c) => {
          const sub =
            c.kind === 'game'
              ? `${c.mins} ${t('min')}`
              : c.kind === 'list' && c.items
                ? `${c.items.length} · ${tr(c.sub)}`
                : tr(c.sub);
          const href =
            c.kind === 'game'
              ? `/game/${c.id}`
              : c.kind === 'special'
                ? `/special/${c.id}`
                : c.kind === 'guide'
                  ? `/item/${sec.id}/${c.id}/0`
                  : `/cat/${sec.id}/${c.id}`;
          return <Tile key={c.id} title={tr(c.title)} sub={sub} ion={c.ion} emoji={c.emoji} onPress={() => router.push(href)} />;
        })}
      </Grid>
    </Screen>
  );
}
