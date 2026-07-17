import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Terminal } from "lucide-react";
import { fetchApi } from "@/lib/api";

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

export function Monitoring() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchApi("/system/containers").then(setContainers).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedContainer) return;
    
    setLogs(["Connecting to log stream..."]);
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(`ws://localhost:8000/api/system/ws/logs/${selectedContainer}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      setLogs((prev) => {
        const newLogs = [...prev, event.data];
        if (newLogs.length > 500) return newLogs.slice(newLogs.length - 500);
        return newLogs;
      });
    };

    ws.onclose = () => {
      setLogs((prev) => [...prev, "Log stream disconnected."]);
    };

    return () => {
      ws.close();
    };
  }, [selectedContainer]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

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
            <CardTitle className="flex items-center gap-2"><Activity size={18} className="text-info" /> Network I/O</CardTitle>
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
              <CardTitle className="flex items-center gap-2"><Terminal size={18} className="text-primary" /> Live CloudWatch Logs</CardTitle>
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
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-[300px]">
            <div className="flex-1 bg-[#0d0d0d] rounded-md p-4 border border-[#333] font-mono text-xs overflow-y-auto whitespace-pre-wrap scrollbar-thin text-text-secondary h-full">
              {logs.length === 0 && !selectedContainer && (
                <span className="text-text-tertiary">Select a container to stream live logs.</span>
              )}
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
