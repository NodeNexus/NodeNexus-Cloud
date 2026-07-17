import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Terminal, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchApi, WS_BASE } from "@/lib/api";

const mockNetwork = [
  { time: "10:00", in: 120, out: 80 },
  { time: "10:05", in: 250, out: 140 },
  { time: "10:10", in: 180, out: 120 },
  { time: "10:15", in: 300, out: 200 },
  { time: "10:20", in: 220, out: 160 },
  { time: "10:25", in: 400, out: 300 },
];

interface Container {
  id: string;
  name: string;
  image: string;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const LOG_FLUSH_INTERVAL_MS = 100; // P2: Buffer flush rate

export function Monitoring() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [wsStatus, setWsStatus] = useState<"idle" | "connecting" | "connected" | "disconnected" | "error">("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  // P2: Log buffer refs — accumulate in a ref, flush to state on interval
  const logBufferRef = useRef<string[]>([]);
  const flushIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchApi("/system/containers").then(setContainers).catch(console.error);
  }, []);

  // P2: Start the flush interval once on mount
  useEffect(() => {
    flushIntervalRef.current = setInterval(() => {
      if (logBufferRef.current.length > 0) {
        const chunk = logBufferRef.current.splice(0);
        setLogs((prev) => {
          const merged = [...prev, ...chunk];
          return merged.length > 500 ? merged.slice(merged.length - 500) : merged;
        });
      }
    }, LOG_FLUSH_INTERVAL_MS);

    return () => {
      if (flushIntervalRef.current) clearInterval(flushIntervalRef.current);
    };
  }, []);

  const connectLogStream = useCallback((containerId: string, attempt = 0) => {
    if (wsRef.current) wsRef.current.close();

    setWsStatus("connecting");
    logBufferRef.current = [];
    if (attempt === 0) setLogs(["Connecting to log stream..."]);

    const ws = new WebSocket(`${WS_BASE}/api/system/ws/logs/${containerId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus("connected");
      reconnectCountRef.current = 0;
    };

    // P2: Push to buffer, NOT directly to state
    ws.onmessage = (event) => {
      logBufferRef.current.push(event.data);
    };

    ws.onclose = (ev) => {
      setWsStatus("disconnected");
      logBufferRef.current.push("\n[Log stream disconnected.]\n");

      // P3: Exponential-backoff reconnect (max 5 attempts)
      const nextAttempt = attempt + 1;
      if (nextAttempt <= MAX_RECONNECT_ATTEMPTS && ev.code !== 1000) {
        const delay = Math.min(1000 * 2 ** attempt, 30000);
        logBufferRef.current.push(
          `[Reconnecting in ${Math.round(delay / 1000)}s... attempt ${nextAttempt}/${MAX_RECONNECT_ATTEMPTS}]\n`
        );
        reconnectTimerRef.current = setTimeout(() => {
          reconnectCountRef.current = nextAttempt;
          connectLogStream(containerId, nextAttempt);
        }, delay);
      } else if (nextAttempt > MAX_RECONNECT_ATTEMPTS) {
        setWsStatus("error");
        logBufferRef.current.push("[Max reconnect attempts reached. Please select the container again.]\n");
      }
    };

    ws.onerror = () => {
      setWsStatus("error");
    };
  }, []);

  useEffect(() => {
    if (!selectedContainer) return;

    // Clean up previous timers and connections
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    reconnectCountRef.current = 0;
    setLogs([]);

    connectLogStream(selectedContainer, 0);

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) wsRef.current.close(1000, "User changed selection");
    };
  }, [selectedContainer, connectLogStream]);

  // Auto-scroll
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const statusColor = {
    idle: "bg-surface-active",
    connecting: "bg-warning animate-pulse",
    connected: "bg-success",
    disconnected: "bg-danger",
    error: "bg-danger",
  }[wsStatus];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Monitoring</h1>
          <p className="text-text-secondary">Real-time telemetry and log streaming.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} className="text-info" /> Network I/O
            </CardTitle>
            <CardDescription>Network traffic over the last 30 minutes (MB/s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockNetwork} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#121214', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Line type="monotone" dataKey="in" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="out" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Terminal size={18} className="text-primary" />
                Live CloudWatch Logs
                <span className={`w-2 h-2 rounded-full ml-1 ${statusColor}`} />
              </CardTitle>
              <div className="flex items-center gap-2">
                {wsStatus === "error" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-warning"
                    onClick={() => selectedContainer && connectLogStream(selectedContainer, 0)}
                  >
                    <RefreshCw size={12} className="mr-1" /> Retry
                  </Button>
                )}
                <select
                  className="bg-surface text-text-primary border border-border rounded-md px-2 py-1 text-xs outline-none focus:border-primary max-w-[200px]"
                  value={selectedContainer}
                  onChange={(e) => setSelectedContainer(e.target.value)}
                >
                  <option value="">Select instance...</option>
                  {containers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-[300px]">
            {wsStatus === "error" ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-danger bg-danger/5 rounded-md border border-danger/20 p-6">
                <WifiOff size={28} />
                <p className="text-sm font-semibold">Log stream failed to connect</p>
                <p className="text-xs text-text-secondary text-center">
                  The container may have stopped or is unreachable.
                </p>
              </div>
            ) : (
              <div className="flex-1 bg-[#0d0d0d] rounded-md p-4 border border-[#333] font-mono text-xs overflow-y-auto whitespace-pre-wrap text-text-secondary h-full">
                {logs.length === 0 && !selectedContainer && (
                  <span className="text-text-tertiary">Select a container to stream live logs.</span>
                )}
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
