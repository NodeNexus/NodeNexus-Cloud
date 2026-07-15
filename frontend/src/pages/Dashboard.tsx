import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Server, Activity, HardDrive, Database, AlertCircle } from "lucide-react";

const mockData = [
  { time: "00:00", cpu: 30, ram: 45 },
  { time: "04:00", cpu: 25, ram: 40 },
  { time: "08:00", cpu: 65, ram: 70 },
  { time: "12:00", cpu: 85, ram: 80 },
  { time: "16:00", cpu: 55, ram: 65 },
  { time: "20:00", cpu: 40, ram: 50 },
  { time: "24:00", cpu: 35, ram: 45 },
];

export function Dashboard() {
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
                <h3 className="text-3xl font-bold text-text-primary mt-1">12</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Server className="text-primary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="success">Healthy</Badge>
              <span className="text-text-tertiary ml-2">All systems operational</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-surface to-surface-active border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-tertiary">Avg CPU Load</p>
                <h3 className="text-3xl font-bold text-text-primary mt-1">45%</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Activity className="text-warning" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-warning font-medium">+15%</span>
              <span className="text-text-tertiary ml-2">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-surface to-surface-active border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-tertiary">Storage Used</p>
                <h3 className="text-3xl font-bold text-text-primary mt-1">1.2 TB</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-info/10 flex items-center justify-center">
                <HardDrive className="text-info" size={24} />
              </div>
            </div>
            <div className="mt-4 w-full bg-surface-active rounded-full h-1.5">
              <div className="bg-info h-1.5 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-surface to-surface-active border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-tertiary">Databases</p>
                <h3 className="text-3xl font-bold text-text-primary mt-1">4</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Database className="text-purple-500" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-text-tertiary">Running</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>CPU and Memory usage over the last 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121214', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                  <Area type="monotone" dataKey="ram" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRam)" />
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-surface-active/50 border border-border/50">
                  <AlertCircle className="text-warning mt-0.5 shrink-0" size={16} />
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">High Memory Usage</h4>
                    <p className="text-xs text-text-tertiary mt-1">Instance i-0x9f83a is using 95% of allocated memory.</p>
                    <span className="text-[10px] text-text-tertiary mt-2 block">2 hours ago</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
