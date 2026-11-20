import { useMemo, useState, type CSSProperties } from 'react'
import type { PageProps } from '../app-context'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../icons'
import type { Skill } from '../types'
import { CATEGORY_COLORS, parseSkillMarkdown, SAMPLE_SKILL_MD } from '../utils'

export function AddPage({ api }: PageProps) {
  const [raw, setRaw] = useState('')
  const [added, setAdded] = useState<Skill | null>(null)

  const result = useMemo(() => (raw.trim() ? parseSkillMarkdown(raw) : null), [raw])
  const duplicate = result?.ok
    ? api.allSkills.some((skill) => skill.name.toLowerCase() === result.skill!.name.toLowerCase())
    : false
  const canAdd = Boolean(result?.ok) && !duplicate

  const handleAdd = () => {
    if (!result?.ok || !result.skill || duplicate) return
    setAdded(api.addSkill(result.skill, raw))
    setRaw('')
  }

  return (
    <>
      <PageHeader
        eyebrow="IMPORT SKILL.md"
        title="添加技能"
        description="粘贴完整的 SKILL.md，左侧编辑、右侧实时解析。确认无误后加入本地技能库，无需刷新页面。"
        icon="plus"
        actions={<button className="btn btn-ghost" onClick={() => api.go('guide')}><Icon name="info" size={16} /> 查看格式指南</button>}
      />

      {added && (
        <section className="add-success glass">
          <div className="success-mark"><Icon name="check" size={22} /></div>
          <div className="success-body">
            <h3>已添加「{added.name}」</h3>
            <p>技能已保存到本地浏览器，并立即出现在技能库、分类浏览和安装脚本中。</p>
          </div>
          <div className="success-actions">
            <button className="btn btn-ghost" onClick={() => api.openDetail(added)}>查看详情</button>
            <button className="btn btn-ghost" onClick={() => setAdded(null)}>继续添加</button>
            <button className="btn btn-primary" onClick={() => api.go('vault')}><Icon name="layers" size={15} /> 返回技能库</button>
          </div>
        </section>
      )}

      <div className="page-two-col add-layout">
        <section className="panel glass">
          <div className="panel-head">
            <div>
              <div className="panel-title"><Icon name="file" size={16} /> SKILL.md 内容</div>
              <div className="panel-sub">以 <code>---</code> 开头的 YAML frontmatter 必须完整</div>
            </div>
            <button className="text-btn" onClick={() => setRaw(SAMPLE_SKILL_MD)}>载入示例</button>
          </div>
          <textarea
            className="page-textarea"
            value={raw}
            onChange={(event) => setRaw(event.target.value)}
            placeholder={'---\nname: my-skill\ndescription: 这个技能能做什么\n---\n\n# My Skill\n...'}
            spellCheck={false}
          />
          <div className="editor-meta">
            <span>{raw.split('\n').length} 行</span>
            <span>{raw.length} 字符</span>
            <span>{result?.ok ? 'frontmatter 解析成功' : '等待有效输入'}</span>
          </div>
        </section>

        <section className="panel glass">
          <div className="panel-head">
            <div>
              <div className="panel-title"><Icon name="info" size={16} /> 实时解析预览</div>
              <div className="panel-sub">校验必填字段并推断分类</div>
            </div>
          </div>
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

          <div className="format-hint">
            <div className="format-hint-title"><Icon name="sparkle" size={14} /> 格式速查</div>
            <pre className="code-block">{'---\nname: my-skill          # 必填，字母/数字/连字符\ndescription: 一句话说明  # 必填\ncategory: 开发           # 可选，省略时自动推断\nallowed-tools: Read, Grep, Bash\n---'}</pre>
          </div>

          <div className="panel-footer">
            <span className="footer-tip">数据只保存在你的浏览器里。</span>
            <button className="btn btn-primary" onClick={handleAdd} disabled={!canAdd}>
              <Icon name="plus" size={16} /> 确认加入技能库
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
