import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Download, Loader2, AlertCircle } from 'lucide-react';
import { generateImage } from '../services/geminiService';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    setImage(null);
    
    const result = await generateImage(prompt);
    
    if (result) {
      setImage(result);
    } else {
      setError('Failed to generate image. Please try a different prompt.');
    }
    setLoading(false);
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Image Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate (e.g., 'A futuristic city with flying cars at sunset')"
          className="w-full h-24 resize-none outline-none text-slate-700 bg-transparent placeholder:text-slate-300"
        />
        <div className="flex justify-end mt-2">
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="bg-fuchsia-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold shadow-md shadow-fuchsia-200 flex items-center gap-2 active:scale-95 transition-all"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate
            </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg group">
        {loading ? (
           <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-fuchsia-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm animate-pulse">Creating your masterpiece...</p>
           </div>
        ) : image ? (
            <>
                <img src={image} alt="Generated" className="w-full h-full object-contain" />
                <button 
                    onClick={downloadImage}
                    className="absolute bottom-4 right-4 bg-white text-slate-900 px-4 py-2 rounded-lg font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                >
                    <Download className="w-4 h-4" /> Save
                </button>
            </>
        ) : (
            <div className="text-center p-6">
                {error ? (
                    <div className="text-red-400 flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8" />
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="text-slate-600 flex flex-col items-center gap-2">
                        <ImageIcon className="w-12 h-12 opacity-50" />
                        <p>Your generated image will appear here</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;