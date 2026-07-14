import { Card } from "@/components/ui/Card"
import { ShieldCheck, Server, Database, MessageSquare, Globe } from "lucide-react"

export const HealthWidget = () => {
  const services = [
    { name: "Docker Daemon", icon: Server, status: "healthy" },
    { name: "VNAV API", icon: ShieldCheck, status: "healthy" },
    { name: "PostgreSQL", icon: Database, status: "healthy" },
    { name: "MQTT Broker", icon: MessageSquare, status: "healthy" },
    { name: "Internet Access", icon: Globe, status: "healthy" },
  ]

  return (
    <Card className="flex flex-col h-full">
      <h3 className="font-semibold text-lg text-white mb-6">System Health</h3>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800">
                <service.icon className="w-4 h-4 text-zinc-300" />
              </div>
              <span className="font-medium text-sm text-zinc-200">{service.name}</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400 capitalize">{service.status}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
