import type { ModuleKey } from '@/types/resume';

export type FieldType =
  | 'input'
  | 'textArea'
  | 'number'
  | 'select'
  | 'checkbox'
  /** 本地图片上传：渲染文件选择 + DataURL 预览，仍保留 URL 手动输入 */
  | 'image';

export interface FieldSchema {
  type: FieldType;
  /** 对应 ResumeConfig 中的字段名 */
  attributeId: string;
  /** 展示名（中文原文，作为 i18n key） */
  displayName: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  /** 透传给具体控件的配置，如 number 的 min/max/step */
  cfg?: Record<string, unknown>;
}

/**
 * 各模块对应的表单 schema（与原项目 CONTENT_OF_MODULE 一致）
 */
export const FORM_SCHEMA: Record<ModuleKey, FieldSchema[]> = {
  avatar: [
    {
      type: 'checkbox',
      attributeId: 'hidden',
      displayName: '隐藏头像',
      cfg: { defaultValue: false },
    },
    {
      type: 'select',
      attributeId: 'shape',
      displayName: '头像形状',
      options: [
        { value: 'circle', label: '圆形' },
        { value: 'square', label: '方形' },
      ],
    },
    {
      type: 'image',
      attributeId: 'src',
      displayName: '头像图片',
      placeholder: '图片 URL，或点击「选择本地图片」上传',
    },
    {
      type: 'input',
      attributeId: 'size',
      displayName: '头像尺寸',
      placeholder: '如 84',
    },
  ],

  profile: [
    { type: 'input', attributeId: 'name', displayName: '姓名', required: true },
    {
      type: 'input',
      attributeId: 'mobile',
      displayName: '手机号码',
      required: true,
    },
    { type: 'input', attributeId: 'email', displayName: '邮箱', required: true },
    {
      type: 'input',
      attributeId: 'github',
      displayName: 'Github',
      placeholder: 'Please input your github account, optional',
    },
    {
      type: 'input',
      attributeId: 'zhihu',
      displayName: '知乎',
      placeholder: 'Please input the link to visit your zhihu account, optional',
    },
    { type: 'input', attributeId: 'workExpYear', displayName: '工作经验' },
    { type: 'input', attributeId: 'workPlace', displayName: '工作地' },
    { type: 'input', attributeId: 'positionTitle', displayName: '职位' },
  ],

  educationList: [
    {
      type: 'input',
      attributeId: 'edu_time',
      displayName: '起始时间',
      required: true,
      placeholder: '如 2014.09 ~ 2018.06',
    },
    { type: 'input', attributeId: 'school', displayName: '学校', required: true },
    { type: 'input', attributeId: 'major', displayName: '专业' },
    { type: 'input', attributeId: 'academic_degree', displayName: '学历' },
  ],

  aboutme: [
    {
      type: 'textArea',
      attributeId: 'aboutme_desc',
      displayName: '自我介绍',
      placeholder: '支持换行，每一行自动分段',
      cfg: { rows: 6, showCount: true },
    },
  ],

  awardList: [
    {
      type: 'input',
      attributeId: 'award_time',
      displayName: '获奖时间',
      required: true,
    },
    {
      type: 'input',
      attributeId: 'award_info',
      displayName: '奖项内容',
      required: true,
    },
  ],

  workList: [
    { type: 'input', attributeId: 'work_name', displayName: '作品名称' },
    { type: 'input', attributeId: 'work_desc', displayName: '作品描述' },
    { type: 'input', attributeId: 'visit_link', displayName: '作品链接' },
  ],

  skillList: [
    { type: 'input', attributeId: 'skill_name', displayName: '技能项' },
    {
      type: 'number',
      attributeId: 'skill_level',
      displayName: '掌握程度',
      cfg: { min: 0, max: 100, step: 5, suffix: '%' },
    },
    {
      type: 'textArea',
      attributeId: 'skill_desc',
      displayName: '技能描述',
      cfg: { rows: 4 },
    },
  ],

  workExpList: [
    {
      type: 'input',
      attributeId: 'work_time',
      displayName: '起止时间',
      required: true,
      placeholder: '如 2018.06 ~ 至今',
    },
    {
      type: 'input',
      attributeId: 'company_name',
      displayName: '公司名称',
      required: true,
    },
    { type: 'input', attributeId: 'department_name', displayName: '部门' },
    {
      type: 'textArea',
      attributeId: 'work_desc',
      displayName: '职位或描述',
      cfg: { rows: 5 },
    },
  ],

  projectList: [
    { type: 'input', attributeId: 'project_name', displayName: '项目名称' },
    { type: 'input', attributeId: 'project_role', displayName: '担任角色' },
    { type: 'input', attributeId: 'project_time', displayName: '项目时间' },
    {
      type: 'textArea',
      attributeId: 'project_desc',
      displayName: '项目描述',
      cfg: { rows: 5 },
    },
    {
      type: 'textArea',
      attributeId: 'project_content',
      displayName: '主要工作',
      cfg: { rows: 5 },
    },
  ],
};
