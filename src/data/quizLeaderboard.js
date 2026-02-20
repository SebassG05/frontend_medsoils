/**
 * Quiz Leaderboard – API-backed data layer
 *
 * All data lives in MongoDB on the backend.
 * A short sessionStorage cache (30 s) avoids hammering the API on every render.
 *
 * Ranking rules: score DESC → totalTime ASC  (enforced by the server)
 */

const API_URL   = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1'
const CACHE_KEY = 'medsoils_lb_cache'
const CACHE_TTL = 30_000 // ms

// ─── Cache helpers ──────────────────────────────────────────────────

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { ts, data } = JSON.parse(raw)
    if (Date.now() - ts < CACHE_TTL) return data
    sessionStorage.removeItem(CACHE_KEY)
    return null
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  } catch { /* quota */ }
}

export function bustCache() {
  sessionStorage.removeItem(CACHE_KEY)
}

// ─── Auth token ───────────────────────────────────────────────────────

function getToken() {
  return (
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    null
  )
}

// ─── Public API ────────────────────────────────────────────────────

/**
 * Save (or conditionally improve) the current user's result.
 * Server only updates when the new attempt is strictly better.
 *
 * @param {{ score: number, totalTime: number, alias?: string }} result
 * @returns {Promise<{ rank: number|null, saved: boolean }>}
 */
export async function saveResult({ score, totalTime, alias }) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const body = { score, totalTime }
  if (alias && alias.trim().length > 0) body.alias = alias.trim().toUpperCase()

  const res = await fetch(`${API_URL}/quiz/result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to save result')

  bustCache() // force fresh leaderboard on next read
  return { rank: json.data.rank, saved: json.data.saved }
}

/**
 * Fetch the top N players (with short cache).
 * @param {number} limit
 * @returns {Promise<Array<{ _id, name, score, totalTime, achievedAt }>>}
 */
export async function getLeaderboard(limit = 5) {
  const cached = readCache()
  if (cached) return cached

  const res  = await fetch(`${API_URL}/quiz/leaderboard?limit=${limit}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to fetch leaderboard')

  const data = json.data ?? []
  writeCache(data)
  return data
}

/**
 * Get the authenticated user's own quiz result (or null if none).
 * @returns {Promise<object|null>}
 */
export async function getMyResult() {
  const token = getToken()
  if (!token) return null

  const res = await fetch(`${API_URL}/quiz/result/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const json = await res.json()
  if (!res.ok) return null
  return json.data ?? null
}

/** Format seconds as "Xs" or "Xm Ys" */
export function formatTime(seconds) {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${s}s`
}

/**
 * Delete the authenticated user's quiz result.
 * @returns {Promise<{ deleted: boolean }>}
 */
export async function deleteResult() {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(`${API_URL}/quiz/result`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to delete result')

  bustCache()
  return { deleted: json.data.deleted }
}
