import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { k8sApi } from '../../api/kubernetes';
import { Terminal, RotateCcw, Trash2, Box } from 'lucide-react';

export const Pods = () => {
  const { token } = useStore();
  const [pods, setPods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [namespace, setNamespace] = useState('default');

  useEffect(() => {
    fetchPods();
  }, [token, namespace]);

  const fetchPods = () => {
    setLoading(true);
    k8sApi.getPods(token, namespace).then(data => {
      setPods(data);
      setLoading(false);
    }).catch(console.error);
  };

  const handleRestart = async (name: string) => {
    try {
      await k8sApi.restartPod(token, name, namespace);
      fetchPods();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90">Live Pods</h1>
        <select 
          value={namespace}
          onChange={e => setNamespace(e.target.value)}
          className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="default">default</option>
          <option value="kube-system">kube-system</option>
        </select>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-white/5 text-zinc-300 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Node</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Restarts</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">Loading pods...</td></tr>
              ) : pods.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8">No pods found in namespace {namespace}.</td></tr>
              ) : pods.map((pod, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-400"/> {pod.name}
                  </td>
                  <td className="px-6 py-4">{pod.node_name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${pod.status === 'Running' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {pod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{pod.restarts}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Logs">
                        <Terminal className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleRestart(pod.name)} className="p-2 rounded-lg hover:bg-amber-500/10 text-zinc-400 hover:text-amber-400 transition-colors" title="Restart">
                        <RotateCcw className="w-4 h-4" />
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
