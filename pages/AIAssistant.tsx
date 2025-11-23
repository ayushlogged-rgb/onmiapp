import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileDown, Loader2, Copy, Check } from 'lucide-react';
import { chatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await chatResponse(userMsg.text, history);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    return (
        <button 
            onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }}
            className="p-1 text-slate-400 hover:text-indigo-600 transition"
        >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
    );
  };

  const formatMessage = (text: string) => {
    // Simple basic formatting for code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const content = part.replace(/```(\w*)\n?/, '').replace(/```$/, '');
        return (
          <div key={index} className="my-3 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
             <div className="bg-slate-800 px-3 py-1 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono">Code</span>
                <CopyButton text={content} />
             </div>
             <pre className="p-3 overflow-x-auto text-sm text-slate-200 font-mono whitespace-pre-wrap">
               {content}
             </pre>
          </div>
        );
      }
      return <p key={index} className="whitespace-pre-wrap mb-2 last:mb-0">{part}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
            <Bot className="w-16 h-16 mb-4" />
            <p className="text-center text-sm">Ask me to write code, explain topics, or draft documents.</p>
          </div>
        )}
        
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'} text-white shadow-sm`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
              {msg.role === 'user' ? msg.text : formatMessage(msg.text)}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 text-white">
                <Bot className="w-5 h-5" />
             </div>
             <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                <span className="text-xs text-slate-400">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length > 0 && (
         <div className="px-4 py-2 flex justify-end">
             <button onClick={handlePrint} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-lg transition-colors">
                 <FileDown className="w-4 h-4" /> Save as PDF
             </button>
         </div>
      )}

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-100 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 disabled:opacity-50 text-white rounded-xl w-12 flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;