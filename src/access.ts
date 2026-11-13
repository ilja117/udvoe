import { router } from 'expo-router';
import { useDialog } from './dialog';
import { useT } from './i18n';
import { useStore } from './store';

/** Returns a guard: runs `go` when content is open, otherwise shows the Premium dialog. */
export function useGuard() {
  const { s } = useStore();
  const { t } = useT();
  const ask = useDialog();
  return (locked: boolean | undefined, go: () => void) => {
    if (!locked || s.premium) return go();
    ask({ title: t('premiumOnly'), text: t('freeNote'), ok: t('toProfile'), cancel: t('cancel'), onOk: () => router.navigate('/profile') });
  };
}
