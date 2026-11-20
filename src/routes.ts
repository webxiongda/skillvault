import { useEffect, useState } from 'react'
import type { IconName } from './icons'

// 页面注册表：导航、路由校验、默认页共用同一份配置
export const ROUTES = [
  { path: 'vault', label: '技能库', icon: 'layers' },
  { path: 'add', label: '添加技能', icon: 'plus' },
  { path: 'enabled', label: '已启用', icon: 'check' },
  { path: 'categories', label: '分类浏览', icon: 'filter' },
  { path: 'scripts', label: '安装脚本', icon: 'script' },
  { path: 'search', label: '高级搜索', icon: 'search' },
  { path: 'import-export', label: '导入导出', icon: 'file' },
  { path: 'guide', label: '使用指南', icon: 'info' },
  { path: 'about', label: '关于与热点', icon: 'sparkle' },
  { path: 'settings', label: '设置', icon: 'settings' },
] as const satisfies ReadonlyArray<{ path: string; label: string; icon: IconName }>

export type RoutePath = (typeof ROUTES)[number]['path']

export function normalizeHash(hash: string): RoutePath {
  const raw = hash.replace(/^#\/?/, '').split(/[/?]/)[0] || ''
  return ROUTES.some((route) => route.path === raw) ? (raw as RoutePath) : 'vault'
}

export function navigateTo(path: RoutePath) {
  window.location.hash = `#/${path}`
}

// Hash 路由：兼容 iframe 相对路径，无需任何路由依赖
export function useHashRoute(): RoutePath {
  const [route, setRoute] = useState<RoutePath>(() => normalizeHash(window.location.hash))

  useEffect(() => {
    if (!window.location.hash) window.location.hash = '#/vault'
    const handleChange = () => setRoute(normalizeHash(window.location.hash))
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [route])

  return route
}
