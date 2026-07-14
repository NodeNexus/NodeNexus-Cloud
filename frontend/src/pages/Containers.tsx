import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { dockerApi, ContainerInfo } from "@/api/docker"
import { Button } from "@/components/ui/Button"
import { Box, HardDrive, Trash2 } from "lucide-react"

// Docker Components
import { ContainerList } from "@/components/docker/ContainerList"
import { ContainerDetailsDrawer } from "@/components/docker/ContainerDetailsDrawer"
import { CreateContainerDialog } from "@/components/docker/CreateContainerDialog"
import { ImageManagerDialog } from "@/components/docker/ImageManagerDialog"
import { LogsViewer } from "@/components/docker/LogsViewer"

export const Containers = () => {
  const queryClient = useQueryClient()
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false)
  
  const [selectedContainer, setSelectedContainer] = useState<ContainerInfo | null>(null)
  const [logsContainer, setLogsContainer] = useState<ContainerInfo | null>(null)

  const { data: containers, isLoading, isError } = useQuery({
    queryKey: ['containers'],
    queryFn: dockerApi.getContainers,
    refetchInterval: 5000 // live updates every 5s
  })

  const pruneMutation = useMutation({
    mutationFn: dockerApi.pruneSystem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] })
      queryClient.invalidateQueries({ queryKey: ['images'] })
      alert("System pruned successfully!")
    }
  })

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Docker Management</h1>
          <p className="text-zinc-400 mt-1">Manage containers, images, and resources</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsImageManagerOpen(true)}>
            <HardDrive className="w-4 h-4 mr-2" />
            Images
          </Button>
          <Button variant="outline" className="text-rose-400 hover:bg-rose-500/10 border-rose-500/20" onClick={() => pruneMutation.mutate()} disabled={pruneMutation.isPending}>
            <Trash2 className="w-4 h-4 mr-2" />
            Prune
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={() => setIsCreateOpen(true)}>
            <Box className="w-4 h-4 mr-2" />
            Deploy Container
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
          Failed to connect to Docker daemon. Is Docker running?
        </div>
      ) : (
        <ContainerList 
          containers={containers || []} 
          onSelect={(c) => setSelectedContainer(c)}
        />
      )}

      {/* Overlays */}
      <ContainerDetailsDrawer 
        container={selectedContainer}
        onClose={() => setSelectedContainer(null)}
        onOpenLogs={(c) => {
          setSelectedContainer(null)
          setLogsContainer(c)
        }}
      />
      
      <LogsViewer
        container={logsContainer}
        onClose={() => setLogsContainer(null)}
      />

      <CreateContainerDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <ImageManagerDialog
        isOpen={isImageManagerOpen}
        onClose={() => setIsImageManagerOpen(false)}
      />
    </div>
  )
}
