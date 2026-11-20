import type { PageProps } from '../app-context'
import { PageHeader } from '../components/PageHeader'
import { SkillRow } from '../components/SkillRow'
import { StatsBar } from '../components/StatsBar'
import { Icon } from '../icons'
import { buildInstallScript } from '../utils'

export function EnabledPage({ api }: PageProps) {
  const disabledCount = api.allSkills.length - api.enabledSkills.length

  return (
    <>
      <PageHeader
        eyebrow="ACTIVE SKILLS"
        title="已启用技能"
        description="这里只展示参与安装脚本的技能。随时关闭开关，脚本内容会同步更新。"
        icon="check"
        actions={
          <button
            className="btn btn-primary"
            disabled={api.enabledSkills.length === 0}
            onClick={() => api.copy(
              'enabled-all',
              buildInstallScript(api.enabledSkills),
              `已复制 ${api.enabledSkills.length} 个启用技能的安装脚本`,
            )}
          >
            <Icon name="script" size={16} /> 复制安装脚本
          </button>
        }
      />

      <StatsBar
        total={api.allSkills.length}
        enabled={api.enabledSkills.length}
        categories={new Set(api.allSkills.map((skill) => skill.category)).size}
        sessionAdded={api.sessionAdded.size}
      />

      <div className="section-head">
        <div>
          <div className="section-title">当前启用 · {api.enabledSkills.length}</div>
          <div className="section-sub">点击右侧开关可快速停用，不会删除技能</div>
        </div>
        {disabledCount > 0 && (
          <button className="text-btn" onClick={() => api.go('vault')}>
            另有 {disabledCount} 个未启用，前往技能库 →
          </button>
        )}
      </div>

      {api.enabledSkills.length > 0 ? (
        <section className="skill-list" aria-label="已启用技能列表">
          {api.enabledSkills.map((skill) => (
            <SkillRow
              key={skill.id}
              skill={skill}
              enabled
              showSource={api.settings.showSource}
              onToggle={() => api.toggle(skill)}
              onOpen={() => api.openDetail(skill)}
            />
          ))}
        </section>
      ) : (
        <div className="empty-state glass">
          <div className="empty-icon"><Icon name="check" size={30} /></div>
          <h3>还没有启用任何技能</h3>
          <p>去技能库打开需要的开关，它们会立即出现在这里。</p>
          <button className="btn btn-primary" onClick={() => api.go('vault')}>前往技能库</button>
        </div>
      )}
    </>
  )
}
