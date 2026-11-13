import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { HINTS, Hint } from '../../data';
import { useT } from '../../i18n';
import { C, R } from '../../theme';
import { Btn, Card, Grid, Screen, st as ui } from '../../ui';

export default function HintTab() {
  const { t, tr } = useT();
  const [open, setOpen] = useState<Hint | null>(null);
  const [n, setN] = useState(0);
  const text = open ? open.texts[n % open.texts.length] : '';
  const send = async () => {
    try {
      await Share.share({ message: text });
    } catch {
      // sharing cancelled or unavailable
    }
    setOpen(null);
  };
  return (
    <Screen>
      <View style={st.hero}>
        <View style={st.ring}>
          <View style={st.heart}>
            <Ionicons name="heart" size={30} color={C.gold} />
          </View>
        </View>
        <Text style={st.title}>{t('hint')}</Text>
        <Text style={st.sub}>{t('hintSub')}</Text>
      </View>
      <Card>
        <Text style={ui.p}>{t('hintInfo')}</Text>
      </Card>
      <Text style={[ui.h2, { marginBottom: 14 }]}>{t('hintPick')}</Text>
      <Grid>
        {HINTS.map((h) => (
          <Pressable
            key={h.id}
            style={({ pressed }) => [st.card, { backgroundColor: h.tint }, pressed && { opacity: 0.75 }]}
            accessibilityRole="button"
            onPress={() => {
              setN(0);
              setOpen(h);
            }}>
            <Text style={st.emoji}>{h.emoji}</Text>
            <Text style={st.cardT}>{tr(h.title)}</Text>
            <Text style={st.tag}>{tr(h.tag)}</Text>
            <Text style={st.preview} numberOfLines={2}>
              {h.texts[0]}
            </Text>
            <View style={st.sendRow}>
              <Ionicons name="paper-plane-outline" size={14} color={h.color} />
              <Text style={[st.sendT, { color: h.color }]}>{t('send')}</Text>
            </View>
          </Pressable>
        ))}
      </Grid>
      <Modal visible={!!open} transparent animationType="slide" onRequestClose={() => setOpen(null)}>
        <Pressable style={st.back} onPress={() => setOpen(null)}>
          <Pressable style={st.sheet} onPress={() => {}}>
            <Text style={st.emoji}>{open?.emoji}</Text>
            <Text style={[st.cardT, { marginBottom: 10 }]}>{open ? tr(open.title) : ''}</Text>
            <Text style={st.full}>{text}</Text>
            <Btn label={t('send')} onPress={send} />
            <Btn kind="ghost" label={t('another')} onPress={() => setN((v) => v + 1)} style={{ marginTop: 10 }} />
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const st = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: 10, marginBottom: 22 },
  ring: { width: 104, height: 104, borderRadius: 52, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  heart: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: C.accent, backgroundColor: C.cardHi, alignItems: 'center', justifyContent: 'center' },
  title: { color: C.gold, fontSize: 30, fontWeight: '700', marginTop: 12 },
  sub: { color: C.muted, fontSize: 14.5, marginTop: 6 },
  card: { width: '48%', borderRadius: R.card, borderWidth: 1, borderColor: C.border, padding: 16, minHeight: 190 },
  emoji: { fontSize: 30, marginBottom: 6 },
  cardT: { color: C.text, fontSize: 21, fontWeight: '700' },
  tag: { color: C.accent, fontSize: 10.5, fontWeight: '700', letterSpacing: 0.8, marginTop: 4 },
  preview: { color: C.muted, fontSize: 13.5, lineHeight: 19, marginTop: 6, flex: 1 },
  sendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  sendT: { fontSize: 14, fontWeight: '700' },
  back: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: 26, borderTopRightRadius: 26, borderWidth: 1, borderColor: C.border, padding: 22, paddingBottom: 34 },
  full: { color: C.text, fontSize: 19, lineHeight: 28, marginBottom: 22 },
});
