#!/usr/bin/env node
/**
 * Generates placeholder photos, video posters, videos and subtitle files for
 * every collection in src/data/collections into ./dev-media (git-ignored).
 * The Vite dev server serves that folder at /__dev-media.
 *
 *   npm run media:dev            # skip files that already exist
 *   npm run media:dev -- --force # regenerate everything
 *
 * Requires ffmpeg (with libaom-av1, libwebp, libx264) on PATH.
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COLLECTIONS } from '../src/data/collections/index.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'dev-media')
const WIDTHS = [480, 960, 1600]
const FORCE = process.argv.includes('--force')
const FONT = process.platform === 'win32' ? 'C\\:/Windows/Fonts/segoeui.ttf' : '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

const even = n => Math.round(n / 2) * 2

function darken(hex, f = 0.55) {
  const n = parseInt(hex.slice(1), 16)
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * f))
  return `0x${c.map(v => v.toString(16).padStart(2, '0')).join('')}`
}

function ffmpeg(args) {
  return new Promise((ok, fail) => {
    const p = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''
    p.stderr.on('data', d => { err += d })
    p.on('close', code => (code === 0 ? ok() : fail(new Error(err || `ffmpeg exited ${code}`))))
  })
}

function background(m, w, h, extra = '') {
  const c0 = `0x${m.color.slice(1)}`
  const c1 = darken(m.color)
  return `gradients=s=${w}x${h}:c0=${c0}:c1=${c1}:x0=0:y0=0:x1=${w}:y1=${h}:nb_colors=2${extra}`
}

function label(text, h) {
  const size = Math.max(14, Math.round(h / 18))
  return `drawtext=fontfile='${FONT}':text='${text}':fontcolor=white@0.85:fontsize=${size}:x=(w-text_w)/2:y=(h-text_h)/2`
}

async function stills(m, name, text) {
  for (const w of WIDTHS) {
    const h = even((w * m.height) / m.width)
    const base = join(OUT, `${name}-${w}`)
    const vf = label(text, h)
    const src = ['-f', 'lavfi', '-i', background(m, w, h), '-frames:v', '1', '-vf', vf]
    if (FORCE || !existsSync(`${base}.avif`)) await ffmpeg([...src, '-c:v', 'libaom-av1', '-cpu-used', '8', '-crf', '40', '-still-picture', '1', `${base}.avif`])
    if (FORCE || !existsSync(`${base}.webp`)) await ffmpeg([...src, '-c:v', 'libwebp', '-quality', '70', `${base}.webp`])
    if (w === 1600 && (FORCE || !existsSync(`${base}.jpg`))) await ffmpeg([...src, '-q:v', '5', `${base}.jpg`])
  }
}

async function clip(m, text) {
  const file = join(OUT, `${m.src}.mp4`)
  if (!FORCE && existsSync(file)) return
  const w = m.width >= m.height ? 960 : 540
  const h = even((w * m.height) / m.width)
  const timer = `drawtext=fontfile='${FONT}':text='%{pts\\:hms}':fontcolor=white@0.7:fontsize=${Math.round(h / 22)}:x=(w-text_w)/2:y=h*0.62`
  await ffmpeg([
    '-f', 'lavfi', '-i', background(m, w, h, `:speed=0.02:d=${m.duration}:r=24`),
    '-vf', `${label(text, h)},${timer}`,
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '32', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', file,
  ])
}

function vtt(track, m) {
  const file = join(OUT, track.src)
  if (!FORCE && existsSync(file)) return
  const end = Math.min(m.duration, 6)
  writeFileSync(file, `WEBVTT\n\n00:00:00.500 --> 00:00:0${end}.000\nPlaceholder subtitles (${track.label}).\n`)
}

const queue = []
for (const c of COLLECTIONS) {
  for (const d of c.days) {
    for (const m of d.media) {
      if (/^https?:\/\//.test(m.src)) continue // hosted remotely (Cloudinary): nothing to generate
      mkdirSync(dirname(join(OUT, m.src)), { recursive: true })
      const text = `Placeholder · Day ${d.number} · ${m.id}`
      if (m.type === 'photo') queue.push(() => stills(m, m.src, text))
      else {
        queue.push(() => stills(m, m.poster, `${text} (poster)`))
        queue.push(() => clip(m, text))
        for (const t of m.tracks ?? []) vtt(t, m)
      }
    }
  }
}

let done = 0
const total = queue.length
async function worker() {
  while (queue.length) {
    await queue.shift()()
    process.stdout.write(`\r${++done}/${total}`)
  }
}
await Promise.all(Array.from({ length: 4 }, worker))
console.log(`\nDev media ready in ${OUT}`)
