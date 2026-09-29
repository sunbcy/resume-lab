import type { ResumeConfig, ResumeVersion } from '@/types/resume';

export const LOCAL_KEY = (user?: string) => `${user ?? ''}resume-config`;

export function readLocalConfig(user?: string): ResumeConfig | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(LOCAL_KEY(user));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ResumeConfig;
  } catch {
    return null;
  }
}

export function writeLocalConfig(user: string | undefined, config: ResumeConfig) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_KEY(user), JSON.stringify(config));
  } catch {
    // 头像等字段可能含较大 DataURL，超出 localStorage 配额时静默忽略，避免中断更新流程
  }
}

export function clearLocalConfig(user?: string) {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(LOCAL_KEY(user));
}

/** 历史版本列表的 localStorage key（按 user 隔离；无 user 时用 anon） */
export const VERSION_KEY = (user?: string) => `${user ?? 'anon'}-resume-versions`;

export function readVersions(user?: string): ResumeVersion[] {
  if (typeof localStorage === 'undefined') return [];
  const raw = localStorage.getItem(VERSION_KEY(user));
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as ResumeVersion[]) : [];
  } catch {
    return [];
  }
}

export function writeVersions(user: string | undefined, versions: ResumeVersion[]) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(VERSION_KEY(user), JSON.stringify(versions));
  } catch {
    // 历史版本同样可能超出配额，静默忽略
  }
}
