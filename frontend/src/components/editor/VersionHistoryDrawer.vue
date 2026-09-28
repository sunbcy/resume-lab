<script setup lang="ts">
import { ref, watch } from 'vue';
import { useResumeStore } from '@/composables/useResumeStore';
import { useI18n } from '@/composables/useI18n';
import BaseDrawer from '../ui/BaseDrawer.vue';
import Icon from '../Icon.vue';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ close: [] }>();

const { versions, saveVersion, restoreVersion, deleteVersion, togglePin, loadVersions } =
  useResumeStore();
const { t } = useI18n();

const name = ref('');
const note = ref('');

// 每次打开抽屉时刷新列表（反映最新存储）
watch(
  () => props.visible,
  v => {
    if (v) loadVersions();
  },
);

function formatTs(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => `${n}`.padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function doSave() {
  saveVersion(name.value, note.value);
  name.value = '';
  note.value = '';
}

function doRestore(id: string) {
  restoreVersion(id);
  emit('close');
}
</script>

<template>
  <BaseDrawer :visible="visible" :width="460" @close="emit('close')">
    <template #title>{{ t('历史版本') }}</template>

    <!-- 保存当前为新版本 -->
    <div class="mb-4 rounded border border-gray-200 p-3">
      <div class="mb-2 text-[13px] font-medium text-gray-700">{{ t('保存当前为新版本') }}</div>
      <input
        v-model="name"
        :placeholder="t('版本名称（如：投递字节-春招终稿）')"
        class="mb-2 w-full rounded border border-gray-300 px-2 py-1.5 text-[13px] outline-none focus:border-brand"
      />
      <textarea
        v-model="note"
        :placeholder="t('备注（可选）')"
        rows="2"
        class="mb-2 w-full resize-none rounded border border-gray-300 px-2 py-1.5 text-[13px] outline-none focus:border-brand"
      />
      <button
        class="w-full rounded bg-brand py-2 text-[13px] text-white hover:opacity-90"
        @click="doSave"
      >
        {{ t('保存版本') }}
      </button>
    </div>

    <div
      v-if="versions.length === 0"
      class="py-10 text-center text-[13px] text-gray-400"
    >
      {{ t('暂无历史版本') }}
    </div>

    <ul v-else class="space-y-2">
      <li
        v-for="v in versions"
        :key="v.id"
        class="rounded border border-gray-200 p-3"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <Icon v-if="v.pinned" name="star" size="13" class="text-brand" />
              <span class="truncate text-[13px] font-medium text-gray-800">{{ v.name }}</span>
            </div>
            <div class="mt-0.5 text-[12px] text-gray-400">{{ formatTs(v.createdAt) }}</div>
            <div v-if="v.note" class="mt-1 text-[12px] text-gray-500">{{ v.note }}</div>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-1">
            <button class="text-[12px] text-brand hover:underline" @click="doRestore(v.id)">
              <Icon name="eye" size="12" class="mr-0.5" />{{ t('恢复') }}
            </button>
            <button
              class="text-[12px] text-gray-500 hover:underline"
              @click="togglePin(v.id)"
            >
              {{ v.pinned ? t('取消置顶') : t('置顶') }}
            </button>
            <button
              class="text-[12px] text-red-500 hover:underline"
              @click="deleteVersion(v.id)"
            >
              <Icon name="trash" size="12" class="mr-0.5" />{{ t('删除') }}
            </button>
          </div>
        </div>
      </li>
    </ul>
  </BaseDrawer>
</template>
