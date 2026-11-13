import { router } from 'expo-router';
import React from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { useDialog } from '../../dialog';
import { useT } from '../../i18n';
import { Lang, useStore } from '../../store';
import { APP_NAME, C } from '../../theme';
import { Btn, Card, Row, Screen, st as ui } from '../../ui';

const ORDER: Lang[] = ['uk', 'en'];

export default function Profile() {
  const { s, set, reset } = useStore();
  const { t, lang } = useT();
  const ask = useDialog();
  return (
    <Screen>
      <Text style={st.title}>{t('profile')}</Text>
      <Card>
        <Text style={ui.h2}>{t('pairMode')}</Text>
        <Text style={[ui.p, { marginBottom: 6 }]}>{s.role === 'main' ? t('mainAcc') : t('partnerAcc')}</Text>
        {s.role === 'partner' ? (
          <Text style={ui.p}>
            {t('pairJoined')}: <Text style={st.codeInline}>{s.partnerCode}</Text>
          </Text>
        ) : (
          <>
            <Text style={ui.p}>{t('pairCode')}</Text>
            <Text style={st.code}>{s.pairCode}</Text>
            <Btn kind="ghost" label={t('shareCode')} onPress={() => Share.share({ message: `${APP_NAME}: ${s.pairCode}` }).catch(() => {})} />
          </>
        )}
      </Card>
      <Card style={{ paddingVertical: 6 }}>
        <Row label={t('language')} value={t('langName')} onPress={() => set({ lang: ORDER[(ORDER.indexOf(lang) + 1) % ORDER.length] })} />
        <Row label={t('privacy')} onPress={() => router.push('/doc/privacy')} />
        <Row label={t('terms')} onPress={() => router.push('/doc/terms')} />
        <Row label={t('support')} onPress={() => router.push('/doc/support')} />
        <Row
          last
          label={t('resetAll')}
          onPress={() => ask({ title: t('resetAll'), text: t('resetQ'), ok: t('resetAll'), cancel: t('cancel'), onOk: reset })}
        />
      </Card>
      {lang !== 'uk' && <Text style={st.disc}>{t('contentNote')}</Text>}
      <Text style={st.disc}>{t('disclaimer')}</Text>
    </Screen>
  );
}

const st = StyleSheet.create({
  title: { color: C.text, fontSize: 30, fontWeight: '700', textAlign: 'center', marginTop: 18, marginBottom: 22 },
  code: { color: C.gold, fontSize: 34, fontWeight: '700', letterSpacing: 8, marginVertical: 10 },
  codeInline: { color: C.gold, fontWeight: '700' },
  disc: { color: C.dim, fontSize: 12, lineHeight: 17, marginBottom: 10 },
});
