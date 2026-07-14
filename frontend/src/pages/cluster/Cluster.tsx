import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { k8sApi } from '../../api/kubernetes';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Server, Activity, HardDrive, Cpu, Box } from 'lucide-react';
import { motion } from 'framer-motion';

const initialNodes = [
  { id: 'master', position: { x: 250, y: 50 }, data: { label: 'Master Node\nv1.27.3' }, type: 'default', style: { background: '#22c55e', color: 'white', borderRadius: '8px', border: 'none', padding: '10px' } },
  { id: 'worker1', position: { x: 100, y: 150 }, data: { label: 'Worker 1' }, type: 'default' },
  { id: 'worker2', position: { x: 400, y: 150 }, data: { label: 'Worker 2' }, type: 'default' },
  { id: 'pod1', position: { x: 50, y: 250 }, data: { label: 'nginx-pod' }, type: 'output' },
  { id: 'pod2', position: { x: 150, y: 250 }, data: { label: 'redis-pod' }, type: 'output' },
  { id: 'pod3', position: { x: 400, y: 250 }, data: { label: 'api-pod' }, type: 'output' },
];

const initialEdges = [
  { id: 'e1', source: 'master', target: 'worker1', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e2', source: 'master', target: 'worker2', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e3', source: 'worker1', target: 'pod1' },
  { id: 'e4', source: 'worker1', target: 'pod2' },
  { id: 'e5', source: 'worker2', target: 'pod3' },
];

export const Cluster = () => {
  const { token } = useStore();
  const [resources, setResources] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    k8sApi.getClusterResources(token).then(setResources).catch(console.error);
    k8sApi.getClusterStatus(token).then(setStatus).catch(console.error);
  }, [token]);

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <h1 className="text-3xl font-bold tracking-tight text-white/90 mb-8">Cluster Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl"><Server className="w-6 h-6"/></div>
          <div>
            <div className="text-zinc-400 text-sm">Status</div>
            <div className="text-xl font-bold text-emerald-400">{status?.status || "Unknown"}</div>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/20 text-blue-400 rounded-xl"><Cpu className="w-6 h-6"/></div>
          <div>
            <div className="text-zinc-400 text-sm">CPU Usage</div>
            <div className="text-xl font-bold">{resources?.cpu || "0%"}</div>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
          <div className="p-4 bg-purple-500/20 text-purple-400 rounded-xl"><Activity className="w-6 h-6"/></div>
          <div>
            <div className="text-zinc-400 text-sm">RAM Usage</div>
            <div className="text-xl font-bold">{resources?.memory || "0%"}</div>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
          <div className="p-4 bg-pink-500/20 text-pink-400 rounded-xl"><HardDrive className="w-6 h-6"/></div>
          <div>
            <div className="text-zinc-400 text-sm">Storage</div>
            <div className="text-xl font-bold">{resources?.storage || "0%"}</div>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative min-h-[500px]">
        <ReactFlow nodes={initialNodes} edges={initialEdges} fitView className="bg-black/50">
          <Background color="#333" gap={16} />
          <Controls className="bg-zinc-800 border-zinc-700 fill-white" />
        </ReactFlow>
        <div className="absolute top-4 left-4 p-3 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-sm">
          <div className="font-bold mb-2">Visual Cluster Graph</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Master Node</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white"></div> Worker Node</div>
          <div className="flex items-center gap-2 border border-white px-1 rounded-sm"><Box className="w-3 h-3"/> Pod</div>
        </div>
      </div>
    </div>
  );
};
