import React, { useState } from 'react';
import { ArrowDown, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { translateText } from '../services/geminiService';

const LANGUAGES = [
  "Spanish", "French", "German", "Italian", "Portuguese", 
  "Chinese (Simplified)", "Japanese", "Korean", "Hindi", "Russian", "Arabic"
];

const Translator: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const result = await translateText(input, targetLang);
    setOutput(result);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 flex flex-col h-full gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex-1 flex flex-col">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">English</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to translate..."
          className="flex-1 resize-none outline-none text-slate-700 text-lg placeholder:text-slate-300"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="h-[1px] bg-slate-200 flex-1"></div>
        <div className="bg-slate-100 p-2 rounded-full">
           <ArrowDown className="w-5 h-5 text-slate-500" />
        </div>
        <div className="h-[1px] bg-slate-200 flex-1"></div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {LANGUAGES.map(lang => (
          <button
            key={lang}
            onClick={() => setTargetLang(lang)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              targetLang === lang ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-lg p-4 flex-1 flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-start mb-2 relative z-10">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{targetLang}</label>
          <button onClick={copyToClipboard} className="text-slate-400 hover:text-white transition">
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="flex-1 text-lg text-white font-light leading-relaxed whitespace-pre-wrap">
            {output || "Translation will appear here..."}
          </div>
        )}

        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500 blur-[60px] opacity-20 pointer-events-none" />
      </div>

      <button
        onClick={handleTranslate}
        disabled={loading || !input}
        className="bg-blue-600 disabled:opacity-50 text-white font-bold h-14 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        {loading ? 'Translating...' : <><Sparkles className="w-5 h-5" /> Translate with AI</>}
      </button>
    </div>
  );
};

export default Translator;