import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { backupsApi } from '../../api/backups';
import { CalendarClock, Plus, Trash2, Clock } from 'lucide-react';

export const Schedules = () => {
  const { token } = useStore();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ name: '', schedule: '0 2 * * *', targets: ['sqlite', 'config'], retention_days: 7 });

  const fetchSchedules = async () => {
    try {
      setSchedules(await backupsApi.getSchedules(token));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [token]);

  const handleAddSchedule = async () => {
    try {
      await backupsApi.createSchedule(token, {
        ...newSchedule,
        targets: JSON.stringify(newSchedule.targets)
      });
      setShowAdd(false);
      fetchSchedules();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90 flex items-center gap-3">
          <CalendarClock className="w-8 h-8 text-pink-500" /> Automated Schedules
        </h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-medium transition-colors">
          <Plus className="w-4 h-4" /> Create Schedule
        </button>
      </div>

      {showAdd && (
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl max-w-2xl">
          <h3 className="font-bold mb-4">New Backup Rule</h3>
          <div className="space-y-4 mb-4">
            <input placeholder="Schedule Name" value={newSchedule.name} onChange={e => setNewSchedule({...newSchedule, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2" />
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-zinc-400 mb-1 block">Cron Expression</label>
                <input placeholder="0 2 * * *" value={newSchedule.schedule} onChange={e => setNewSchedule({...newSchedule, schedule: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 font-mono" />
              </div>
              <div className="w-32">
                <label className="text-xs text-zinc-400 mb-1 block">Retention (Days)</label>
                <input type="number" value={newSchedule.retention_days} onChange={e => setNewSchedule({...newSchedule, retention_days: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2" />
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Targets (Comma separated)</label>
              <input 
                placeholder="sqlite, postgresql, grafana" 
                value={newSchedule.targets.join(', ')} 
                onChange={e => setNewSchedule({...newSchedule, targets: e.target.value.split(',').map(s => s.trim())})} 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={handleAddSchedule} className="px-4 py-2 bg-pink-600 rounded-xl hover:bg-pink-500 transition-colors">Save Schedule</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {schedules.map((sched, i) => (
          <div key={i} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">{sched.name}</h3>
                <div className="text-xs text-zinc-500 font-mono mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3"/> {sched.schedule}
                </div>
              </div>
              <span className={`w-2 h-2 rounded-full ${sched.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </div>
            
            <div className="text-sm text-zinc-400 mb-4">
              Retains backups for <span className="text-white">{sched.retention_days} days</span>.
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {JSON.parse(sched.targets).map((t: string) => (
                <span key={t} className="px-2 py-1 bg-white/5 text-zinc-300 text-xs rounded-md">
                  {t}
                </span>
              ))}
            </div>

            <button className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm transition-colors flex justify-center items-center gap-2">
              <Trash2 className="w-4 h-4"/> Delete Rule
            </button>
          </div>
        ))}
        {schedules.length === 0 && <div className="col-span-3 text-zinc-500 py-10">No automated schedules configured.</div>}
      </div>
    </div>
  );
};
