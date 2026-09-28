import { computed, ref } from 'vue';
import type {
  ListModuleKey,
  ModuleKey,
  ResumeConfig,
  ResumeVersion,
  ThemeConfig,
} from '@/types/resume';
import { DEFAULT_RESUME, DEFAULT_THEME } from '@/config/defaultResume';
import { DEFAULT_TEMPLATE } from '@/config/templates';
import { getDefaultTitleNameMap } from '@/config/titles';
import { customAssign, omitLocales } from '@/utils/customAssign';
import { readLocalConfig, writeLocalConfig, readVersions, writeVersions } from '@/utils/storage';
import { throttle } from '@/utils/throttle';
import { fetchRemoteResume } from '@/api/resume';
import { useI18n } from './useI18n';
import { useQuery } from './useQuery';
import { useToast } from './useToast';

/**
 * 简历全局状态（模块级单例，任意组件调用共享同一份状态）
 * 这是 Composition API 的核心：把「数据 + 行为」聚合在一个 composable 里
 */
const { lang, t, setLang } = useI18n();
const { query } = useQuery();
const toast = useToast();

const config = ref<ResumeConfig>({});
/** 含 locales 的原始数据，导出时需要 */
const originalConfig = ref<ResumeConfig | null>(null);
const theme = ref<ThemeConfig>({ ...DEFAULT_THEME });
const template = ref<string>(DEFAULT_TEMPLATE);
const mode = ref<'view' | 'edit'>('view');
const loading = ref(true);
const loadError = ref(false);

/** URL query 只在首次加载时消费，之后以用户交互（切模式 / 切语言）为准 */
let initialized = false;

/** 同步参数到地址栏（不触发路由跳转），保证刷新后状态一致 */
function syncUrl(patch: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  Object.entries(patch).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  window.history.replaceState({}, '', url.toString());
}

/** 补全默认模块标题 */
function withDefaultTitles(c: ResumeConfig): ResumeConfig {
  return {
    ...c,
    titleNameMap: {
      ...getDefaultTitleNameMap(t),
      ...(c.titleNameMap ?? {}),
    },
  };
}

const persist = throttle(() => {
  writeLocalConfig(query.user, config.value);
  toast.success(t('已缓存在本地'));
}, 5000);

function apply(next: ResumeConfig) {
  config.value = withDefaultTitles(next);
}

function applyRaw(raw: ResumeConfig) {
  originalConfig.value = raw;
  apply(omitLocales(customAssign({}, raw, raw?.locales?.[lang.value])));
}

async function load() {
  loading.value = true;
  loadError.value = false;

  if (!initialized) {
    initialized = true;
    if (query.lang) setLang(query.lang);
    if (query.template) template.value = query.template;
    mode.value = query.mode === 'edit' ? 'edit' : 'view';
  }

  const params = { user: query.user, branch: query.branch, lang: lang.value };

  if (mode.value === 'edit') {
    // 编辑模式：本地缓存 → 远程 → 默认模板
    const local = readLocalConfig(query.user);
    if (local) {
      apply(local);
      loading.value = false;
      return;
    }
  }

  if (!query.user) {
    // 无 user 时直接使用默认模板
    applyRaw(DEFAULT_RESUME);
    loading.value = false;
    return;
  }

  try {
    const { raw } = await fetchRemoteResume(params);
    applyRaw(raw);
    toast.success(t('已从远程加载'));
  } catch {
    // 远程拉取失败：回退内置默认模板，避免只读模式直接报错（演示更友好）
    applyRaw(DEFAULT_RESUME);
    toast.info(t('未能加载远程简历，已使用默认模板'));
  } finally {
    loading.value = false;
  }
}

/** 更新整体配置 */
function updateConfig(patch: Partial<ResumeConfig>) {
  apply({ ...config.value, ...patch });
  persist();
}

/** 更新单个模块（对象型：avatar / profile / aboutme） */
function updateModule(key: ModuleKey, value: unknown) {
  updateConfig({ [key]: value } as Partial<ResumeConfig>);
}

/** 更新模块标题 */
function updateTitleNameMap(key: string, name: string) {
  updateConfig({
    titleNameMap: { ...(config.value.titleNameMap ?? {}), [key]: name },
  });
}

function getList(key: ListModuleKey): Record<string, unknown>[] {
  return ((config.value[key] as unknown[]) ?? []) as Record<string, unknown>[];
}

function setList(key: ListModuleKey, list: Record<string, unknown>[]) {
  updateConfig({ [key]: list } as unknown as Partial<ResumeConfig>);
}

function addListItem(key: ListModuleKey, item: Record<string, unknown>) {
  setList(key, [...getList(key), item]);
}

function updateListItem(
  key: ListModuleKey,
  index: number,
  item: Record<string, unknown>,
) {
  const list = [...getList(key)];
  list[index] = { ...list[index], ...item };
  setList(key, list);
}

