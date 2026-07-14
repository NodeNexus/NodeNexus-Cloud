import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Terminal } from "lucide-react"
import { ContainerInfo, dockerApi } from "@/api/docker"
import { useQuery } from "@tanstack/react-query"

export const LogsViewer = ({ 
  container, 
  onClose 
}: { 
  container: ContainerInfo | null, 
  onClose: () => void 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['container-logs', container?.id],
    queryFn: () => dockerApi.getLogs(container!.id),
    enabled: !!container,
    refetchInterval: 3000 // poll every 3 seconds for live logs
  })

  // auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [data])

  return (
    <AnimatePresence>
      {container && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed inset-4 z-50 flex flex-col bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white">Live Logs: {container.name}</h3>
            </div>
            <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-auto bg-black p-4 font-mono text-sm text-zinc-300"
          >
            {isLoading ? (
              <div className="text-zinc-500 animate-pulse">Fetching logs...</div>
            ) : (
              <pre className="whitespace-pre-wrap break-all">{data?.logs || "No logs available."}</pre>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
