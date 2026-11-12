import { describe, it, expect } from 'vitest'
import { createMetaStack } from './metaStack'

describe('createMetaStack', () => {
  it('applies the newest page and falls back when it leaves', () => {
    const applied = []
    const stack = createMetaStack(page => applied.push(page?.title ?? null))
    const a = stack.push({ title: 'A' })
    const b = stack.push({ title: 'B' })
    // Exit animations unmount the old page AFTER the new one mounted:
    a()
    expect(applied.at(-1)).toBe('B')
    b()
    expect(applied.at(-1)).toBe(null)
  })
})
