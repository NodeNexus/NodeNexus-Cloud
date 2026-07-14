const API_BASE = "http://127.0.0.1:8000";

const fetchWithAuth = async (url: string, token: string | null, options: any = {}) => {
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`
  };
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
};

export const k8sApi = {
  getClusterStatus: (token: string | null) => fetchWithAuth("/cluster/status", token),
  getClusterResources: (token: string | null) => fetchWithAuth("/cluster/resources", token),
  getNodes: (token: string | null) => fetchWithAuth("/nodes", token),
  getPods: (token: string | null, namespace: string = "default") => fetchWithAuth(`/pods?namespace=${namespace}`, token),
  restartPod: (token: string | null, name: string, namespace: string = "default") => 
    fetchWithAuth(`/pods/restart?name=${name}&namespace=${namespace}`, token, { method: "POST" }),
  getDeployments: (token: string | null, namespace: string = "default") => fetchWithAuth(`/deployments?namespace=${namespace}`, token),
  getHelmCharts: (token: string | null) => fetchWithAuth("/helm/charts", token),
};
