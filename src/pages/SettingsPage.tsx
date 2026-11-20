import type { PageProps } from '../app-context'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../icons'
import type { Category } from '../types'
import { CATEGORIES } from '../utils'

const STORAGE_KEYS = ['skillvault.userSkills.v1', 'skillvault.enabled.v1', 'skillvault.settings.v1']

export function SettingsPage({ api }: PageProps) {
  const storageBytes = STORAGE_KEYS.reduce((total, key) => total + (localStorage.getItem(key)?.length ?? 0), 0)
  const storageKb = (storageBytes / 1024).toFixed(1)

  const reset = () => {
    if (window.confirm('确定清空所有自定义技能、启停状态和偏好设置吗？内置技能会自动恢复。')) {
      api.resetLibrary()
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="PREFERENCES"
        title="设置"
        description="偏好设置会立即生效并持久化到 localStorage，下次打开自动沿用。"
        icon="settings"
        actions={<button className="btn btn-ghost" onClick={() => api.go('import-export')}><Icon name="file" size={16} /> 备份数据</button>}
      />

      <div className="settings-grid">
        <section className="panel glass setting-card">
          <div className="panel-head"><div className="panel-title"><Icon name="filter" size={16} /> 浏览偏好</div></div>

          <div className="setting-row">
            <div className="setting-label">
              <strong>默认分类</strong>
              <span>技能库打开时预选的分类筛选条件</span>
            </div>
            <select
              value={api.settings.defaultCategory}
              onChange={(event) => api.updateSettings({ defaultCategory: event.target.value as Category | '全部' })}
            >
              <option value="全部">全部</option>
              {CATEGORIES.map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-label">
              <strong>显示技能来源</strong>
              <span>在卡片与列表中显示「内置 / 自定义」徽标</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={api.settings.showSource}
                onChange={(event) => api.updateSettings({ showSource: event.target.checked })}
                aria-label="显示技能来源"
              />
              <span className="switch-track"><span className="switch-thumb" /></span>
            </label>
          </div>

          <div className="setting-row">
            <div className="setting-label">
              <strong>卡片密度</strong>
              <span>紧凑模式在屏幕上展示更多技能</span>
            </div>
            <div className="segmented" role="group" aria-label="卡片密度">
              <button
                className={api.settings.density === 'comfortable' ? 'active' : ''}
                onClick={() => api.updateSettings({ density: 'comfortable' })}
              >舒适</button>
              <button
                className={api.settings.density === 'compact' ? 'active' : ''}
                onClick={() => api.updateSettings({ density: 'compact' })}
              >紧凑</button>
            </div>
          </div>
        </section>

        <section className="panel glass setting-card">
          <div className="panel-head"><div className="panel-title"><Icon name="server" size={16} /> 本地存储</div></div>
          <div className="storage-summary">
            <div className="storage-value">{storageKb} <span>KB</span></div>
            <div className="storage-label">当前浏览器占用（估算）</div>
          </div>
          <div className="storage-bar"><span style={{ width: `${Math.min(100, Math.max(4, storageBytes / 512))}%` }} /></div>
          <ul className="storage-keys">
            {STORAGE_KEYS.map((key) => (
              <li key={key}>
                <code>{key}</code>
                <span>{(Number(localStorage.getItem(key)?.length ?? 0) / 1024).toFixed(1)} KB</span>
              </li>
            ))}
          </ul>
          <div className="danger-zone">
            <div>
              <strong>清空本地数据</strong>
              <p>移除所有自定义技能与偏好，恢复内置示例的初始状态。</p>
            </div>
            <button className="btn btn-danger" onClick={reset}><Icon name="trash" size={15} /> 重置</button>
          </div>
        </section>
      </div>

      <section className="panel glass">
        <div className="panel-head"><div className="panel-title"><Icon name="code" size={16} /> 当前配置</div></div>
        <pre className="code-block">{JSON.stringify(api.settings, null, 2)}</pre>
      </section>
    </>
  )
}
