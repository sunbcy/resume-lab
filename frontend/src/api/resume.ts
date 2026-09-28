import type { ResumeConfig } from '@/types/resume';
import { customAssign, omitLocales } from '@/utils/customAssign';

const GITHUB_RAW = 'https://raw.githubusercontent.com';

export interface RemoteResumeParams {
  user: string;
  branch: string;
  lang: string;
}

export interface RemoteResumeResult {
  /** 合并当前语言后的配置（不含 locales） */
  config: ResumeConfig;
  /** 原始配置（含 locales），用于导出时回填 */
  raw: ResumeConfig;
}

function mergeLocale(raw: ResumeConfig, lang: string): ResumeConfig {
  return omitLocales(customAssign({}, raw, raw?.locales?.[lang]));
}

/**
 * 从 GitHub 同名仓库的 resume.json 拉取简历数据。
 * 优先走后端 FastAPI（服务端缓存 + 统一 locale 合并），
 * 后端不可用时降级为直接请求 raw.githubusercontent.com。
 */
export async function fetchRemoteResume(
  params: RemoteResumeParams,
): Promise<RemoteResumeResult> {
  const { user, branch, lang } = params;
  const query = `?user=${encodeURIComponent(user)}&branch=${encodeURIComponent(
    branch,
  )}&lang=${encodeURIComponent(lang)}`;

  try {
    const res = await fetch(`/api/resume${query}`);
    if (res.ok) {
      const data = (await res.json()) as RemoteResumeResult;
      if (data?.config) return data;
    }
  } catch {
    /* 后端未启动，走降级逻辑 */
  }

  const fallback = await fetch(
    `${GITHUB_RAW}/${user}/${user}/${branch}/resume.json`,
  );
  if (!fallback.ok) {
    throw new Error('fetch resume.json failed');
  }
  const raw = (await fallback.json()) as ResumeConfig;
  return { raw, config: mergeLocale(raw, lang) };
}

/** 后端健康检查 */
export async function pingBackend(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    return res.ok;
  } catch {
    return false;
  }
}
