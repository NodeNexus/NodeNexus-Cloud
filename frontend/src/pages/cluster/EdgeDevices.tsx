import { Wifi, Thermometer, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export const EdgeDevices = () => {
  // Stubbed Edge Devices
  const devices = [
    { name: 'ESP32-Cam-01', type: 'ESP32', status: 'Online', temp: 42, mqtt: 'Connected' },
    { name: 'RPi-Gateway', type: 'Raspberry Pi', status: 'Online', temp: 55, mqtt: 'Connected' },
    { name: 'Jetson-Nano-AI', type: 'Jetson', status: 'Offline', temp: 0, mqtt: 'Disconnected' }
  ];

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <h1 className="text-3xl font-bold tracking-tight text-white/90 mb-8">Edge Devices</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((d, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
             <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full ${d.status === 'Online' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
             
             <div className="flex items-center justify-between mb-4 relative z-10">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/5 rounded-xl"><Radio className="w-5 h-5 text-purple-400"/></div>
                 <div>
                   <div className="font-bold">{d.name}</div>
                   <div className="text-xs text-zinc-500">{d.type}</div>
                 </div>
               </div>
               <span className={`px-2 py-1 rounded text-xs font-medium ${d.status === 'Online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                 {d.status}
               </span>
             </div>

             <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                  <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Thermometer className="w-3 h-3"/> Temp</div>
                  <div className="font-medium">{d.temp}°C</div>
                </div>
                <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                  <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Wifi className="w-3 h-3"/> MQTT</div>
                  <div className="font-medium truncate text-sm">{d.mqtt}</div>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
