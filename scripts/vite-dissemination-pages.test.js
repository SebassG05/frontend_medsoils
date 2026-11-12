import { it, expect } from 'vitest'
import { jsonForScript, inject } from './vite-dissemination-pages.js'

it('jsonForScript cannot close the script tag', () => {
  const out = jsonForScript({ title: 'a </script><b>x</b> & y' })
  expect(out).not.toMatch(/<\/script/i)
  expect(JSON.parse(out).title).toBe('a </script><b>x</b> & y')
})

it('inject keeps $ sequences from the data literally', () => {
  const html = inject('<html><head><title>x</title></head></html>', {
    title: 'Costs $& savings $1', description: 'd', url: 'https://e/x', type: 'article', jsonLd: null,
  })
  expect(html).toContain('<title>Costs $&amp; savings $1 · MEDSOILS Challenge</title>')
})
