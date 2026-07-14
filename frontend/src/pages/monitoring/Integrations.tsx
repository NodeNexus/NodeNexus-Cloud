import { Database, LineChart, Server, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';

export const Integrations = () => {
  const integrations = [
    { name: 'Prometheus', status: 'Not Connected', icon: LineChart, color: 'text-orange-500' },
    { name: 'Grafana', status: 'Not Connected', icon: LineChart, color: 'text-orange-400' },
    { name: 'PostgreSQL', status: 'Configured', icon: Database, color: 'text-blue-500' },
    { name: 'Redis', status: 'Configured', icon: Database, color: 'text-red-500' },
    { name: 'MinIO', status: 'Not Connected', icon: Server, color: 'text-red-600' },
    { name: 'MQTT (Mosquitto)', status: 'Not Connected', icon: Workflow, color: 'text-purple-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <h1 className="text-3xl font-bold tracking-tight text-white/90 mb-8">Service Integrations</h1>
      <p className="text-zinc-400 mb-8 max-w-2xl">
        VNAV Cloud can automatically aggregate metrics and logs from external services. Configure the connection parameters below to enable advanced monitoring for these specific platforms.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-white/5 rounded-2xl ${integration.color}`}>
                  <integration.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">{integration.name}</h3>
              </div>
            </div>
            
            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${integration.status === 'Configured' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                {integration.status}
              </span>
              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                Configure
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
