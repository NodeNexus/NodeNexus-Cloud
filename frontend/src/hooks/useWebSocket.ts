import { useEffect, useRef, useState } from 'react';
import { useStore, type SystemStats } from '@/store/useStore';

const WS_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/monitoring/ws/realtime`;

export const useWebSocket = () => {
  const { setSystemStats } = useStore();
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        try {
          const data: SystemStats = JSON.parse(event.data);
          setSystemStats(data);
        } catch (err) {
          console.error("Failed to parse WebSocket message", err);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(connect, 3000);
      };

      ws.current.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.current?.close();
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [setSystemStats]);

  return { isConnected };
};
