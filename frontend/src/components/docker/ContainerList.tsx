import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Play, Square, RefreshCw, Trash2, FileText, Terminal, Search } from "lucide-react"
import { ContainerInfo, dockerApi } from "@/api/docker"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const ContainerList = ({ containers, onSelect }: { containers: ContainerInfo[], onSelect: (c: ContainerInfo) => void }) => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const actionMutation = useMutation({
    mutationFn: async ({ action, id }: { action: 'start' | 'stop' | 'restart' | 'delete', id: string }) => {
      switch (action) {
        case 'start': return dockerApi.startContainer(id)
        case 'stop': return dockerApi.stopContainer(id)
        case 'restart': return dockerApi.restartContainer(id)
        case 'delete': return dockerApi.deleteContainer(id)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['containers'] })
  })

  const filteredContainers = containers.filter(c => {
    if (filter === "running" && c.status !== "running") return false
    if (filter === "stopped" && c.status !== "exited") return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search containers..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-400 uppercase bg-black/20">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Name</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ports</th>
              <th className="px-4 py-3 rounded-tr-lg rounded-br-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredContainers.map(c => (
                <motion.tr 
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group cursor-pointer"
                  onClick={() => onSelect(c)}
                >
                  <td className="px-4 py-4 font-medium text-white flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${c.status === 'running' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    {c.name}
                  </td>
                  <td className="px-4 py-4 text-zinc-400 truncate max-w-[150px]" title={c.image}>{c.image}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full border ${c.status === 'running' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-zinc-400 max-w-[200px] truncate">
                    {Object.keys(c.ports || {}).join(', ') || '-'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      {c.status !== 'running' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/10" onClick={() => actionMutation.mutate({action: 'start', id: c.id})}><Play className="w-4 h-4" /></Button>
                      )}
                      {c.status === 'running' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:bg-rose-500/10" onClick={() => actionMutation.mutate({action: 'stop', id: c.id})}><Square className="w-4 h-4" /></Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => actionMutation.mutate({action: 'restart', id: c.id})}><RefreshCw className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-rose-500/10 hover:text-rose-400" onClick={() => actionMutation.mutate({action: 'delete', id: c.id})}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </Card>
  )
}
