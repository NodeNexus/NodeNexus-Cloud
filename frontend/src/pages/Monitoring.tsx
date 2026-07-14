import { Card } from "@/components/ui/Card"
import { Activity } from "lucide-react"

export const Monitoring = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Monitoring</h1>
        <p className="text-zinc-400 mt-1">Detailed system telemetry</p>
      </div>
      
      <Card className="flex flex-col items-center justify-center py-20 text-center">
        <Activity className="w-12 h-12 text-zinc-600 mb-4" />
        <h3 className="text-xl font-semibold text-zinc-300">Advanced Telemetry Coming Soon</h3>
        <p className="text-zinc-500 mt-2 max-w-md">
          We're building comprehensive networking and process monitoring dashboards.
        </p>
      </Card>
    </div>
  )
}
