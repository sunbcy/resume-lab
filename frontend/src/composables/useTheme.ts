import { watchEffect } from 'vue';
import type { ThemeConfig } from '@/types/resume';
import { hexToRgbTuple } from '@/utils/color';

/**
 * 把主题色同步为 CSS 变量，供 Tailwind 的 brand / tag 颜色使用
 */
export function useTheme(theme: { value: ThemeConfig }) {
  watchEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.value.color);
    root.style.setProperty('--tag-color', theme.value.tagColor);
    root.style.setProperty('--brand-rgb', hexToRgbTuple(theme.value.color));
    root.style.setProperty('--tag-rgb', hexToRgbTuple(theme.value.tagColor));
  });
}
