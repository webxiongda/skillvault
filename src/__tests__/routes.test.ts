import { describe, it, expect } from 'vitest'
import { normalizeHash } from '../routes'

describe('normalizeHash', () => {
  it('识别全部合法路由', () => {
    expect(normalizeHash('vault')).toBe('vault')
    expect(normalizeHash('#/add')).toBe('add')
    expect(normalizeHash('#/import-export')).toBe('import-export')
  })

  it('容错查询串与尾部斜杠', () => {
    expect(normalizeHash('#/search?q=1')).toBe('search')
    expect(normalizeHash('#/scripts/')).toBe('scripts')
  })

  it('空或未知路由回落到 vault', () => {
    expect(normalizeHash('')).toBe('vault')
    expect(normalizeHash('#/nope')).toBe('vault')
  })
})
