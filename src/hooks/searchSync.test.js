import { it, expect } from 'vitest'
import { shouldFollowUrl } from './searchSync'

it('does not overwrite the input with the trimmed value it just wrote', () => {
  expect(shouldFollowUrl({ urlQ: 'soil', localQ: 'soil ', pending: false })).toBe(false)
  expect(shouldFollowUrl({ urlQ: 'water', localQ: 'soil ', pending: false })).toBe(true)
  expect(shouldFollowUrl({ urlQ: '', localQ: 'soil', pending: true })).toBe(false)
})
