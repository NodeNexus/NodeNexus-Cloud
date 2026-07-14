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

export const pluginsApi = {
  getPlugins: (token: string | null) => fetchWithAuth("/plugins", token),
  getCategories: (token: string | null) => fetchWithAuth("/plugins/categories", token),
  installPlugin: (token: string | null, id: string) => fetchWithAuth(`/plugins/${id}/install`, token, { method: "POST" }),
  uninstallPlugin: (token: string | null, id: string) => fetchWithAuth(`/plugins/${id}/uninstall`, token, { method: "POST" }),
};
