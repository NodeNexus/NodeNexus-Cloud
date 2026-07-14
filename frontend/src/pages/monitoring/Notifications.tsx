import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { monitoringApi } from '../../api/monitoring';
import { Bell, Plus, Trash2, Mail, MessageSquare } from 'lucide-react';

export const Notifications = () => {
  const { token } = useStore();
  const [channels, setChannels] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newChannel, setNewChannel] = useState({ name: '', type: 'discord', webhook_url: '' });

  const fetchData = async () => {
    try {
      setChannels(await monitoringApi.getChannels(token));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, fetchData]);

  const handleAddChannel = async () => {
    try {
      await monitoringApi.createChannel(token, newChannel);
      setShowAdd(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90 flex items-center gap-3">
          <Bell className="w-8 h-8 text-purple-500" /> Notification Channels
        </h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Channel
        </button>
      </div>

      {showAdd && (
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl max-w-2xl">
          <h3 className="font-bold mb-4">Configure Integration</h3>
          <div className="space-y-4 mb-4">
            <input placeholder="Channel Name (e.g. DevOps Team Slack)" value={newChannel.name} onChange={e => setNewChannel({...newChannel, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2" />
            <select value={newChannel.type} onChange={e => setNewChannel({...newChannel, type: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2">
              <option value="discord">Discord Webhook</option>
              <option value="slack">Slack Webhook</option>
              <option value="telegram">Telegram Bot API</option>
              <option value="email">SMTP Email</option>
            </select>
            <input placeholder="Webhook URL / Config endpoint" value={newChannel.webhook_url} onChange={e => setNewChannel({...newChannel, webhook_url: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 font-mono text-sm" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={handleAddChannel} className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors">Save Channel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {channels.map((ch, i) => (
          <div key={i} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-xl text-zinc-300">
                  {ch.type === 'email' ? <Mail className="w-6 h-6"/> : <MessageSquare className="w-6 h-6"/>}
                </div>
                <div>
                  <h3 className="font-bold">{ch.name}</h3>
                  <div className="text-xs text-zinc-500 uppercase">{ch.type}</div>
                </div>
              </div>
              <span className={`w-2 h-2 rounded-full ${ch.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </div>
            
            <div className="text-xs font-mono text-zinc-500 truncate mb-4 bg-black/50 p-2 rounded-lg">
              {ch.webhook_url || 'No URL configured'}
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors">Test</button>
              <button className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs transition-colors"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
        {channels.length === 0 && <div className="col-span-3 text-zinc-500 py-10">No notification channels configured.</div>}
      </div>
    </div>
  );
};
