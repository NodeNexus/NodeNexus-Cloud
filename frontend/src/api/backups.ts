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

export const backupsApi = {
  getSnapshots: (token: string | null) => fetchWithAuth("/backups/snapshots", token),
  createSnapshot: (token: string | null, data: any) => fetchWithAuth("/backups/snapshots", token, { method: "POST", body: JSON.stringify(data) }),
  restoreSnapshot: (token: string | null, id: number) => fetchWithAuth(`/backups/${id}/restore`, token, { method: "POST" }),
  getSchedules: (token: string | null) => fetchWithAuth("/backups/schedules", token),
  createSchedule: (token: string | null, schedule: any) => fetchWithAuth("/backups/schedules", token, { method: "POST", body: JSON.stringify(schedule) })
};
