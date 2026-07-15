export const API_BASE = "/api";

export const fetchWithAuth = async (url: string, token: string | null, options: any = {}) => {
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
  
  // URL may be absolute or relative, but typically it starts with /
  const endpoint = url.startsWith('/') ? url.substring(1) : url;
  
  const res = await fetch(`${API_BASE}/${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `API Error: ${res.statusText}`);
  }
  return res.json();
};
