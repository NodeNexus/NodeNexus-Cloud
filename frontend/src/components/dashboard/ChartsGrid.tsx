import { Card } from "@/components/ui/Card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { type SystemStats } from "@/store/useStore"
import { Wifi, HardDrive } from "lucide-react"

interface ChartsGridProps {
  history: any[];
  stats: SystemStats | null;
}

export const ChartsGrid = ({ history, stats }: ChartsGridProps) => {
  const diskData = [
    { name: 'Used', value: stats?.disk_used || 0 },
    { name: 'Free', value: (stats?.disk_total || 0) - (stats?.disk_used || 0) }
  ]
  const COLORS = ['#3b82f6', '#27272a']

  const getDiskPercentage = () => {
    if (!stats?.disk_total) return 0;
    return ((stats.disk_used / stats.disk_total) * 100).toFixed(1);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 flex flex-col h-[400px]">
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
        <div className="flex-1 w-full min-h-0">
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

      <div className="flex flex-col gap-6 h-[400px]">
        <Card className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-white">Network I/O</h3>
            <Wifi className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs">
              <span className="text-emerald-400 font-medium">↓ {stats?.net_rx?.toFixed(2) || 0}</span> MB/s
            </div>
            <div className="text-xs">
              <span className="text-blue-400 font-medium">↑ {stats?.net_tx?.toFixed(2) || 0}</span> MB/s
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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

        <Card className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-white">Storage</h3>
            <HardDrive className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex items-center justify-between flex-1 min-h-0">
            <div className="w-1/2 h-full flex items-center justify-center -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diskData}
                    innerRadius="60%"
                    outerRadius="80%"
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
            <div className="w-1/2 space-y-3 pr-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400">Used</span>
                  <span className="font-medium">{stats?.disk_used?.toFixed(1) || 0} GB</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${getDiskPercentage()}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400">Free</span>
                  <span className="font-medium">
                    {((stats?.disk_total || 0) - (stats?.disk_used || 0)).toFixed(1)} GB
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-zinc-800 h-1.5 rounded-full" style={{ width: `${100 - parseFloat(String(getDiskPercentage()))}%` }} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
