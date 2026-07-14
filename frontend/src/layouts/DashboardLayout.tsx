import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"
import { Outlet } from "react-router-dom"
import { useStore } from "@/store/useStore"
import { motion } from "framer-motion"

export const DashboardLayout = () => {
  const { isSidebarOpen } = useStore()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-blue-500/30">
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      <Sidebar />
      <motion.div
        animate={{
          marginLeft: isSidebarOpen ? 240 : 80
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex min-h-screen flex-col"
      >
        <Navbar />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </motion.div>
    </div>
  )
}
