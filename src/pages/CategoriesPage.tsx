import { useState, type CSSProperties } from 'react'
import type { PageProps } from '../app-context'
import { PageHeader } from '../components/PageHeader'
import { SkillRow } from '../components/SkillRow'
import { Icon } from '../icons'
import type { Category } from '../types'
import { CATEGORIES, CATEGORY_COLORS } from '../utils'

export function CategoriesPage({ api }: PageProps) {
  const [expanded, setExpanded] = useState<Record<Category, boolean>>(() =>
    Object.fromEntries(CATEGORIES.map((category) => [category, true])) as Record<Category, boolean>,
  )

  const allExpanded = CATEGORIES.every((category) => expanded[category])

  return (
    <>
      <PageHeader
        eyebrow="BROWSE BY DOMAIN"
        title="分类浏览"
        description="按照开发、设计、安全、写作、运维等能力领域整理技能，点击分类标题即可折叠或展开。"
        icon="filter"
        actions={
          <button className="btn btn-ghost" onClick={() =>
            setExpanded(Object.fromEntries(CATEGORIES.map((category) => [category, !allExpanded])) as Record<Category, boolean>)
          }>
            <Icon name="layers" size={16} /> {allExpanded ? '全部收起' : '全部展开'}
          </button>
        }
      />

      <div className="category-groups">
        {CATEGORIES.map((category) => {
          const skills = api.allSkills.filter((skill) => skill.category === category)
          const enabledCount = skills.filter(api.isEnabled).length
          const isOpen = expanded[category]

          return (
            <section
              className={`category-group glass ${isOpen ? 'open' : ''}`}
              key={category}
              style={{ '--cat-color': CATEGORY_COLORS[category] } as CSSProperties}
            >
              <button
                className="category-group-head"
                onClick={() => setExpanded((prev) => ({ ...prev, [category]: !prev[category] }))}
                aria-expanded={isOpen}
              >
                <span className="category-bar" />
                <span className="category-icon"><Icon name={category === '安全' ? 'shield' : category === '设计' ? 'palette' : 'layers'} size={18} /></span>
                <span className="category-name">{category}</span>
                <span className="category-meta">{skills.length} 个技能 · {enabledCount} 个启用</span>
                <span className="category-chevron"><Icon name="chevron" size={17} /></span>
              </button>
              {isOpen && (
                <div className="category-body">
                  {skills.length ? (
                    skills.map((skill) => (
                      <SkillRow
                        key={skill.id}
                        skill={skill}
                        enabled={api.isEnabled(skill)}
                        showSource={api.settings.showSource}
                        onToggle={() => api.toggle(skill)}
                        onOpen={() => api.openDetail(skill)}
                      />
                    ))
                  ) : (
                    <div className="category-empty">这个分类还没有技能，去添加一份 SKILL.md 吧。</div>
                  )}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </>
  )
}
