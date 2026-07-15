import { fetchWithAuth } from './client';

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
