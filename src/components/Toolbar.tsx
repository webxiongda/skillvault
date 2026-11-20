import { useEffect, useRef } from 'react'
import { Icon } from '../icons'
import type { Category } from '../types'
import { CATEGORIES } from '../utils'

interface Props {
  query: string
  onQueryChange: (value: string) => void
  category: Category | '全部'
  onCategoryChange: (value: Category | '全部') => void
  enabledOnly: boolean
  onEnabledOnlyChange: (value: boolean) => void
  onCopyAll: () => void
  enabledCount: number
}

export function Toolbar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  enabledOnly,
  onEnabledOnlyChange,
  onCopyAll,
  enabledCount,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if (event.key === '/' && !typing) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <section className="toolbar glass" aria-label="搜索与筛选">
      <div className="toolbar-top">
        <div className="search-box">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索技能名称或描述…"
            aria-label="搜索技能"
          />
          {query ? (
            <button className="clear-search" onClick={() => onQueryChange('')} aria-label="清空搜索">
              <Icon name="close" size={14} />
            </button>
          ) : (
            <kbd className="shortcut">/</kbd>
          )}
        </div>

        <div className="toolbar-actions">
          <button
            className={`btn btn-ghost ${enabledOnly ? 'filter-active' : ''}`}
            onClick={() => onEnabledOnlyChange(!enabledOnly)}
            aria-pressed={enabledOnly}
          >
            <Icon name="check" size={15} />
            仅已启用
          </button>
          <button className="btn btn-primary" onClick={onCopyAll} disabled={enabledCount === 0}>
            <Icon name="script" size={16} />
            复制全部安装脚本
          </button>
        </div>
      </div>

      <div className="toolbar-bottom">
        <div className="filter-label"><Icon name="filter" size={14} /> 分类</div>
        <div className="chips">
          {(['全部', ...CATEGORIES] as const).map((item) => (
            <button
              key={item}
              className={`chip ${category === item ? 'active' : ''}`}
              onClick={() => onCategoryChange(item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="result-count">{query || category !== '全部' || enabledOnly ? '筛选结果' : '全部技能'}</span>
      </div>
    </section>
  )
}
