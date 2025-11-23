import React, { useState, useEffect } from 'react';
import { Shield, Key, Eye, EyeOff, Copy, RefreshCw, Lock, Trash2, Plus, X } from 'lucide-react';

interface PasswordEntry {
    id: string;
    title: string;
    pass: string; // In a real app, this would be encrypted blob
    username?: string;
}

const Security: React.FC = () => {
  const [view, setView] = useState<'manager' | 'generator'>('manager');
  const [entries, setEntries] = useState<PasswordEntry[]>(() => {
      const s = localStorage.getItem('omni_passwords');
      return s ? JSON.parse(s) : [];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', username: '', pass: '' });
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  // Generator State
  const [genLength, setGenLength] = useState(12);
  const [generated, setGenerated] = useState('');

  useEffect(() => {
      localStorage.setItem('omni_passwords', JSON.stringify(entries));
  }, [entries]);

  const generatePass = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
      let res = "";
      const array = new Uint32Array(genLength);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < genLength; i++) {
          res += chars[array[i] % chars.length];
      }
      setGenerated(res);
  };

  const addEntry = () => {
      if(!newEntry.title || !newEntry.pass) return;
      setEntries([...entries, { id: Date.now().toString(), ...newEntry }]);
      setNewEntry({ title: '', username: '', pass: '' });
      setShowAdd(false);
  };

  const deleteEntry = (id: string) => {
      setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="p-4 flex gap-2">
          <button onClick={() => setView('manager')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'manager' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-500'}`}>My Vault</button>
          <button onClick={() => setView('generator')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'generator' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-500'}`}>Generator</button>
      </div>

      {view === 'manager' ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
              {entries.length === 0 && (
                  <div className="text-center mt-20 opacity-40">
                      <Lock className="w-16 h-16 mx-auto mb-2 text-slate-400" />
                      <p>Vault is empty</p>
                  </div>
              )}
              
              {entries.map(entry => (
                  <div key={entry.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                      <div className="overflow-hidden max-w-[60%]">
                          <h3 className="font-bold text-slate-800 truncate">{entry.title}</h3>
                          <p className="text-xs text-slate-400 truncate">{entry.username}</p>
                          <div className="mt-1 flex items-center gap-2">
                              <div className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                  {revealed[entry.id] ? entry.pass : '••••••••••'}
                              </div>
                              <button onClick={() => setRevealed({...revealed, [entry.id]: !revealed[entry.id]})}>
                                  {revealed[entry.id] ? <EyeOff className="w-3 h-3 text-slate-400"/> : <Eye className="w-3 h-3 text-slate-400"/>}
                              </button>
                          </div>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => navigator.clipboard.writeText(entry.pass)} className="p-2 rounded-full bg-slate-50 text-slate-600"><Copy className="w-4 h-4"/></button>
                          <button onClick={() => deleteEntry(entry.id)} className="p-2 rounded-full bg-red-50 text-red-500"><Trash2 className="w-4 h-4"/></button>
                      </div>
                  </div>
              ))}

              {/* Add Modal */}
              {showAdd && (
                  <div className="absolute inset-0 z-20 bg-slate-50 flex flex-col animate-slide-up">
                      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                          <h3 className="font-bold">New Entry</h3>
                          <button onClick={() => setShowAdd(false)}><X className="w-6 h-6 text-slate-400"/></button>
                      </div>
                      <div className="p-4 space-y-4">
                          <div>
                              <label className="text-xs font-bold uppercase text-slate-400">Service</label>
                              <input className="w-full p-3 bg-white border rounded-xl mt-1 outline-none font-bold" placeholder="e.g. Netflix" value={newEntry.title} onChange={e => setNewEntry({...newEntry, title: e.target.value})} />
                          </div>
                          <div>
                              <label className="text-xs font-bold uppercase text-slate-400">Username</label>
                              <input className="w-full p-3 bg-white border rounded-xl mt-1 outline-none" placeholder="Email or ID" value={newEntry.username} onChange={e => setNewEntry({...newEntry, username: e.target.value})} />
                          </div>
                          <div>
                              <label className="text-xs font-bold uppercase text-slate-400">Password</label>
                              <input className="w-full p-3 bg-white border rounded-xl mt-1 outline-none font-mono" placeholder="Required" value={newEntry.pass} onChange={e => setNewEntry({...newEntry, pass: e.target.value})} />
                          </div>
                          <button onClick={addEntry} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl mt-4 shadow-lg shadow-emerald-200">Save to Vault</button>
                      </div>
                  </div>
              )}
              
              <button onClick={() => setShowAdd(true)} className="absolute bottom-6 right-4 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition"><Plus className="w-8 h-8"/></button>
          </div>
      ) : (
          <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="bg-slate-900 p-6 rounded-3xl text-center mb-8 relative overflow-hidden">
                  <div className="text-2xl font-mono text-white break-all tracking-wider mb-2">{generated || 'Generate Secure Pass'}</div>
                  <div className="flex justify-center gap-4 mt-4">
                      <button onClick={() => navigator.clipboard.writeText(generated)} className="flex items-center gap-2 text-xs font-bold bg-white/10 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm"><Copy className="w-3 h-3"/> Copy</button>
                      <button onClick={generatePass} className="flex items-center gap-2 text-xs font-bold bg-emerald-500 text-white px-3 py-1.5 rounded-lg"><RefreshCw className="w-3 h-3"/> Renew</button>
                  </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="flex justify-between mb-4">
                      <span className="font-bold text-slate-700">Length</span>
                      <span className="font-bold text-emerald-600">{genLength}</span>
                  </div>
                  <input type="range" min="8" max="32" value={genLength} onChange={e => setGenLength(parseInt(e.target.value))} className="w-full accent-emerald-600" />
              </div>
          </div>
      )}
    </div>
  );
};

export default Security;