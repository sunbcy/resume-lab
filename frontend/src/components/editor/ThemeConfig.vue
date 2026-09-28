<script setup lang="ts">
import type { ThemeConfig } from '@/types/resume';
import { useI18n } from '@/composables/useI18n';

const props = defineProps<{ theme: ThemeConfig }>();
const emit = defineEmits<{ change: [value: Partial<ThemeConfig>] }>();
const { t } = useI18n();

const update = (key: keyof ThemeConfig, value: string) => {
  emit('change', { [key]: value } as Partial<ThemeConfig>);
};
</script>

<template>
  <div class="mb-6">
    <div class="mb-3 text-[13px] font-medium text-gray-800">
      {{ t('主题色') }}
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2">
        <span class="text-[13px] text-gray-600">{{ t('主题色') }}</span>
        <input
          type="color"
          :value="props.theme.color"
          class="h-8 w-12 cursor-pointer rounded border border-gray-300"
          @input="update('color', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="props.theme.color"
          class="w-[90px] rounded border border-gray-300 px-2 py-1 text-[12px] outline-none focus:border-brand"
          @change="update('color', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[13px] text-gray-600">{{ t('tag 标签色') }}</span>
        <input
          type="color"
          :value="props.theme.tagColor"
          class="h-8 w-12 cursor-pointer rounded border border-gray-300"
          @input="update('tagColor', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="props.theme.tagColor"
          class="w-[90px] rounded border border-gray-300 px-2 py-1 text-[12px] outline-none focus:border-brand"
          @change="update('tagColor', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>
