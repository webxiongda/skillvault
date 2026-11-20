import { describe, it, expect } from 'vitest'
import { BUILTIN_SKILLS } from '../data'

describe('BUILTIN_SKILLS 内置技能', () => {
  it('至少提供 10 个示例技能', () => {
    expect(BUILTIN_SKILLS.length).toBeGreaterThanOrEqual(10)
  })

  it('每个技能字段合法且内容含 frontmatter', () => {
    for (const skill of BUILTIN_SKILLS) {
      expect(skill.name.length).toBeGreaterThan(0)
      expect(skill.description.length).toBeGreaterThan(0)
      expect(skill.source).toBe('built-in')
      expect(skill.content.startsWith('---')).toBe(true)
    }
  })

  it('技能名不重复', () => {
    const names = BUILTIN_SKILLS.map((s) => s.name)
    expect(new Set(names).size).toBe(names.length)
  })
})
