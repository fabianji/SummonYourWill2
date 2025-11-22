const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}))
    throw new Error(detail.detail || 'Request failed')
  }
  if (response.status === 204) return null
  return response.json()
}

export const guidesApi = {
  list: () => request('/guides/'),
  create: (data) => request('/guides/', { method: 'POST', body: JSON.stringify(data) }),
  get: (id) => request(`/guides/${id}`),
}

export const diaryApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/diary/${query ? `?${query}` : ''}`)
  },
  create: (data) => request('/diary/', { method: 'POST', body: JSON.stringify(data) }),
}
