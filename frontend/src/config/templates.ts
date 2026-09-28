export interface TemplateDef {
  id: string;
  description: string;
  /** 用于模板选择卡的示意图（内联 SVG path，避免外部依赖） */
  preview: 'split' | 'simple' | 'card';
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'template1',
    description: '默认模板(适用于单页)',
    preview: 'split',
  },
  {
    id: 'template2',
    description: '简易模板',
    preview: 'simple',
  },
  {
    id: 'template3',
    description: '简易模板(适用于多页)',
    preview: 'card',
  },
];

export const DEFAULT_TEMPLATE = 'template1';
