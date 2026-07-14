import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your system configuration</p>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">System Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Hostname</label>
                <input 
                  type="text" 
                  defaultValue="vnav-pi-01"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">IP Address</label>
                <input 
                  type="text" 
                  disabled
                  defaultValue="192.168.1.100"
                  className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>
            <Button>Save Changes</Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-rose-400 mb-4">Danger Zone</h3>
          <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-lg flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Reboot System</h4>
              <p className="text-sm text-zinc-400">Safely restart the Raspberry Pi</p>
            </div>
            <Button variant="destructive">Reboot</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
