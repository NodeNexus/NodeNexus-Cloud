import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { monitoringApi } from '../../api/monitoring';
import { MetricChart } from '../../components/monitoring/MetricChart';
import { Activity, Cpu, HardDrive, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { token } = useStore();
  const [metricsData, setMetricsData] = useState<any[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await monitoringApi.getMetrics(token);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        setCurrentMetrics(data);
        setMetricsData(prev => {
          const newPoint = {
            time,
            cpu: data.cpu,
            memory: data.memory,
            storage: data.storage,
            network: (data.network_rx + data.network_tx) / (1024 * 1024) // MB
          };
          const newData = [...prev, newPoint];
          return newData.slice(Math.max(newData.length - 20, 0)); // Keep last 20 points
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <h1 className="text-3xl font-bold tracking-tight text-white/90 mb-8 flex items-center gap-3">
        <Activity className="w-8 h-8 text-blue-500" /> Health Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/20 text-blue-400 rounded-xl"><Cpu className="w-6 h-6"/></div>
          <div>
            <div className="text-zinc-400 text-sm">CPU Usage</div>
            <div className="text-xl font-bold">{currentMetrics?.cpu.toFixed(1) || 0}%</div>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
          <div className="p-4 bg-purple-500/20 text-purple-400 rounded-xl"><Activity className="w-6 h-6"/></div>
          <div>
            <div className="text-zinc-400 text-sm">Memory</div>
            <div className="text-xl font-bold">{currentMetrics?.memory.toFixed(1) || 0}%</div>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
          <div className="p-4 bg-pink-500/20 text-pink-400 rounded-xl"><HardDrive className="w-6 h-6"/></div>
          <div>
            <div className="text-zinc-400 text-sm">Storage (Root)</div>
            <div className="text-xl font-bold">{currentMetrics?.storage.toFixed(1) || 0}%</div>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl"><Network className="w-6 h-6"/></div>
          <div>
            <div className="text-zinc-400 text-sm">Network I/O</div>
            <div className="text-xl font-bold">{((currentMetrics?.network_rx || 0) / (1024*1024*1024)).toFixed(2)} GB</div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MetricChart data={metricsData} dataKey="cpu" color="#3b82f6" title="CPU History" unit="%" />
        <MetricChart data={metricsData} dataKey="memory" color="#a855f7" title="Memory History" unit="%" />
        <MetricChart data={metricsData} dataKey="storage" color="#ec4899" title="Storage History" unit="%" />
        <MetricChart data={metricsData} dataKey="network" color="#10b981" title="Network Throughput" unit=" MB" type="line" />
      </div>
    </div>
  );
};
