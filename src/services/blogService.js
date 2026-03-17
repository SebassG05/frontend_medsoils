const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1';

function authHeaders() {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchBlogs(page = 1, limit = 10, options = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (options.type) {
    params.set('type', options.type);
  }

  const res = await fetch(`${API_URL}/blogs?${params.toString()}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load posts');
  return data.data;
}

export async function fetchBlogById(id) {
  const res = await fetch(`${API_URL}/blogs/${id}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load post');
  return data.data;
}

export async function createBlog({ title, content, tags, coverImage, bannerImage, type, eventDate, eventTime }) {
  const res = await fetch(`${API_URL}/blogs`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ title, content, tags, coverImage, bannerImage, type, eventDate, eventTime }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create post');
  return data.data;
}

export async function updateBlog(id, payload) {
  const res = await fetch(`${API_URL}/blogs/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update post');
  return data.data;
}

export async function deleteBlog(id) {
  const res = await fetch(`${API_URL}/blogs/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete post');
  return data;
}

export async function fetchBlogStats() {
  const res = await fetch(`${API_URL}/blogs/stats`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load stats');
  return data.data;
}
