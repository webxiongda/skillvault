import { useMemo, useState } from 'react'
import type { PageProps } from '../app-context'
import { AddSkillModal } from '../components/AddSkillModal'
import { SkillCard } from '../components/SkillCard'
import { StatsBar } from '../components/StatsBar'
import { Toolbar } from '../components/Toolbar'
import { Icon } from '../icons'
import type { Category } from '../types'
import { buildInstallScript, installCommand } from '../utils'

export function VaultPage({ api }: PageProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | '全部'>(api.settings.defaultCategory)
  const [enabledOnly, setEnabledOnly] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return api.allSkills.filter((skill) => {
      if (category !== '全部' && skill.category !== category) return false
      if (enabledOnly && !api.isEnabled(skill)) return false
      if (keyword && !`${skill.name} ${skill.description}`.toLowerCase().includes(keyword)) return false
      return true
    })
  }, [api, query, category, enabledOnly])

  const clearFilters = () => {
    setQuery('')
    setCategory(api.settings.defaultCategory)
    setEnabledOnly(false)
  }

  return (
    <>
      <section className="hero">
        <div className="hero-badge"><Icon name="sparkle" size={13} /> 兼容 Claude Code / Agent Skills 规范</div>
        <h1>让你的技能，<span className="gradient-text">触手可及。</span></h1>
        <p>解析 SKILL.md、按能力分类、一键启停，并批量生成可直接运行的安装脚本。所有数据都留在你的浏览器里。</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => api.go('add')}>
            <Icon name="plus" size={16} /> 整页添加技能
          </button>
          <button className="btn btn-ghost" onClick={() => setQuickAddOpen(true)}>
            <Icon name="file" size={16} /> 快速粘贴 SKILL.md
          </button>
        </div>
      </section>

      <StatsBar
        total={api.allSkills.length}
        enabled={api.enabledSkills.length}
        categories={new Set(api.allSkills.map((skill) => skill.category)).size}
        sessionAdded={api.sessionAdded.size}
      />

      <Toolbar
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        enabledOnly={enabledOnly}
        onEnabledOnlyChange={setEnabledOnly}
        onCopyAll={() => api.copy(
          'all',
          buildInstallScript(api.enabledSkills),
          `已复制 ${api.enabledSkills.length} 个技能的安装脚本`,
        )}
        enabledCount={api.enabledSkills.length}
      />

      {filtered.length > 0 ? (
        <section className={`skill-grid ${api.settings.density === 'compact' ? 'compact' : ''}`} aria-label="技能列表">
          {filtered.map((skill, index) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={index}
              enabled={api.isEnabled(skill)}
              isNew={api.sessionAdded.has(skill.id)}
              copied={api.copiedKey === skill.id}
              showSource={api.settings.showSource}
              density={api.settings.density}
              onToggle={() => api.toggle(skill)}
              onOpen={() => api.openDetail(skill)}
              onCopy={() => api.copy(skill.id, installCommand(skill), `已复制 ${skill.name} 的安装命令`)}
            />
          ))}
        </section>
      ) : (
        <div className="empty-state glass">
          <div className="empty-icon"><Icon name="search" size={32} /></div>
          <h3>没有找到匹配的技能</h3>
          <p>试试更换关键词或分类，或者添加一个新的 SKILL.md。</p>
          <button className="btn btn-primary" onClick={clearFilters}>清除筛选</button>
        </div>
      )}

      <AddSkillModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onAdd={(parsed, content) => {
          api.addSkill(parsed, content)
          setQuickAddOpen(false)
        }}
        existingNames={api.allSkills.map((skill) => skill.name)}
      />
    </>
  )
}
