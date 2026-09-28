<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ListModuleKey, ModuleKey } from '@/types/resume';
import { MODULES } from '@/config/modules';
import { FORM_SCHEMA } from '@/config/formSchema';
import { getDefaultTitleNameMap } from '@/config/titles';
import { useResumeStore } from '@/composables/useResumeStore';
import { useI18n } from '@/composables/useI18n';
import Icon from '../Icon.vue';
import BaseDrawer from '../ui/BaseDrawer.vue';
import FormCreator from './FormCreator.vue';
import ModuleItemList from './ModuleItemList.vue';

const store = useResumeStore();
const { t } = useI18n();

const isListKey = (key: string) => key.endsWith('List');

const titleMap = computed(
  () =>
    (store.config.value?.titleNameMap ?? {}) as Record<
      string,
      string | undefined
    >,
);

const modules = computed(() =>
  MODULES.map(m => ({
    ...m,
    name: titleMap.value[m.key] ?? t(m.name),
  })),
);

/** 允许自定义标题的模块（与原项目 DEFAULT_TITLE_MAP 一致） */
const defaultTitles = computed(
  () => getDefaultTitleNameMap(t) as Record<string, string | undefined>,
);

const expanded = ref<Record<string, boolean>>({});
const toggle = (key: string) => {
  expanded.value[key] = !expanded.value[key];
};

/** 子抽屉（编辑具体模块 / 条目） */
const currentKey = ref<ModuleKey | null>(null);
const currentValue = ref<Record<string, unknown> | null>(null);
/** null = 编辑对象模块；>= 0 = 编辑列表第 n 项；-1 = 新增 */
const currentIndex = ref<number | null>(null);

const schema = computed(() =>
  currentKey.value ? FORM_SCHEMA[currentKey.value] ?? [] : [],
);

const drawerTitle = computed(() => {
  const m = MODULES.find(item => item.key === currentKey.value);
  if (!m) return '';
  return titleMap.value[m.key] ?? t(m.name);
});

function openModule(key: ModuleKey) {
  currentKey.value = key;
  currentIndex.value = null;
  currentValue.value = {
    ...((store.config.value?.[key] as Record<string, unknown>) ?? {}),
  };
}

function openItem(key: ListModuleKey, index: number) {
  currentKey.value = key;
  currentIndex.value = index;
  currentValue.value = { ...(store.getList(key)[index] ?? {}) };
}

function openAdd(key: ListModuleKey) {
  currentKey.value = key;
  currentIndex.value = -1;
  currentValue.value = {};
}

function onSubmit(value: Record<string, unknown>) {
  const key = currentKey.value;
  if (!key) return;

  if (isListKey(key)) {
    const listKey = key as ListModuleKey;
    if (currentIndex.value === null || currentIndex.value < 0) {
      store.addListItem(listKey, value);
    } else {
      store.updateListItem(listKey, currentIndex.value, value);
    }
  } else {
    store.updateModule(key, value);
  }

  currentKey.value = null;
  currentValue.value = null;
  currentIndex.value = null;
}

const getItems = (key: ModuleKey) => store.getList(key as ListModuleKey);
const editItem = (key: ModuleKey, index: number) =>
  openItem(key as ListModuleKey, index);
const addItem = (key: ModuleKey) => openAdd(key as ListModuleKey);
</script>

<template>
  <div>
    <div
      v-for="module in modules"
      :key="module.key"
      class="mb-2 border-b border-gray-100 pb-2"
    >
      <div class="flex items-center gap-2">
        <Icon :name="module.icon" size="16" class="text-brand" />

        <!-- 可自定义标题的模块 -->
        <input
          v-if="defaultTitles[module.key]"
          :value="module.name"
          class="min-w-0 flex-1 border-none bg-transparent p-0 text-[13px] text-gray-800 outline-none focus:text-brand"
          @change="
            store.updateTitleNameMap(
              module.key,
              ($event.target as HTMLInputElement).value,
            )
          "
        />
        <span v-else class="min-w-0 flex-1 text-[13px] text-gray-800">
          {{ module.name }}
        </span>

        <button
          v-if="module.isList"
          class="rounded px-2 py-[2px] text-[12px] text-gray-500 hover:bg-gray-100"
          @click="toggle(module.key)"
        >
          {{ expanded[module.key] ? '−' : '+' }}
        </button>
        <button
          v-else
          class="rounded px-2 py-[2px] text-[12px] text-gray-500 hover:bg-gray-100"
          @click="openModule(module.key)"
        >
          <Icon name="edit" size="14" />
        </button>
      </div>

      <ModuleItemList
        v-if="module.isList && expanded[module.key]"
        :module-key="module.key as ListModuleKey"
        :items="getItems(module.key)"
        @edit="index => editItem(module.key, index)"
        @add="addItem(module.key)"
      />
    </div>

    <BaseDrawer
      :visible="!!currentKey"
      :width="450"
      :title="drawerTitle"
      @close="currentKey = null"
    >
      <FormCreator
        :schema="schema"
        :value="currentValue"
        @submit="onSubmit"
      />
    </BaseDrawer>
  </div>
</template>
