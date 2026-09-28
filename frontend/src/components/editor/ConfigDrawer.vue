<script setup lang="ts">
import { ref } from 'vue';
import { useResumeStore } from '@/composables/useResumeStore';
import { useI18n } from '@/composables/useI18n';
import BaseDrawer from '../ui/BaseDrawer.vue';
import ThemeConfig from './ThemeConfig.vue';
import TemplatePicker from './TemplatePicker.vue';
import ModuleList from './ModuleList.vue';

const { theme, template, setTheme, setTemplate } = useResumeStore();
const { t } = useI18n();

const visible = ref(false);
const tab = ref<'template' | 'module'>('template');
</script>

<template>
  <div>
    <button
      class="rounded bg-brand px-3 py-2 text-[13px] text-white hover:opacity-90"
      @click="visible = true"
    >
      {{ t('进行配置') }}
    </button>

    <BaseDrawer :visible="visible" :width="480" @close="visible = false">
      <template #title>
        <div class="flex gap-1">
          <button
            class="rounded px-3 py-1 text-[13px] transition"
            :class="
              tab === 'template' ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'
            "
            @click="tab = 'template'"
          >
            {{ t('选择模板') }}
          </button>
          <button
            class="rounded px-3 py-1 text-[13px] transition"
            :class="
              tab === 'module' ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'
            "
            @click="tab = 'module'"
          >
            {{ t('配置简历') }}
          </button>
        </div>
      </template>

      <template v-if="tab === 'template'">
        <ThemeConfig :theme="theme" @change="setTheme" />
        <TemplatePicker :template="template" @change="setTemplate" />
      </template>

      <ModuleList v-else />
    </BaseDrawer>
  </div>
</template>
