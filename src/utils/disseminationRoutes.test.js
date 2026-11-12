import { describe, it, expect } from 'vitest'
import { isDisseminationSectionPath, interviewPath } from './disseminationRoutes'

describe('isDisseminationSectionPath', () => {
  it.each(['/dissemination', '/dissemination/', '/dissemination/some-slug', '/dissemination/some-slug/'])(
    '%s → true',
    p => expect(isDisseminationSectionPath(p)).toBe(true),
  )
  it.each(['/', '/resources', '/dissemination/a/b', '/disseminationx'])(
    '%s → false',
    p => expect(isDisseminationSectionPath(p)).toBe(false),
  )
})

it('interviewPath builds the detail URL', () => {
  expect(interviewPath('abc')).toBe('/dissemination/abc')
})
