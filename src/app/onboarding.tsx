import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useT } from '../i18n';
import { Lang, newPairCode, useStore } from '../store';
import { APP_NAME, C, R } from '../theme';
import { Btn, IconCircle, IonName } from '../ui';

type Step = 'lang' | 'age' | 'blocked' | 'rules' | 's1' | 's2' | 's3' | 'code';
const LANGS: [Lang, string][] = [
  ['uk', 'Українська'],
  ['en', 'English'],
];

export default function Onboarding() {
  const { s, set } = useStore();
  const { t } = useT();
  const ins = useSafeAreaInsets();
  const [step, setStep] = useState<Step>(s.lang ? 'age' : 'lang');
  const [accepted, setAccepted] = useState(false);
  const [code, setCode] = useState('');

  const finish = (partnerCode: string | null) => {
    set({ onboarded: true, role: partnerCode ? 'partner' : 'main', partnerCode, pairCode: newPairCode() });
    router.replace('/');
  };

  const slideIdx = step === 's1' ? 0 : step === 's2' ? 1 : step === 's3' ? 2 : -1;
  const brand = <Text style={st.brand}>{APP_NAME}</Text>;

  let body: React.ReactNode;
  if (step === 'lang') {
    body = (
      <View style={st.center}>
        {brand}
        <View style={{ width: '70%', gap: 10, marginTop: 28 }}>
          {LANGS.map(([id, name]) => (
            <Btn
              key={id}
              kind="ghost"
              label={name}
              onPress={() => {
                set({ lang: id });
                setStep('age');
              }}
            />
          ))}
        </View>
      </View>
    );
  } else if (step === 'age' || step === 'blocked') {
    body = (
      <View style={st.center}>
        {brand}
        <Text style={st.h1}>{t('ageQ')}</Text>
        <Text style={st.pCenter}>{step === 'blocked' ? t('ageBlocked') : t('ageText')}</Text>
        {step === 'age' && (
          <View style={{ alignSelf: 'stretch', gap: 10, marginTop: 24 }}>
            <Btn label={t('ageYes')} onPress={() => setStep('rules')} />
            <Btn kind="ghost" label={t('ageNo')} onPress={() => setStep('blocked')} />
          </View>
        )}
      </View>
    );
  } else if (step === 'rules') {
    body = (
      <View style={{ paddingTop: 24 }}>
        <Text style={[st.brand, { fontSize: 28 }]}>{APP_NAME}</Text>
        <Text style={st.h1}>{t('rulesTitle')}</Text>
        <Text style={st.pCenter}>{t('rulesText')}</Text>
        <View style={{ gap: 12, marginTop: 22 }}>
          <Btn kind="ghost" label={t('privacy')} onPress={() => router.push('/doc/privacy')} style={st.docBtn} />
          <Btn kind="ghost" label={t('terms')} onPress={() => router.push('/doc/terms')} style={st.docBtn} />
        </View>
        <Pressable
          style={st.check}
          onPress={() => setAccepted((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}>
          <View style={[st.checkBox, accepted && { backgroundColor: C.accent }]}>
            {accepted && <Ionicons name="checkmark" size={16} color={C.onAccent} />}
          </View>
          <Text style={st.checkText}>{t('accept')}</Text>
        </Pressable>
        <Btn label={t('cont')} disabled={!accepted} onPress={() => setStep('s1')} />
      </View>
    );
  } else if (step === 's1') {
    body = (
      <>
        <View style={st.center}>
          <Text style={[st.brand, { fontSize: 34 }]}>
            {t('welcome')} {APP_NAME}
          </Text>
          <Text style={[st.pCenter, { fontSize: 17 }]}>{t('tagline')}</Text>
          <View style={st.rule} />
          <Text style={[st.pCenter, { fontSize: 17, lineHeight: 26 }]}>{t('welcomeText')}</Text>
          <View style={st.chips}>
            {[t('chipGames'), t('chipHints'), t('chipPractices')].map((c) => (
              <View key={c} style={st.chip}>
                <Text style={st.chipText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>
        <Btn label={t('next')} onPress={() => setStep('s2')} />
      </>
    );
  } else if (step === 's2') {
    const rows: [IonName, string, string][] = [
      ['hand-left-outline', t('why1'), t('why1s')],
      ['moon-outline', t('why2'), t('why2s')],
      ['fitness-outline', t('why3'), t('why3s')],
    ];
    body = (
      <>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={st.h1Left}>{t('whyTitle')}</Text>
          <Text style={st.pLeft}>{t('whyText')}</Text>
          {rows.map(([ion, a, b]) => (
            <View key={a} style={st.feat}>
              <IconCircle ion={ion} size={42} />
              <View style={{ flex: 1 }}>
                <Text style={st.featT}>{a}</Text>
                <Text style={st.featS}>{b}</Text>
              </View>
            </View>
          ))}
        </View>
        <Btn label={t('next')} onPress={() => setStep('s3')} />
      </>
    );
  } else if (step === 's3') {
    body = (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={st.h1Left}>{t('howTitle')}</Text>
        <Text style={st.pLeft}>{t('howText')}</Text>
        <Pressable style={st.opt} onPress={() => setStep('code')} accessibilityRole="button">
          <View style={st.optIcon}>
            <Ionicons name="keypad-outline" size={22} color={C.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={st.optT}>{t('haveCode')}</Text>
            <Text style={st.optS}>{t('haveCodeS')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.muted} />
        </Pressable>
        <Pressable style={[st.opt, st.optPrimary]} onPress={() => finish(null)} accessibilityRole="button">
          <View style={[st.optIcon, { backgroundColor: 'rgba(255,255,255,0.28)' }]}>
            <Ionicons name="rocket-outline" size={22} color={C.onAccent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[st.optT, { color: C.onAccent }]}>{t('start')}</Text>
            <Text style={[st.optS, { color: '#4A2E17' }]}>{t('startS')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.onAccent} />
        </Pressable>
      </View>
    );
  } else {
    body = (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={st.h1Left}>{t('enterCode')}</Text>
        <Text style={st.pLeft}>{t('enterCodeS')}</Text>
        <TextInput
          value={code}
          onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          placeholder="000000"
          placeholderTextColor={C.dim}
          style={st.input}
          maxLength={6}
          autoFocus
          accessibilityLabel={t('enterCode')}
        />
        <Btn label={t('cont')} disabled={code.length !== 6} onPress={() => finish(code)} />
        <Btn kind="ghost" label={t('back')} onPress={() => setStep('s3')} style={{ marginTop: 10 }} />
      </View>
    );
  }

  return (
    <View style={[st.root, { paddingTop: ins.top + 16, paddingBottom: ins.bottom + 16 }]}>
      <View style={{ flex: 1 }}>{body}</View>
      {slideIdx >= 0 && (
        <>
          <View style={st.dots}>
            {[0, 1, 2].map((n) => (
              <View key={n} style={[st.dot, n === slideIdx && st.dotOn]} />
            ))}
          </View>
          <Text style={st.foot}>{t('footnote')}</Text>
        </>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  brand: { color: C.gold, fontSize: 40, fontWeight: '700', textAlign: 'center' },
  h1: { color: C.text, fontSize: 25, fontWeight: '700', textAlign: 'center', marginTop: 16 },
  h1Left: { color: C.text, fontSize: 28, fontWeight: '700' },
  pCenter: { color: C.muted, fontSize: 16, lineHeight: 23, textAlign: 'center', marginTop: 12 },
  pLeft: { color: C.muted, fontSize: 17, lineHeight: 25, marginTop: 8, marginBottom: 20 },
  docBtn: { alignItems: 'flex-start', minHeight: 62 },
  check: { flexDirection: 'row', gap: 12, marginVertical: 22, alignItems: 'flex-start' },
  checkBox: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: C.accentEdge, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkText: { color: C.text, fontSize: 15.5, lineHeight: 22, flex: 1 },
  rule: { width: 48, height: 2, backgroundColor: C.border, marginVertical: 22 },
  chips: { flexDirection: 'row', gap: 8, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' },
  chip: { borderWidth: 1, borderColor: C.border, backgroundColor: '#1E1712', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 8 },
  chipText: { color: C.accent, fontWeight: '700', fontSize: 14 },
  feat: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.card, padding: 16, marginBottom: 10 },
  featT: { color: C.text, fontSize: 17, fontWeight: '700' },
  featS: { color: C.muted, fontSize: 14, marginTop: 2 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border, borderRadius: R.card, padding: 18, marginBottom: 16 },
  optPrimary: { backgroundColor: C.accent, borderColor: C.accentEdge },
  optIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.cardHi, alignItems: 'center', justifyContent: 'center' },
  optT: { color: C.text, fontSize: 20, fontWeight: '700' },
  optS: { color: C.muted, fontSize: 14, lineHeight: 19, marginTop: 3 },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.btn, color: C.text, fontSize: 28, letterSpacing: 10, textAlign: 'center', paddingVertical: 14, marginBottom: 16 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 18 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.border },
  dotOn: { width: 20, backgroundColor: C.gold },
  foot: { color: C.dim, fontSize: 11, lineHeight: 15, textAlign: 'center', marginTop: 10 },
});
