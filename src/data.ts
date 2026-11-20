import type { Skill } from './types'

interface BuiltinSeed {
  name: string
  description: string
  category: Skill['category']
  allowedTools: string[]
  enabled?: boolean
  body: string
}

/**
 * 内置示例技能。每个 body 都是一份完整的 SKILL.md（含 frontmatter），
 * 保证从卡片详情复制出的内容与真实可用的技能文件一致。
 */
const seeds: BuiltinSeed[] = [
  {
    name: 'code-review',
    description: '审查代码变更，发现潜在缺陷、风格问题与安全风险，并给出可执行的改进建议。',
    category: '开发',
    allowedTools: ['Read', 'Grep', 'Glob', 'Bash'],
    body: `---
name: code-review
description: 审查代码变更，发现潜在缺陷、风格问题与安全风险，并给出可执行的改进建议。
category: 开发
allowed-tools: Read, Grep, Glob, Bash
---

# Code Review

## 使用场景
当完成一段实现、提交 Pull Request 或接手他人代码时，使用本技能进行系统性审查。

## 执行步骤
1. 先阅读变更的整体背景与需求，明确本次修改的目标。
2. 逐文件检查逻辑正确性，重点关注边界条件、异常处理与并发场景。
3. 检查是否存在安全问题，例如输入未校验、敏感信息泄露或权限缺失。
4. 评估代码可读性与一致性，包括命名、重复代码与注释质量。
5. 按严重程度（阻断 / 建议 / 可选）分组输出结论。

## 输出要求
- 每条问题都要指出具体文件与行号。
- 说明问题的影响，并给出可直接采用的修改示例。
- 若未发现问题，明确说明已检查的范围与结论。

## 原则
只提出有依据的问题，避免主观偏好式的琐碎评论。`,
  },
  {
    name: 'security-audit',
    description: '对代码与依赖进行安全审计，识别注入、越权、密钥泄露等常见漏洞并给出修复方案。',
    category: '安全',
    allowedTools: ['Read', 'Grep', 'Bash'],
    body: `---
name: security-audit
description: 对代码与依赖进行安全审计，识别注入、越权、密钥泄露等常见漏洞并给出修复方案。
category: 安全
allowed-tools: Read, Grep, Bash
---

# Security Audit

## 使用场景
在版本发布前、引入第三方依赖后，或处理安全事件时，对代码库进行定向安全审计。

## 检查清单
1. 注入风险：SQL、命令、模板与路径拼接是否使用了可信的输入过滤。
2. 认证与授权：是否存在越权访问、会话固定或权限校验缺失。
3. 敏感数据：密钥、令牌与密码是否硬编码或写入日志。
4. 依赖安全：检查已知 CVE 与过时版本，评估传递依赖风险。
5. 配置问题：CORS、CSP、Cookie 属性与错误详情暴露是否恰当。

## 输出要求
按风险等级（严重 / 高危 / 中危 / 低危）列出发现，每项包含：
- 漏洞位置与触发条件；
- 可能被造成的实际影响；
- 具体的修复代码或配置变更。

## 原则
不提供可被直接利用的攻击载荷，只给出定位问题与修复所需的必要信息。`,
  },
  {
    name: 'design-critique',
    description: '从可用性、可访问性与视觉一致性角度评审界面设计，提出具体可落地的改进建议。',
    category: '设计',
    allowedTools: ['Read', 'Glob'],
    body: `---
name: design-critique
description: 从可用性、可访问性与视觉一致性角度评审界面设计，提出具体可落地的改进建议。
category: 设计
allowed-tools: Read, Glob
---

# Design Critique

## 使用场景
当设计稿或页面实现完成、需要在开发前发现体验问题时，使用本技能进行结构化评审。

## 评审维度
1. 信息层级：核心任务是否在首屏可见，视觉动线是否符合阅读习惯。
2. 一致性：间距、字号、颜色与组件状态是否遵循统一的设计语言。
3. 可用性：交互反馈是否及时，错误提示是否可理解且可恢复。
4. 可访问性：对比度、焦点状态、键盘操作与屏幕阅读器语义是否完备。
5. 响应式：在窄屏与宽屏下的布局是否都保持可用。

## 输出要求
- 按优先级列出问题，区分「阻断上线」与「体验优化」。
- 对每条建议说明原因，并尽量给出可落地的参数或替代方案。
- 肯定做得好的部分，避免只输出负面评价。`,
  },
  {
    name: 'write-release-notes',
    description: '根据提交记录与变更内容生成结构清晰、用户友好的版本发布说明。',
    category: '写作',
    allowedTools: ['Bash', 'Read'],
    enabled: true,
    body: `---
name: write-release-notes
description: 根据提交记录与变更内容生成结构清晰、用户友好的版本发布说明。
category: 写作
allowed-tools: Bash, Read
---

# Write Release Notes

## 使用场景
在准备版本发布、需要把零散的提交整理成面向用户的说明时，使用本技能。

## 执行步骤
1. 读取两个版本标签之间的提交记录，按类型进行归类。
2. 过滤掉纯格式化、依赖 bump 等对用户无感知的变更。
3. 将技术描述改写为用户能理解的价值陈述。
4. 标注破坏性变更、迁移步骤与已知问题。

## 输出结构
- 版本标题与一句话摘要
- 新功能
- 改进
- 修复
- 破坏性变更（如有）
- 升级提示

## 风格要求
使用简洁的中文，避免内部术语；每条说明以动词开头，控制在两行以内。`,
  },
  {
    name: 'test-generator',
    description: '为给定函数或模块生成高覆盖率的单元测试，覆盖正常路径、边界条件与异常路径。',
    category: '开发',
    allowedTools: ['Read', 'Grep', 'Bash'],
    body: `---
name: test-generator
description: 为给定函数或模块生成高覆盖率的单元测试，覆盖正常路径、边界条件与异常路径。
category: 开发
allowed-tools: Read, Grep, Bash
---

# Test Generator

## 使用场景
当新增核心逻辑、补充遗留代码的测试，或需要提升覆盖率时，使用本技能生成测试用例。

## 执行步骤
1. 阅读目标函数的签名、类型定义与现有测试，确定项目使用的测试框架。
2. 列出输入空间：典型值、边界值、空值与非法值。
3. 为每个分支编写独立用例，断言应验证结果而非实现细节。
4. 对外部依赖使用 mock，并确保用例之间互不干扰。

## 覆盖目标
- 正常路径与主要业务分支；
- 边界条件，例如空集合、最大值与最小值；
- 异常路径，例如依赖失败与参数非法。

## 输出要求
遵循项目现有测试的命名与结构风格，用例名应直接描述被验证的行为。`,
  },
  {
    name: 'api-doc-writer',
    description: '根据代码签名与调用示例生成清晰的 API 文档，包含参数、返回值与错误码说明。',
    category: '写作',
    allowedTools: ['Read', 'Grep'],
    enabled: false,
    body: `---
name: api-doc-writer
description: 根据代码签名与调用示例生成清晰的 API 文档，包含参数、返回值与错误码说明。
category: 写作
allowed-tools: Read, Grep
---

# API Doc Writer

## 使用场景
当新增或调整对外接口、需要同步维护文档时，使用本技能从代码生成准确的 API 说明。

## 执行步骤
1. 读取接口定义、类型声明与中间件，确认真实的请求与响应结构。
2. 梳理每个参数的名称、类型、是否必填与取值范围。
3. 从实现中提取可能的错误码与触发条件。
4. 为每个接口补充一段可直接运行的调用示例。

## 输出结构
- 接口概述与鉴权要求
- 请求方法与路径
- 参数表
- 响应示例
- 错误码表
- 调用示例

## 原则
文档必须与代码保持一致；无法从代码确认的信息应标记为待补充，而不是猜测。`,
  },
  {
    name: 'deploy-checklist',
    description: '在发布前执行部署检查清单，核对环境变量、数据库迁移、回滚方案与监控告警。',
    category: '运维',
    allowedTools: ['Read', 'Bash', 'Grep'],
    body: `---
name: deploy-checklist
description: 在发布前执行部署检查清单，核对环境变量、数据库迁移、回滚方案与监控告警。
category: 运维
allowed-tools: Read, Bash, Grep
---

# Deploy Checklist

## 使用场景
在生产环境发布前，按清单逐项核对，降低人为遗漏导致的事故风险。

## 检查项
1. 配置：必需环境变量已注入，密钥未落入代码仓库。
2. 依赖：构建产物可复现，锁文件已提交且版本一致。
3. 数据库：迁移脚本已评审，包含可逆的回滚步骤。
4. 健康探针：启动、存活与就绪探针均能正确反映服务状态。
5. 回滚：上一版本镜像或产物可用，回滚步骤经过演练。
6. 监控：核心指标、错误率与告警规则已就位。
7. 沟通：发布窗口、负责人与应急联络方式已确认。

## 输出要求
以勾选清单形式呈现，未通过项必须标注负责人和补齐时间，全部通过后才建议放行。`,
  },
  {
    name: 'performance-profiler',
    description: '分析性能瓶颈，定位慢查询、重复渲染与内存泄漏，并给出可量化的优化建议。',
    category: '运维',
    allowedTools: ['Read', 'Grep', 'Bash'],
    enabled: false,
    body: `---
name: performance-profiler
description: 分析性能瓶颈，定位慢查询、重复渲染与内存泄漏，并给出可量化的优化建议。
category: 运维
allowed-tools: Read, Grep, Bash
---

# Performance Profiler

## 使用场景
当接口响应变慢、页面卡顿或资源占用异常升高时，使用本技能进行系统性的瓶颈定位。

## 分析路径
1. 建立基线：记录当前延迟、吞吐量与资源占用的量化指标。
2. 分层排查：依次检查网络、应用、缓存与数据库层。
3. 数据库：识别缺失索引、N+1 查询与全表扫描。
4. 前端：定位重复渲染、过大的包体积与泄漏的事件监听。
5. 内存：检查未释放的引用、无界缓存与频繁的对象分配。

## 输出要求
- 按影响程度排序瓶颈，附定位依据与相关数据。
- 每条优化建议说明预期收益与实施成本。
- 给出优化后的验证方法与回归指标。`,
  },
  {
    name: 'refactor-assistant',
    description: '识别代码异味并给出保持行为不变的渐进式重构方案，降低长期维护成本。',
    category: '开发',
    allowedTools: ['Read', 'Grep', 'Bash'],
    body: `---
name: refactor-assistant
description: 识别代码异味并给出保持行为不变的渐进式重构方案，降低长期维护成本。
category: 开发
allowed-tools: Read, Grep, Bash
---

# Refactor Assistant

## 使用场景
当代码难以理解、修改风险高或重复模式不断出现时，使用本技能规划安全的重构。

## 识别信号
- 过长函数与过深嵌套；
- 重复逻辑与复制粘贴的代码块；
- 命名含糊、职责混杂的模块；
- 过长的参数列表与全局可变状态。

## 执行步骤
1. 确认现有测试覆盖，必要时先补充刻画行为的测试。
2. 将重构拆成可被独立验证的小步骤。
3. 每一步都保持对外行为不变，并运行测试确认。
4. 优先使用成熟的重构手法，避免引入新的抽象层次。

## 输出要求
给出分步计划，每步说明改动范围、风险与验证方式，并明确哪些改动应单独提交。`,
  },
  {
    name: 'accessibility-audit',
    description: '检查界面可访问性，发现对比度、键盘导航与语义化问题，帮助产品符合 WCAG 标准。',
    category: '设计',
    allowedTools: ['Read', 'Glob'],
    body: `---
name: accessibility-audit
description: 检查界面可访问性，发现对比度、键盘导航与语义化问题，帮助产品符合 WCAG 标准。
category: 设计
allowed-tools: Read, Glob
---

# Accessibility Audit

## 使用场景
在页面上线前或收到无障碍反馈时，使用本技能对照 WCAG 准则进行系统性检查。

## 检查维度
1. 感知：文本与背景对比度是否达标，图片是否有替代文本，信息是否不只依赖颜色传达。
2. 操作：所有交互是否可通过键盘完成，焦点顺序是否合理且可见。
3. 理解：表单标签是否明确，错误提示是否说明原因与修正方式。
4. 健壮：是否使用语义化 HTML，ARIA 属性是否正确且不过度。
5. 适配：在缩放、高对比度与屏幕阅读器下是否仍可用。

## 输出要求
按 WCAG 级别列出问题，每项包含位置、影响的用户群体、修复建议与对应的验收方式。`,
  },
]

export const BUILTIN_SKILLS: Skill[] = seeds.map((seed) => ({
  id: `builtin-${seed.name}`,
  name: seed.name,
  description: seed.description,
  category: seed.category,
  allowedTools: seed.allowedTools,
  enabled: seed.enabled ?? true,
  source: 'built-in',
  content: seed.body,
}))
