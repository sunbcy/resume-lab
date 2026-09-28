<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { FieldSchema } from '@/config/formSchema';
import { useI18n } from '@/composables/useI18n';

const props = defineProps<{
  schema: FieldSchema[];
  value: Record<string, unknown> | null;
}>();

const emit = defineEmits<{ submit: [value: Record<string, unknown>] }>();
const { t } = useI18n();

const form = ref<Record<string, any>>({});
const errors = ref<Record<string, string>>({});
const formEl = ref<HTMLFormElement | null>(null);

/** 让所有 textarea 根据内容自适应高度，长文本/emoji 不裁切 */
function syncHeights() {
  formEl.value?.querySelectorAll<HTMLTextAreaElement>('textarea').forEach(el => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  });
}

watch(
  () => props.value,
  async v => {
    form.value = { ...(v ?? {}) };
    errors.value = {};
    await nextTick();
    syncHeights();
  },
  { immediate: true },
);

function autoGrow(e: Event) {
  const el = e.target as HTMLTextAreaElement;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

function validate(): boolean {
  const next: Record<string, string> = {};
  for (const field of props.schema) {
    if (field.required) {
      const v = form.value[field.attributeId];
      if (v === undefined || v === null || String(v).trim() === '') {
        next[field.attributeId] = `${t(field.displayName)} ${t('必填')}`;
      }
    }
  }
  errors.value = next;
  return Object.keys(next).length === 0;
}

function submit() {
  if (!validate()) return;
  const { dataIndex, ...rest } = form.value as Record<string, unknown> & {
    dataIndex?: number;
  };
  emit('submit', rest as Record<string, unknown>);
}
</script>

<template>
  <form ref="formEl" @submit.prevent="submit">
    <div v-for="field in schema" :key="field.attributeId" class="mb-4">
      <!-- checkbox -->
      <label
        v-if="field.type === 'checkbox'"
        class="flex cursor-pointer items-center gap-2 text-[13px] text-gray-700"
      >
        <input
          v-model="form[field.attributeId]"
          type="checkbox"
          class="h-4 w-4 accent-brand"
        />
        <span>{{ t(field.displayName) }}</span>
      </label>

      <template v-else>
        <div class="mb-1 text-[13px] text-gray-700">
          {{ t(field.displayName) }}
          <span v-if="field.required" class="text-red-500">*</span>
        </div>

        <!-- select -->
        <select
          v-if="field.type === 'select'"
          v-model="form[field.attributeId]"
          class="w-full rounded border border-gray-300 px-3 py-[6px] text-[13px] outline-none focus:border-brand"
        >
          <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
            {{ t(opt.label) }}
          </option>
        </select>

        <!-- number -->
        <div v-else-if="field.type === 'number'" class="flex items-center gap-2">
          <input
            v-model.number="form[field.attributeId]"
            type="number"
            :min="(field.cfg?.min as number) ?? 0"
            :max="(field.cfg?.max as number) ?? 100"
            :step="(field.cfg?.step as number) ?? 1"
            class="w-full rounded border border-gray-300 px-3 py-[6px] text-[13px] outline-none focus:border-brand"
          />
          <span v-if="field.cfg?.suffix" class="text-[13px] text-gray-500">
            {{ field.cfg.suffix }}
          </span>
        </div>

        <!-- textarea -->
        <textarea
          v-else-if="field.type === 'textArea'"
          v-model="form[field.attributeId]"
          :rows="(field.cfg?.rows as number) ?? 4"
          :placeholder="field.placeholder ? t(field.placeholder) : ''"
          class="w-full resize-y rounded border border-gray-300 px-3 py-[6px] text-[13px] leading-relaxed text-gray-800 outline-none focus:border-brand"
          style="overflow-wrap: anywhere; word-break: break-word"
          @input="autoGrow"
        />
        <div
          v-if="field.cfg?.showCount"
          class="mt-1 text-right text-[12px] text-gray-400"
        >
          {{ String(form[field.attributeId] ?? '').length }} 字
        </div>

        <!-- input -->
        <input
          v-else
          v-model="form[field.attributeId]"
          type="text"
          :placeholder="field.placeholder ? t(field.placeholder) : ''"
          class="w-full rounded border border-gray-300 px-3 py-[6px] text-[13px] outline-none focus:border-brand"
        />
      </template>

      <div v-if="errors[field.attributeId]" class="mt-1 text-[12px] text-red-500">
        {{ errors[field.attributeId] }}
      </div>
    </div>

    <button
      type="submit"
      class="w-full rounded bg-brand px-4 py-2 text-[13px] text-white hover:opacity-90"
    >
      {{ t('提交') }}
    </button>
  </form>
</template>
