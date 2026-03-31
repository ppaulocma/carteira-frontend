const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api'

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message || 'Erro na requisição')
  }

  return json
}

export const api = {
  register: (data) =>
    request('/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data) =>
    request('/login', { method: 'POST', body: JSON.stringify(data) }),

  getUser: () => request('/user'),

  getTransactions: () => request('/transactions'),

  findUserByEmail: (email) =>
    request(`/users/find?email=${encodeURIComponent(email)}`),

  deposit: (data) =>
    request('/deposit', { method: 'POST', body: JSON.stringify(data) }),

  transfer: (data) =>
    request('/transfer', { method: 'POST', body: JSON.stringify(data) }),

  reverseTransaction: (id) =>
    request(`/transactions/${id}/reverse`, { method: 'POST' }),
}
