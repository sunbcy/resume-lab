# 🧾 Resume Generator（重构版）

由原 Gatsby + React + AntD + Less 项目重构而来，技术栈升级为：

- **前端**：Vue 3（Composition API）+ TypeScript + Vite + TailwindCSS 3.4.17（Yarn 管理）
- **后端**：FastAPI（Python）+ httpx + Pydantic

在线预览 / 编辑 / 导出 PDF 简历的能力与原项目保持一致，内置 3 套模板、自定义主题色、自定义模块标题、中英文国际化。

## 📁 目录结构

```
resume/
├── backend/                 # FastAPI 后端
│   ├── app/
│   │   ├── main.py          # 应用入口（CORS + 路由挂载）
│   │   ├── routers.py       # /api/resume 等路由
│   │   ├── services.py      # GitHub 抓取 / 缓存 / locale 合并
│   │   ├── schemas.py  →    # （模型定义见 routers.py）
│   │   ├── config.py        # 常量配置
│   │   └── default_resume.py# 默认简历数据
│   └── requirements.txt
└── frontend/                # Vue3 前端
    ├── src/
    │   ├── composables/     # Composition API 状态层（核心）
    │   │   ├── useResumeStore.ts   # 简历全局状态（单例）
    │   │   ├── useI18n.ts          # 国际化
    │   │   ├── useTheme.ts         # 主题色 → CSS 变量
    │   │   ├── useQuery.ts         # URL 参数
    │   │   └── useToast.ts         # 轻量消息提示
    │   ├── components/
    │   │   ├── templates/          # 三套简历模板
    │   │   ├── editor/             # 配置抽屉 / 动态表单 / 工具栏
    │   │   └── ui/                 # 基础组件（Drawer / Toast）
    │   ├── config/                 # 模块定义 / 表单 schema / 默认数据
    │   ├── locales/                # zh_CN / en_US
    │   ├── types/                  # TS 类型定义
    │   └── utils/                  # 存储 / 导出 / 深合并
    ├── tailwind.config.js
    └── vite.config.ts
```

## ✨ 已实现功能

### 1. 三套简历模板
内置 `template1`（默认，单页）/ `template2`（简易）/ `template3`（多页卡片），可在编辑抽屉「选择模板」中切换，模板实体见 `components/templates/`。

### 2. 在线编辑（编辑模式）
- 顶部「编辑 / 预览」按钮或 URL `?mode=edit` 进入；交互状态（mode / lang）会自动同步到地址栏，刷新后仍保持。
- **配置抽屉**：切换模板、调整主题色、编辑各模块（新增 / 删除 / **拖拽排序**，基于原生 HTML5 拖拽 `useDragSort`）。
- **模块标题自定义**：每个模块可单独改名（`updateTitleNameMap`），默认标题由 `config/titles.ts` + i18n 提供。
- **动态表单** `FormCreator`：按 `config/formSchema.ts` 渲染字段；长文本（如自我介绍）输入框已做自适应高度、字数统计、emoji/长链接友好显示。

### 3. 自定义主题色
`DEFAULT_THEME`（`color` / `tagColor`）通过 `useTheme` 写入 CSS 变量（`--primary-color` / `--tag-color` 等），编辑面板可实时调整，导出 JSON 时一并保存。

### 4. 中英文国际化
`locales/zh_CN.ts` 与 `en_US.ts`；顶部语言下拉切换。远程数据中的 `locales.<lang>` 字段会经深合并（`customAssign`）覆盖到当前语言，导出时回填。

### 5. 数据来源与缓存
- **默认账号**：未传 `?user` 时默认 `sunbcy`（见 `useQuery.DEFAULT_USER`），读取其同名仓库 `{user}/{user}` 的 `resume.json`。
- **后端代理**：FastAPI 负责抓取 GitHub + 服务端缓存（`CACHE_TTL=300s`）+ locale 合并，路由见 `routers.py`。
- **降级**：后端不可用时前端直接请求 `raw.githubusercontent.com`（`api/resume.ts`）。
- **本地草稿**：编辑内容按 user 自动缓存到 `localStorage`（`utils/storage.ts`，`throttle` 5s 落盘）。

### 6. 头像与技能评分
- 头像支持 `src` / `shape`（圆形/方形）/ `hidden`，可填 GitHub 头像链接（`https://avatars.githubusercontent.com/u/<id>?s=200&v=4`）。
- 技能采用星级评分（`SkillRate.vue`）。

