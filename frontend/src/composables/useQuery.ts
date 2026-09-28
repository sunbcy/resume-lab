import { reactive } from 'vue';

export interface QueryState {
  user: string;
  branch: string;
  template: string;
  /** mode=edit 进入编辑模式，默认只读 */
  mode: string;
  lang: string;
}

function parseSearch(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/** 解析并响应式保存 URL query（user / branch / template / mode / lang） */
/** 未显式传 user 时的默认 GitHub 账号 */
export const DEFAULT_USER = 'sunbcy';

export function useQuery() {
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const raw = parseSearch(search);

  const query = reactive<QueryState>({
    user: raw.user ?? DEFAULT_USER,
    branch: raw.branch ?? 'master',
    template: raw.template ?? '',
    mode: raw.mode ?? '',
    lang: raw.lang ?? 'zh_CN',
  });

  return { query, raw };
}
