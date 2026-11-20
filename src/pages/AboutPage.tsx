import type { PageProps } from '../app-context'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../icons'

const HOTSPOTS = [
  {
    name: 'mattpocock/skills',
    metric: '+19.7k',
    label: 'Stars（社区快照）',
    detail: 'TypeScript 教育者 Matt Pocock 维护的技能集合，是 Agent Skills 话题热度的代表性证据。',
    url: 'https://github.com/mattpocock/skills',
  },
  {
    name: 'anthropics/skills',
    metric: '官方',
    label: '参考实现',
    detail: 'Anthropic 提供的 skills 示例仓库，定义了 SKILL.md 与 frontmatter 的事实标准。',
    url: 'https://github.com/anthropics/skills',
  },
  {
    name: 'Claude Code Skills',
    metric: '文档',
    label: '安装规范',
    detail: '把技能放进 ~/.claude/skills/<name>/SKILL.md 即可被识别，本项目脚本遵循该约定。',
    url: 'https://docs.anthropic.com/en/docs/claude-code/skills',
  },
]

const TECH = ['React 19', 'TypeScript 5.7', 'Vite 6', 'Hash 路由', 'localStorage', '零后端', '零新增依赖']

export function AboutPage({ api }: PageProps) {
  return (
    <>
      <PageHeader
        eyebrow="ABOUT & SIGNALS"
        title="关于与热点"
        description="SkillVault 是一个本地优先的 Agent Skills 管理器。这里记录项目的社区背景、技术选型与授权信息。"
        icon="sparkle"
      />

      <section className="about-hero glass">
        <div className="about-mark"><Icon name="logo" size={32} /></div>
        <div>
          <h2>SkillVault</h2>
          <p>让每一份 SKILL.md 都能被收藏、分类、启停，并一键生成可运行的安装脚本。所有状态只存在浏览器，刷新与 iframe 嵌入都不影响使用。</p>
          <div className="tech-list">
            {TECH.map((item) => <span className="tag tag-tool" key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <div className="section-head">
        <div>
          <div className="section-title">社区热点证据</div>
          <div className="section-sub">数字为快照数据，点击卡片查看源头</div>
        </div>
      </div>
      <div className="hot-grid">
        {HOTSPOTS.map((item) => (
          <a className="hot-card glass" href={item.url} target="_blank" rel="noopener noreferrer" key={item.name}>
            <div className="hot-top">
              <span className="hot-name">{item.name}</span>
              <Icon name="external" size={15} />
            </div>
            <div className="hot-stat">{item.metric}</div>
            <div className="hot-label">{item.label}</div>
            <p>{item.detail}</p>
          </a>
        ))}
      </div>

      <div className="page-two-col about-bottom">
        <section className="panel glass">
          <div className="panel-head"><div className="panel-title"><Icon name="info" size={16} /> 数据与设计原则</div></div>
          <ul className="bullet-list">
            <li>本地优先：技能、启停状态与偏好设置全部保存在 localStorage。</li>
            <li>容错读取：JSON 解析失败时自动降级为空，不让坏数据阻塞应用。</li>
            <li>无遥测、无账号、无外部 API；内置示例与自定义技能一视同仁。</li>
            <li>兼容 iframe：页面导航使用 hash 路由，相对路径即可访问。</li>
          </ul>
        </section>
        <section className="panel glass">
          <div className="panel-head"><div className="panel-title"><Icon name="file" size={16} /> License</div></div>
          <p className="license-text">本项目以 MIT License 发布，可自由使用、修改与分发。内置示例技能仅作为格式演示，使用前请自行审查其内容。</p>
          <div className="panel-footer">
            <span className="footer-tip">当前技能库共 {api.allSkills.length} 个技能</span>
            <button className="btn btn-ghost" onClick={() => api.go('guide')}>阅读使用指南</button>
          </div>
        </section>
      </div>
    </>
  )
}
