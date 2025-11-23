import React, { useState, useRef } from 'react';
import { Mic, Play, Square, Loader2, Volume2 } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

const VOICES = [
  { id: 'Puck', name: 'Puck (Soft)' },
  { id: 'Charon', name: 'Charon (Deep)' },
  { id: 'Kore', name: 'Kore (Calm)' },
  { id: 'Fenrir', name: 'Fenrir (Energetic)' }
];

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Puck');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleGenerateAndPlay = async () => {
    if (!text.trim()) return;
    
    // Stop current playback
    if (sourceRef.current) {
        sourceRef.current.stop();
        setIsPlaying(false);
    }

    setLoading(true);
    const base64Audio = await generateSpeech(text, voice);
    setLoading(false);

    if (base64Audio) {
        playAudio(base64Audio);
    }
  };

  const playAudio = async (base64: string) => {
    try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        }
        
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsPlaying(false);
        
        sourceRef.current = source;
        source.start(0);
        setIsPlaying(true);
    } catch (e) {
        console.error("Audio playback error", e);
    }
  };

  const stopAudio = () => {
    if (sourceRef.current) {
        sourceRef.current.stop();
        setIsPlaying(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          className="flex-1 w-full resize-none outline-none text-slate-700 text-lg placeholder:text-slate-300 bg-transparent"
        />
        <div className="text-right text-xs text-slate-400 mt-2">
            No word limit
        </div>
      </div>

      <div className="space-y-4">
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Select Voice</label>
            <div className="grid grid-cols-2 gap-2">
                {VOICES.map(v => (
                    <button
                        key={v.id}
                        onClick={() => setVoice(v.id)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all text-left flex items-center gap-2 ${
                            voice === v.id 
                            ? 'bg-violet-600 text-white border-violet-600 shadow-md' 
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                    >
                        <span className={`w-3 h-3 rounded-full ${voice === v.id ? 'bg-white' : 'bg-slate-300'}`} />
                        {v.name}
                    </button>
                ))}
            </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}>
                    <Volume2 className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-sm font-bold">Audio Output</div>
                    <div className="text-xs text-slate-400">{isPlaying ? 'Playing...' : 'Ready'}</div>
                </div>
             </div>

             {isPlaying ? (
                 <button onClick={stopAudio} className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center active:scale-95 transition">
                     <Square className="w-5 h-5 fill-current" />
                 </button>
             ) : (
                 <button 
                    onClick={handleGenerateAndPlay} 
                    disabled={loading || !text}
                    className="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center disabled:opacity-50 active:scale-95 transition"
                >
                     {loading ? <Loader2 className="w-6 h-6 animate-spin text-violet-600" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                 </button>
             )}
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;