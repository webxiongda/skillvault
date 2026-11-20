import type { Category, ParsedSkill, Skill } from './types'
import type { RoutePath } from './routes'

// 用户设置：全部通过 localStorage 持久化
export interface VaultSettings {
  defaultCategory: Category | '全部'
  showSource: boolean
  density: 'comfortable' | 'compact'
}

// 页面共享的应用状态与操作；页面组件不直接触碰 localStorage
export interface VaultApi {
  allSkills: Skill[]
  userSkills: Skill[]
  enabledSkills: Skill[]
  sessionAdded: Set<string>
  isEnabled: (skill: Skill) => boolean
  settings: VaultSettings
  updateSettings: (next: Partial<VaultSettings>) => void
  copiedKey: string | null
  copy: (key: string, text: string, message: string) => void
  toggle: (skill: Skill) => void
  addSkill: (parsed: ParsedSkill, content: string) => Skill
  deleteSkill: (skill: Skill) => void
  importSkills: (skills: Skill[]) => number
  resetLibrary: () => void
  openDetail: (skill: Skill) => void
  go: (route: RoutePath) => void
}

export interface PageProps {
  api: VaultApi
}
