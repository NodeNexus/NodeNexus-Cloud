import { useEffect, useState } from "react"
import { useStore } from "@/store/useStore"
import { useWebSocket } from "@/hooks/useWebSocket"

// Components
import { HeroSection } from "@/components/dashboard/HeroSection"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { HealthWidget } from "@/components/dashboard/HealthWidget"
import { ContainerTable } from "@/components/dashboard/ContainerTable"
import { ChartsGrid } from "@/components/dashboard/ChartsGrid"

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

  if (!systemStats && !isConnected) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-zinc-400">Connecting to telemetry stream...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <HeroSection stats={systemStats} />
      
      <ChartsGrid history={history} stats={systemStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <HealthWidget />
      </div>

      <ContainerTable stats={systemStats} />
    </div>
  )
}
