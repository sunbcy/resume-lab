import type { ResumeConfig } from '@/types/resume';

/** 各模块默认标题（受 i18n 影响） */
export function getDefaultTitleNameMap(
  t: (key: string) => string,
): NonNullable<ResumeConfig['titleNameMap']> {
  return {
    educationList: t('教育背景'),
    workExpList: t('工作经历'),
    projectList: t('项目经历'),
    skillList: t('专业技能'),
    awardList: t('更多信息'),
    workList: t('个人作品'),
    aboutme: t('自我介绍'),
  };
}
