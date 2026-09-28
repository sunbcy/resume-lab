"""默认（示例）简历数据，与前端 DEFAULT_RESUME 保持一致"""

DEFAULT_RESUME = {
    "avatar": {"src": None, "hidden": False, "shape": "circle"},
    "profile": {
        "name": "姓名",
        "email": "736****86@qq.com",
        "mobile": "156********",
        "github": "https://github.com/sunbcy",
        "zhihu": "https://zhihu.com/people/sunbcy",
        "workExpYear": "",
        "workPlace": "浙江杭州",
        "positionTitle": "前端工程师",
    },
    "educationList": [
        {
            "edu_time": ["2014.09.01", "2018.06.30"],
            "school": "华南理工大学",
            "major": "网络工程",
            "academic_degree": "本科",
        }
    ],
    "awardList": [
        {"award_info": "英语 CET6", "award_time": "2015"},
        {"award_info": "蚂蚁近卫军 卓越个人奖", "award_time": "2018.09"},
    ],
    "workExpList": [
        {
            "company_name": "蚂蚁集团",
            "department_name": "体验技术部",
            "work_time": ["2018.06", ""],
            "work_desc": (
                "1. 担任蚂蚁高管决策和管理协同产品 “数据作战室” 的前端负责人\n"
                "2. 负责蚂蚁敏捷 BI 产品 “DeepInsight” 的可视分析模块产品能力建设\n"
                "3. 数据可视化 AntV 团队核心成员，负责 G2、G2Plot 开源技术的建设"
            ),
        }
    ],
    "skillList": [
        {"skill_name": "HTML 和 CSS", "skill_desc": "", "skill_level": 89},
        {"skill_name": "TypeScript / JavaScript", "skill_level": 90},
    ],
    "projectList": [
        {
            "project_name": "数据作战室",
            "project_role": "前端负责人",
            "project_time": "2019.04 - 2020.06",
            "project_desc": "面向总裁和高管以及决策 BI 的数字化经营决策和管理协同产品。",
            "project_content": (
                "1. 项目从0到1的框架设计和开发 2. 产品体验精雕细琢的打磨 "
                "3. 建立稳定性保障机制"
            ),
        }
    ],
    "workList": [],
    "aboutme": {
        "aboutme_desc": (
            "🌱 Focus on data visualization and analysis\n"
            "自驱型前端工程师，三年多大型复杂产品开发经验。\n"
            "参与 AntV 团队开源项目 G2、G2Plot 的研发。"
        )
    },
    "locales": {
        "en_US": {
            "profile": {"name": "Xiaojuan Liao"},
            "aboutme": {
                "aboutme_desc": (
                    "🌱 Focus on data visualization and analysis\n"
                    "Self-driven front-end engineer.\n"
                    "Core developer of AntV G2 / G2Plot."
                )
            },
        }
    },
}

DEFAULT_THEME = {"color": "#2f5785", "tagColor": "#8bc34a"}
