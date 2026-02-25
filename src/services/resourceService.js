const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1'

function authHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/* ─── GET all (public) ─── */
export async function fetchResources({ type = '', q = '' } = {}) {
  const params = new URLSearchParams()
  if (type) params.set('type', type)
  if (q)    params.set('q', q)
  const qs = params.toString() ? `?${params}` : ''

  const res = await fetch(`${API_URL}/resources${qs}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch resources')
  return data.data   // array of resources
}

/* ─── POST create (superadmin) ─── */
export async function createResource(payload) {
  const res = await fetch(`${API_URL}/resources`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create resource')
  return data.data
}

/* ─── PUT update (superadmin) ─── */
export async function updateResource(id, payload) {
  const res = await fetch(`${API_URL}/resources/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update resource')
  return data.data
}

/* ─── DELETE (superadmin) ─── */
export async function deleteResource(id) {
  const res = await fetch(`${API_URL}/resources/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to delete resource')
  return true
}
