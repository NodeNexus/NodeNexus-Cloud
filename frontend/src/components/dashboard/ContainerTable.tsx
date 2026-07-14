import { Card } from "@/components/ui/Card"
import { Activity, Play, Square, RotateCw } from "lucide-react"
import { type SystemStats } from "@/store/useStore"

interface ContainerTableProps {
  stats: SystemStats | null;
}

export const ContainerTable = ({ stats }: ContainerTableProps) => {
  // Use real data if available, fallback to empty array
  const containers = stats?.containers_status || []

  // Mock resource usage since backend doesn't provide per-container stats yet
  const mockResourceUsage = (name: string) => {
    // Generate deterministic mock usage based on string length
    const cpu = (name.length * 1.5 % 15).toFixed(1)
    const ram = (name.length * 25 % 200).toFixed(0)
    return { cpu: `${cpu}%`, ram: `${ram} MB` }
  }

  return (
    <Card className="col-span-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg text-white flex items-center gap-2">
          Recent Activity
          <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-white/10 text-zinc-400">
            {stats?.docker_containers || 0} Total
          </span>
        </h3>
        <Activity className="w-5 h-5 text-zinc-400" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-400 uppercase bg-white/5 rounded-t-lg">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg font-medium">Container Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">CPU Usage</th>
              <th className="px-4 py-3 font-medium">RAM Usage</th>
              <th className="px-4 py-3 rounded-tr-lg font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {containers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  No containers running
                </td>
              </tr>
            ) : (
              containers.map((container, i) => {
                const { cpu, ram } = mockResourceUsage(container.name)
                const isRunning = container.status === 'running'
                
                return (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-200">
                      {container.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span className="capitalize text-zinc-300">{container.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{cpu}</td>
                    <td className="px-4 py-3 text-zinc-400">{ram}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Start/Stop">
                          {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Restart">
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
