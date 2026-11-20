import type { ReactNode } from 'react'
import { Icon, type IconName } from '../icons'

interface Props {
  eyebrow: string
  title: string
  description: string
  icon: IconName
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, icon, actions }: Props) {
  return (
    <header className="page-header">
      <div className="page-header-main">
        <div className="page-eyebrow"><Icon name={icon} size={14} /> {eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  )
}
