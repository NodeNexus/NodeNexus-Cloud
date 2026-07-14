import { Card } from "@/components/ui/Card"
import { RefreshCw, Download, Box, ExternalLink, ShieldAlert, Zap } from "lucide-react"

export const QuickActions = () => {
  const actions = [
    { name: "Restart Docker", icon: RefreshCw, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
    { name: "Update System", icon: Download, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { name: "New Container", icon: Box, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  ]

  const externalLinks = [
    { name: "Portainer", url: "/portainer", icon: ShieldAlert },
    { name: "Grafana", url: "/grafana", icon: Zap },
    { name: "MinIO", url: "/minio", icon: HardDrive },
    { name: "NodeRED", url: "/nodered", icon: Network },
  ]

  return (
    <Card className="flex flex-col h-full">
      <h3 className="font-semibold text-lg text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {actions.map((action) => (
          <button 
            key={action.name}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border ${action.border} ${action.bg} hover:brightness-125 transition-all group cursor-pointer`}
          >
            <action.icon className={`w-6 h-6 ${action.color} group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-medium text-zinc-300">{action.name}</span>
          </button>
        ))}
      </div>
      
      <h3 className="font-semibold text-sm text-zinc-400 mb-3 mt-auto uppercase tracking-wider">External Services</h3>
      <div className="grid grid-cols-2 gap-2">
        {externalLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
          >
            <span className="text-sm font-medium text-zinc-300">{link.name}</span>
            <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </a>
        ))}
      </div>
    </Card>
  )
}
import { HardDrive, Network } from "lucide-react"
