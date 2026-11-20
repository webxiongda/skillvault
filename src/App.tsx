import { useCallback, useEffect, useMemo, useState } from 'react'
import type { VaultApi, VaultSettings } from './app-context'
import { DetailDrawer } from './components/DetailDrawer'
import { NavBar } from './components/NavBar'
import { BUILTIN_SKILLS } from './data'
import { Icon } from './icons'
import { AboutPage } from './pages/AboutPage'
import { AddPage } from './pages/AddPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { EnabledPage } from './pages/EnabledPage'
import { GuidePage } from './pages/GuidePage'
import { ImportExportPage } from './pages/ImportExportPage'
import { ScriptsPage } from './pages/ScriptsPage'
import { SearchPage } from './pages/SearchPage'
import { SettingsPage } from './pages/SettingsPage'
import { VaultPage } from './pages/VaultPage'
import { navigateTo, useHashRoute } from './routes'
import type { Category, ParsedSkill, Skill } from './types'
import { CATEGORIES, copyText, installCommand } from './utils'

const STORAGE_USER = 'skillvault.userSkills.v1'
const STORAGE_ENABLED = 'skillvault.enabled.v1'
const STORAGE_SETTINGS = 'skillvault.settings.v1'

const DEFAULT_SETTINGS: VaultSettings = {
  defaultCategory: '全部',
  showSource: true,
  density: 'comfortable',
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

// 坏数据不阻塞应用：结构不合法的本地内容直接降级为空
function isSkill(value: unknown): value is Skill {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<Skill>
  return typeof item.id === 'string' && typeof item.name === 'string'
    && typeof item.content === 'string' && Array.isArray(item.allowedTools)
}

function readSettings(): VaultSettings {
  const stored = readStorage<Partial<VaultSettings>>(STORAGE_SETTINGS, {})
  const category = stored.defaultCategory
  const validCategory = category === '全部' || CATEGORIES.includes(category as Category)
  return {
    defaultCategory: validCategory ? (category as VaultSettings['defaultCategory']) : '全部',
    showSource: typeof stored.showSource === 'boolean' ? stored.showSource : true,
    density: stored.density === 'compact' ? 'compact' : 'comfortable',
  }
}

export default function App() {
  const route = useHashRoute()
  const [userSkills, setUserSkills] = useState<Skill[]>(() => {
    const stored = readStorage<unknown>(STORAGE_USER, [])
    return Array.isArray(stored) ? stored.filter(isSkill) : []
  })
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() => {
    const stored = readStorage<unknown>(STORAGE_ENABLED, {})
    return stored && typeof stored === 'object' && !Array.isArray(stored)
      ? stored as Record<string, boolean>
      : {}
  })
  const [settings, setSettings] = useState<VaultSettings>(readSettings)
  const [sessionAdded, setSessionAdded] = useState<Set<string>>(() => new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_USER, JSON.stringify(userSkills))
  }, [userSkills])

  useEffect(() => {
    localStorage.setItem(STORAGE_ENABLED, JSON.stringify(enabledMap))
  }, [enabledMap])

  useEffect(() => {
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const allSkills = useMemo(() => [...BUILTIN_SKILLS, ...userSkills], [userSkills])
  const isEnabled = useCallback((skill: Skill) => enabledMap[skill.id] ?? skill.enabled, [enabledMap])
  const enabledSkills = useMemo(() => allSkills.filter(isEnabled), [allSkills, isEnabled])

  const handleCopy = (key: string, text: string, message: string) => {
    void copyText(text).then((ok) => {
      if (!ok) {
        setToast('复制失败，请手动选择文本复制')
        return
      }
      setCopiedKey(key)
      setToast(message)
      window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1800)
    })
  }

  const handleToggle = (skill: Skill) => {
    setEnabledMap((prev) => ({ ...prev, [skill.id]: !isEnabled(skill) }))
  }

  const handleAdd = (parsed: ParsedSkill, content: string): Skill => {
    const skill: Skill = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: parsed.name,
      description: parsed.description,
      category: parsed.category,
      allowedTools: parsed.allowedTools,
      enabled: true,
      source: 'user',
      content,
    }
    setUserSkills((prev) => [skill, ...prev])
    setSessionAdded((prev) => new Set(prev).add(skill.id))
    setToast(`已添加技能 ${skill.name}`)
    return skill
  }

  const handleDelete = (skill: Skill) => {
    setUserSkills((prev) => prev.filter((item) => item.id !== skill.id))
    setSessionAdded((prev) => {
      const next = new Set(prev)
      next.delete(skill.id)
      return next
    })
    setSelectedId(null)
    setToast(`已移除技能 ${skill.name}`)
  }

  const handleImport = (incoming: Skill[]): number => {
    const seen = new Set(allSkills.map((skill) => skill.name.toLowerCase()))
    const fresh: Skill[] = []
    for (const skill of incoming) {
      const key = skill.name.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      fresh.push(skill)
    }
    if (fresh.length === 0) {
      setToast('没有新增技能：名称可能重复')
      return 0
    }
    setUserSkills((prev) => [...fresh, ...prev])
    setEnabledMap((prev) => {
      const next = { ...prev }
      for (const skill of fresh) next[skill.id] = skill.enabled
      return next
    })
    setSessionAdded((prev) => new Set([...prev, ...fresh.map((skill) => skill.id)]))
    setToast(`已导入 ${fresh.length} 个技能`)
    return fresh.length
  }

  const resetLibrary = () => {
    setUserSkills([])
    setEnabledMap({})
    setSessionAdded(new Set())
    setSettings(DEFAULT_SETTINGS)
    setSelectedId(null)
    setToast('本地数据已重置')
  }

  const api: VaultApi = {
    allSkills,
    userSkills,
    enabledSkills,
    sessionAdded,
    isEnabled,
    settings,
    updateSettings: (next) => setSettings((prev) => ({ ...prev, ...next })),
    copiedKey,
    copy: handleCopy,
    toggle: handleToggle,
    addSkill: handleAdd,
    deleteSkill: handleDelete,
    importSkills: handleImport,
    resetLibrary,
    openDetail: (skill) => setSelectedId(skill.id),
    go: navigateTo,
  }

  const selectedSkill = useMemo(
    () => allSkills.find((skill) => skill.id === selectedId) ?? null,
    [allSkills, selectedId],
  )

  const page = (() => {
    switch (route) {
      case 'add': return <AddPage api={api} />
      case 'enabled': return <EnabledPage api={api} />
      case 'categories': return <CategoriesPage api={api} />
      case 'scripts': return <ScriptsPage api={api} />
      case 'search': return <SearchPage api={api} />
      case 'import-export': return <ImportExportPage api={api} />
      case 'guide': return <GuidePage api={api} />
      case 'about': return <AboutPage api={api} />
      case 'settings': return <SettingsPage api={api} />
      default: return <VaultPage api={api} />
    }
  })()

  return (
    <div className="app-shell">
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb-one" />
        <span className="orb orb-two" />
        <span className="orb orb-three" />
      </div>

      <header className="site-header">
        <a className="brand" href="#/vault">
          <div className="brand-mark"><Icon name="logo" size={26} /></div>
          <div>
            <div className="brand-name">Skill<span>Vault</span></div>
            <div className="brand-tagline">Agent Skills 管理器 · 收藏、整理、安装你的 SKILL.md</div>
          </div>
        </a>
        <div className="header-actions">
          <div className="header-stat"><span className="pulse-dot" /> 本地优先 · 数据不出浏览器</div>
          <a className="btn btn-primary btn-add" href="#/add">
            <Icon name="plus" size={17} /> 添加技能
          </a>
        </div>
      </header>

      <NavBar current={route} />

      <main className="main-content">{page}</main>

      <footer className="site-footer">
        <span>SkillVault · 本地优先的 Agent Skills 管理器</span>
        <span>数据仅保存在 localStorage · MIT License</span>
      </footer>

      <DetailDrawer
        skill={selectedSkill}
        enabled={selectedSkill ? isEnabled(selectedSkill) : false}
        copied={copiedKey === 'drawer'}
        onClose={() => setSelectedId(null)}
        onToggle={() => { if (selectedSkill) handleToggle(selectedSkill) }}
        onCopyCommand={() => {
          if (selectedSkill) handleCopy('drawer', installCommand(selectedSkill), '已复制安装命令')
        }}
        onCopyContent={() => {
          if (selectedSkill) handleCopy('drawer-content', selectedSkill.content, '已复制 SKILL.md 原文')
        }}
        onDelete={() => { if (selectedSkill) handleDelete(selectedSkill) }}
      />

      {toast && <div className="toast"><Icon name="check" size={16} />{toast}</div>}
    </div>
  )
}
