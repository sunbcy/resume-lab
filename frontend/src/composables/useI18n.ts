import { computed, ref } from 'vue';
import { en_US } from '@/locales/en_US';
import { zh_CN } from '@/locales/zh_CN';

const LOCALE_MAP: Record<string, Record<string, string>> = {
  zh_CN,
  en_US,
};

export type LangCode = 'zh_CN' | 'en_US' | string;

/** 当前语言（模块级单例） */
const lang = ref<LangCode>('zh_CN');

export function useI18n() {
  /** 翻译：优先当前语言 → 回退 zh_CN → 回退 key 本身 */
  const t = (key: string): string => {
    const table = LOCALE_MAP[lang.value] ?? {};
    return table[key] || LOCALE_MAP.zh_CN?.[key] || key;
  };

  const setLang = (next: LangCode) => {
    lang.value = next;
    if (typeof document !== 'undefined') {
      document.body.setAttribute('lang', next);
    }
  };

  const isZh = computed(() => lang.value === 'zh_CN');

  return { lang, t, setLang, isZh };
}
