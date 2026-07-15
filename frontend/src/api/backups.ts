import { fetchWithAuth } from './client';
export const backupsApi = {
  getSnapshots: (token: string | null) => fetchWithAuth("/backups/snapshots", token),
  createSnapshot: (token: string | null, data: any) => fetchWithAuth("/backups/snapshots", token, { method: "POST", body: JSON.stringify(data) }),
  restoreSnapshot: (token: string | null, id: number) => fetchWithAuth(`/backups/${id}/restore`, token, { method: "POST" }),
  getSchedules: (token: string | null) => fetchWithAuth("/backups/schedules", token),
  createSchedule: (token: string | null, schedule: any) => fetchWithAuth("/backups/schedules", token, { method: "POST", body: JSON.stringify(schedule) })
};
