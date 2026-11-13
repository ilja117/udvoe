import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { DOCS } from '../../data';
import { useT } from '../../i18n';
import { Screen, st as ui } from '../../ui';

export default function DocScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tr } = useT();
  const doc = DOCS[id ?? ''];
  return (
    <Screen title={doc ? tr(doc.title) : ''} back>
      {doc?.body.map((p, k) => (
        <Text key={k} style={[ui.p, { marginBottom: 14, fontSize: 16.5, lineHeight: 25 }]}>
          {p}
        </Text>
      ))}
    </Screen>
  );
}
