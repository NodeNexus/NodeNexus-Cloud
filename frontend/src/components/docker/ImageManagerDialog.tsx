import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, HardDrive } from "lucide-react"
import { dockerApi } from "@/api/docker"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/Button"

export const ImageManagerDialog = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) => {
  const queryClient = useQueryClient()
  const [pullImageName, setPullImageName] = useState("")

  const { data: images, isLoading } = useQuery({
    queryKey: ['images'],
    queryFn: dockerApi.getImages,
    enabled: isOpen
  })

  const pullMutation = useMutation({
    mutationFn: (image: string) => dockerApi.pullImage(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] })
      setPullImageName("")
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
            className="relative w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Image Manager</h2>
              </div>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 shrink-0 border-b border-white/5">
              <h3 className="text-sm font-medium text-white mb-2">Pull New Image</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={pullImageName}
                  onChange={e => setPullImageName(e.target.value)}
                  placeholder="e.g. ubuntu:latest" 
                  className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
                  onKeyDown={e => e.key === 'Enter' && pullImageName && pullMutation.mutate(pullImageName)}
                />
                <Button 
                  onClick={() => pullMutation.mutate(pullImageName)} 
                  disabled={!pullImageName || pullMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white border-0"
                >
                  {pullMutation.isPending ? 'Pulling...' : <><Download className="w-4 h-4 mr-2" /> Pull</>}
                </Button>
              </div>
              {pullMutation.isError && (
                <p className="text-xs text-rose-400 mt-2">Error pulling image. It may not exist or requires authentication.</p>
              )}
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="text-sm font-medium text-white mb-4">Local Images</h3>
              {isLoading ? (
                <div className="text-zinc-500 text-sm animate-pulse">Loading images...</div>
              ) : (
                <div className="space-y-2">
                  {images?.map(img => (
                    <div key={img.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="overflow-hidden">
                        <div className="text-white font-medium truncate">
                          {img.tags && img.tags.length > 0 ? img.tags.join(', ') : '<none>'}
                        </div>
                        <div className="text-xs text-zinc-500 flex gap-3 mt-1">
                          <span>{(img.size / 1024 / 1024).toFixed(2)} MB</span>
                          <span className="truncate font-mono">{img.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Add delete button if needed, omit for now as we don't have a direct delete image route, or wait, prune covers it, but let's keep UI simple */}
                      </div>
                    </div>
                  ))}
                  {(!images || images.length === 0) && (
                    <div className="text-zinc-500 text-sm">No images found locally.</div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
