<script setup lang="ts">
import type { ListModuleKey } from '@/types/resume';
import { useResumeStore } from '@/composables/useResumeStore';
import { useI18n } from '@/composables/useI18n';
import { useDragSort } from '@/composables/useDragSort';
import Icon from '../Icon.vue';

const props = defineProps<{
  moduleKey: ListModuleKey;
  items: Record<string, unknown>[];
}>();

const emit = defineEmits<{
  edit: [index: number];
  add: [];
}>();

const store = useResumeStore();
const { t } = useI18n();

const drag = useDragSort((from, to) => store.moveListItem(props.moduleKey, from, to));

const summary = (value: Record<string, unknown>) =>
  Object.values(value ?? {})
    .filter(v => v !== undefined && v !== null && v !== '')
    .join(' - ');

function remove(index: number) {
  if (window.confirm(t('确认删除'))) {
    store.removeListItem(props.moduleKey, index);
  }
}
</script>

<template>
  <div class="mt-1">
    <div
      v-for="(item, idx) in items"
      :key="idx"
      draggable="true"
      class="mb-1 flex cursor-move items-center justify-between gap-2 rounded px-2 py-[6px] text-[12px] transition"
      :class="
        drag.isDragging(idx)
          ? 'bg-gray-100 opacity-60'
          : drag.isOver(idx)
            ? 'bg-brand/10'
            : 'hover:bg-gray-50'
      "
      @dragstart="drag.onDragStart(idx)"
      @dragenter="drag.onDragEnter(idx)"
      @dragover="drag.onDragOver"
      @drop.prevent="drag.onDrop(idx)"
      @dragend="drag.onDragEnd"
    >
      <div class="flex min-w-0 flex-1 items-center gap-1" @click="emit('edit', idx)">
        <Icon name="drag" size="12" class="shrink-0 text-gray-400" />
        <span class="truncate">{{ idx + 1 }}. {{ summary(item) }}</span>
      </div>
      <button
        class="shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
        @click.stop="remove(idx)"
      >
        <Icon name="trash" size="14" />
      </button>
    </div>

    <div
      class="mt-2 cursor-pointer rounded border border-dashed border-gray-300 py-[6px] text-center text-[12px] text-gray-500 hover:border-brand hover:text-brand"
      @click="emit('add')"
    >
      + {{ t('继续添加') }}
    </div>
  </div>
</template>
