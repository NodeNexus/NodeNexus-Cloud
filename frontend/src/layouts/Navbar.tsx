import { useStore } from "@/store/useStore"
import { Menu, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/Button"

export const Navbar = () => {
  const { toggleSidebar, systemStats } = useStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-black/20 backdrop-blur-xl px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex items-center gap-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="search"
            placeholder="Search commands..."
            className="w-full rounded-lg bg-white/5 border border-white/10 pl-9 pr-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 md:w-[200px] lg:w-[300px]"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        </Button>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-2 pr-4 py-1">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
          <span className="text-xs font-medium text-zinc-300">
            {systemStats?.hostname || "vnav-pi"}
          </span>
        </div>
      </div>
    </header>
  )
}
