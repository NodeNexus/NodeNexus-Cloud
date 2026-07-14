import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { k8sApi } from '../../api/kubernetes';
import { Package, DownloadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

export const Helm = () => {
  const { token } = useStore();
  const [charts, setCharts] = useState<any[]>([]);

  useEffect(() => {
    k8sApi.getHelmCharts(token).then(setCharts).catch(console.error);
  }, [token]);

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <h1 className="text-3xl font-bold tracking-tight text-white/90 mb-8">Helm Charts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {charts.map((c, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{c.name}</h3>
                <p className="text-zinc-500 text-sm">v{c.version}</p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm flex-1 mb-6">{c.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs bg-white/10 px-2 py-1 rounded text-zinc-300">{c.repo}</span>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm transition-colors">
                <DownloadCloud className="w-4 h-4" /> Install
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
