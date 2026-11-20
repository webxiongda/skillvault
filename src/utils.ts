import type { Category, ParseResult, Skill } from './types'

export const CATEGORIES: Category[] = ['开发', '设计', '安全', '写作', '运维', '其他']

export const CATEGORY_COLORS: Record<Category, string> = {
  开发: '#a78bfa',
  设计: '#f472b6',
  安全: '#fb7185',
  写作: '#38bdf8',
  运维: '#34d399',
  其他: '#a1a1aa',
}

// 按优先级匹配关键词，用于推断未声明 category 的技能
const KEYWORD_RULES: Array<[Category, RegExp]> = [
  ['安全', /安全|漏洞|注入|越权|密钥|凭据|审计|security|audit|vulnerab/i],
  ['设计', /设计|视觉|界面|交互|可访问|无障碍|design|\bui\b|\bux\b|accessib/i],
  ['写作', /写作|文档|说明|文案|发布说明|提交信息|prompt|write|doc|readme/i],
  ['运维', /运维|部署|监控|回滚|性能|扩容|deploy|\bops\b|performance|monitor/i],
  ['开发', /代码|函数|测试|重构|调试|开发|review|refactor|test|code/i],
]

function unquote(value: string): string {
  if (value.length >= 2) {
    const first = value[0]
    const last = value[value.length - 1]
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1)
    }
  }
  return value
}

function parseList(value: string): string[] {
  const cleaned = value.trim().replace(/^\[/, '').replace(/\]$/, '')
  return cleaned
    .split(',')
    .map((item) => unquote(item.trim()))
    .filter(Boolean)
}

function normalizeCategory(value: string): Category | null {
  const trimmed = value.trim()
  return (CATEGORIES as string[]).includes(trimmed) ? (trimmed as Category) : null
}

function inferCategory(text: string): Category {
  for (const [category, pattern] of KEYWORD_RULES) {
    if (pattern.test(text)) return category
  }
  return '其他'
}

/** 解析 SKILL.md 的 YAML frontmatter，失败时返回明确的中文错误 */
export function parseSkillMarkdown(raw: string): ParseResult {
  const text = raw.replace(/\r\n?/g, '\n')
  const lines = text.split('\n')

  if (lines[0]?.trim() !== '---') {
    return { ok: false, error: '缺少 YAML frontmatter：文件必须以单独一行 --- 开头' }
  }

  let close = -1
  for (let i = 1; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (trimmed === '---' || trimmed === '...') {
      close = i
      break
    }
  }
  if (close === -1) {
    return { ok: false, error: 'frontmatter 未闭合：找不到结束的 --- 分隔符' }
  }

  const fm = lines.slice(1, close)
  const fields: Record<string, string> = {}

  for (let i = 0; i < fm.length; i++) {
    const line = fm[i]
    if (!line.trim() || line.trim().startsWith('#')) continue
    const match = line.match(/^([\w-]+)\s*:\s*(.*)$/)
    if (!match) continue

    const key = match[1].toLowerCase()
    let value = match[2].trim()

    if (/^[>|][+-]?$/.test(value)) {
      // 多行块标量：> 折叠为单行，| 保留换行
      const folded = value[0] === '>'
      const strip = value.includes('-')
      const buffer: string[] = []
      let j = i + 1
      while (j < fm.length && /^\s+/.test(fm[j])) {
        buffer.push(fm[j].trim())
        j++
      }
      value = buffer.join(folded ? ' ' : '\n')
      if (strip) value = value.replace(/\s+$/, '')
      i = j - 1
    } else if (value === '' && fm[i + 1] && /^\s*-\s+/.test(fm[i + 1])) {
      // YAML 列表写法：allowed-tools:\n  - Read\n  - Grep
      const buffer: string[] = []
      let j = i + 1
      while (j < fm.length && /^\s*-\s+/.test(fm[j])) {
        buffer.push(fm[j].replace(/^\s*-\s+/, '').trim())
        j++
      }
      value = buffer.join(', ')
      i = j - 1
    } else {
      value = unquote(value)
    }
    fields[key] = value
  }

  const name = (fields.name || '').trim()
  const description = (fields.description || '').trim()

  if (!name) {
    return { ok: false, error: '缺少必填字段 name：请在 frontmatter 中声明技能名称' }
  }
  if (!/^[a-zA-Z0-9][a-zA-Z0-9-_]*$/.test(name)) {
    return { ok: false, error: 'name 格式不合法：仅允许字母、数字、连字符与下划线，且以字母或数字开头' }
  }
  if (!description) {
    return { ok: false, error: '缺少必填字段 description：请补充技能描述' }
  }

  const allowedTools = parseList(fields['allowed-tools'] || fields.allowedtools || '')
  const category = normalizeCategory(fields.category || '') || inferCategory(`${name} ${description}`)

  return { ok: true, skill: { name, description, category, allowedTools } }
}

