import { useCallback, useEffect, useMemo, useState } from 'react'
import { AddSkillModal } from './components/AddSkillModal'
import { DetailDrawer } from './components/DetailDrawer'
import { SkillCard } from './components/SkillCard'
import { StatsBar } from './components/StatsBar'
import { Toolbar } from './components/Toolbar'
import { BUILTIN_SKILLS } from './data'
import { Icon } from './icons'
import type { Category, ParsedSkill, Skill } from './types'
import { buildInstallScript, copyText, installCommand } from './utils'

const STORAGE_USER = 'skillvault.userSkills.v1'
const STORAGE_ENABLED = 'skillvault.enabled.v1'

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [userSkills, setUserSkills] = useState<Skill[]>(() => readStorage<Skill[]>(STORAGE_USER, []))
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() => readStorage(STORAGE_ENABLED, {}))
  const [sessionAdded, setSessionAdded] = useState<Set<string>>(() => new Set())
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | '全部'>('全部')
  const [enabledOnly, setEnabledOnly] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
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
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const allSkills = useMemo(() => [...BUILTIN_SKILLS, ...userSkills], [userSkills])
  const isEnabled = useCallback((skill: Skill) => enabledMap[skill.id] ?? skill.enabled, [enabledMap])
  const enabledSkills = useMemo(() => allSkills.filter(isEnabled), [allSkills, isEnabled])
  const categoryCount = useMemo(() => new Set(allSkills.map((skill) => skill.category)).size, [allSkills])

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return allSkills.filter((skill) => {
      if (category !== '全部' && skill.category !== category) return false
      if (enabledOnly && !isEnabled(skill)) return false
      if (keyword && !`${skill.name} ${skill.description}`.toLowerCase().includes(keyword)) return false
      return true
    })
  }, [allSkills, query, category, enabledOnly, isEnabled])

  const selectedSkill = useMemo(
    () => allSkills.find((skill) => skill.id === selectedId) ?? null,
    [allSkills, selectedId],
  )

  const handleCopy = async (key: string, text: string, message: string) => {
    const ok = await copyText(text)
    if (!ok) {
      setToast('复制失败，请手动选择文本复制')
      return
    }
    setCopiedKey(key)
    setToast(message)
    window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1800)
  }

  const handleToggle = (skill: Skill) => {
    setEnabledMap((prev) => ({ ...prev, [skill.id]: !isEnabled(skill) }))
  }

  const handleAdd = (parsed: ParsedSkill, content: string) => {
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
    setModalOpen(false)
    setQuery('')
    setCategory('全部')
    setEnabledOnly(false)
    setToast(`已添加技能 ${skill.name}`)
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

  const handleCopyAll = () => {
    if (!enabledSkills.length) return
    void handleCopy('all', buildInstallScript(enabledSkills), `已复制 ${enabledSkills.length} 个技能的安装脚本`)
  }

  return (
    <div className="app-shell">
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb-one" />
        <span className="orb orb-two" />
        <span className="orb orb-three" />
      </div>

      <header className="site-header">
        <div className="brand">
          <div className="brand-mark"><Icon name="logo" size={26} /></div>
          <div>
            <div className="brand-name">Skill<span>Vault</span></div>
            <div className="brand-tagline">Agent Skills 管理器 · 收藏、整理、安装你的 SKILL.md</div>
          </div>
        </div>
        <div className="header-actions">
          <div className="header-stat"><span className="pulse-dot" /> 本地优先 · 数据不出浏览器</div>
          <button className="btn btn-primary btn-add" onClick={() => setModalOpen(true)}>
            <Icon name="plus" size={17} /> 添加技能
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="hero-badge"><Icon name="sparkle" size={13} /> 兼容 Claude Code / Agent Skills 规范</div>
          <h1>让你的技能，<span className="gradient-text">触手可及。</span></h1>
          <p>解析 SKILL.md、按能力分类、一键启停，并批量生成可直接运行的安装脚本。所有数据都留在你的浏览器里。</p>
        </section>

        <StatsBar
          total={allSkills.length}
          enabled={enabledSkills.length}
          categories={categoryCount}
          sessionAdded={sessionAdded.size}
        />

        <Toolbar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          enabledOnly={enabledOnly}
          onEnabledOnlyChange={setEnabledOnly}
          onCopyAll={handleCopyAll}
          enabledCount={enabledSkills.length}
        />

        {filtered.length > 0 ? (
          <section className="skill-grid" aria-label="技能列表">
            {filtered.map((skill, index) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                index={index}
                enabled={isEnabled(skill)}
                isNew={sessionAdded.has(skill.id)}
                copied={copiedKey === skill.id}
                onToggle={() => handleToggle(skill)}
                onOpen={() => setSelectedId(skill.id)}
                onCopy={() => void handleCopy(skill.id, installCommand(skill), `已复制 ${skill.name} 的安装命令`)}
              />
            ))}
          </section>
        ) : (
          <div className="empty-state glass">
            <div className="empty-icon"><Icon name="search" size={32} /></div>
            <h3>没有找到匹配的技能</h3>
            <p>试试更换关键词或分类，或者添加一个新的 SKILL.md。</p>
            <button
              className="btn btn-primary"
              onClick={() => { setQuery(''); setCategory('全部'); setEnabledOnly(false) }}
            >
              清除筛选
            </button>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <span>SkillVault · 本地优先的 Agent Skills 管理器</span>
        <span>按 / 快速搜索 · 数据仅保存在 localStorage</span>
      </footer>

      <AddSkillModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
        existingNames={allSkills.map((skill) => skill.name)}
      />
      <DetailDrawer
        skill={selectedSkill}
        enabled={selectedSkill ? isEnabled(selectedSkill) : false}
        copied={copiedKey === 'drawer'}
        onClose={() => setSelectedId(null)}
        onToggle={() => { if (selectedSkill) handleToggle(selectedSkill) }}
        onCopyCommand={() => {
          if (selectedSkill) void handleCopy('drawer', installCommand(selectedSkill), '已复制安装命令')
        }}
        onCopyContent={() => {
          if (selectedSkill) void handleCopy('drawer-content', selectedSkill.content, '已复制 SKILL.md 原文')
        }}
        onDelete={() => { if (selectedSkill) handleDelete(selectedSkill) }}
      />

      {toast && <div className="toast"><Icon name="check" size={16} />{toast}</div>}
    </div>
  )
}
