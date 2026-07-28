const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

type RequestOptions = { method?: string; body?: any; signal?: AbortSignal };

async function request(path: string, { method = 'GET', body, signal }: RequestOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export function fetchPosts(options: RequestOptions = {}) {
  return request('/posts?_limit=5', options) as Promise<any[]>;
}

export function postJson(path: string, body: any, options: RequestOptions = {}) {
  return request(path, { ...options, method: 'POST', body });
}
