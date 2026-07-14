import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { backupsApi } from '../../api/backups';
import { DatabaseBackup, Play, HardDrive, ShieldCheck, Loader2 } from 'lucide-react';

export const Dashboard = () => {
  const { token } = useStore();
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
  const newBackup = { name: 'Manual Backup', description: '', targets: ['sqlite', 'postgresql', 'grafana'], encrypt: false };

  const fetchSnapshots = async () => {
    try {
      setSnapshots(await backupsApi.getSnapshots(token));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSnapshots();
  }, [token, fetchSnapshots]);

  const handleCreateSnapshot = async () => {
    setIsTakingSnapshot(true);
    try {
      await backupsApi.createSnapshot(token, newBackup);
      fetchSnapshots();
    } catch (e) {
      console.error(e);
    } finally {
      setIsTakingSnapshot(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90 flex items-center gap-3">
          <DatabaseBackup className="w-8 h-8 text-indigo-500" /> Backup & Restore
        </h1>
        <button 
          onClick={handleCreateSnapshot} 
          disabled={isTakingSnapshot}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          {isTakingSnapshot ? <Loader2 className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4" />} Create Snapshot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col">
          <div className="text-zinc-400 mb-2 font-medium">Total Backups</div>
          <div className="text-4xl font-bold text-indigo-400">{snapshots.length}</div>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col">
          <div className="text-zinc-400 mb-2 font-medium">Storage Used</div>
          <div className="text-4xl font-bold text-pink-400 flex items-end gap-2">
            {snapshots.reduce((acc, curr) => acc + curr.size_mb, 0).toFixed(2)} <span className="text-lg text-zinc-500 mb-1">MB</span>
          </div>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-center items-center">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mb-2" />
          <div className="text-emerald-400 font-bold">System Protected</div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4 text-zinc-300">Recent Snapshots</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {snapshots.map((snap, i) => (
          <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-bold text-lg text-white/90">{snap.name}</h4>
                <div className="text-sm text-zinc-500">{new Date(snap.created_at).toLocaleString()}</div>
              </div>
              <div className="px-3 py-1 bg-white/5 rounded-lg text-xs font-mono text-zinc-300 flex items-center gap-2">
                <HardDrive className="w-3 h-3" /> {snap.size_mb.toFixed(2)} MB
              </div>
            </div>
            
            <p className="text-sm text-zinc-400 mb-4">{snap.description || 'No description provided.'}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {JSON.parse(snap.targets).map((t: string) => (
                <span key={t} className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-md">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium">
                Restore Wizard
              </button>
              <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors font-medium">
                Download Archive
              </button>
            </div>
          </div>
        ))}
        {snapshots.length === 0 && <div className="text-zinc-500 col-span-2">No snapshots found.</div>}
      </div>
    </div>
  );
};
