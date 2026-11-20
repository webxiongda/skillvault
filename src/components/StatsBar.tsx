import { Icon, type IconName } from '../icons'

interface Props {
  total: number
  enabled: number
  categories: number
  sessionAdded: number
}

export function StatsBar({ total, enabled, categories, sessionAdded }: Props) {
  const items: Array<{ label: string; value: number; icon: IconName; accent: string; hint: string }> = [
    { label: '技能总数', value: total, icon: 'layers', accent: 'violet', hint: '已收录的 SKILL.md' },
    { label: '已启用', value: enabled, icon: 'check', accent: 'green', hint: '安装脚本将包含' },
    { label: '分类覆盖', value: categories, icon: 'filter', accent: 'pink', hint: '不同的能力领域' },
    { label: '本次新增', value: sessionAdded, icon: 'sparkle', accent: 'cyan', hint: '当前会话添加' },
  ]

  return (
    <section className="stats-grid" aria-label="技能统计">
      {items.map((item, index) => (
        <div
          className={`stat-card stat-${item.accent}`}
          key={item.label}
          style={{ animationDelay: `${index * 70}ms` }}
        >
          <div className="stat-icon"><Icon name={item.icon} size={20} /></div>
          <div className="stat-body">
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
            <div className="stat-hint">{item.hint}</div>
          </div>
          <div className="stat-glow" />
        </div>
      ))}
    </section>
  )
}
