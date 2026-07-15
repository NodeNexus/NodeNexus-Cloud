import { fetchWithAuth } from './client';

export const updatesApi = {
  checkUpdates: (token: string | null) => fetchWithAuth("/updates/check", token),
  applyUpdate: (token: string | null, payload: any) => fetchWithAuth("/updates/apply", token, { method: "POST", body: JSON.stringify(payload) }),
  getHistory: (token: string | null) => fetchWithAuth("/updates/history", token),
  getState: (token: string | null) => fetchWithAuth("/updates/state", token),
  toggleMaintenance: (token: string | null) => fetchWithAuth("/updates/maintenance", token, { method: "POST" }),
};
