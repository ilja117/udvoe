import { router } from 'expo-router';
import { useEffect } from 'react';

/** Replaces the current screen once mounted. */
export function Redirect({ href }: { href: string }) {
  useEffect(() => {
    const id = setTimeout(() => router.replace(href), 0);
    return () => clearTimeout(id);
  }, [href]);
  return null;
}
