import { Bot, Play, Pause, Trash2, Plus } from 'lucide-react';

export const AutomationBuilder = () => {
  const automations = [
    { name: 'Daily Health Check', schedule: '0 8 * * *', status: 'Active', nextRun: 'in 4 hours' },
    { name: 'Restart Failed Pods', schedule: '*/15 * * * *', status: 'Active', nextRun: 'in 5 mins' },
    { name: 'Backup Database', schedule: '0 0 * * 0', status: 'Paused', nextRun: '-' }
  ];

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90">AI Automation</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-colors">
          <Plus className="w-4 h-4" /> Create Workflow
        </button>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6">
        <p className="text-zinc-400 mb-8">
          VNAV AI can autonomously execute actions based on a cron schedule or system events.
        </p>

        <div className="space-y-4">
          {automations.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/50 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${a.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">{a.name}</h3>
                  <div className="text-sm text-zinc-500 font-mono mt-1">Cron: {a.schedule} | Next: {a.nextRun}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {a.status === 'Active' ? (
                  <button className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors" title="Pause">
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors" title="Resume">
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
