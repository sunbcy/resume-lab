# 🧾 Resume Generator（简历生成器）

> 一个由「GitHub 仓库中的 `resume.json`」驱动的在线简历生成器：支持在线预览 / 编辑 / 导出 PDF，内置多套模板、自定义主题色、自定义模块标题与中英文国际化。

由原 Gatsby + React + AntD + Less 项目重构而来，技术栈升级为：

- **前端**：Vue 3（`<script setup>` Composition API）+ TypeScript + Vite 5 + TailwindCSS 3.4
- **后端**：FastAPI（Python）+ Uvicorn + httpx + Pydantic 2

在线预览 / 编辑 / 导出 PDF 的能力与原项目保持一致，并新增了**基于 localStorage 的本地版本管理**。

---

## ✨ 功能特性

- **3 套简历模板**：`template1`（默认单页）/ `template2`（简约）/ `template3`（多页卡片），可随时切换。
- **在线编辑**：编辑模式下可切换模板、调整主题色、编辑各模块（新增 / 删除 / **拖拽排序**）。
- **自定义主题色**：实时调整主色与标签色，导出时一并保存。
- **中英文国际化**：内置 `zh_CN` / `en_US`，远程数据可按语言深合并覆盖。
- **本地草稿自动缓存**：编辑内容按 `user` 自动缓存到 `localStorage`（节流 5s 落盘）。
- **🆕 历史版本（本地版本管理）**：编辑模式下左侧「历史版本」面板，可将当前简历**保存为新版本**（命名 + 备注），并支持**恢复 / 置顶 / 删除**，数据隔离存储在 `localStorage`（按 GitHub 用户名隔离）。
- **头像与技能评分**：头像支持 `src` / `shape` / `size` / `hidden`；技能采用星级评分。
- **导出与分享**：复制配置、下载 JSON、导入 JSON、**PDF 下载**（浏览器打印）。

---

## 🛠 技术栈

| 层 | 技术 | 版本 |
| -- | ---- | ---- |
| 前端框架 | Vue 3 | `^3.4.38` |
| 语言 | TypeScript | `^5.5.4` |
| 构建 | Vite | `^5.4.3` |
| 样式 | TailwindCSS | `3.4.17` |
| 类型检查 | vue-tsc | `2.1.6` |
| 后端 | FastAPI | `0.112.0` |
| ASGI 服务 | Uvicorn | `0.30.5` |
| HTTP 客户端 | httpx | `0.27.0` |
| 数据校验 | Pydantic | `2.8.2` |

前端状态层为自建 `composables`（非 Pinia），核心为单例 `useResumeStore`。

---

## 📁 目录结构

```
resume/
├── backend/                 # FastAPI 后端
│   └── app/
│       ├── main.py          # 应用入口（CORS + 路由挂载）
│       ├── routers.py       # /api/resume 等路由
│       ├── services.py      # GitHub 抓取 / 缓存 / locale 合并
│       ├── config.py        # 常量配置
│       └── default_resume.py# 默认简历数据
├── frontend/                # Vue3 前端
│   └── src/
│       ├── composables/     # 状态层（核心）
│       │   ├── useResumeStore.ts   # 简历全局状态（单例）
│       │   ├── useI18n.ts          # 国际化
│       │   ├── useTheme.ts         # 主题色 → CSS 变量
│       │   ├── useQuery.ts         # URL 参数
│       │   ├── useToast.ts         # 轻量消息提示
│       │   └── useDragSort.ts      # 原生 HTML5 拖拽排序
│       ├── components/
│       │   ├── templates/          # 三套简历模板
│       │   ├── editor/             # 工具栏 / 动态表单 / 历史版本面板
│       │   └── ui/                 # 基础组件（Drawer / Toast）
│       ├── config/          # 模块定义 / 表单 schema / 默认数据
│       ├── locales/         # zh_CN / en_US
│       ├── types/           # TS 类型定义
│       └── utils/           # 存储 / 导出 / 深合并
├── run.sh                   # 一键运行脚本
└── README.md
```

---

## 🚀 快速开始

### 前置依赖

- **Node.js** ≥ 18（前端）
- **Yarn**（前端包管理，`npm i -g yarn`）
- **Python** ≥ 3.10（后端）
- **Git**

### 方式一：一键脚本（推荐）

```bash
./run.sh setup     # 首次：安装前后端依赖（创建 venv + yarn install）
./run.sh dev       # 同时启动后端(8000) + 前端(5173)
./run.sh status    # 查看运行状态
./run.sh logs      # 实时查看日志（Ctrl+C 退出）
./run.sh stop      # 停止所有服务
./run.sh build     # 前端类型检查 + 生产构建
./run.sh clean     # 清理 venv / node_modules / dist / 日志
```

脚本把日志写到 `.logs/`，PID 记录在同目录；端口占用时会自动跳过并提示。

### 方式二：手动启动

**后端**

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**前端**

```bash
cd frontend
yarn install
yarn dev          # http://localhost:5173
yarn build        # 类型检查 + 构建到 dist/
```

> ⚠️ 若当前 shell 设置了 `NODE_ENV=production`，`yarn install` 会跳过 devDependencies，请使用 `NODE_ENV=development yarn install`。

前端通过 Vite proxy 将 `/api` 转发到 `http://127.0.0.1:8000`。

---

## 🧩 数据流与架构

```
┌────────────┐   编辑/预览    ┌──────────────────┐
│  浏览器     │ ───────────▶ │  Vue 前端 (SPA)   │
│ (localStorage│              └────────┬─────────┘
│  草稿+版本) │                       │ /api/* (dev proxy)
└────────────┘                        ▼
                              ┌──────────────────┐
                              │ FastAPI 后端      │
                              │ 代理+缓存+合并     │
                              └────────┬─────────┘
                                       │ httpx
                                       ▼
                              ┌──────────────────┐
                              │ GitHub resume.json│
                              │ {user}/{user}     │
                              └──────────────────┘
```

