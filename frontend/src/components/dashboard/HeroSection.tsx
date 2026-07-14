import { motion, AnimatePresence } from "framer-motion"
import { Cpu, MemoryStick, HardDrive, Thermometer, Clock } from "lucide-react"
import { StatCard } from "@/components/ui/StatCard"
import { type SystemStats } from "@/store/useStore"

interface HeroSectionProps {
  stats: SystemStats | null;
}

export const HeroSection = ({ stats }: HeroSectionProps) => {
  const formatUptime = (seconds: number) => {
    if (!seconds) return "0s"
    const d = Math.floor(seconds / (3600*24))
    const h = Math.floor(seconds % (3600*24) / 3600)
    const m = Math.floor(seconds % 3600 / 60)
    if (d > 0) return `${d}d ${h}h`
    return `${h}h ${m}m`
  }

  const getRamPercentage = () => {
    if (!stats?.ram_total) return 0
    return ((stats.ram_used / stats.ram_total) * 100).toFixed(1)
  }

  const formatBytes = (mb: number) => {
    if (!mb) return "0 GB"
    return (mb / 1024).toFixed(1) + " GB"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          Welcome back
          <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-zinc-400 text-lg flex items-center gap-2">
          Your Raspberry Pi cluster is running smoothly. 
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-sm">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <AnimatePresence mode="wait">
              <motion.span
                key={stats?.uptime}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="font-mono text-zinc-300"
              >
                {formatUptime(stats?.uptime || 0)}
              </motion.span>
            </AnimatePresence>
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="CPU Usage"
          value={`${stats?.cpu?.toFixed(1) || 0}%`}
          icon={Cpu}
          color="blue"
        />
        <StatCard
          title="Memory Usage"
          value={`${getRamPercentage()}%`}
          icon={MemoryStick}
          color="purple"
          description={`${formatBytes(stats?.ram_used || 0)} / ${formatBytes(stats?.ram_total || 0)}`}
        />
        <StatCard
          title="Disk Usage"
          value={`${((stats?.disk_used || 0) / (stats?.disk_total || 1) * 100).toFixed(1)}%`}
          icon={HardDrive}
          color="green"
          description={`${stats?.disk_used?.toFixed(1) || 0} / ${stats?.disk_total?.toFixed(1) || 0} GB`}
        />
        <StatCard
          title="Temperature"
          value={`${stats?.temperature?.toFixed(1) || 0}°C`}
          icon={Thermometer}
          color="orange"
        />
      </div>
    </div>
  )
}