### 7. 导出与分享
工具栏支持：复制配置（剪贴板）、保存简历（下载 JSON）、导入配置（上传 JSON）、**PDF 下载**（浏览器打印）。导出内容含 `theme` 与多语言 `locales` 回填。

### 8. 一键运行
`run.sh` 统一安装 / 启动 / 构建 / 停止 / 日志 / 清理前后端服务（开发端口 8000 + 5173）。

## 🚧 可优化项（TODO）

- **远程失败兜底** ✅ 已解决：只读模式远程失败时回退内置模板并提示。
- **头像 `size` 字段未生效** ✅ 已解决：三套模板均改为读取 `avatar.size`（默认 84px）。
- **PDF 打印分页** ✅ 已解决：抽出 `ModuleSection` 统一模块容器，打印时按模块/列表单条 `break-inside: avoid` 分块，超限模块自动退化为单条不切、整条落到下一页。
- **移动端拖拽**：`useDragSort` 为鼠标原生拖拽，触屏设备无法排序。
- **前后端数据双份维护**：默认简历数据在 `frontend/defaultResume.ts` 与 `backend/default_resume.py` 各一份，易不同步，可考虑共享一份 schema。
- **无自动化测试**：目前仅有 `vue-tsc` 类型检查，缺单元/集成测试。

## 🚀 启动

### 一键脚本（推荐）

```bash
./run.sh setup     # 首次：安装前后端依赖
./run.sh dev       # 同时启动后端(8000) + 前端(5173)
./run.sh status    # 查看运行状态
./run.sh logs      # 实时查看日志
./run.sh stop      # 停止所有服务
./run.sh build     # 前端生产构建
./run.sh clean     # 清理 venv / node_modules / dist / 日志
```

脚本会把日志写到 `.logs/`，PID 记录在同目录下，端口占用时会自动跳过并提示。

### 后端

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

接口：

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| GET  | `/api/health` | 健康检查 |
| GET  | `/api/resume?user=&branch=&lang=` | 拉取 GitHub resume.json 并按语言合并 |
| GET  | `/api/resume/default?lang=` | 内置默认模板数据 |
| POST | `/api/cache/clear` | 清空服务端缓存 |

> 后端只做「代理 + 缓存 + 国际化合并」。若后端未启动，前端会自动降级为直接请求 `raw.githubusercontent.com`。

### 前端

```bash
cd frontend
yarn install
yarn dev          # http://localhost:5173
yarn build        # 类型检查 + 构建
```

> ⚠️ 若当前 shell 存在 `NODE_ENV=production`，yarn 会跳过 devDependencies，请用 `NODE_ENV=development yarn install`。

`/api` 已通过 Vite proxy 转发到 `http://127.0.0.1:8000`。

## 🔗 URL 参数

| 参数 | 说明 | 默认值 |
| ---- | ---- | ------ |
| `user` | GitHub 用户名（读取 `{user}/{user}` 仓库的 resume.json） | `sunbcy`（传 `?user=` 空值则使用内置模板） |
| `branch` | 分支名 | `master` |
| `template` | `template1` / `template2` / `template3` | `template1` |
| `mode` | `edit` 进入编辑模式 | 只读 |
| `lang` | `zh_CN` / `en_US` | `zh_CN` |

示例：`http://localhost:5173/?user=sunbcy&template=template1&mode=edit&lang=zh_CN`

## ✨ 与原项目的对应关系

| 原项目 | 重构后 |
| ------ | ------ |
| `gatsby-config.js` / SSG | Vite SPA |
| React 类/函数组件 | Vue3 SFC + `<script setup>` |
| `helpers/customAssign` | `utils/customAssign.ts` + 后端 `services.deep_merge` |
| `helpers/fetch-resume` | `api/resume.ts` + FastAPI `/api/resume` |
| `datas/resume.ts` | `config/defaultResume.ts` + `backend/app/default_resume.py` |
| `MODULES` / `CONTENT_OF_MODULE` | `config/modules.ts` / `config/formSchema.ts` |
| `Drawer` + `FormCreator` | `editor/ConfigDrawer.vue` + `editor/FormCreator.vue` |
| AntD `Rate` / `Tag` / `message` | `SkillRate.vue` / Tailwind 标签 / `useToast` |
| react-dnd | 原生 HTML5 拖拽（`useDragSort`） |
| Less | TailwindCSS 3.4.17 |
