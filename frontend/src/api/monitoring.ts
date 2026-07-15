import { fetchWithAuth } from './client';

export const monitoringApi = {
  getMetrics: (token: string | null) => fetchWithAuth("/monitoring/metrics", token),
  getRules: (token: string | null) => fetchWithAuth("/monitoring/rules", token),
  createRule: (token: string | null, rule: any) => fetchWithAuth("/monitoring/rules", token, { method: "POST", body: JSON.stringify(rule) }),
  getAlerts: (token: string | null) => fetchWithAuth("/monitoring/alerts", token),
  getChannels: (token: string | null) => fetchWithAuth("/monitoring/channels", token),
  createChannel: (token: string | null, channel: any) => fetchWithAuth("/monitoring/channels", token, { method: "POST", body: JSON.stringify(channel) })
};
