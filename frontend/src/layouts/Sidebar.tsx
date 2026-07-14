import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Box, 
  Store, 
  HardDrive, 
  Activity, 
  Network, 
  Container, 
  Settings, 
  Bot, 
  LogOut,
  ChevronLeft,
  Terminal,
  Folder,
  User,
  Shield
} from "lucide-react"
import { useStore } from "@/store/useStore"

import { useNavigate } from "react-router-dom"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Terminal', href: '/terminal', icon: Terminal },
  { name: 'Files', href: '/files', icon: Folder },
  { name: 'Containers', href: '/containers', icon: Box },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Monitoring', href: '/monitoring', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const adminNavigation = [
  { name: 'Users', href: '/users', icon: User },
  { name: 'Roles', href: '/roles', icon: Shield },
]

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, logout, user } = useStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.div 
      initial={false}
      animate={{ width: isSidebarOpen ? 240 : 80 }}
      className="h-screen bg-zinc-950/50 backdrop-blur-xl border-r border-white/5 flex flex-col flex-shrink-0 sticky top-0 relative z-50"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
        <AnimatePresence mode="popLayout">
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="font-bold text-xl tracking-tighter text-white flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Box className="w-5 h-5 text-white" />
              </div>
              VNAV Cloud
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 transition-colors"
        >
          <motion.div animate={{ rotate: isSidebarOpen ? 0 : 180 }}>
            <ChevronLeft className="w-5 h-5" />
          </motion.div>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-white/10 border border-white/10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className="w-5 h-5 flex-shrink-0 relative z-10" />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate font-medium relative z-10"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}

        {user?.role_id === 1 && (
          <>
            <div className="pt-4 pb-2 px-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              {isSidebarOpen && "Admin"}
            </div>
            {adminNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-white/10 border border-white/10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className="w-5 h-5 flex-shrink-0 relative z-10" />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="truncate font-medium relative z-10"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group w-full text-zinc-400 hover:bg-white/5 hover:text-zinc-200">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="truncate font-medium"
              >
                Profile
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group w-full text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="truncate font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}
