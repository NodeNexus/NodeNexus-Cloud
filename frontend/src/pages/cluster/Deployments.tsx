import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { k8sApi } from '../../api/kubernetes';
import { Layers, Activity, Settings2, Trash2 } from 'lucide-react';

export const Deployments = () => {
  const { token } = useStore();
  const [deps, setDeps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [namespace, setNamespace] = useState('default');

  useEffect(() => {
    k8sApi.getDeployments(token, namespace).then(data => {
      setDeps(data);
      setLoading(false);
    }).catch(console.error);
  }, [token, namespace]);

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90">Deployments</h1>
        <div className="flex gap-4">
          <select 
            value={namespace}
            onChange={e => setNamespace(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="default">default</option>
            <option value="kube-system">kube-system</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
            + Deploy App
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-white/5 text-zinc-300 font-medium">
              <tr>
                <th className="px-6 py-4">Deployment Name</th>
                <th className="px-6 py-4">Replicas</th>
                <th className="px-6 py-4">Ready</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8">Loading deployments...</td></tr>
              ) : deps.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8">No deployments found in namespace {namespace}.</td></tr>
              ) : deps.map((d, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400"/> {d.name}
                  </td>
                  <td className="px-6 py-4">{d.replicas}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${d.ready_replicas === d.replicas && d.replicas > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {d.ready_replicas} / {d.replicas}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Scale">
                        <Activity className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Rolling Update">
                        <Settings2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
