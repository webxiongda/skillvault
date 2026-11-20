import type { CSSProperties } from 'react'
import { Icon, type IconName } from '../icons'
import type { Skill } from '../types'
import { CATEGORY_COLORS, installCommand } from '../utils'

const CATEGORY_ICONS: Record<Skill['category'], IconName> = {
  开发: 'code',
  设计: 'palette',
  安全: 'shield',
  写作: 'pen',
  运维: 'server',
  其他: 'layers',
}

interface Props {
  skill: Skill
  enabled: boolean
  isNew: boolean
  copied: boolean
  showSource?: boolean
  density?: 'comfortable' | 'compact'
  index: number
  onToggle: () => void
  onOpen: () => void
  onCopy: () => void
}

export function SkillCard({ skill, enabled, isNew, copied, index, showSource = true, density = 'comfortable', onToggle, onOpen, onCopy }: Props) {
  const color = CATEGORY_COLORS[skill.category]
  const style = { '--cat-color': color, animationDelay: `${Math.min(index, 12) * 45}ms` } as CSSProperties

  return (
    <article
      className={`skill-card glass ${enabled ? '' : 'is-disabled'} ${density === 'compact' ? 'compact' : ''}`}
      style={style}
      onClick={onOpen}
      tabIndex={0}
      role="button"
      aria-label={`查看 ${skill.name} 详情`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <div className="card-top">
        <div className="card-badges">
          {showSource && (
            <span className={`source-badge ${skill.source === 'user' ? 'source-user' : ''}`}>
              {skill.source === 'built-in' ? '内置' : '自定义'}
            </span>
          )}
          {isNew && <span className="new-badge">NEW</span>}
        </div>
        <label className="switch" onClick={(event) => event.stopPropagation()}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={onToggle}
            aria-label={`${enabled ? '禁用' : '启用'} ${skill.name}`}
          />
          <span className="switch-track"><span className="switch-thumb" /></span>
        </label>
      </div>

      <div className="card-heading">
        <div className="skill-icon"><Icon name={CATEGORY_ICONS[skill.category]} size={21} /></div>
        <h3>{skill.name}</h3>
      </div>

      <p className="card-desc">{skill.description}</p>

      <div className="card-tags">
        <span className="tag tag-category">{skill.category}</span>
        {skill.allowedTools.slice(0, 3).map((tool) => (
          <span className="tag tag-tool" key={tool}>{tool}</span>
        ))}
        {skill.allowedTools.length > 3 && (
          <span className="tag tag-more">+{skill.allowedTools.length - 3}</span>
        )}
      </div>

      <div className="card-install" onClick={(event) => event.stopPropagation()}>
        <code title={installCommand(skill)}>{installCommand(skill)}</code>
        <button className="icon-btn" onClick={onCopy} title="复制安装命令" aria-label="复制安装命令">
          <Icon name={copied ? 'check' : 'copy'} size={15} className={copied ? 'copied-icon' : ''} />
        </button>
      </div>

      <div className="card-footer">
        <span>查看完整 SKILL.md</span>
        <Icon name="chevron" size={15} />
      </div>
    </article>
  )
}
