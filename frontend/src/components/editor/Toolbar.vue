<script setup lang="ts">
import { ref } from 'vue';
import { useResumeStore } from '@/composables/useResumeStore';
import { useI18n } from '@/composables/useI18n';
import { useToast } from '@/composables/useToast';
import {
  copyToClipboard,
  exportDataToLocal,
  printResume,
  readJsonFile,
} from '@/utils/exporter';
import ConfigDrawer from './ConfigDrawer.vue';
import Icon from '../Icon.vue';

const store = useResumeStore();
const { query } = store;
const { t } = useI18n();
const toast = useToast();

const fileInput = ref<HTMLInputElement | null>(null);

async function copyConfig() {
  const ok = await copyToClipboard(store.exportJson());
  toast[ok ? 'success' : 'error'](t('复制成功'));
}

function saveResume() {
  exportDataToLocal(
    store.exportJson(),
    `${query.user || 'resume'}'s resume info`,
  );
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const data = await readJsonFile<Record<string, unknown>>(file);
    store.importJson(JSON.stringify(data));
    toast.success(t('上传配置已应用'));
  } catch {
    toast.error(t('上传文件有误'));
  } finally {
    input.value = '';
  }
}
</script>

<template>
  <div class="no-print sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-[1200px] flex-wrap items-center gap-2 px-4 py-2">
      <ConfigDrawer />

      <button
        class="flex items-center gap-1 rounded border border-gray-300 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
        @click="copyConfig"
      >
        <Icon name="copy" size="14" />{{ t('复制配置') }}
      </button>

      <button
        class="flex items-center gap-1 rounded border border-gray-300 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
        @click="saveResume"
      >
        <Icon name="save" size="14" />{{ t('保存简历') }}
      </button>

      <button
        class="flex items-center gap-1 rounded border border-gray-300 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
        @click="fileInput?.click()"
      >
        <Icon name="upload" size="14" />{{ t('导入配置') }}
      </button>

      <input
        ref="fileInput"
        type="file"
        accept=".json"
        class="hidden"
        @change="onFileChange"
      />

      <button
        class="flex items-center gap-1 rounded bg-brand px-3 py-2 text-[13px] text-white hover:opacity-90"
        @click="printResume"
      >
        <Icon name="print" size="14" />{{ t('PDF 下载') }}
      </button>
    </div>
  </div>
</template>
