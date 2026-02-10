const baseURL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function buildUrl(path) {
  if (!baseURL) {
    throw new Error('VITE_API_URL is not configured.')
  }

  return `${baseURL}${path}`
}

async function request(path, options = {}) {
  const requestHeaders = options.headers || {}

  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...requestHeaders
    }
  })

  let json = null
  try {
    json = await response.json()
  } catch (_error) {
    json = null
  }

  if (!response.ok) {
    const error = new Error(json?.error || `HTTP ${response.status}`)
    error.status = response.status
    error.payload = json
    throw error
  }

  return json
}

export function getPerson(slug) {
  return request(`/people/${slug}`)
}

export function getGoals(slug) {
  return request(`/people/${slug}/goals`)
}

export function updateGoal(goalId, completed) {
  return request(`/goals/${goalId}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed })
  })
}

export function getGoalsStats() {
  return request('/stats/goals')
}

export function getPersonalRecords(slug) {
  return request(`/people/${slug}/personal_records`)
}

export function createPersonalRecord(slug, payload, password) {
  return request(`/people/${slug}/personal_records`, {
    method: 'POST',
    headers: {
      'X-WRITE-PASSWORD': password
    },
    body: JSON.stringify({ personal_record: payload })
  })
}

export function updatePersonalRecord(id, payload, password) {
  return request(`/personal_records/${id}`, {
    method: 'PATCH',
    headers: {
      'X-WRITE-PASSWORD': password
    },
    body: JSON.stringify({ personal_record: payload })
  })
}

export function deletePersonalRecord(id, password) {
  return request(`/personal_records/${id}`, {
    method: 'DELETE',
    headers: {
      'X-WRITE-PASSWORD': password
    }
  })
}
