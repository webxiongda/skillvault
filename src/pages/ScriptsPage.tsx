import { useMemo, useState } from 'react'
import type { PageProps } from '../app-context'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../icons'
import { buildInstallScript, downloadText } from '../utils'

export function ScriptsPage({ api }: PageProps) {
  const [scope, setScope] = useState<'enabled' | 'all'>('enabled')

  const script = useMemo(
    () => buildInstallScript(scope === 'enabled' ? api.enabledSkills : api.allSkills),
    [scope, api.enabledSkills, api.allSkills],
  )
  const targets = scope === 'enabled' ? api.enabledSkills : api.allSkills
  const lines = script.split('\n')
  const sizeKb = (new Blob([script]).size / 1024).toFixed(1)

  return (
    <>
      <PageHeader
        eyebrow="INSTALL SCRIPT"
        title="安装脚本"
        description="生成自包含的 bash 脚本：用 heredoc 把每份完整 SKILL.md 写入 ~/.claude/skills，复制或下载后即可直接运行。"
        icon="script"
        actions={
          <button
            className="btn btn-primary"
            disabled={targets.length === 0}
            onClick={() => api.copy('install-script', script, `已复制 ${targets.length} 个技能的安装脚本`)}
          >
            <Icon name={api.copiedKey === 'install-script' ? 'check' : 'copy'} size={16} /> 复制脚本
          </button>
        }
      />

      <section className="panel glass script-panel">
        <div className="panel-head">
          <div>
            <div className="panel-title"><Icon name="filter" size={16} /> 导出范围</div>
            <div className="panel-sub">禁用技能不会被写入脚本（除非选择全部）</div>
          </div>
          <div className="segmented" role="group" aria-label="导出范围">
            <button className={scope === 'enabled' ? 'active' : ''} onClick={() => setScope('enabled')}>仅已启用 · {api.enabledSkills.length}</button>
            <button className={scope === 'all' ? 'active' : ''} onClick={() => setScope('all')}>全部技能 · {api.allSkills.length}</button>
          </div>
        </div>

        <div className="script-meta">
          <div><span>技能数量</span><strong>{targets.length}</strong></div>
          <div><span>脚本行数</span><strong>{lines.length}</strong></div>
          <div><span>文件大小</span><strong>{sizeKb} KB</strong></div>
          <div><span>写入目录</span><code>~/.claude/skills/</code></div>
        </div>

        <div className="script-preview">
          <div className="script-preview-bar">
            <span><Icon name="file" size={14} /> skillvault-install.sh</span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => downloadText('skillvault-install.sh', script, 'text/x-shellscript;charset=utf-8')}
              disabled={targets.length === 0}
            >
              <Icon name="file" size={14} /> 下载 .sh
            </button>
          </div>
          <div className="code-view script-code">
            {lines.map((line, index) => (
              <div className="code-line" key={index}>
                <span className="line-number">{index + 1}</span>
                <span className="line-content">{line || ' '}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="notice glass">
        <Icon name="info" size={17} />
        <div>
          <strong>脚本使用方式</strong>
          <p>把复制的内容保存为 <code>skillvault-install.sh</code>，执行 <code>bash skillvault-install.sh</code> 即可。每份技能前都有名称与描述注释，heredoc 使用带引号的定界符，正文中的 <code>$</code> 与反引号不会被 shell 展开。</p>
        </div>
      </div>
    </>
  )
}