export const SAMPLE_SKILL_MD = `---
name: my-awesome-skill
description: 在这里用一句话描述这个技能能做什么，以及应该在什么时候使用它。
category: 开发
allowed-tools: Read, Grep, Bash
---

# My Awesome Skill

## 使用场景
当遇到某种特定任务时，使用本技能。

## 执行步骤
1. 读取相关上下文
2. 分析并给出方案
3. 输出结果
`

/** 单个技能的快速安装命令 */
export function installCommand(skill: Skill): string {
  return `mkdir -p ~/.claude/skills/${skill.name} && cp SKILL.md ~/.claude/skills/${skill.name}/SKILL.md`
}

/** 生成自包含的批量安装脚本，直接写入完整 SKILL.md 内容 */
export function buildInstallScript(skills: Skill[]): string {
  const lines: string[] = [
    '#!/usr/bin/env bash',
    `# SkillVault · 批量安装 ${skills.length} 个已启用技能`,
    'set -e',
    '',
  ]
  for (const skill of skills) {
    lines.push(`# ── ${skill.name} ── ${skill.description}`)
    lines.push(`mkdir -p ~/.claude/skills/${skill.name}`)
    lines.push(`cat > ~/.claude/skills/${skill.name}/SKILL.md <<'SKILLVAULT_EOF'`)
    lines.push(skill.content.replace(/\s+$/, ''))
    lines.push('SKILLVAULT_EOF')
    lines.push('')
  }
  return lines.join('\n')
}

/** 优先使用异步剪贴板 API，非安全上下文回退到 execCommand */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // 回退到兼容方案
  }
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

/** 生成带元信息的 JSON 备份载荷 */
export function buildExportPayload(skills: Skill[]): string {
  return JSON.stringify({
    format: 'skillvault.library',
    version: 1,
    exportedAt: new Date().toISOString(),
    count: skills.length,
    skills,
  }, null, 2)
}

/** 校验并规范化外部 JSON 技能数据，非法数据直接给出中文原因 */
export function normalizeImportedSkills(raw: unknown): Skill[] {
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' ? (raw as Record<string, unknown>).skills : null
  if (!Array.isArray(list)) {
    throw new Error('JSON 结构不正确：应为技能数组，或包含 skills 数组的对象')
  }

  return list.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`第 ${index + 1} 项不是有效的技能对象`)
    }
    const source = item as Record<string, unknown>
    const name = typeof source.name === 'string' ? source.name.trim() : ''
    if (!name) throw new Error(`第 ${index + 1} 项缺少 name 字段`)

    const description = typeof source.description === 'string' && source.description.trim()
      ? source.description.trim()
      : '（导入技能暂无描述）'
    const categoryValue = typeof source.category === 'string' ? source.category : ''
    const category: Category = CATEGORIES.includes(categoryValue as Category) ? (categoryValue as Category) : '其他'
    const allowedTools = Array.isArray(source.allowedTools)
      ? source.allowedTools.filter((tool): tool is string => typeof tool === 'string' && Boolean(tool.trim()))
      : []
    const content = typeof source.content === 'string' && source.content.trim()
      ? source.content
      : `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n`

    return {
      id: typeof source.id === 'string' && source.id
        ? source.id
        : `user-import-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      description,
      category,
      allowedTools,
      enabled: typeof source.enabled === 'boolean' ? source.enabled : true,
      source: 'user' as const,
      content,
    }
  })
}

/** 通过 Blob URL 下载文本文件，使用完立即释放引用 */
export function downloadText(filename: string, text: string, mime = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
