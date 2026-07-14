import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { k8sApi } from '../../api/kubernetes';
import { Server, Cpu, HardDrive, Trash2, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const Nodes = () => {
  const { token } = useStore();
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    k8sApi.getNodes(token).then(data => {
      setNodes(data);
      setLoading(false);
    }).catch(console.error);
  }, [token]);

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90">Nodes</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
          + Add Node
        </button>
      </div>
      
      {loading ? (
        <div className="text-zinc-500 text-center py-20">Scanning cluster...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {nodes.length === 0 ? (
            <div className="col-span-3 text-center text-zinc-500 py-10">No nodes found or cluster offline.</div>
          ) : nodes.map(node => (
            <motion.div key={node.name} whileHover={{ scale: 1.02 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              {/* Status glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 rounded-full ${node.status === 'Ready' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl"><Server className="w-6 h-6 text-zinc-300"/></div>
                  <div>
                    <h3 className="font-bold text-lg">{node.name}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`w-2 h-2 rounded-full ${node.status === 'Ready' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      <span className={node.status === 'Ready' ? 'text-emerald-400' : 'text-rose-400'}>{node.status}</span>
                      <span className="text-zinc-500">| IP: {node.ip || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10 text-sm">
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-1">
                  <span className="text-zinc-500 flex items-center gap-1"><Cpu className="w-4 h-4"/> Arch</span>
                  <span className="font-medium">{node.architecture || 'amd64'}</span>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-1">
                  <span className="text-zinc-500 flex items-center gap-1"><HardDrive className="w-4 h-4"/> OS</span>
                  <span className="font-medium truncate" title={node.os}>{node.os || 'Linux'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10 border-t border-white/5 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors flex justify-center items-center gap-2">
                  <RotateCw className="w-4 h-4" /> Drain
                </button>
                <button className="flex-1 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm transition-colors flex justify-center items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
