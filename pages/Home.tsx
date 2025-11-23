import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOLS } from '../App';
import { Sparkles, Search } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const filteredTools = TOOLS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-5 pb-20">
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Find a tool..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white pl-12 pr-4 py-3.5 rounded-2xl shadow-sm border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-medium"
        />
      </div>

      {/* AI Hero Section */}
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl shadow-indigo-900/20 group cursor-pointer" onClick={() => navigate('/ai-chat')}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative p-6 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">New Features</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">AI Assistant</h2>
            <p className="text-slate-400 text-sm max-w-[180px]">Generate code, images, or summarize docs.</p>
          </div>
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 ml-1">All Tools</h3>
        <div className="grid grid-cols-2 gap-4">
          {filteredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(tool.path)}
              className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 active:scale-[0.98] transition-all duration-200 text-left gap-4 group"
            >
              <div className={`${tool.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="block font-bold text-slate-700 text-sm">{tool.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;