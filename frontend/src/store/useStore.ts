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

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role_id?: number;
}

interface AppState {
  systemStats: SystemStats | null;
  setSystemStats: (stats: SystemStats) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  token: string | null;
  user: UserProfile | null;
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  systemStats: null,
  setSystemStats: (stats) => set({ systemStats: stats }),
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  token: localStorage.getItem('vnav_token'),
  user: localStorage.getItem('vnav_user') ? JSON.parse(localStorage.getItem('vnav_user')!) : null,
  setAuth: (token, user) => {
    localStorage.setItem('vnav_token', token);
    localStorage.setItem('vnav_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('vnav_token');
    localStorage.removeItem('vnav_user');
    set({ token: null, user: null });
  },
}))
