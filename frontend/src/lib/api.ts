export const API_BASE = `http://${window.location.hostname}:8000/api`;
export const WS_BASE = `ws://${window.location.hostname}:8000`;
export const BASE_URL = `http://${window.location.hostname}:8000`;

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'API Error';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorDetail;
    } catch {
      // Ignored
    }
    throw new Error(errorDetail);
  }

  return response.json();
}
