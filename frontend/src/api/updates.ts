const API_BASE = "http://127.0.0.1:8000";

const fetchWithAuth = async (url: string, token: string | null, options: any = {}) => {
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
};

export const updatesApi = {
  checkUpdates: (token: string | null) => fetchWithAuth("/updates/check", token),
  applyUpdate: (token: string | null, payload: any) => fetchWithAuth("/updates/apply", token, { method: "POST", body: JSON.stringify(payload) }),
  getHistory: (token: string | null) => fetchWithAuth("/updates/history", token),
  getState: (token: string | null) => fetchWithAuth("/updates/state", token),
  toggleMaintenance: (token: string | null) => fetchWithAuth("/updates/maintenance", token, { method: "POST" }),
};
