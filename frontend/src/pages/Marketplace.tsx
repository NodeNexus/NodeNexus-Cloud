import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Download } from "lucide-react"

const apps = [
  { name: "Pi-hole", desc: "Network-wide Ad Blocking", category: "Networking" },
  { name: "Home Assistant", desc: "Open source home automation", category: "Home Automation" },
  { name: "Nextcloud", desc: "A safe home for all your data", category: "Productivity" },
  { name: "Plex", desc: "Media server for your content", category: "Media" },
]

export const Marketplace = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Marketplace</h1>
        <p className="text-zinc-400 mt-1">One-click install popular self-hosted apps</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {apps.map((app) => (
          <Card key={app.name} className="flex flex-col group hover:border-blue-500/50 transition-colors">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 border border-white/10 group-hover:border-blue-500/30 transition-colors">
                <span className="font-bold text-lg text-white">{app.name[0]}</span>
              </div>
              <h3 className="font-semibold text-lg text-white">{app.name}</h3>
              <p className="text-sm text-zinc-400 mt-1">{app.desc}</p>
              <span className="inline-block px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-zinc-300 mt-4">
                {app.category}
              </span>
            </div>
            <Button className="w-full mt-6" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
