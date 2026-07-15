import { fetchWithAuth } from './client';

export const pluginsApi = {
  getPlugins: (token: string | null) => fetchWithAuth("/plugins", token),
  getCategories: (token: string | null) => fetchWithAuth("/plugins/categories", token),
  installPlugin: (token: string | null, id: string) => fetchWithAuth(`/plugins/${id}/install`, token, { method: "POST" }),
  uninstallPlugin: (token: string | null, id: string) => fetchWithAuth(`/plugins/${id}/uninstall`, token, { method: "POST" }),
};
