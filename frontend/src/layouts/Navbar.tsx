import { Search, Bell, User } from "lucide-react"
import { useStore } from "@/store/useStore"
import { useWebSocket } from "@/hooks/useWebSocket"

export const Navbar = () => {
  const { systemStats } = useStore()
  const { isConnected } = useWebSocket()

  return (
    <header className="h-16 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search commands, resources, settings..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-3 py-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="text-xs font-medium text-zinc-300">
              {isConnected ? 'System Online' : 'Disconnected'}
            </span>
          </div>
          <div className="w-px h-3 bg-white/10 mx-1"></div>
          <span className="text-xs text-zinc-500 font-mono">
            {systemStats?.hostname || 'raspberrypi'}
          </span>
        </div>

        <button className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-zinc-950"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-zinc-200">Admin User</div>
            <div className="text-xs text-zinc-500">admin@vnav.cloud</div>
          </div>
          <button className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-zinc-950 shadow-lg cursor-pointer hover:scale-105 transition-transform">
            <User className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </header>
  )
}
