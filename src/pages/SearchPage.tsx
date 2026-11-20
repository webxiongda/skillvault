import { useMemo, useState } from 'react'
import type { PageProps } from '../app-context'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../icons'
import type { Category } from '../types'
import { CATEGORIES, installCommand } from '../utils'

export function SearchPage({ api }: PageProps) {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState<Category | '全部'>('全部')
  const [tool, setTool] = useState('全部工具')
  const [source, setSource] = useState<'all' | 'built-in' | 'user'>('all')
  const [status, setStatus] = useState<'all' | 'enabled' | 'disabled'>('all')

  const tools = useMemo(
    () => [...new Set(api.allSkills.flatMap((skill) => skill.allowedTools))].sort(),
    [api.allSkills],
  )

  const results = useMemo(() => {
    const text = keyword.trim().toLowerCase()
    return api.allSkills.filter((skill) => {
      const enabled = api.isEnabled(skill)
      if (category !== '全部' && skill.category !== category) return false
      if (tool !== '全部工具' && !skill.allowedTools.includes(tool)) return false
      if (source !== 'all' && skill.source !== source) return false
      if (status === 'enabled' && !enabled) return false
      if (status === 'disabled' && enabled) return false
      if (text && !`${skill.name} ${skill.description} ${skill.allowedTools.join(' ')}`.toLowerCase().includes(text)) return false
      return true
    })
  }, [api, keyword, category, tool, source, status])

  const reset = () => {
    setKeyword('')
    setCategory('全部')
    setTool('全部工具')
    setSource('all')
    setStatus('all')
  }

  return (
    <>
      <PageHeader
        eyebrow="ADVANCED FILTER"
        title="高级搜索"
        description="同时按关键词、分类、允许工具、来源和启停状态组合筛选，结果以表格呈现并可直接操作。"
        icon="search"
        actions={<button className="btn btn-ghost" onClick={reset}><Icon name="close" size={15} /> 重置条件</button>}
      />

      <section className="panel glass search-panel">
        <div className="search-form">
          <label className="field field-grow">
            <span>关键词</span>
            <div className="search-box">
              <Icon name="search" size={17} />
              <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="名称、描述或工具…" />
            </div>
          </label>
          <label className="field">
            <span>分类</span>
            <select value={category} onChange={(event) => setCategory(event.target.value as Category | '全部')}>
              <option value="全部">全部分类</option>
              {CATEGORIES.map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
          </label>
          <label className="field">
            <span>允许工具</span>
            <select value={tool} onChange={(event) => setTool(event.target.value)}>
              <option value="全部工具">全部工具</option>
              {tools.map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
          </label>
          <label className="field">
            <span>来源</span>
            <select value={source} onChange={(event) => setSource(event.target.value as typeof source)}>
              <option value="all">全部来源</option>
              <option value="built-in">内置</option>
              <option value="user">自定义</option>
            </select>
          </label>
          <label className="field">
            <span>状态</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
              <option value="all">全部状态</option>
              <option value="enabled">已启用</option>
              <option value="disabled">已禁用</option>
            </select>
          </label>
        </div>
        <div className="search-result-bar">
          <span>找到 <strong>{results.length}</strong> 个技能，共 {api.allSkills.length} 个</span>
          <button
            className="text-btn"
            disabled={results.length === 0}
            onClick={() => api.copy('search-results', results.map((skill) => `${skill.name}: ${skill.description}`).join('\n'), `已复制 ${results.length} 条搜索结果`)}
          >
            复制结果摘要
          </button>
        </div>
      </section>

      {results.length > 0 ? (
        <div className="table-wrap glass">
          <table className="data-table">
            <thead>
              <tr>
                <th>技能</th>
                <th>分类 / 来源</th>
                <th>允许工具</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {results.map((skill) => {
                const enabled = api.isEnabled(skill)
                return (
                  <tr key={skill.id} className={enabled ? '' : 'is-disabled'}>
                    <td>
                      <div className="table-name">{skill.name}</div>
                      <div className="table-desc">{skill.description}</div>
                    </td>
                    <td>
                      <span className="tag tag-category">{skill.category}</span>
                      <span className="tag tag-tool">{skill.source === 'built-in' ? '内置' : '自定义'}</span>
                    </td>
                    <td>
                      <div className="table-tools">{skill.allowedTools.length ? skill.allowedTools.join(' · ') : '未限制'}</div>
                    </td>
                    <td>
                      <span className={`status-pill ${enabled ? 'on' : 'off'}`}>{enabled ? '已启用' : '已禁用'}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-switch btn-sm" onClick={() => api.toggle(skill)}>{enabled ? '停用' : '启用'}</button>
                        <button className="icon-btn" title="查看详情" onClick={() => api.openDetail(skill)}><Icon name="chevron" size={15} /></button>
                        <button
                          className="icon-btn"
                          title="复制安装命令"
                          onClick={() => api.copy(`search-${skill.id}`, installCommand(skill), `已复制 ${skill.name} 的安装命令`)}
                        >
                          <Icon name={api.copiedKey === `search-${skill.id}` ? 'check' : 'copy'} size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state glass">
          <div className="empty-icon"><Icon name="search" size={30} /></div>
          <h3>没有符合条件的技能</h3>
          <p>减少筛选条件，或切换到技能库添加新的 SKILL.md。</p>
          <button className="btn btn-primary" onClick={reset}>重置条件</button>
        </div>
      )}
    </>
  )
}
