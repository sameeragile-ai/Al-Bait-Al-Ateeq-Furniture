import { en } from './en.ts';
import { ar } from './ar.ts';
import { useStore } from '../store/useStore.ts';

export const translations = {
  en,
  ar,
};

export function useTranslation() {
  const language = useStore((state) => state.language);
  const t = translations[language];
  return { t, language, isRtl: language === 'ar' };
}
