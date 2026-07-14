import { useStore } from "@/store/useStore"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Box, 
  ShoppingCart, 
  Activity, 
  Settings,
  LogOut
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Box, label: "Containers", href: "/containers" },
  { icon: ShoppingCart, label: "Marketplace", href: "/marketplace" },
  { icon: Activity, label: "Monitoring", href: "/monitoring" },
]

export const Sidebar = () => {
  const { isSidebarOpen } = useStore()

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isSidebarOpen ? 240 : 80,
        opacity: 1
      }}
      className="fixed left-0 top-0 z-40 h-screen border-r border-white/5 bg-black/50 backdrop-blur-2xl flex flex-col"
    >
      <div className="flex h-16 items-center justify-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="font-bold text-white text-lg">V</span>
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-semibold tracking-wide text-zinc-100 whitespace-nowrap overflow-hidden"
              >
                VNAV Cloud
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors relative overflow-hidden group",
              isActive ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-50"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="h-5 w-5 relative z-10" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap relative z-10 overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
            isActive ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className="h-5 w-5" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
        <button
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
