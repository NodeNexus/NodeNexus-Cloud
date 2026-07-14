import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { updatesApi } from '../../api/updates';
import { History as HistoryIcon, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

export const History = () => {
  const { token } = useStore();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    updatesApi.getHistory(token).then(setHistory).catch(console.error);
  }, [token]);

  return (
    <div className="flex flex-col h-full bg-black text-white p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90 flex items-center gap-3">
          <HistoryIcon className="w-8 h-8 text-sky-500" /> Update History
        </h1>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        <div className="space-y-4">
          {history.map(record => (
            <div key={record.id} className="flex items-start gap-4 p-4 rounded-2xl bg-black/50 border border-white/5 relative group">
              <div className="mt-1">
                {record.status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-lg">{record.component_name}</div>
                  <div className="text-xs text-zinc-500">{new Date(record.timestamp).toLocaleString()}</div>
                </div>
                
                <div className="flex items-center gap-2 text-sm font-mono text-zinc-400 mb-2">
                  <span className="uppercase text-xs bg-white/10 px-2 py-0.5 rounded text-white">{record.component_type}</span>
                  {record.previous_version && <span>{record.previous_version} -&gt; </span>}
                  <span className="text-sky-400">{record.new_version}</span>
                </div>
                
                <div className="text-sm text-zinc-500">{record.logs}</div>
              </div>

              {record.status === 'success' && record.previous_version && (
                <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm absolute right-4 top-4">
                  <RotateCcw className="w-4 h-4" /> Rollback
                </button>
              )}
            </div>
          ))}
          {history.length === 0 && <div className="text-zinc-500 text-center py-10">No update history found.</div>}
        </div>
      </div>
    </div>
  );
};
