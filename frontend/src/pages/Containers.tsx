import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Box, Square, RefreshCw, Trash2 } from "lucide-react"

export const Containers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Containers</h1>
        <p className="text-zinc-400 mt-1">Manage your Docker containers</p>
      </div>
      
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-white">Running Containers</h3>
          <Button size="sm">
            <Box className="w-4 h-4 mr-2" />
            Deploy New
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-black/20">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Name</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ports</th>
                <th className="px-4 py-3 rounded-tr-lg rounded-br-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 font-medium text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  pihole
                </td>
                <td className="px-4 py-4 text-zinc-400">pihole/pihole:latest</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Running
                  </span>
                </td>
                <td className="px-4 py-4 text-zinc-400">53:53/udp, 80:80</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:bg-rose-500/10"><Square className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><RefreshCw className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-rose-500/10 hover:text-rose-400"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
