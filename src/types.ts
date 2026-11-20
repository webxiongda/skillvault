export type Category = '开发' | '设计' | '安全' | '写作' | '运维' | '其他'

export interface Skill {
  id: string
  name: string
  description: string
  category: Category
  allowedTools: string[]
  enabled: boolean
  source: 'built-in' | 'user'
  content: string
}

export interface ParsedSkill {
  name: string
  description: string
  category: Category
  allowedTools: string[]
}

export interface ParseResult {
  ok: boolean
  skill?: ParsedSkill
  error?: string
}
