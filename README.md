# SkillVault

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/SkillVault/skillvault?style=social)](https://github.com/SkillVault/skillvault/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/SkillVault/skillvault/pulls)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61dafb?logo=react)](https://react.dev/)
[![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-3178c6?logo=typescript)](https://www.typescriptlang.org/)

> 一个本地优先的 Agent Skills 管理器：解析 `SKILL.md`、分类筛选、一键启停，并批量生成可直接运行的安装脚本。

SkillVault 把散落在各处的 Agent Skills 收进一个精致的控制台。内置 10 个真实可用的示例技能，打开即有内容；你粘贴的每一份 `SKILL.md` 都会在本地被解析、预览并保存，数据绝不离开浏览器。

## ✨ 特性

- **技能卡片网格** — 名称、描述、分类标签、来源、启用状态一目了然，磨砂玻璃 + 霓虹强调色。
- **SKILL.md 解析** — 粘贴全文即时解析 YAML frontmatter（`name`、`description`、可选 `allowed-tools`、`category`），失败时给出明确的中文错误提示。
- **实时预览** — 添加弹窗左侧编辑、右侧即时呈现解析后的卡片，支持折叠块、YAML 列表等多种写法。
- **搜索与筛选** — 按名称/描述搜索，按分类过滤，支持「仅已启用」；按 `/` 快速聚焦搜索框。
- **启用/禁用** — 卡片开关即时生效，状态持久化到 localStorage，并直接影响批量安装脚本的内容。
- **统计面板** — 技能总数、已启用数、分类覆盖数、本次会话新增数实时更新。
- **安装命令** — 每张卡片提供可复制的安装命令；一键复制包含全部已启用技能的自包含 shell 脚本。
- **详情抽屉** — 点击卡片查看带行号的完整 `SKILL.md` 原文，支持复制原文与快速启停。
- **本地优先** — 纯前端实现，无后端、无遥测、无外部依赖，所有数据只存在你的浏览器里。
- **精致界面** — 深色主题、渐变发光、玻璃拟态、微交互动效与完整响应式适配。

## 🚀 快速开始

```bash
git clone https://github.com/SkillVault/skillvault.git
cd skillvault
npm install
npm run dev
```

打开终端提示的地址（默认 `http://localhost:5173`）即可使用。生产构建：

```bash
npm run build
npm run preview
```

## 🎮 核心玩法

1. **浏览内置技能** — 打开页面即可看到 code-review、security-audit、design-critique 等 10 个示例技能。
2. **找到需要的技能** — 使用搜索框或分类标签快速定位，按 `/` 可直接聚焦搜索。
3. **管理启用状态** — 用卡片右上角的开关决定哪些技能参与安装脚本；关闭的技能会变暗但不会删除。
4. **添加自己的技能** — 点击「添加技能」，粘贴完整的 `SKILL.md`，右侧实时校验并预览解析结果，确认后加入技能库。
5. **一键安装** — 复制单张卡片的安装命令，或点击「复制全部安装脚本」得到一段可直接在终端运行的 shell 脚本。

### SKILL.md 格式

```markdown
---
name: my-skill
description: 用一句话描述这个技能能做什么，以及何时使用它。
category: 开发
allowed-tools: Read, Grep, Bash
---

# My Skill

技能的具体指令写在 frontmatter 之后……
```

- `name`、`description` 为必填字段；
- `allowed-tools`、`category` 可选，`category` 省略时会根据名称与描述自动推断；
- `allowed-tools` 支持逗号分隔、`[Read, Grep]` 数组以及 YAML 列表三种写法。

## 📸 截图

> 截图占位区：将应用运行在 `npm run dev` 后，把界面截图放在 `docs/screenshots/` 目录下，并在此处嵌入：
>
> ```markdown
> ![SkillVault 技能总览](docs/screenshots/overview.png)
> ![添加技能弹窗](docs/screenshots/add-skill.png)
> ![技能详情抽屉](docs/screenshots/detail.png)
> ```

## 🛠 技术栈

Vite · React 19 · TypeScript · 原生 CSS。仅使用 React 与 React DOM 两个运行时依赖，图表与图标均为手写内联 SVG。

## 📄 License

[MIT](LICENSE) © 2026 SkillVault contributors
