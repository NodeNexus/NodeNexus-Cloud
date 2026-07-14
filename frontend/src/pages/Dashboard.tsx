import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import { useWebSocket } from "@/hooks/useWebSocket"
import { StatCard } from "@/components/ui/StatCard"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Thermometer, 
  Activity, 
  Box, 
  ArrowUpRight,
  Wifi,
  Clock
} from "lucide-react"
import { 
  Area, 
  AreaChart,
  Line,
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  PieChart,
  Pie,
  Cell
} from "recharts"

export const Dashboard = () => {
  const { systemStats } = useStore()
  const { isConnected } = useWebSocket()
  
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (systemStats) {
      setHistory(prev => {
        const newHistory = [...prev, {
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: systemStats.cpu,
          ram: (systemStats.ram_used / systemStats.ram_total) * 100,
          rx: systemStats.net_rx,
          tx: systemStats.net_tx
        }]
        if (newHistory.length > 20) {
          return newHistory.slice(1)
        }
        return newHistory
      })
    }
  }, [systemStats])

  const formatBytes = (mb: number) => {
    if (!mb) return "0 GB";
    return (mb / 1024).toFixed(1) + " GB";
  }

  const getRamPercentage = () => {
    if (!systemStats?.ram_total) return 0;
    return ((systemStats.ram_used / systemStats.ram_total) * 100).toFixed(1);
  }

  const getDiskPercentage = () => {
    if (!systemStats?.disk_total) return 0;
    return ((systemStats.disk_used / systemStats.disk_total) * 100).toFixed(1);
  }

  const formatUptime = (seconds: number) => {
    if (!seconds) return "0s";
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    if (d > 0) return `${d}d ${h}h`;
    return `${h}h ${m}m`;
  }

  if (!systemStats && !isConnected) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="text-zinc-400">Connecting to telemetry stream...</p>
      </div>
    )
  }

  const diskData = [
    { name: 'Used', value: systemStats?.disk_used || 0 },
    { name: 'Free', value: (systemStats?.disk_total || 0) - (systemStats?.disk_used || 0) }
  ]
  const COLORS = ['#3b82f6', '#27272a']

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            {isConnected ? (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            ) : (
              <span className="h-2 w-2 rounded-full bg-rose-500" />
            )}
          </div>
          <p className="text-zinc-400 mt-1">Live telemetry for {systemStats?.hostname || 'Raspberry Pi'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button>
            <Box className="w-4 h-4 mr-2" />
            New Container
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="CPU Usage"
          value={`${systemStats?.cpu?.toFixed(1) || 0}%`}
          icon={Cpu}
          color="blue"
        />
        <StatCard
          title="Memory Usage"
          value={`${getRamPercentage()}%`}
          icon={MemoryStick}
          color="purple"
          description={`${formatBytes(systemStats?.ram_used || 0)} / ${formatBytes(systemStats?.ram_total || 0)}`}
        />
        <StatCard
          title="Temperature"
          value={`${systemStats?.temperature?.toFixed(1) || 0}°C`}
          icon={Thermometer}
          color="orange"
        />
        <StatCard
          title="Uptime"
          value={formatUptime(systemStats?.uptime || 0)}
          icon={Clock}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-white">System Performance</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-zinc-400">CPU</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-zinc-400">RAM</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Area isAnimationActive={false} type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                <Area isAnimationActive={false} type="monotone" dataKey="ram" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorRam)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-white">Docker Status</h3>
            <Activity className="w-5 h-5 text-zinc-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
              <div className="text-2xl font-bold text-white">{systemStats?.docker_containers || 0}</div>
              <div className="text-xs text-zinc-400 mt-1">Containers</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
              <div className="text-2xl font-bold text-white">{systemStats?.docker_images || 0}</div>
              <div className="text-xs text-zinc-400 mt-1">Images</div>
            </div>
          </div>

          <div className="space-y-3">
            {systemStats?.containers_status?.length === 0 ? (
              <div className="text-sm text-zinc-500 text-center py-4">No containers running</div>
            ) : (
              systemStats?.containers_status.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 truncate">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.status === 'running' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span className="font-medium text-sm truncate">{c.name}</span>
                  </div>
                  <span className="text-xs text-zinc-400 capitalize flex-shrink-0">{c.status}</span>
                </div>
              ))
            )}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300">
            Manage Containers
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-white">Network I/O</h3>
            <Wifi className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm">
              <span className="text-emerald-400 font-medium">↓ {systemStats?.net_rx?.toFixed(2) || 0}</span> MB/s
            </div>
            <div className="text-sm">
              <span className="text-blue-400 font-medium">↑ {systemStats?.net_tx?.toFixed(2) || 0}</span> MB/s
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" hide />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                  labelStyle={{ display: 'none' }}
                />
                <Line isAnimationActive={false} type="monotone" dataKey="rx" stroke="#34d399" strokeWidth={2} dot={false} />
                <Line isAnimationActive={false} type="monotone" dataKey="tx" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-white">Storage Overview</h3>
            <HardDrive className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex items-center justify-between h-[200px]">
            <div className="w-1/2 h-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diskData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {diskData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#e4e4e7' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4 pr-6">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Used Space
                  </span>
                  <span className="font-medium">{systemStats?.disk_used?.toFixed(1) || 0} GB</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${getDiskPercentage()}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    Free Space
                  </span>
                  <span className="font-medium">
                    {((systemStats?.disk_total || 0) - (systemStats?.disk_used || 0)).toFixed(1)} GB
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-zinc-800 h-2 rounded-full" style={{ width: `${100 - parseFloat(String(getDiskPercentage()))}%` }} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
