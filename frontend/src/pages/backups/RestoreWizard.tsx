import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { backupsApi } from '../../api/backups';
import { RotateCcw, AlertTriangle, CheckCircle2, Loader2, HardDrive } from 'lucide-react';

export const RestoreWizard = () => {
  const { token } = useStore();
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    backupsApi.getSnapshots(token).then(setSnapshots).catch(console.error);
  }, [token]);

  const handleRestore = async () => {
    if (!selectedSnapshot) return;
    setIsRestoring(true);
    setRestoreStatus('idle');
    try {
      await backupsApi.restoreSnapshot(token, selectedSnapshot.id);
      setRestoreStatus('success');
    } catch (e) {
      console.error(e);
      setRestoreStatus('error');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90 flex items-center gap-3">
          <RotateCcw className="w-8 h-8 text-amber-500" /> Restore Wizard
        </h1>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Select Snapshot */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col h-[500px]">
          <h3 className="font-bold text-lg mb-4 text-zinc-300">1. Select Snapshot</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {snapshots.map(snap => (
              <div 
                key={snap.id} 
                onClick={() => setSelectedSnapshot(snap)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSnapshot?.id === snap.id 
                    ? 'bg-amber-500/10 border-amber-500/50' 
                    : 'bg-black/50 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="font-bold mb-1">{snap.name}</div>
                <div className="flex justify-between text-xs text-zinc-500 font-mono mb-2">
                  <span>{new Date(snap.created_at).toLocaleString()}</span>
                  <span className="flex items-center gap-1"><HardDrive className="w-3 h-3"/>{snap.size_mb.toFixed(1)} MB</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {JSON.parse(snap.targets).map((t: string) => (
                    <span key={t} className="px-1.5 py-0.5 bg-white/5 text-[10px] rounded text-zinc-400">{t}</span>
                  ))}
                </div>
              </div>
            ))}
            {snapshots.length === 0 && <div className="text-zinc-500 text-sm">No snapshots available.</div>}
          </div>
        </div>

        {/* Step 2: Review and Execute */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col">
          <h3 className="font-bold text-lg mb-4 text-zinc-300">2. Review & Restore</h3>
          
          {!selectedSnapshot ? (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
              Please select a snapshot from the left.
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl mb-6 flex items-start gap-3 text-rose-400">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Warning:</strong> Restoring this snapshot is a destructive action. Existing database records and files corresponding to the selected targets will be completely overwritten by the backup data.
                </div>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl mb-6">
                <div className="text-xs text-zinc-500 mb-1">Target Snapshot</div>
                <div className="font-bold text-lg">{selectedSnapshot.name}</div>
                <div className="text-sm text-zinc-400 mt-2">{selectedSnapshot.description}</div>
              </div>

              <div className="mt-auto">
                {restoreStatus === 'success' && (
                  <div className="mb-4 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-xl justify-center">
                    <CheckCircle2 className="w-5 h-5"/> Restoration Complete
                  </div>
                )}
                {restoreStatus === 'error' && (
                  <div className="mb-4 flex items-center gap-2 text-rose-400 bg-rose-500/10 p-3 rounded-xl justify-center">
                    <AlertTriangle className="w-5 h-5"/> Restoration Failed
                  </div>
                )}
                <button 
                  onClick={handleRestore}
                  disabled={isRestoring}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2 text-lg"
                >
                  {isRestoring ? <Loader2 className="w-6 h-6 animate-spin"/> : <RotateCcw className="w-6 h-6" />}
                  {isRestoring ? 'Restoring System...' : 'Initiate Restore'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
