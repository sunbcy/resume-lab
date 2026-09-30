<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useResumeStore } from '@/composables/useResumeStore';
import { useTheme } from '@/composables/useTheme';
import { useI18n } from '@/composables/useI18n';
import ResumeRenderer from '@/components/ResumeRenderer.vue';
import Toolbar from '@/components/editor/Toolbar.vue';
import VersionHistoryPanel from '@/components/editor/VersionHistoryPanel.vue';
import ToastHost from '@/components/ui/ToastHost.vue';
import Icon from '@/components/Icon.vue';

const store = useResumeStore();
const { config, theme, template, loading, loadError, isEdit, query, historyOpen } = store;
const { lang, t } = useI18n();

/** 主题色 -> CSS 变量 */
useTheme(theme);

const pageTitle = computed(() =>
  query.user ? `${query.user}'s resume` : 'Resume Generator',
);

watch(
  pageTitle,
  value => {
    if (typeof document !== 'undefined') document.title = value;
  },
  { immediate: true },
);

onMounted(() => store.load());

const githubLink = computed(
  () => `https://github.com/${query.user}/${query.user}/blob/${query.branch}/resume.json`,
);
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <ToastHost />

    <!-- 顶部栏 -->
    <header
      class="no-print flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-3"
    >
      <div class="flex items-center gap-2">
        <Icon name="profile" size="20" class="text-brand" />
        <span class="text-[15px] font-medium text-gray-800">
          {{ pageTitle }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <select
          :value="lang"
          class="rounded border border-gray-300 px-2 py-1 text-[13px] outline-none focus:border-brand"
          @change="store.setLanguage(($event.target as HTMLSelectElement).value)"
        >
          <option value="zh_CN">简体中文</option>
          <option value="en_US">English</option>
        </select>

        <button
          class="flex items-center gap-1 rounded border border-gray-300 px-3 py-1 text-[13px] text-gray-700 hover:bg-gray-50"
          @click="store.setMode(isEdit ? 'view' : 'edit')"
        >
          <Icon :name="isEdit ? 'eye' : 'edit'" size="14" />
          {{ isEdit ? t('预览') : t('编辑') }}
        </button>
      </div>
    </header>

    <!-- 编辑模式工具栏 -->
    <Toolbar v-if="isEdit" />

    <main class="flex items-start gap-3 p-3">
      <!-- 左侧页签栏：点击展开/收起历史版本（页签式，始终可见） -->
      <div class="no-print sticky top-[112px] z-20 flex">
        <button
          class="flex w-[42px] flex-col items-center gap-1.5 rounded-xl border px-1 py-3 text-[12px] transition"
          :class="
            historyOpen
              ? 'border-brand bg-brand/5 text-brand shadow-sm'
              : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
          "
          :title="historyOpen ? t('收起历史版本') : t('展开历史版本')"
          @click="store.toggleHistory()"
        >
          <Icon name="clock" size="18" />
          <span class="[writing-mode:vertical-rl] tracking-[0.2em]">历史版本</span>
        </button>
      </div>

      <!-- 历史版本面板（主界面与编辑态均常驻，可手动隐藏） -->
      <VersionHistoryPanel v-if="historyOpen" />

      <div class="flex flex-1 justify-center">
      <!-- 加载中 -->
      <div v-if="loading" class="py-20 text-[13px] text-gray-500">
        {{ t('加载中') }}...
      </div>

      <!-- 加载失败 -->
      <div
        v-else-if="loadError"
        class="mt-10 max-w-[520px] rounded border border-gray-200 bg-white p-6 text-[13px] text-gray-700 shadow"
      >
        <div class="mb-2 font-medium text-gray-900">
          {{ t('获取简历信息失败') }}
        </div>
        <div class="mb-4 leading-6">
          {{ t('请检查用户名或简历信息是否位于') }}
          <a
            :href="githubLink"
            target="_blank"
            class="text-brand underline"
          >{{ githubLink }}</a>
        </div>
        <button
          class="rounded bg-brand px-3 py-2 text-white hover:opacity-90"
          @click="store.setMode('edit')"
        >
          {{ t('进入在线编辑') }}
        </button>
      </div>

      <!-- 简历 -->
      <ResumeRenderer
        v-else
        :value="config"
        :theme="theme"
        :template="template"
      />
      </div>
    </main>
  </div>
</template>
