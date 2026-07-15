export interface SystemStats {
  hostname: string;
  ip: string;
  cpu: number;
  ram_used: number;
  ram_total: number;
  disk_used: number;
  disk_total: number;
}

const API_BASE_URL = '/api';

export const fetchSystemStats = async (): Promise<SystemStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/system`);
    if (!response.ok) {
      throw new Error('Failed to fetch system stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching system stats:', error);
    // Return mock data for development if backend is not running
    return {
      hostname: 'vnav-pi-01',
      ip: '192.168.1.100',
      cpu: Math.random() * 100,
      ram_used: 4096 * Math.random(),
      ram_total: 8192,
      disk_used: 120,
      disk_total: 256,
    };
  }
}
