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

export const monitoringApi = {
  getMetrics: (token: string | null) => fetchWithAuth("/monitoring/metrics", token),
  getRules: (token: string | null) => fetchWithAuth("/monitoring/rules", token),
  createRule: (token: string | null, rule: any) => fetchWithAuth("/monitoring/rules", token, { method: "POST", body: JSON.stringify(rule) }),
  getAlerts: (token: string | null) => fetchWithAuth("/monitoring/alerts", token),
  getChannels: (token: string | null) => fetchWithAuth("/monitoring/channels", token),
  createChannel: (token: string | null, channel: any) => fetchWithAuth("/monitoring/channels", token, { method: "POST", body: JSON.stringify(channel) })
};
