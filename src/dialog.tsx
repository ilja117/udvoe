import React, { createContext, useCallback, useContext, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { C, R } from './theme';
import { Btn } from './ui';

type Opts = { title: string; text?: string; ok: string; cancel?: string; onOk?: () => void };
const Ctx = createContext<(o: Opts) => void>(() => {});
export const useDialog = () => useContext(Ctx);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [o, setO] = useState<Opts | null>(null);
  const ask = useCallback((opts: Opts) => setO(opts), []);
  return (
    <Ctx.Provider value={ask}>
      {children}
      <Modal visible={!!o} transparent animationType="fade" onRequestClose={() => setO(null)}>
        <Pressable style={st.back} onPress={() => setO(null)}>
          <Pressable style={st.box} onPress={() => {}}>
            <Text style={st.title}>{o?.title}</Text>
            {o?.text ? <Text style={st.text}>{o.text}</Text> : null}
            <Btn
              label={o?.ok ?? ''}
              onPress={() => {
                const fn = o?.onOk;
                setO(null);
                fn?.();
              }}
            />
            {o?.cancel ? <Btn kind="ghost" label={o.cancel} onPress={() => setO(null)} style={{ marginTop: 10 }} /> : null}
          </Pressable>
        </Pressable>
      </Modal>
    </Ctx.Provider>
  );
}

const st = StyleSheet.create({
  back: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  box: { width: '100%', maxWidth: 400, backgroundColor: C.card, borderRadius: R.card, borderWidth: 1, borderColor: C.border, padding: 22 },
  title: { color: C.text, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  text: { color: C.muted, fontSize: 15.5, lineHeight: 22, marginBottom: 18 },
});
