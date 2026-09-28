<script setup lang="ts">
import { computed } from 'vue';
import type { ResumeConfig, ThemeConfig } from '@/types/resume';
import Template1 from './templates/Template1.vue';
import Template2 from './templates/Template2.vue';
import Template3 from './templates/Template3.vue';

const props = defineProps<{
  value: ResumeConfig;
  theme: ThemeConfig;
  template: string;
}>();

const Current = computed(() => {
  switch (props.template) {
    case 'template2':
      return Template2;
    case 'template3':
      return Template3;
    default:
      return Template1;
  }
});
</script>

<template>
  <component :is="Current" :value="value" :theme="theme" />
</template>
