/** 简历配置内容（与原 Gatsby 版 ResumeConfig 保持一致） */
export interface ResumeConfig {
  /** 头像 */
  avatar?: {
    src?: string;
    shape?: 'circle' | 'square' | string;
    size?: string;
    hidden?: boolean;
  };

  /** 个人信息 */
  profile?: {
    name: string;
    mobile?: string;
    email?: string;
    github?: string;
    zhihu?: string;
    /** 工作经验 xx 年 */
    workExpYear?: string;
    /** 工作地 */
    workPlace?: string;
    /** 职位 */
    positionTitle?: string;
  };

  /** 标题名称映射（支持自定义模块标题） */
  titleNameMap?: {
    educationList?: string;
    workExpList?: string;
    projectList?: string;
    skillList?: string;
    awardList?: string;
    workList?: string;
    aboutme?: string;
  };

  /** 教育背景 */
  educationList?: Array<{
    edu_time: [string | undefined, string | number];
    school: string;
    major?: string;
    academic_degree?: string;
  }>;

  /** 工作经历 */
  workExpList?: Array<{
    company_name: string;
    department_name: string;
    work_time?: [string | undefined, string | number];
    work_desc: string;
  }>;

  /** 项目经历 */
  projectList?: Array<{
    project_name: string;
    project_role: string;
    project_desc?: string;
    project_content?: string;
    project_time?: string;
  }>;

  /** 个人技能 */
  skillList?: Array<{
    skill_name?: string;
    /** 0 - 100 */
    skill_level?: number;
    skill_desc?: string;
  }>;

  /** 更多信息 / 奖项 */
  awardList?: Array<{
    award_info: string;
    award_time?: string;
  }>;

  /** 作品 */
  workList?: Array<{
    work_name?: string;
    work_desc?: string;
    visit_link?: string;
  }>;

  /** 自我介绍 */
  aboutme?: {
    aboutme_desc: string;
  };

  /** 国际化：语言 -> 该语言下的覆盖配置 */
  locales?: {
    [key: string]: ResumeConfig;
  };
}

/** 主题配置 */
export interface ThemeConfig {
  /** 主题色 */
  color: string;
  /** tag 标签色 */
  tagColor: string;
}

/** 简历历史版本快照（localStorage 按 user 隔离保存） */
export interface ResumeVersion {
  /** 唯一 id */
  id: string;
  /** 创建时间戳（ms） */
  createdAt: number;
  /** 版本名称（用户填写，缺省时用时间） */
  name: string;
  /** 备注（可选） */
  note?: string;
  /** 是否置顶（置顶的永不被清理） */
  pinned?: boolean;
  /** 保存时的模板 */
  template: string;
  /** 保存时的主题 */
  theme: ThemeConfig;
  /** 保存时的完整配置快照 */
  config: ResumeConfig;
}

/** 列表型模块的 key */
export type ListModuleKey =
  | 'educationList'
  | 'workExpList'
  | 'projectList'
  | 'skillList'
  | 'awardList'
  | 'workList';

/** 对象型模块的 key */
export type ObjectModuleKey = 'avatar' | 'profile' | 'aboutme';

export type ModuleKey = ListModuleKey | ObjectModuleKey;