function removeListItem(key: ListModuleKey, index: number) {
  const list = [...getList(key)];
  list.splice(index, 1);
  setList(key, list);
}

function moveListItem(key: ListModuleKey, from: number, to: number) {
  const list = [...getList(key)];
  if (from < 0 || to < 0 || from >= list.length || to >= list.length) return;
  const [moved] = list.splice(from, 1);
  list.splice(to, 0, moved);
  setList(key, list);
}

/** 主题 */
function setTheme(patch: Partial<ThemeConfig>) {
  theme.value = { ...theme.value, ...patch };
}

function setTemplate(next: string) {
  template.value = next;
}

function setMode(next: 'view' | 'edit') {
  mode.value = next;
  query.mode = next === 'edit' ? 'edit' : 'view';
  syncUrl({ mode: query.mode });

  if (next !== 'edit') return;

  const local = readLocalConfig(query.user);
  if (local) {
    apply(local);
    loadError.value = false;
    loading.value = false;
    return;
  }
  loadError.value = false;
  load();
}

function setLanguage(next: string) {
  setLang(next);
  query.lang = next;
  syncUrl({ lang: next });
  load();
}

/** 导出完整 JSON（含 theme 与 locales 回填） */
function exportJson(): string {
  let full: ResumeConfig = config.value;
  if (lang.value !== 'zh_CN') {
    full = customAssign({}, originalConfig.value ?? {}, {
      locales: { [lang.value]: omitLocales(config.value) },
    });
  }
  return JSON.stringify({ ...omitLocales(full), theme: theme.value }, null, 2);
}

/** 导入 JSON */
function importJson(text: string) {
  const parsed = JSON.parse(text) as ResumeConfig & { theme?: ThemeConfig };
  if (parsed.theme) {
    theme.value = { ...theme.value, ...parsed.theme };
  }
  applyRaw(omitLocales(parsed));
  persist();
}

const isEdit = computed(() => mode.value === 'edit');

/* ============ 历史版本（localStorage，按 user 隔离） ============ */
const versions = ref<ResumeVersion[]>([]);
/** 左侧历史版本面板是否展开 */
const historyOpen = ref(false);
function toggleHistory() {
  historyOpen.value = !historyOpen.value;
}

/** 本地时间格式化（YYYY-MM-DD HH:mm），用于版本默认名与列表展示 */
function formatTs(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => `${n}`.padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function loadVersions() {
  versions.value = readVersions(query.user);
}

function saveVersion(name: string, note?: string) {
  const snapshot: ResumeVersion = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    name: name.trim() || `版本 ${formatTs(Date.now())}`,
    note: note?.trim() || undefined,
    pinned: false,
    template: template.value,
    theme: JSON.parse(JSON.stringify(theme.value)),
    config: JSON.parse(JSON.stringify(config.value)),
  };
  // 置顶的永远保留；其余按上限裁剪，避免 localStorage 膨胀
  const MAX = 100;
  const merged = [snapshot, ...versions.value];
  const pinned = merged.filter(v => v.pinned);
  const unpinned = merged.filter(v => !v.pinned).slice(0, MAX);
  versions.value = [...pinned, ...unpinned];
  writeVersions(query.user, versions.value);
  toast.success(t('已保存版本'));
}

/** 非破坏性恢复：把某版本载入当前继续编辑，历史不丢（恢复后当前会被自动缓存） */
function restoreVersion(id: string) {
  const v = versions.value.find(x => x.id === id);
  if (!v) return;
  template.value = v.template;
  theme.value = JSON.parse(JSON.stringify(v.theme));
  apply(v.config);
  persist();
  toast.success(t('已恢复到该版本'));
}

function deleteVersion(id: string) {
  versions.value = versions.value.filter(v => v.id !== id);
  writeVersions(query.user, versions.value);
  toast.success(t('已删除版本'));
}

function togglePin(id: string) {
  const v = versions.value.find(x => x.id === id);
  if (!v) return;
  v.pinned = !v.pinned;
  versions.value = [...versions.value].sort(
    (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.createdAt - a.createdAt,
  );
  writeVersions(query.user, versions.value);
}

export function useResumeStore() {
  return {
    /** state */
    config,
    originalConfig,
    theme,
    template,
    mode,
    loading,
    loadError,
    query,
    isEdit,
    /** actions */
    load,
    updateConfig,
    updateModule,
    updateTitleNameMap,
    getList,
    addListItem,
    updateListItem,
    removeListItem,
    moveListItem,
    setTheme,
    setTemplate,
    setMode,
    setLanguage,
    exportJson,
    importJson,
    versions,
    loadVersions,
    saveVersion,
    restoreVersion,
    deleteVersion,
    togglePin,
    historyOpen,
    toggleHistory,
  };
}
