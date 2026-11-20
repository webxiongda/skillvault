import type { PageProps } from '../app-context'
import { PageHeader } from '../components/PageHeader'
import type { RoutePath } from '../routes'
import { Icon, type IconName } from '../icons'
import { SAMPLE_SKILL_MD } from '../utils'

const STEPS: Array<{ title: string; detail: string; icon: IconName; hash?: RoutePath }> = [
  { title: '添加 SKILL.md', detail: '粘贴完整技能文件，实时校验 frontmatter 并预览解析结果。', icon: 'plus', hash: 'add' },
  { title: '启停与分类', detail: '用开关决定哪些技能生效，按领域分组整理你的能力库。', icon: 'check', hash: 'vault' },
  { title: '生成安装脚本', detail: '一键复制 heredoc 脚本，把完整内容写入 skills 目录。', icon: 'script', hash: 'scripts' },
  { title: '备份与迁移', detail: '导出 JSON 备份，换设备后导入即可恢复全部技能。', icon: 'file', hash: 'import-export' },
]

export function GuidePage({ api }: PageProps) {
  return (
    <>
      <PageHeader
        eyebrow="GET STARTED"
        title="使用指南"
        description="从理解 Agent Skill 的格式，到安装到 Claude Code / Codex，四步把技能真正用起来。"
        icon="info"
        actions={<button className="btn btn-primary" onClick={() => api.go('add')}><Icon name="plus" size={16} /> 开始添加技能</button>}
      />

      <section className="guide-intro glass">
        <div className="guide-intro-icon"><Icon name="sparkle" size={26} /></div>
        <div>
          <h2>什么是 Agent Skill？</h2>
          <p>Agent Skill 是一份带有 YAML frontmatter 的 <code>SKILL.md</code>：frontmatter 告诉智能体「叫什么、什么时候用、能调用哪些工具」，正文则是可执行的具体指令。它像一份可复用的岗位说明书——放进 skills 目录后，兼容的编码智能体会在合适的任务里自动加载它。</p>
        </div>
      </section>

      <div className="guide-grid">
        <section className="panel glass">
          <div className="panel-head"><div className="panel-title"><Icon name="file" size={16} /> frontmatter 格式</div></div>
          <pre className="code-block">{SAMPLE_SKILL_MD.split('\n').slice(0, 6).join('\n')}</pre>
          <ul className="bullet-list">
            <li><code>name</code> 与 <code>description</code> 必填，名称只含字母、数字、连字符与下划线。</li>
            <li><code>category</code> 省略时根据名称和描述自动推断。</li>
            <li><code>allowed-tools</code> 支持逗号分隔、数组与 YAML 列表三种写法。</li>
          </ul>
        </section>

        <section className="panel glass">
          <div className="panel-head"><div className="panel-title"><Icon name="script" size={16} /> 安装到编码智能体</div></div>
          <div className="guide-subtitle">Claude Code</div>
          <pre className="code-block">{'mkdir -p ~/.claude/skills/code-review\ncp SKILL.md ~/.claude/skills/code-review/SKILL.md'}</pre>
          <div className="guide-subtitle">Codex</div>
          <pre className="code-block">{'mkdir -p ~/.codex/skills/code-review\ncp SKILL.md ~/.codex/skills/code-review/SKILL.md'}</pre>
          <p className="guide-note">不想手敲命令？到「安装脚本」页复制批量脚本，一次写完所有已启用技能。</p>
        </section>
      </div>

      <div className="section-head">
        <div>
          <div className="section-title">四步玩法</div>
          <div className="section-sub">每一步都对应一个真实可用的页面</div>
        </div>
      </div>
      <div className="step-list">
        {STEPS.map((step, index) => (
          <button className="step-item glass" key={step.title} onClick={() => step.hash && api.go(step.hash)}>
            <span className="step-num">{String(index + 1).padStart(2, '0')}</span>
            <span className="step-icon"><Icon name={step.icon} size={20} /></span>
            <span className="step-body">
              <strong>{step.title}</strong>
              <span>{step.detail}</span>
            </span>
            <Icon name="chevron" size={17} />
          </button>
        ))}
      </div>
    </>
  )
}
