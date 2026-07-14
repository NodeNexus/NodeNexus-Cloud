import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { updatesApi } from '../../api/updates';
import { RefreshCcw, Server, ShieldAlert, Cpu, AlertTriangle, ArrowUpCircle, CheckCircle2, Loader2, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { token } = useStore();
  const [updates, setUpdates] = useState<any[]>([]);
  const [sysState, setSysState] = useState({ maintenance_mode: false, restart_required: false });
  const [isChecking, setIsChecking] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchState = async () => {
    try {
      setSysState(await updatesApi.getState(token));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchState();
  }, [token]);

  const handleCheckUpdates = async () => {
    setIsChecking(true);
    try {
      setUpdates(await updatesApi.checkUpdates(token));
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleApply = async (update: any) => {
    setUpdatingId(update.component_name);
    try {
      await updatesApi.applyUpdate(token, {
        component_type: update.component_type,
        component_name: update.component_name,
        current_version: update.current_version,
        new_version: update.available_version
      });
      // Remove from list
      setUpdates(updates.filter(u => u.component_name !== update.component_name));
      fetchState(); // refresh restart required status
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const res = await updatesApi.toggleMaintenance(token);
      setSysState({ ...sysState, maintenance_mode: res.maintenance_mode });
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'os': return <Server className="w-5 h-5" />;
      case 'plugin': return <ShieldAlert className="w-5 h-5" />;
      case 'k8s': return <RefreshCcw className="w-5 h-5" />;
      case 'ollama': return <Cpu className="w-5 h-5" />;
      default: return <RefreshCcw className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90 flex items-center gap-3">
          <RefreshCcw className="w-8 h-8 text-sky-500" /> Update Center
        </h1>
        <div className="flex gap-4">
          <button 
            onClick={handleToggleMaintenance}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${sysState.maintenance_mode ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-white/10 hover:bg-white/20'}`}
          >
            <Wrench className="w-4 h-4" /> {sysState.maintenance_mode ? 'Maintenance Active' : 'Enable Maintenance'}
          </button>
          <button 
            onClick={handleCheckUpdates} 
            disabled={isChecking}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isChecking ? <Loader2 className="w-4 h-4 animate-spin"/> : <RefreshCcw className="w-4 h-4" />} Check for Updates
          </button>
        </div>
      </div>

      {sysState.restart_required && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <div className="font-bold">System Restart Required</div>
              <div className="text-sm">A critical OS or Kernel update has been installed. Please restart the host machine to apply changes.</div>
            </div>
          </div>
          <button className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-black font-bold rounded-xl transition-colors">
            Reboot Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {updates.map((upd, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            {upd.is_critical && (
              <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 bg-rose-500 rounded-full"></div>
            )}
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${upd.is_critical ? 'bg-rose-500/20 text-rose-400' : 'bg-sky-500/20 text-sky-400'}`}>
                  {getIcon(upd.component_type)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{upd.component_name}</h3>
                  <div className="text-xs text-zinc-500 uppercase font-bold">{upd.component_type}</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4 relative z-10 text-sm font-mono">
              <div className="text-zinc-400 line-through">{upd.current_version}</div>
              <ArrowUpCircle className="w-4 h-4 text-sky-500" />
              <div className="text-white font-bold">{upd.available_version}</div>
            </div>

            <div className="text-sm text-zinc-400 mb-6 relative z-10 p-3 bg-black/50 rounded-xl">
              {upd.changelog}
            </div>
            
            <button 
              onClick={() => handleApply(upd)}
              disabled={updatingId === upd.component_name}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2 relative z-10 disabled:opacity-50 ${
                upd.is_critical ? 'bg-rose-600 hover:bg-rose-500' : 'bg-sky-600 hover:bg-sky-500'
              }`}
            >
              {updatingId === upd.component_name ? <Loader2 className="w-5 h-5 animate-spin"/> : <ArrowUpCircle className="w-5 h-5" />}
              {updatingId === upd.component_name ? 'Applying Update...' : 'Update Now'}
            </button>
          </motion.div>
        ))}
      </div>
      
      {updates.length === 0 && !isChecking && (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 mt-10">
          <CheckCircle2 className="w-16 h-16 mb-4 text-emerald-500/50" />
          <p className="text-xl font-bold text-white/80">System is Up to Date</p>
          <p className="text-sm mt-2">All docker images, plugins, and host packages are running the latest versions.</p>
        </div>
      )}
    </div>
  );
};
