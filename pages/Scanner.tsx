import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Maximize, Check, X, QrCode, FileText, Image as ImageIcon, Copy, AlertTriangle } from 'lucide-react';

const Scanner: React.FC = () => {
  const [mode, setMode] = useState<'doc' | 'qr'>('doc');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [filter, setFilter] = useState<'none' | 'grayscale' | 'contrast'>('none');
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (mode === 'qr' && !qrResult) {
      const interval = setInterval(detectQR, 500);
      return () => clearInterval(interval);
    }
  }, [mode, qrResult, stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e) {
      console.error("Camera error", e);
      setError("Camera permission denied. Please allow access.");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const vid = videoRef.current;
    const cvs = canvasRef.current;
    cvs.width = vid.videoWidth;
    cvs.height = vid.videoHeight;
    const ctx = cvs.getContext('2d');
    if (ctx) {
      ctx.drawImage(vid, 0, 0);
      setCapturedImage(cvs.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  const detectQR = async () => {
    if (!videoRef.current || !('BarcodeDetector' in window)) return;
    
    try {
      // @ts-ignore - BarcodeDetector is experimental
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      const bitmaps = await detector.detect(videoRef.current);
      if (bitmaps.length > 0) {
        setQrResult(bitmaps[0].rawValue);
      }
    } catch (e) {
      // Fallback or ignore
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setQrResult(null);
    startCamera();
  };

  const applyFilter = () => {
      // Re-draw canvas with filter
      if (!canvasRef.current || !capturedImage) return;
      const img = new Image();
      img.src = capturedImage;
      img.onload = () => {
          const cvs = canvasRef.current!;
          const ctx = cvs.getContext('2d')!;
          ctx.filter = filter === 'none' ? 'grayscale(100%)' : filter === 'grayscale' ? 'contrast(200%)' : 'none';
          setFilter(filter === 'none' ? 'grayscale' : filter === 'grayscale' ? 'contrast' : 'none');
          ctx.drawImage(img, 0, 0);
          // Update state visual only, keeping original for now
      }
  };

  return (
    <div className="h-full bg-black flex flex-col relative overflow-hidden">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-center gap-4 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => setMode('doc')} className={`px-4 py-1 rounded-full text-sm font-bold backdrop-blur-md ${mode === 'doc' ? 'bg-white text-black' : 'bg-white/20 text-white'}`}>Document</button>
        <button onClick={() => setMode('qr')} className={`px-4 py-1 rounded-full text-sm font-bold backdrop-blur-md ${mode === 'qr' ? 'bg-white text-black' : 'bg-white/20 text-white'}`}>QR Code</button>
      </div>

      {/* Viewport */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-900">
        {error ? (
          <div className="text-center p-6 text-white">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Permission Denied</h3>
            <p className="text-slate-400 text-sm">{error}</p>
            <button onClick={startCamera} className="mt-4 bg-indigo-600 px-6 py-2 rounded-xl font-bold">Try Again</button>
          </div>
        ) : (
          <>
            {!capturedImage && (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
            )}
            
            {/* QR Overlay */}
            {mode === 'qr' && !qrResult && !capturedImage && !error && (
              <div className="absolute w-64 h-64 border-2 border-indigo-500 rounded-3xl z-10 flex items-center justify-center">
                  <div className="w-60 h-1 bg-indigo-500 absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
              </div>
            )}

            {/* Captured Image View */}
            {capturedImage && (
                <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                    <img 
                        src={capturedImage} 
                        className={`max-w-full max-h-full object-contain transition-all duration-300 ${filter === 'grayscale' ? 'grayscale' : filter === 'contrast' ? 'contrast-[2]' : ''}`} 
                    />
                    <div className="absolute bottom-20 left-0 right-0 flex justify-center">
                        <span className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-mono uppercase">{filter} Mode</span>
                    </div>
                </div>
            )}
          </>
        )}

        {/* QR Result Modal */}
        {qrResult && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center animate-slide-up">
                    <QrCode className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                    <h3 className="font-bold text-lg mb-2 break-all">{qrResult}</h3>
                    <div className="flex gap-2 mt-6">
                        <button onClick={() => navigator.clipboard.writeText(qrResult)} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Copy className="w-4 h-4"/> Copy</button>
                        <button onClick={retake} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">Scan Again</button>
                    </div>
                </div>
            </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Bottom Controls */}
      <div className="bg-slate-900 p-6 flex justify-between items-center h-32">
        {capturedImage ? (
            <>
                <button onClick={retake} className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center"><RefreshCw className="w-5 h-5"/></button>
                <button onClick={applyFilter} className="flex flex-col items-center text-white gap-1">
                    <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center"><ImageIcon className="w-6 h-6"/></div>
                    <span className="text-[10px] font-bold uppercase">Filter</span>
                </button>
                <button onClick={() => setCapturedImage(null)} className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center"><Check className="w-6 h-6"/></button>
            </>
        ) : !error && (
            <div className="w-full flex justify-center">
                <button onClick={capture} className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center relative group">
                    <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;