- **默认账号**：未传 `?user` 时默认 `sunbcy`，读取其同名仓库 `{user}/{user}` 的 `resume.json`。
- **后端代理**：FastAPI 负责抓取 GitHub + 服务端缓存（`CACHE_TTL=300s`）+ locale 合并。
- **降级策略**：后端不可用时，前端直接请求 `raw.githubusercontent.com`（`api/resume.ts`）。
- **本地优先**：编辑内容按 `user` 自动缓存到 `localStorage`，刷新不丢；历史版本同样以 `user` 为键隔离存储。

---

## 🌐 API 参考

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| GET  | `/api/health` | 健康检查 |
| GET  | `/api/resume?user=&branch=&lang=` | 拉取 GitHub `resume.json` 并按语言合并 |
| GET  | `/api/resume/default?lang=` | 内置默认模板数据 |
| POST | `/api/cache/clear` | 清空服务端缓存 |

> 后端只做「代理 + 缓存 + 国际化合并」。不启动后端时前端会自动降级为直连 `raw.githubusercontent.com`。

---

## 🎛 URL 参数

| 参数 | 说明 | 默认值 |
| ---- | ---- | ------ |
| `user` | GitHub 用户名（读取 `{user}/{user}` 仓库的 `resume.json`） | `sunbcy`（传 `?user=` 空值则使用内置模板） |
| `branch` | 分支名 | `master` |
| `template` | `template1` / `template2` / `template3` | `template1` |
| `mode` | `edit` 进入编辑模式 | 只读 |
| `lang` | `zh_CN` / `en_US` | `zh_CN` |

示例：`http://localhost:5173/?user=sunbcy&template=template1&mode=edit&lang=zh_CN`

---

## 📝 编辑与版本管理

### 进入编辑模式

顶部「编辑 / 预览」按钮，或 URL 加 `?mode=edit`。交互状态（`mode` / `lang`）会自动同步到地址栏，刷新后仍保持。

### 配置能力

- **配置抽屉**：切换模板、调整主题色、编辑各模块（新增 / 删除 / **拖拽排序**）。
- **模块标题自定义**：每个模块可单独改名，默认标题由 `config/titles.ts` + i18n 提供。
- **动态表单** `FormCreator`：按 `config/formSchema.ts` 渲染字段；长文本（如自我介绍）已做自适应高度、字数统计、emoji / 长链接友好显示。

### 历史版本（本地版本管理）

编辑模式下，点击工具栏「历史版本」会在**左侧**展开一个列表面板：

- **保存当前为新版本**：填写版本名称（如「投递字节-春招终稿」）与可选备注，点击「保存版本」即把当前简历快照存入 `localStorage`（按 `user` 隔离）。
- **恢复**：将某版本回填到编辑区（不删除原版本）。
- **置顶 / 取消置顶**：把常用版本固定在列表顶部。
- **删除**：移除某版本。

所有版本数据仅存于浏览器本地，不上传服务器，适合做「多投递版本」比对与回滚。

---

## 📤 导出与分享

工具栏支持：复制配置（剪贴板）、保存简历（下载 JSON）、导入配置（上传 JSON）、**PDF 下载**（浏览器打印）。导出内容包含 `theme` 与多语言 `locales` 回填。

---

## 🚢 部署

### 前端（静态托管）

```bash
cd frontend
yarn build                # 产物输出到 frontend/dist
```

将 `dist/` 部署到任意静态托管（GitHub Pages / Vercel / Nginx / OSS 等）。若要直连 GitHub（不依赖后端），前端已内置降级逻辑。

### 后端（API 服务）

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
# 生产建议：gunicorn -k uvicorn.workers.UvicornWorker app.main:app -b 0.0.0.0:8000
```

部署后，前端通过环境变量或 `vite.config.ts` 的 `proxy` / 运行时配置将 `/api` 指向后端地址即可。

---

## ❓ 常见问题

- **`yarn install` 后运行报错 / devDependencies 缺失？** 多为 `NODE_ENV=production` 导致，使用 `NODE_ENV=development yarn install`。
- **端口被占用？** 执行 `./run.sh stop` 释放 8000 / 5173，脚本也会按端口兜底清理遗留进程。
- **后端起不来？** 查看 `./run.sh logs` 或 `backend/.venv` 是否创建成功；确认 `python3` ≥ 3.10。
- **数据从哪来？** 默认读取 `github.com/{user}/{user}` 仓库根目录的 `resume.json`；不存在时回退内置模板。

---

## 🚧 可优化项（TODO）

- **移动端拖拽**：`useDragSort` 为鼠标原生拖拽，触屏设备暂无法排序。
- **前后端数据双份维护**：默认简历数据在 `frontend/src/config/defaultResume.ts` 与 `backend/app/default_resume.py` 各一份，可考虑共享一份 schema。
- **无自动化测试**：目前仅有 `vue-tsc` 类型检查，缺单元 / 集成测试。
- **远程失败兜底** ✅ 已解决：只读模式远程失败时回退内置模板并提示。
- **头像 `size` 字段未生效** ✅ 已解决：三套模板均改为读取 `avatar.size`（默认 84px）。
- **PDF 打印分页** ✅ 已解决：统一模块容器，按模块 / 列表单条 `break-inside: avoid` 分块。

---

## 🔗 与原项目的对应关系

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

---

## 📄 License

本项目仅供学习与交流使用，遵循仓库根目录 `LICENSE`（如未单独声明，默认按内部/个人项目处理）。
