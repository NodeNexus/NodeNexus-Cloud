import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Activity, Server, Network, Clock, Box, Hash, Terminal } from "lucide-react"
import { ContainerInfo, ContainerDetails, dockerApi } from "@/api/docker"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/Button"

export const ContainerDetailsDrawer = ({ 
  container, 
  onClose,
  onOpenLogs
}: { 
  container: ContainerInfo | null, 
  onClose: () => void,
  onOpenLogs: (c: ContainerInfo) => void
}) => {
  const { data: details, isLoading } = useQuery({
    queryKey: ['container-details', container?.id],
    queryFn: () => dockerApi.getContainerDetails(container!.id),
    enabled: !!container,
    refetchInterval: 5000 // live update every 5 seconds
  })

  // Basic calculation for docker stats (very simplified for demo purposes)
  const calculateCpuPercent = (stats: any) => {
    if (!stats || !stats.cpu_stats || !stats.precpu_stats) return 0
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage
    if (systemDelta > 0 && cpuDelta > 0) {
      return ((cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100).toFixed(2)
    }
    return 0
  }

  const calculateRam = (stats: any) => {
    if (!stats || !stats.memory_stats) return { used: 0, limit: 0, percent: 0 }
    const used = stats.memory_stats.usage || 0
    const limit = stats.memory_stats.limit || 0
    return {
      used: (used / 1024 / 1024).toFixed(2),
      limit: (limit / 1024 / 1024).toFixed(2),
      percent: limit > 0 ? ((used / limit) * 100).toFixed(2) : 0
    }
  }

  const calculateNetwork = (stats: any) => {
    if (!stats || !stats.networks) return { rx: 0, tx: 0 }
    let rx = 0, tx = 0
    Object.values(stats.networks).forEach((net: any) => {
      rx += net.rx_bytes
      tx += net.tx_bytes
    })
    return {
      rx: (rx / 1024 / 1024).toFixed(2),
      tx: (tx / 1024 / 1024).toFixed(2)
    }
  }

  const cpu = calculateCpuPercent(details?.stats)
  const ram = calculateRam(details?.stats)
  const net = calculateNetwork(details?.stats)

  return (
    <AnimatePresence>
      {container && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[500px] bg-zinc-950 border-l border-white/10 z-50 overflow-y-auto"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-zinc-950/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${container.status === 'running' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                <h2 className="text-xl font-bold text-white">{container.name}</h2>
              </div>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" onClick={() => onOpenLogs(container)}>
                  <Terminal className="w-4 h-4 mr-2" />
                  Live Logs
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => alert("Terminal feature requires WebSocket shell implementation.")}>
                  <Terminal className="w-4 h-4 mr-2" />
                  Open Terminal
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm">
                    <Activity className="w-4 h-4 text-blue-400" /> CPU Usage
                  </div>
                  <div className="text-2xl font-semibold text-white">{cpu}%</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm">
                    <Server className="w-4 h-4 text-purple-400" /> RAM Usage
                  </div>
                  <div className="text-2xl font-semibold text-white">{ram.used} MB</div>
                  <div className="text-xs text-zinc-500 mt-1">{ram.percent}% of {ram.limit} MB</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm">
                    <Network className="w-4 h-4 text-emerald-400" /> Network (RX/TX)
                  </div>
                  <div className="text-lg font-semibold text-white">{net.rx} / {net.tx} MB</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm">
                    <Clock className="w-4 h-4 text-amber-400" /> Created
                  </div>
                  <div className="text-sm font-semibold text-white truncate" title={container.created}>
                    {new Date(container.created).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Configuration</h3>
                
                <div className="flex items-start gap-4">
                  <Box className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div className="overflow-hidden">
                    <div className="text-sm text-zinc-500">Image</div>
                    <div className="text-white truncate font-mono text-sm">{container.image}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Hash className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div className="overflow-hidden">
                    <div className="text-sm text-zinc-500">Container ID</div>
                    <div className="text-white truncate font-mono text-sm">{container.id}</div>
                  </div>
                </div>

                {details?.cmd && details.cmd.length > 0 && (
                  <div className="flex items-start gap-4">
                    <Terminal className="w-5 h-5 text-zinc-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-zinc-500">Command</div>
                      <div className="text-white font-mono text-xs bg-black/30 p-2 rounded-lg mt-1 break-all">
                        {details.cmd.join(' ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
