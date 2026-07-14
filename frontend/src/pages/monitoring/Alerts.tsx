import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { monitoringApi } from '../../api/monitoring';
import { AlertTriangle, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const Alerts = () => {
  const { token } = useStore();
  const [rules, setRules] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', metric: 'cpu', condition: '>', threshold: 90 });

  const fetchData = async () => {
    try {
      setRules(await monitoringApi.getRules(token));
      setAlerts(await monitoringApi.getAlerts(token));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAddRule = async () => {
    try {
      await monitoringApi.createRule(token, newRule);
      setShowAdd(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-amber-500" /> Alerts & Rules
        </h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      {showAdd && (
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl">
          <h3 className="font-bold mb-4">New Alert Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input placeholder="Rule Name" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-2" />
            <select value={newRule.metric} onChange={e => setNewRule({...newRule, metric: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-2">
              <option value="cpu">CPU %</option>
              <option value="memory">Memory %</option>
              <option value="storage">Storage %</option>
            </select>
            <select value={newRule.condition} onChange={e => setNewRule({...newRule, condition: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-2">
              <option value=">">Greater than (&gt;)</option>
              <option value="<">Less than (&lt;)</option>
            </select>
            <input type="number" placeholder="Threshold" value={newRule.threshold} onChange={e => setNewRule({...newRule, threshold: Number(e.target.value)})} className="bg-black border border-white/10 rounded-xl px-4 py-2" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={handleAddRule} className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors">Save Rule</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold text-xl mb-4 text-zinc-300">Active Rules</h3>
          <div className="space-y-4">
            {rules.map((rule, i) => (
              <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold">{rule.name}</div>
                  <div className="text-sm text-zinc-400 font-mono mt-1">IF {rule.metric} {rule.condition} {rule.threshold}</div>
                </div>
                <button className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
            {rules.length === 0 && <div className="text-zinc-500 text-sm">No rules configured.</div>}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-4 text-zinc-300">Alert History</h3>
          <div className="space-y-4">
            {alerts.map((alert, i) => (
              <div key={i} className={`border rounded-2xl p-4 flex items-start gap-4 ${alert.is_resolved ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                {alert.is_resolved ? <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0"/> : <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0"/>}
                <div>
                  <div className="font-bold text-sm mb-1">{alert.message}</div>
                  <div className="text-xs text-zinc-500">{new Date(alert.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
            {alerts.length === 0 && <div className="text-zinc-500 text-sm">No alerts triggered yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
