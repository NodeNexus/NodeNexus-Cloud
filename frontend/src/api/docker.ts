export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  status: string;
  ports: Record<string, any>;
  created: string;
}

export interface ContainerDetails extends ContainerInfo {
  stats: any;
  env: string[];
  cmd: string[];
}

export interface ImageInfo {
  id: string;
  tags: string[];
  size: number;
  created: string;
}

export interface DockerActionResponse {
  status: string;
  message: string;
  container_id?: string;
}

export interface DockerPruneResponse {
  containers_deleted: string[];
  images_deleted: string[];
  space_reclaimed: number;
}

const API_URL = 'http://localhost:8000/docker';

export const dockerApi = {
  getContainers: async (): Promise<ContainerInfo[]> => {
    const res = await fetch(`${API_URL}/containers`);
    if (!res.ok) throw new Error('Failed to fetch containers');
    return res.json();
  },

  getContainerDetails: async (id: string): Promise<ContainerDetails> => {
    const res = await fetch(`${API_URL}/container/${id}`);
    if (!res.ok) throw new Error('Failed to fetch container details');
    return res.json();
  },

  getImages: async (): Promise<ImageInfo[]> => {
    const res = await fetch(`${API_URL}/images`);
    if (!res.ok) throw new Error('Failed to fetch images');
    return res.json();
  },

  startContainer: async (id: string): Promise<DockerActionResponse> => {
    const res = await fetch(`${API_URL}/start/${id}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to start container');
    return res.json();
  },

  stopContainer: async (id: string): Promise<DockerActionResponse> => {
    const res = await fetch(`${API_URL}/stop/${id}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to stop container');
    return res.json();
  },

  restartContainer: async (id: string): Promise<DockerActionResponse> => {
    const res = await fetch(`${API_URL}/restart/${id}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to restart container');
    return res.json();
  },

  deleteContainer: async (id: string): Promise<DockerActionResponse> => {
    const res = await fetch(`${API_URL}/container/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete container');
    return res.json();
  },

  getLogs: async (id: string): Promise<{logs: string}> => {
    const res = await fetch(`${API_URL}/logs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
  },

  createContainer: async (payload: { image: string, name?: string, ports?: Record<string, string>, env?: string[], command?: string }): Promise<DockerActionResponse> => {
    const res = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create container');
    return res.json();
  },

  pullImage: async (image: string): Promise<DockerActionResponse> => {
    const res = await fetch(`${API_URL}/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image })
    });
    if (!res.ok) throw new Error('Failed to pull image');
    return res.json();
  },

  pruneSystem: async (): Promise<DockerPruneResponse> => {
    const res = await fetch(`${API_URL}/prune`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to prune system');
    return res.json();
  }
};
