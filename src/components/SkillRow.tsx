import type { CSSProperties } from 'react'
import { Icon, type IconName } from '../icons'
import type { Skill } from '../types'
import { CATEGORY_COLORS } from '../utils'

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
  showSource?: boolean
  onToggle: () => void
  onOpen: () => void
}

// 列表页共用的技能行：启停、详情入口与卡片保持同一套交互
export function SkillRow({ skill, enabled, showSource = true, onToggle, onOpen }: Props) {
  return (
    <div
      className={`skill-row ${enabled ? '' : 'is-disabled'}`}
      style={{ '--cat-color': CATEGORY_COLORS[skill.category] } as CSSProperties}
    >
      <div className="row-icon"><Icon name={CATEGORY_ICONS[skill.category]} size={19} /></div>
      <div className="row-main">
        <div className="row-title">
          <span>{skill.name}</span>
          <span className="tag tag-category">{skill.category}</span>
          {showSource && (
            <span className={`source-badge ${skill.source === 'user' ? 'source-user' : ''}`}>
              {skill.source === 'built-in' ? '内置' : '自定义'}
            </span>
          )}
        </div>
        <div className="row-desc">{skill.description}</div>
        <div className="row-tags">
          {skill.allowedTools.slice(0, 4).map((tool) => <span className="tag tag-tool" key={tool}>{tool}</span>)}
          {skill.allowedTools.length > 4 && <span className="tag tag-more">+{skill.allowedTools.length - 4}</span>}
        </div>
      </div>
      <div className="row-actions">
        <span className={`status-pill ${enabled ? 'on' : 'off'}`}>{enabled ? '已启用' : '已禁用'}</span>
        <label className="switch" onClick={(event) => event.stopPropagation()}>
          <input type="checkbox" checked={enabled} onChange={onToggle} aria-label={`${enabled ? '禁用' : '启用'} ${skill.name}`} />
          <span className="switch-track"><span className="switch-thumb" /></span>
        </label>
        <button className="icon-btn" onClick={onOpen} title="查看详情" aria-label={`查看 ${skill.name} 详情`}>
          <Icon name="chevron" size={16} />
        </button>
      </div>
    </div>
  )
}
