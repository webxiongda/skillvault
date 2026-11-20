import { useEffect, type CSSProperties } from 'react'
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
  skill: Skill | null
  enabled: boolean
  copied: boolean
  onClose: () => void
  onToggle: () => void
  onCopyContent: () => void
  onCopyCommand: () => void
  onDelete: () => void
}

export function DetailDrawer({
  skill,
  enabled,
  copied,
  onClose,
  onToggle,
  onCopyContent,
  onCopyCommand,
  onDelete,
}: Props) {
  useEffect(() => {
    if (!skill) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [skill, onClose])

  if (!skill) return null
  const lines = skill.content.split('\n')
  const color = CATEGORY_COLORS[skill.category]

  return (
    <div className="overlay drawer-overlay" onMouseDown={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${skill.name} 详情`}
        style={{ '--cat-color': color } as CSSProperties}
      >
        <header className="drawer-header">
          <div className="drawer-title">
            <div className="skill-icon large"><Icon name={CATEGORY_ICONS[skill.category]} size={24} /></div>
            <div>
              <div className="drawer-name">{skill.name}</div>
              <div className="drawer-subtitle">{skill.category} · {skill.source === 'built-in' ? '内置技能' : '自定义技能'}</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="关闭详情"><Icon name="close" size={19} /></button>
        </header>

        <div className="drawer-meta">
          <div className="meta-item">
            <span className="meta-label">状态</span>
            <span className={`meta-value ${enabled ? 'status-on' : 'status-off'}`}>{enabled ? '已启用' : '已禁用'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">允许工具</span>
            <span className="meta-value">{skill.allowedTools.length ? skill.allowedTools.join(', ') : '未限制'}</span>
          </div>
          <div className="meta-item wide">
            <span className="meta-label">描述</span>
            <span className="meta-value">{skill.description}</span>
          </div>
        </div>

        <div className="drawer-actions">
          <button className={`btn btn-switch ${enabled ? 'on' : ''}`} onClick={onToggle}>
            <Icon name={enabled ? 'check' : 'plus'} size={15} />
            {enabled ? '已启用' : '启用技能'}
          </button>
          <button className="btn btn-ghost" onClick={onCopyCommand}>
            <Icon name={copied ? 'check' : 'copy'} size={15} /> 复制安装命令
          </button>
          <button className="btn btn-ghost" onClick={onCopyContent}>
            <Icon name="file" size={15} /> 复制原文
          </button>
          {skill.source === 'user' && (
            <button className="btn btn-danger" onClick={onDelete}>
              <Icon name="trash" size={15} /> 移除
            </button>
          )}
        </div>

        <div className="drawer-install">
          <code>{installCommand(skill)}</code>
        </div>

        <div className="drawer-section-title">
          <Icon name="file" size={15} /> SKILL.md 原文
        </div>
        <div className="code-view">
          {lines.map((line, index) => (
            <div className={`code-line ${line.trim() === '---' ? 'frontmatter-line' : ''}`} key={index}>
              <span className="line-number">{index + 1}</span>
              <span className="line-content">{line || ' '}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
