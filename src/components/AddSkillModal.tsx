import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Icon } from '../icons'
import type { ParsedSkill } from '../types'
import { CATEGORY_COLORS, parseSkillMarkdown, SAMPLE_SKILL_MD } from '../utils'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (parsed: ParsedSkill, content: string) => void
  existingNames: string[]
}

export function AddSkillModal({ open, onClose, onAdd, existingNames }: Props) {
  const [raw, setRaw] = useState('')

  const result = useMemo(() => (raw.trim() ? parseSkillMarkdown(raw) : null), [raw])

  useEffect(() => {
    if (!open) {
      setRaw('')
      return
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const duplicate = result?.ok ? existingNames.includes(result.skill!.name) : false
  const canAdd = Boolean(result?.ok) && !duplicate

  const handleAdd = () => {
    if (!canAdd || !result?.skill) return
    onAdd(result.skill, raw)
  }

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div
        className="modal glass"
        role="dialog"
        aria-modal="true"
        aria-label="添加技能"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <div className="modal-eyebrow"><Icon name="sparkle" size={14} /> NEW SKILL</div>
            <h2>添加技能</h2>
            <p>粘贴完整的 SKILL.md，解析结果会实时显示在右侧。</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="关闭"><Icon name="close" size={18} /></button>
        </header>

        <div className="modal-body">
          <div className="editor-pane">
            <div className="pane-label">
              <span><Icon name="file" size={14} /> SKILL.md 内容</span>
              <button className="text-btn" onClick={() => setRaw(SAMPLE_SKILL_MD)}>载入示例</button>
            </div>
            <textarea
              value={raw}
              onChange={(event) => setRaw(event.target.value)}
              placeholder={'---\nname: my-skill\ndescription: 这个技能能做什么\n---\n\n# My Skill\n...'}
              spellCheck={false}
              autoFocus
            />
            <div className="editor-meta">
              <span>{raw.split('\n').length} 行</span>
              <span>{raw.length} 字符</span>
            </div>
          </div>

          <div className="preview-pane">
            <div className="pane-label"><span><Icon name="info" size={14} /> 实时预览</span></div>
            {result?.ok ? (
              <>
                <div className="preview-card" style={{ '--cat-color': CATEGORY_COLORS[result.skill!.category] } as CSSProperties}>
                  <div className="preview-card-top">
                    <span className="tag tag-category">{result.skill!.category}</span>
                    <span className="source-badge">解析成功</span>
                  </div>
                  <div className="preview-name">{result.skill!.name}</div>
                  <p>{result.skill!.description}</p>
                  <div className="card-tags">
                    {result.skill!.allowedTools.length ? (
                      result.skill!.allowedTools.map((tool) => <span className="tag tag-tool" key={tool}>{tool}</span>)
                    ) : (
                      <span className="tag tag-tool">未声明 allowed-tools</span>
                    )}
                  </div>
                </div>
                {duplicate && (
                  <div className="parse-message warning">
                    <Icon name="info" size={16} />
                    <span>同名技能已存在，请修改 name 后再添加。</span>
                  </div>
                )}
              </>
            ) : result && !result.ok ? (
              <div className="parse-message error">
                <Icon name="info" size={16} />
                <span>{result.error}</span>
              </div>
            ) : (
              <div className="preview-empty">
                <Icon name="file" size={30} />
                <p>等待输入 SKILL.md…</p>
                <span>必填字段：name、description<br />可选字段：category、allowed-tools</span>
              </div>
            )}
          </div>
        </div>

        <footer className="modal-footer">
          <span className="footer-tip">技能将保存在本地浏览器，并立即加入你的技能库。</span>
          <div className="footer-actions">
            <button className="btn btn-ghost" onClick={onClose}>取消</button>
            <button className="btn btn-primary" onClick={handleAdd} disabled={!canAdd}>
              <Icon name="plus" size={16} /> 添加到库
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
