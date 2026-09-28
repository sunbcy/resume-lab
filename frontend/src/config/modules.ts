import type { ModuleKey } from '@/types/resume';

export interface ModuleDef {
  key: ModuleKey;
  /** 默认（中文）名称，用于 i18n 兜底 */
  name: string;
  icon: string;
  /** 是否为数组型模块（可增删、可拖拽排序） */
  isList: boolean;
}

/**
 * 内置简历模块（与原项目 MODULES 一致）
 * 数组型模块 key 以 List 结尾
 */
export const MODULES: ModuleDef[] = [
  { key: 'avatar', name: '头像设置', icon: 'contacts', isList: false },
  { key: 'profile', name: '个人信息', icon: 'profile', isList: false },
  { key: 'educationList', name: '教育背景', icon: 'schedule', isList: true },
  { key: 'aboutme', name: '自我介绍', icon: 'smile', isList: false },
  { key: 'awardList', name: '更多信息', icon: 'trophy', isList: true },
  { key: 'workList', name: '个人作品', icon: 'tool', isList: true },
  { key: 'skillList', name: '专业技能', icon: 'rocket', isList: true },
  { key: 'workExpList', name: '工作经历', icon: 'tags', isList: true },
  { key: 'projectList', name: '项目经历', icon: 'project', isList: true },
];

export const LIST_MODULE_KEYS = MODULES.filter(m => m.isList).map(m => m.key);
