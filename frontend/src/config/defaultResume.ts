import type { ResumeConfig, ThemeConfig } from '@/types/resume';

/** 默认主题 */
export const DEFAULT_THEME: ThemeConfig = {
  color: '#2f5785',
  tagColor: '#8bc34a',
};

/** 默认（示例）简历数据，与原项目 RESUME_INFO 一致 */
export const DEFAULT_RESUME: ResumeConfig = {
  avatar: { src: undefined, hidden: false, shape: 'circle' },
  profile: {
    name: '姓名',
    email: '736****86@qq.com',
    mobile: '156********',
    github: 'https://github.com/sunbcy',
    zhihu: 'https://zhihu.com/people/sunbcy',
    workExpYear: '',
    workPlace: '浙江杭州',
    positionTitle: '前端工程师',
  },
  educationList: [
    {
      edu_time: ['2014.09.01', '2018.06.30'],
      school: '华南理工大学',
      major: '网络工程',
      academic_degree: '本科',
    },
  ],
  awardList: [
    { award_info: '英语 CET6', award_time: '2015' },
    { award_info: '蚂蚁近卫军 卓越个人奖', award_time: '2018.09' },
    { award_info: '前端练习生 可视化讲师', award_time: '2020.10' },
    {
      award_info:
        '前端早早聊 分享 “如何构思和开发开箱即用的可视化图表库 G2Plot”',
      award_time: '2021.07',
    },
  ],
  workExpList: [
    {
      company_name: '蚂蚁集团',
      department_name: '体验技术部',
      work_time: ['2018.06', ''],
      work_desc: `1. 担任蚂蚁高管决策和管理协同产品 “数据作战室” 的前端负责人\n2. 负责蚂蚁敏捷 BI 产品 “DeepInsight” 的可视分析模块产品能力建设\n3. 数据可视化 AntV 团队核心成员，负责 G2、G2Plot 开源技术的建设`,
    },
    {
      company_name: '蚂蚁金服',
      department_name: '大数据部',
      work_time: ['2017.06', '2017.12'],
      work_desc:
        '前端实习生。使用 React 参与开发多类产品：数据研发平台、数据决策平台、数据分析平台的研发工作，同时也参与大型 BI 产品的重构工作，有良好的编码习惯。',
    },
  ],
  skillList: [
    { skill_name: 'HTML 和 CSS', skill_desc: '', skill_level: 89 },
    { skill_name: 'TypeScript / JavaScript', skill_level: 90 },
    {
      skill_name: '数据可视化',
      skill_desc: '丰富的可视化工程实践以及开源经验',
      skill_level: 90,
    },
    {
      skill_name: 'React / 前端工程化',
      skill_desc: '大型前端项目经验以及组件库开发经验',
      skill_level: 80,
    },
  ],
  projectList: [
    {
      project_name: '数据作战室',
      project_role: '前端负责人',
      project_time: '2019.04 - 2020.06',
      project_desc:
        '面向总裁和高管以及决策 BI 的数字化经营决策和管理协同产品。',
      project_content:
        '1. 项目从0到1的框架设计和开发 2. 产品体验精雕细琢的打磨 3. 建立稳定性保障机制',
    },
  ],
  workList: [],
  aboutme: {
    aboutme_desc: `🌱 Focus on data visualization and analysis\n自驱型前端工程师，三年多大型复杂产品开发经验。\n参与 AntV 团队开源项目 G2、G2Plot 的研发。`,
  },
  locales: {
    en_US: {
      profile: {
        name: 'Xiaojuan Liao',
        email: '736****86@qq.com',
        mobile: '156********',
        github: 'https://github.com/sunbcy',
        zhihu: 'https://zhihu.com/people/sunbcy',
        workExpYear: '',
      },
      educationList: [
        {
          edu_time: ['2014.09.01', '2018.06.30'],
          school: 'SCUT',
          major: 'Computer Science',
          academic_degree: 'Bachelor',
        },
      ],
      workExpList: [
        {
          company_name: 'Ant Group',
          department_name: 'AFX',
          work_time: ['2018.06', ''],
          work_desc:
            '1. Front-end owner of the executive decision product\n2. Responsible for visual analysis of DeepInsight\n3. Core member of AntV, G2 / G2Plot',
        },
      ],
      skillList: [
        { skill_name: 'HTML & CSS', skill_desc: '', skill_level: 89 },
        { skill_name: 'TypeScript / JavaScript', skill_level: 90 },
        { skill_name: 'Data Visualization', skill_level: 90 },
        { skill_name: 'React / Front-end Engineering', skill_level: 80 },
      ],
      aboutme: {
        aboutme_desc: `🌱 Focus on data visualization and analysis\nSelf-driven front-end engineer with rich experience in large-scale products.\nCore developer of AntV G2 / G2Plot.`,
      },
    },
  },
};
