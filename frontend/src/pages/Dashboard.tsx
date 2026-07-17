import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Server, Activity, HardDrive, Database, AlertCircle } from "lucide-react";

interface DashboardMetrics {
  timestamp: number;
  hardware: {
    cpu_percent: number;
    memory_percent: number;
    memory_used_gb: number;
    memory_total_gb: number;
    disk_percent: number;
    disk_used_gb: number;
    disk_total_gb: number;
  };
  orchestration: {
    active_instances: number;
    database_count: number;
    healthy: boolean;
  };
  recent_alerts: any[];
}

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/system/dashboard");
        if (res.ok) {
          const data: DashboardMetrics = await res.json();
          setMetrics(data);
          
          const timeLabel = new Date(data.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setChartData(prev => {
            const newData = [...prev, { time: timeLabel, cpu: data.hardware.cpu_percent, ram: data.hardware.memory_percent }];
            return newData.slice(-15); // keep last 15 points
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard metrics", err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary">Overview of your VNAV Cloud infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-surface to-surface-active border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-tertiary">Active Instances</p>
                <h3 className="text-3xl font-bold text-text-primary mt-1">
                  {metrics ? metrics.orchestration.active_instances : "..."}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Server className="text-primary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {metrics?.orchestration.healthy ? (
                <>
                  <Badge variant="success">Healthy</Badge>
                  <span className="text-text-tertiary ml-2">All systems operational</span>
                </>
              ) : (
                <>
                  <Badge variant="destructive">Warning</Badge>
                  <span className="text-text-tertiary ml-2">Systems degraded</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-surface to-surface-active border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-tertiary">Avg CPU Load</p>
                <h3 className="text-3xl font-bold text-text-primary mt-1">
                  {metrics ? `${metrics.hardware.cpu_percent}%` : "..."}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Activity className="text-warning" size={24} />
              </div>
            </div>
            <div className="mt-4 w-full bg-surface-active rounded-full h-1.5">
              <div className="bg-warning h-1.5 rounded-full transition-all duration-500" style={{ width: `${metrics?.hardware.cpu_percent || 0}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-surface to-surface-active border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-tertiary">Storage Used</p>
                <h3 className="text-3xl font-bold text-text-primary mt-1">
                  {metrics ? `${metrics.hardware.disk_used_gb} GB` : "..."}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-info/10 flex items-center justify-center">
                <HardDrive className="text-info" size={24} />
              </div>
            </div>
            <div className="mt-4 w-full bg-surface-active rounded-full h-1.5 flex flex-col justify-end">
              <div className="bg-info h-1.5 rounded-full transition-all duration-500" style={{ width: `${metrics?.hardware.disk_percent || 0}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-surface to-surface-active border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-tertiary">Databases</p>
                <h3 className="text-3xl font-bold text-text-primary mt-1">
                  {metrics ? metrics.orchestration.database_count : "..."}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Database className="text-purple-500" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-text-tertiary">Running containers</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Live CPU and Memory usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121214', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
                  <Area type="monotone" dataKey="ram" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRam)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>System notifications and warnings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(!metrics?.recent_alerts || metrics.recent_alerts.length === 0) ? (
                <div className="text-center py-6 text-text-tertiary text-sm">
                  No active alerts
                </div>
              ) : (
                metrics.recent_alerts.map((alert: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-surface-active/50 border border-border/50">
                    <AlertCircle className="text-warning mt-0.5 shrink-0" size={16} />
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">{alert.title}</h4>
                      <p className="text-xs text-text-tertiary mt-1">{alert.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
