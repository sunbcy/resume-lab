import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info' | 'warn';

export interface ToastItem {
  id: number;
  type: ToastType;
  text: string;
}

const toasts = ref<ToastItem[]>([]);
let seed = 0;

function push(type: ToastType, text: string, duration = 2200) {
  const id = ++seed;
  toasts.value.push({ id, type, text });
  window.setTimeout(() => {
    toasts.value = toasts.value.filter(item => item.id !== id);
  }, duration);
}

/** 轻量消息提示（替代原项目的 antd message） */
export function useToast() {
  return {
    toasts,
    success: (text: string) => push('success', text),
    error: (text: string) => push('error', text),
    info: (text: string) => push('info', text),
    warn: (text: string) => push('warn', text),
    remove: (id: number) => {
      toasts.value = toasts.value.filter(item => item.id !== id);
    },
  };
}
