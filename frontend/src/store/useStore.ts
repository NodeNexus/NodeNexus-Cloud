import { create } from 'zustand'

export interface DockerSimpleStat {
  name: string;
  status: string;
}

export interface SystemStats {
  hostname: string;
  ip: string;
  cpu: number;
  ram_used: number;
  ram_total: number;
  disk_used: number;
  disk_total: number;
  temperature: number;
  net_rx: number;
  net_tx: number;
  uptime: number;
  docker_containers: number;
  docker_images: number;
  containers_status: { name: string; status: string }[];
}

interface AppState {
  systemStats: SystemStats | null;
  setSystemStats: (stats: SystemStats) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set) => ({
  systemStats: null,
  setSystemStats: (stats) => set({ systemStats: stats }),
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}))
