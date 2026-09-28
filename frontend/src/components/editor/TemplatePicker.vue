<script setup lang="ts">
import { TEMPLATES } from '@/config/templates';
import { useResumeStore } from '@/composables/useResumeStore';
import { useI18n } from '@/composables/useI18n';

const { theme } = useResumeStore();
const { t } = useI18n();

const props = defineProps<{ template: string }>();
const emit = defineEmits<{ change: [value: string] }>();
</script>

<template>
  <div>
    <div class="mb-3 text-[13px] font-medium text-gray-800">
      {{ t('选择模板') }}
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="item in TEMPLATES"
        :key="item.id"
        class="cursor-pointer rounded border p-2 transition hover:shadow-md"
        :class="
          item.id === props.template
            ? 'border-brand ring-1 ring-brand'
            : 'border-gray-200'
        "
        @click="emit('change', item.id)"
      >
        <svg viewBox="0 0 60 82" class="h-[82px] w-full">
          <rect x="0" y="0" width="60" height="82" fill="#fff" stroke="#e5e7eb" />

          <!-- 默认模板：双栏 -->
          <template v-if="item.preview === 'split'">
            <rect x="3" y="5" width="23" height="72" fill="#f3f4f6" />
            <rect x="28" y="5" width="29" height="72" fill="#eef2f7" />
            <circle cx="14" cy="14" r="5" :fill="theme.color" opacity="0.3" />
            <rect x="7" y="24" width="15" height="3" rx="1" :fill="theme.color" />
            <rect x="7" y="31" width="12" height="2" rx="1" fill="#cbd5e1" />
            <rect x="7" y="36" width="14" height="2" rx="1" fill="#cbd5e1" />
            <rect x="32" y="10" width="20" height="4" rx="1" :fill="theme.color" />
            <rect x="32" y="20" width="20" height="2" rx="1" fill="#cbd5e1" />
            <rect x="32" y="25" width="16" height="2" rx="1" fill="#cbd5e1" />
            <rect x="32" y="35" width="20" height="4" rx="1" :fill="theme.color" />
            <rect x="32" y="45" width="18" height="2" rx="1" fill="#cbd5e1" />
          </template>

          <!-- 简易模板：单栏 -->
          <template v-else-if="item.preview === 'simple'">
            <circle cx="48" cy="12" r="6" :fill="theme.color" opacity="0.3" />
            <rect x="6" y="9" width="16" height="4" rx="1" :fill="theme.color" />
            <rect x="6" y="24" width="48" height="3" rx="1" :fill="theme.color" />
            <rect x="6" y="31" width="40" height="2" rx="1" fill="#cbd5e1" />
            <rect x="6" y="42" width="48" height="3" rx="1" :fill="theme.color" />
            <rect x="6" y="49" width="34" height="2" rx="1" fill="#cbd5e1" />
            <rect x="6" y="60" width="48" height="3" rx="1" :fill="theme.color" />
            <rect x="6" y="67" width="42" height="2" rx="1" fill="#cbd5e1" />
          </template>

          <!-- 多页模板：卡片 -->
          <template v-else>
            <rect x="5" y="7" width="50" height="16" rx="2" fill="#fff" stroke="#e5e7eb" />
            <rect x="5" y="7" width="50" height="4" rx="2" :fill="theme.color" />
            <rect x="5" y="28" width="50" height="16" rx="2" fill="#fff" stroke="#e5e7eb" />
            <rect x="5" y="28" width="50" height="4" rx="2" :fill="theme.color" />
            <rect x="5" y="49" width="50" height="16" rx="2" fill="#fff" stroke="#e5e7eb" />
            <rect x="5" y="49" width="50" height="4" rx="2" :fill="theme.color" />
          </template>
        </svg>
        <div class="mt-2 text-center text-[11px] leading-4 text-gray-600">
          {{ t(item.description) }}
        </div>
      </div>
    </div>
  </div>
</template>
