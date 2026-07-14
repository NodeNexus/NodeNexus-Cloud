import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play } from "lucide-react"
import { dockerApi } from "@/api/docker"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/Button"

export const CreateContainerDialog = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) => {
  const queryClient = useQueryClient()
  
  const [image, setImage] = useState("")
  const [name, setName] = useState("")
  const [portsStr, setPortsStr] = useState("")
  const [envStr, setEnvStr] = useState("")

  const createMutation = useMutation({
    mutationFn: async () => {
      // parse ports
      const ports: Record<string, string> = {}
      if (portsStr) {
        portsStr.split(',').forEach(p => {
          const [container, host] = p.split(':')
          if (container && host) {
            ports[container.trim()] = host.trim()
          }
        })
      }
      
      // parse env
      const env = envStr ? envStr.split(',').map(e => e.trim()) : undefined

      return dockerApi.createContainer({
        image,
        name: name || undefined,
        ports: Object.keys(ports).length > 0 ? ports : undefined,
        env
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] })
      onClose()
      setImage("")
      setName("")
      setPortsStr("")
      setEnvStr("")
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h2 className="text-xl font-semibold text-white">Create Container</h2>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Image Name (required)</label>
                <input 
                  type="text" 
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="e.g. nginx:latest" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Container Name (optional)</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. my-nginx" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Ports (optional)</label>
                <input 
                  type="text" 
                  value={portsStr}
                  onChange={e => setPortsStr(e.target.value)}
                  placeholder="container_port:host_port, e.g. 80/tcp:8080" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
                />
                <p className="text-xs text-zinc-500 mt-1">Format: container_port/protocol:host_port, comma separated</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Environment Variables (optional)</label>
                <input 
                  type="text" 
                  value={envStr}
                  onChange={e => setEnvStr(e.target.value)}
                  placeholder="KEY=value, ANOTHER_KEY=123" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button 
                onClick={() => createMutation.mutate()} 
                disabled={!image || createMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0"
              >
                {createMutation.isPending ? 'Creating...' : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Deploy Container
                  </>
                )}
              </Button>
            </div>
            {createMutation.isError && (
              <div className="px-6 py-3 bg-rose-500/10 text-rose-400 text-sm border-t border-rose-500/20">
                Error creating container. Check image name and port formats.
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
