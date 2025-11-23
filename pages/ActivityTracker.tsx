import React, { useState, useEffect } from 'react';
import { ActivityLog } from '../types';
import { Plus, Flame, Clock, Trash2 } from 'lucide-react';

const ACTIVITIES = ["Walking", "Running", "Cycling", "Gym", "Yoga", "Swimming"];

const ActivityTracker: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const s = localStorage.getItem('omni_activity');
    return s ? JSON.parse(s) : [];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newLog, setNewLog] = useState<{type: string, duration: string}>({ type: 'Walking', duration: '' });

  useEffect(() => {
    localStorage.setItem('omni_activity', JSON.stringify(logs));
  }, [logs]);

  const addLog = () => {
    if (!newLog.duration) return;
    const log: ActivityLog = {
      id: Date.now().toString(),
      type: newLog.type,
      durationMinutes: parseInt(newLog.duration),
      date: new Date().toLocaleDateString(),
      calories: Math.floor(parseInt(newLog.duration) * 5) // Mock calculation
    };
    setLogs([log, ...logs]);
    setShowAdd(false);
    setNewLog({ type: 'Walking', duration: '' });
  };

  const totalMins = logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalCals = logs.reduce((acc, curr) => acc + (curr.calories || 0), 0);

  return (
    <div className="p-4 h-full flex flex-col relative">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-rose-500 rounded-2xl p-4 text-white shadow-lg shadow-rose-200">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Clock className="w-4 h-4" /> <span className="text-xs font-medium">Total Time</span>
          </div>
          <span className="text-3xl font-bold">{totalMins}<span className="text-sm font-medium opacity-60 ml-1">min</span></span>
        </div>
        <div className="bg-orange-500 rounded-2xl p-4 text-white shadow-lg shadow-orange-200">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Flame className="w-4 h-4" /> <span className="text-xs font-medium">Burned</span>
          </div>
          <span className="text-3xl font-bold">{totalCals}<span className="text-sm font-medium opacity-60 ml-1">kcal</span></span>
        </div>
      </div>

      <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
      
      <div className="flex-1 overflow-y-auto space-y-3 pb-20">
        {logs.length === 0 && <p className="text-slate-400 text-center py-10">No activities logged yet.</p>}
        {logs.map(log => (
          <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">{log.type}</h4>
                <p className="text-xs text-slate-400">{log.date}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-bold text-slate-700">{log.durationMinutes} min</span>
              <span className="text-xs text-rose-500 font-medium">{log.calories} kcal</span>
            </div>
             <button onClick={() => setLogs(logs.filter(l => l.id !== log.id))} className="ml-2 text-slate-300 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => setShowAdd(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-rose-600 text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>

      {showAdd && (
        <div className="absolute inset-0 z-20 bg-black/50 flex items-end justify-center backdrop-blur-sm">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
            <h3 className="font-bold text-lg mb-4">Log Activity</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Activity Type</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ACTIVITIES.map(a => (
                    <button 
                      key={a}
                      onClick={() => setNewLog({...newLog, type: a})}
                      className={`px-3 py-1.5 rounded-lg text-sm transition ${newLog.type === a ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Duration (Minutes)</label>
                <input 
                  type="number"
                  value={newLog.duration}
                  onChange={e => setNewLog({...newLog, duration: e.target.value})}
                  className="w-full mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-rose-500 font-bold text-lg"
                  placeholder="e.g. 30"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-slate-100 font-bold rounded-xl text-slate-600">Cancel</button>
              <button onClick={addLog} className="flex-1 py-3 bg-rose-600 font-bold rounded-xl text-white shadow-lg shadow-rose-200">Save Log</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTracker;