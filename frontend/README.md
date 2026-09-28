# 简历生成器（Resume Builder）前端

Vue 3 + TypeScript + Vite + Tailwind CSS。内置三套模板（`Template1` / `Template2` / `Template3`），支持浏览器打印导出 PDF。

## 打印 / 导出 PDF 方案

本章聚焦简历**打印排版**的关键设计（也是最近一次迭代重点改动的部分）。

### 设计目标

- 彩色侧栏（左栏浅灰 `#f6f7f9`、右栏深灰 `#f2f2f2`）在每一页（含次页）都保留，且**上下满幅出血**到页边；
- 文字在每页（含次页）的**上下都有统一内缩留白**；
- 右栏「工作经历 / 项目经历」做**条目级连续分页**：项目经历紧贴最后一段工作内容之后；当某一条（如超长项目）在页尾放不下时，**仅该条整条**落到下一页，其余条目照常排布。

### 关键实现

1. **页边距归零出血**
   `@page { margin: 0 }`，让彩色栏上下满幅出血到页边（不再被页面白边内缩）。

2. **彩色背景画在网格单元上**
   `.print-split` 在打印时强制两栏 `grid`；左栏 `:first-child` 画背景 `#f6f7f9` + 右边线，右栏保留 `bg-[#f2f2f2]`。网格单元会随右栏内容自然跨页延展并逐页绘制，因此**每一页都保留彩色侧栏并满幅出血**（比 `position: fixed` 伪元素方案更稳健，后者在部分打印引擎下不重复/不出血，还会撑出空白页）。

3. **每页文字留白 = 标题/条目的统一 `padding`**
   因为 `.module-title` 与 `.module-item` 都是原子块（`break-inside: avoid`），浏览器分页**必定落在它们的边界上**，于是：
   - 每页**顶部**：首个元素自带的 `padding-top` → 文字内缩；
   - 每页**底部**：末个元素自带的 `padding-bottom` → 文字内缩；
   - 左右两栏统一 16px，首页与次页顶/底对齐。

4. **flow 模式（条目级连续分页）**
   `ModuleSection` 新增 `flow` prop。右栏「工作经历 / 项目经历」传 `:flow="true"`，放开 `.resume-module--flow` 的「整块不切」，仅保留 `.module-item` 的「单条不切」，使模块标题/条目可跨页连续流动。

### 约束与取舍

- **纯 CSS 下 `@page` 页边距会连同背景一起内缩**，无法同时做到"每页白边 + 满幅出血"。本方案改用 `padding` 替代 `@page` 边距来内缩文字，从而兼顾"彩栏满幅出血"与"文字每页内缩"。
- **代价**：条目之间间距约等于上/下 `padding` 之和（默认 `16 + 16 = 32px`），比普通间距略宽松；这是"每页上下都留白"在纯 CSS 下的必然结果。
- **第三页风险**：新增 `padding` 会增加内容总高。若默认简历内容已接近两页上限，可能撑出第三页；此时调小下方 `16px` 即可压回两页（或见下方"进阶方案"）。

### 调参位置

`src/style.css` 的 `@media print` 区块：

| 想调整的效果 | 改哪里 |
| --- | --- |
| 退回"每页白边、彩栏内缩"稳妥方案 | `@page { margin: 0 }` → `margin: 16mm 0` |
| 文字留白更大 / 更小 | `.print-split .module-title`、`.print-split .module-item` 的 `padding-top/bottom: 16px` |
| 条目间距更紧凑、避免第三页 | 同上，调小 `16px`（如 `12px`） |
| 彩栏配色 / 边线 | `.print-split > :first-child` 的 `background` / `border-right`，右栏 `bg-[#f2f2f2]`（模板内） |

进阶方案（未实现）：若需"更大留白且不放宽条目间距、且严格保持两页"，可在 `beforeprint` 时用 JS 测量分页点，仅在每页首尾元素注入留白（不翻倍、不撑页）。

### 导出方式

预览页 → `Ctrl/Cmd + P` → 另存为 PDF。建议在打印设置中**开启"背景图形"**（Background Graphics），以确保彩色侧栏被正确打印。

## 文件改动清单（本次打印优化）

- `src/components/ModuleSection.vue`：新增 `flow?: boolean` prop，渲染 `resume-module--flow` 类。
- `src/style.css`：新增/调整 `@media print` 规则——`@page { margin: 0 }`、网格单元彩色背景满幅出血、标题/条目统一 `padding` 实现每页文字内缩、`.resume-module--flow` 条目级分页。
- `src/components/templates/Template1.vue` / `Template2.vue` / `Template3.vue`：工作经历、项目经历的 `<ModuleSection>` 均加 `:flow="true"`。
