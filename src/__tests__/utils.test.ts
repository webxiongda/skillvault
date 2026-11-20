import { describe, it, expect } from 'vitest'
import {
  CATEGORIES,
  CATEGORY_COLORS,
  parseSkillMarkdown,
  installCommand,
  buildInstallScript,
  buildExportPayload,
  normalizeImportedSkills,
} from '../utils'
import type { Skill } from '../types'

const fullSkill = (overrides: Partial<Skill> = {}): Skill => ({
  id: 's1',
  name: 'demo-skill',
  description: 'a demo',
  category: '开发',
  allowedTools: [],
  enabled: true,
  source: 'user',
  content: '---\nname: demo-skill\ndescription: a demo\n---\n\nbody',
  ...overrides,
})

describe('CATEGORIES 与颜色', () => {
  it('六类齐全且每类都有颜色', () => {
    expect(CATEGORIES).toHaveLength(6)
    for (const c of CATEGORIES) expect(CATEGORY_COLORS[c]).toMatch(/^#/)
  })
})

describe('parseSkillMarkdown', () => {
  it('解析完整 frontmatter', () => {
    const raw = [
      '---',
      'name: my-skill',
      'description: does things',
      'allowed-tools: Read, Grep',
      'category: 开发',
      '---',
      '',
      'body',
    ].join('\n')
    const r = parseSkillMarkdown(raw)
    expect(r.ok).toBe(true)
    expect(r.skill).toMatchObject({
      name: 'my-skill',
      description: 'does things',
      category: '开发',
      allowedTools: ['Read', 'Grep'],
    })
  })

  it('支持 YAML 列表写法的 allowed-tools', () => {
    const raw = '---\nname: x\ndescription: y\nallowed-tools:\n  - Read\n  - Grep\n---\n'
    expect(parseSkillMarkdown(raw).skill?.allowedTools).toEqual(['Read', 'Grep'])
  })

  it('支持多行块标量描述', () => {
    const raw = '---\nname: x\ndescription: |\n  line one\n  line two\n---\n'
    expect(parseSkillMarkdown(raw).skill?.description).toBe('line one\nline two')
  })

  it('去除字段值两端的引号', () => {
    const raw = '---\nname: "quoted"\ndescription: "desc"\n---\n'
    expect(parseSkillMarkdown(raw).skill?.name).toBe('quoted')
  })

  it('根据关键词推断缺失的 category', () => {
    const raw = '---\nname: sec\ndescription: security audit for vulnerabilities\n---\n'
    expect(parseSkillMarkdown(raw).skill?.category).toBe('安全')
  })

  it('缺少 frontmatter 返回明确错误', () => {
    const r = parseSkillMarkdown('# just markdown')
    expect(r.ok).toBe(false)
    expect(r.error).toContain('frontmatter')
  })

  it('frontmatter 未闭合返回错误', () => {
    const r = parseSkillMarkdown('---\nname: x\n')
    expect(r.ok).toBe(false)
    expect(r.error).toContain('未闭合')
  })

  it('缺少 name 或 description 分别报错', () => {
    expect(parseSkillMarkdown('---\ndescription: d\n---\n').error).toContain('name')
    expect(parseSkillMarkdown('---\nname: x\n---\n').error).toContain('description')
  })

  it('非法 name 格式被拒绝', () => {
    const r = parseSkillMarkdown('---\nname: "bad name!"\ndescription: d\n---\n')
    expect(r.ok).toBe(false)
    expect(r.error).toContain('格式')
  })
})

describe('installCommand', () => {
  it('生成以技能名为目录的安装命令', () => {
    const cmd = installCommand(fullSkill({ name: 'my-skill' }))
    expect(cmd).toContain('mkdir -p ~/.claude/skills/my-skill')
    expect(cmd).toContain('cp SKILL.md ~/.claude/skills/my-skill/SKILL.md')
  })
})

describe('buildInstallScript', () => {
  it('空技能列表仍生成可执行的脚本头', () => {
    const script = buildInstallScript([])
    expect(script).toContain('#!/usr/bin/env bash')
    expect(script).toContain('set -e')
    expect(script).toContain('批量安装 0 个')
  })

  it('每个技能都写入 heredoc 完整内容', () => {
    const script = buildInstallScript([
      fullSkill({ name: 'a', content: '---\nname: a\n---\nA' }),
      fullSkill({ name: 'b', content: '---\nname: b\n---\nB' }),
    ])
    expect(script).toContain("<<'SKILLVAULT_EOF'")
    expect(script).toContain('name: a')
    expect(script).toContain('name: b')
    expect(script).toContain('批量安装 2 个')
  })
})

describe('buildExportPayload', () => {
  it('生成可 JSON.parse 往返的载荷', () => {
    const payload = buildExportPayload([fullSkill()])
    const parsed = JSON.parse(payload)
    expect(parsed.format).toBe('skillvault.library')
    expect(parsed.version).toBe(1)
    expect(parsed.count).toBe(1)
    expect(parsed.skills).toHaveLength(1)
  })
})

describe('normalizeImportedSkills', () => {
  it('接受技能数组', () => {
    const skills = normalizeImportedSkills([{ name: 'x', description: 'd' }])
    expect(skills).toHaveLength(1)
    expect(skills[0].name).toBe('x')
  })

  it('接受包含 skills 数组的对象', () => {
    const skills = normalizeImportedSkills({ skills: [{ name: 'y' }] })
    expect(skills[0].name).toBe('y')
  })

  it('非数组/对象结构抛错', () => {
    expect(() => normalizeImportedSkills('oops')).toThrow(/结构不正确/)
    expect(() => normalizeImportedSkills(42)).toThrow(/结构不正确/)
  })

  it('缺少 name 的项抛错', () => {
    expect(() => normalizeImportedSkills([{ description: 'no name' }])).toThrow(/name/)
  })

  it('规范化缺失字段：category 兜底“其他”、内容自动生成、enabled 默认 true', () => {
    const [s] = normalizeImportedSkills([{ name: 'z', category: '不存在的类' }])
    expect(s.category).toBe('其他')
    expect(s.enabled).toBe(true)
    expect(s.source).toBe('user')
    expect(s.content).toContain('name: z')
  })

  it('过滤 allowedTools 中的非字符串项', () => {
    const [s] = normalizeImportedSkills([{ name: 'z', allowedTools: ['Read', 1, null, 'Grep'] }])
    expect(s.allowedTools).toEqual(['Read', 'Grep'])
  })
})
