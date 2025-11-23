import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Trash2, CheckCircle2, Circle, Save, X } from 'lucide-react';
import { Note } from '../types';

const Notes: React.FC = () => {
  const location = useLocation();
  const isTodoMode = new URLSearchParams(location.search).get('tab') === 'todo';
  
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('omni_notes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTab, setActiveTab] = useState<'notes' | 'todo'>(isTodoMode ? 'todo' : 'notes');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({});

  useEffect(() => {
    localStorage.setItem('omni_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (new URLSearchParams(location.search).get('tab') === 'todo') {
      setActiveTab('todo');
    } else {
      setActiveTab('notes');
    }
  }, [location.search]);

  const handleSave = () => {
    if (!currentNote.title && !currentNote.content) return;
    
    const newNote: Note = {
      id: currentNote.id || Date.now().toString(),
      title: currentNote.title || 'Untitled',
      content: currentNote.content || '',
      date: new Date().toLocaleDateString(),
      isTodo: activeTab === 'todo',
      completed: currentNote.completed || false
    };

    if (currentNote.id) {
      setNotes(notes.map(n => n.id === newNote.id ? newNote : n));
    } else {
      setNotes([newNote, ...notes]);
    }
    setIsEditing(false);
    setCurrentNote({});
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const toggleTodo = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, completed: !n.completed } : n));
  };

  const filteredNotes = notes.filter(n => n.isTodo === (activeTab === 'todo'));

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
        >
          Notes
        </button>
        <button 
          onClick={() => setActiveTab('todo')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'todo' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}
        >
          To-Do List
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredNotes.length === 0 && (
          <div className="text-center mt-20 text-slate-400">
            <p>No {activeTab === 'todo' ? 'tasks' : 'notes'} yet.</p>
          </div>
        )}
        
        {filteredNotes.map(note => (
          <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-start gap-3">
            {activeTab === 'todo' && (
              <button onClick={() => toggleTodo(note.id)} className="mt-1 text-slate-400 hover:text-emerald-500 transition-colors">
                {note.completed ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6" />}
              </button>
            )}
            <div 
              className="flex-1 cursor-pointer" 
              onClick={() => {
                if(activeTab === 'notes') {
                    setCurrentNote(note);
                    setIsEditing(true);
                }
              }}
            >
              <h3 className={`font-semibold text-slate-800 ${note.completed ? 'line-through text-slate-400' : ''}`}>{note.title}</h3>
              {note.content && <p className={`text-sm text-slate-500 mt-1 line-clamp-2 ${note.completed ? 'line-through text-slate-300' : ''}`}>{note.content}</p>}
              <span className="text-xs text-slate-300 mt-2 block">{note.date}</span>
            </div>
            <button onClick={() => deleteNote(note.id)} className="text-slate-300 hover:text-red-500 p-1">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => { setCurrentNote({}); setIsEditing(true); }}
        className={`absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white ${activeTab === 'todo' ? 'bg-emerald-500' : 'bg-blue-500'}`}
      >
        <Plus className="w-8 h-8" />
      </button>

      {isEditing && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4">
            <button onClick={() => setIsEditing(false)} className="p-2 -ml-2"><X className="w-6 h-6 text-slate-500" /></button>
            <span className="font-semibold">{currentNote.id ? 'Edit' : 'New'} {activeTab === 'todo' ? 'Task' : 'Note'}</span>
            <button onClick={handleSave} className="p-2 -mr-2 text-blue-600 font-medium"><Save className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-4">
            <input 
              value={currentNote.title || ''}
              onChange={e => setCurrentNote({...currentNote, title: e.target.value})}
              placeholder={activeTab === 'todo' ? "What needs to be done?" : "Title"}
              className="text-2xl font-bold placeholder:text-slate-300 outline-none w-full bg-transparent"
              autoFocus
            />
            <textarea 
              value={currentNote.content || ''}
              onChange={e => setCurrentNote({...currentNote, content: e.target.value})}
              placeholder={activeTab === 'todo' ? "Add details (optional)" : "Start typing..."}
              className="flex-1 resize-none outline-none text-slate-600 leading-relaxed bg-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;