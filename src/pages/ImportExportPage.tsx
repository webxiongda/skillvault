import { useRef, useState } from 'react'
import type { PageProps } from '../app-context'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../icons'
import type { Skill } from '../types'
import { buildExportPayload, downloadText, normalizeImportedSkills } from '../utils'

export function ImportExportPage({ api }: PageProps) {
  const [preview, setPreview] = useState<Skill[] | null>(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setPreview(null)
    setFileName(file.name)
    try {
      const text = await file.text()
      let data: unknown
      try {
        data = JSON.parse(text) as unknown
      } catch {
        throw new Error('JSON 语法错误：请检查文件内容是否完整')
      }
      const skills = normalizeImportedSkills(data)
      setPreview(skills)
      if (skills.length === 0) setError('文件中没有可导入的技能')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '文件读取失败')
    }
  }

  const exportJson = () => {
    const payload = buildExportPayload(api.allSkills)
    const stamp = new Date().toISOString().slice(0, 10)
    downloadText(`skillvault-skills-${stamp}.json`, payload, 'application/json;charset=utf-8')
    api.copy('backup-json', payload, `已导出并复制 ${api.allSkills.length} 个技能的 JSON`)
  }

  return (
    <>
      <PageHeader
        eyebrow="PORTABLE LIBRARY"
        title="导入与导出"
        description="把全部技能（含自定义）打包成 JSON 备份，或从备份文件恢复。导入数据会在校验后合并进本地库，同名技能自动跳过。"
        icon="file"
      />

      <div className="page-two-col">
        <section className="panel glass">
          <div className="panel-head">
            <div>
              <div className="panel-title"><Icon name="file" size={16} /> 导出 JSON</div>
              <div className="panel-sub">包含内置与自定义技能的完整字段</div>
            </div>
          </div>
          <div className="export-stats">
            <div><span>导出技能</span><strong>{api.allSkills.length}</strong></div>
            <div><span>其中自定义</span><strong>{api.userSkills.length}</strong></div>
            <div><span>含 SKILL.md 原文</span><Icon name="check" size={16} /></div>
          </div>
          <pre className="code-block export-sample">{'{\n  "format": "skillvault.library",\n  "version": 1,\n  "exportedAt": "2026-01-01T00:00:00.000Z",\n  "count": 12,\n  "skills": [ { "id": "...", "name": "...",\n    "description": "...", "category": "开发",\n    "allowedTools": ["Read"], "enabled": true,\n    "source": "user", "content": "---..." } ]\n}'}</pre>
          <div className="panel-footer">
            <span className="footer-tip">下载同时会复制 JSON 到剪贴板。</span>
            <button className="btn btn-primary" onClick={exportJson}><Icon name="file" size={16} /> 导出 JSON 文件</button>
          </div>
        </section>

        <section className="panel glass">
          <div className="panel-head">
            <div>
              <div className="panel-title"><Icon name="plus" size={16} /> 导入 JSON</div>
              <div className="panel-sub">支持本应用备份或技能数组</div>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            className="file-input-hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void handleFile(file)
              event.target.value = ''
            }}
          />
          <div
            className={`file-drop ${dragging ? 'dragging' : ''}`}
            onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              const file = event.dataTransfer.files[0]
              if (file) void handleFile(file)
            }}
          >
            <Icon name="file" size={30} />
            <p>把 JSON 文件拖到这里</p>
            <span>或者</span>
            <button className="btn btn-ghost" onClick={() => inputRef.current?.click()}>选择文件</button>
            {fileName && <div className="file-name">{fileName}</div>}
          </div>

          {error && (
            <div className="parse-message error">
              <Icon name="info" size={16} /><span>{error}</span>
            </div>
          )}

          {preview && preview.length > 0 && (
            <div className="import-preview">
              <div className="import-preview-head">待导入 {preview.length} 个技能</div>
              <div className="import-list">
                {preview.slice(0, 8).map((skill) => (
                  <div className="import-item" key={skill.id}>
                    <span className="tag tag-category">{skill.category}</span>
                    <span className="import-name">{skill.name}</span>
                    <span className="import-desc">{skill.description}</span>
                  </div>
                ))}
                {preview.length > 8 && <div className="import-more">还有 {preview.length - 8} 个…</div>}
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const count = api.importSkills(preview)
                  setPreview(null)
                  setFileName('')
                  if (count > 0) api.go('vault')
                }}
              >
                <Icon name="check" size={16} /> 确认导入
              </button>
            </div>
          )}

          <div className="format-hint">
            <div className="format-hint-title"><Icon name="info" size={14} /> 格式说明</div>
            <p>接受 <code>{'{ "skills": [...] }'}</code> 或直接的技能数组。<code>name</code> 必填；<code>description</code>、<code>category</code>、<code>allowedTools</code>、<code>enabled</code>、<code>content</code> 可选，缺失字段会安全补默认值。所有导入项均按自定义技能保存，可在详情抽屉中删除。</p>
          </div>
        </section>
      </div>
    </>
  )
}
