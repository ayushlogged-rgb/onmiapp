import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, FileText, Loader2, Trash2 } from 'lucide-react';
import { transcribeAudio } from '../services/geminiService';

interface Recording {
    id: string;
    blob: Blob;
    url: string;
    date: string;
    duration: number;
    transcription?: string;
}

const VoiceNotes: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorderRef.current = new MediaRecorder(stream);
          chunksRef.current = [];
          
          mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
          mediaRecorderRef.current.onstop = () => {
              const blob = new Blob(chunksRef.current, { type: 'audio/mp3' });
              const url = URL.createObjectURL(blob);
              setRecordings(prev => [{
                  id: Date.now().toString(),
                  blob,
                  url,
                  date: new Date().toLocaleString(),
                  duration: timer
              }, ...prev]);
              setTimer(0);
          };

          mediaRecorderRef.current.start();
          setIsRecording(true);
          timerRef.current = window.setInterval(() => setTimer(t => t + 1), 1000);
      } catch (e) {
          alert("Microphone access denied");
      }
  };

  const stopRecording = () => {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTranscribe = async (rec: Recording) => {
      setLoading(rec.id);
      const reader = new FileReader();
      reader.readAsDataURL(rec.blob);
      reader.onloadend = async () => {
          const base64data = reader.result as string;
          const content = base64data.split(',')[1]; // remove data:audio/x;base64,
          const text = await transcribeAudio(content, rec.blob.type || 'audio/mp3');
          
          setRecordings(prev => prev.map(r => r.id === rec.id ? { ...r, transcription: text } : r));
          setLoading(null);
      };
  };

  const formatTime = (s: number) => {
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = (rec: Recording) => {
      if (playing === rec.id) {
          audioRef.current?.pause();
          setPlaying(null);
      } else {
          if (audioRef.current) audioRef.current.pause();
          const audio = new Audio(rec.url);
          audio.onended = () => setPlaying(null);
          audio.play();
          audioRef.current = audio;
          setPlaying(rec.id);
      }
  };

  return (
    <div className="h-full flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-3 pb-24">
            {recordings.length === 0 && (
                <div className="text-center mt-20 text-slate-400">
                    <Mic className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Tap mic to record</p>
                </div>
            )}
            
            {recordings.map(rec => (
                <div key={rec.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <button onClick={() => togglePlay(rec)} className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                                {playing === rec.id ? <Pause className="w-4 h-4 fill-current"/> : <Play className="w-4 h-4 fill-current ml-1"/>}
                            </button>
                            <div>
                                <div className="font-bold text-slate-800">Voice Note</div>
                                <div className="text-xs text-slate-400">{rec.date} • {formatTime(rec.duration)}</div>
                            </div>
                        </div>
                        <button onClick={() => setRecordings(prev => prev.filter(r => r.id !== rec.id))} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                    </div>

                    {rec.transcription ? (
                        <div className="bg-slate-50 p-3 rounded-xl text-sm text-slate-600 mt-3 border border-slate-100">
                            {rec.transcription}
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleTranscribe(rec)} 
                            disabled={loading === rec.id}
                            className="w-full mt-2 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center justify-center gap-2"
                        >
                            {loading === rec.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <FileText className="w-3 h-3"/>}
                            Transcribe Audio
                        </button>
                    )}
                </div>
            ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 to-transparent flex justify-center">
            {isRecording ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl font-mono font-bold text-rose-600 animate-pulse">{formatTime(timer)}</div>
                    <button onClick={stopRecording} className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-200 hover:scale-105 transition-transform">
                        <Square className="w-6 h-6 fill-current" />
                    </button>
                </div>
            ) : (
                <button onClick={startRecording} className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                    <Mic className="w-7 h-7" />
                </button>
            )}
        </div>
    </div>
  );
};

export default VoiceNotes;