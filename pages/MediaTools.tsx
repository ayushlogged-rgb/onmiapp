import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import { FileDown, Image as ImageIcon, Plus, Scissors, Layers } from 'lucide-react';

const MediaTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'resize'>('pdf');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [width, setWidth] = useState(800);
  const [quality, setQuality] = useState(0.8);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const files = Array.from(e.target.files);
          files.forEach(file => {
              const reader = new FileReader();
              reader.onload = (ev) => {
                  setSelectedImages(prev => [...prev, ev.target?.result as string]);
              };
              reader.readAsDataURL(file as Blob);
          });
      }
  };

  const generatePDF = () => {
      if (selectedImages.length === 0) return;
      const doc = new jsPDF();
      selectedImages.forEach((img, index) => {
          if (index > 0) doc.addPage();
          const imgProps = doc.getImageProperties(img);
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          doc.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      });
      doc.save("generated-doc.pdf");
  };

  const resizeImage = async () => {
      if (selectedImages.length === 0) return;
      const img = new Image();
      img.src = selectedImages[0];
      img.onload = () => {
          const canvas = document.createElement('canvas');
          const scaleFactor = width / img.width;
          canvas.width = width;
          canvas.height = img.height * scaleFactor;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const link = document.createElement('a');
          link.download = 'resized.jpg';
          link.href = canvas.toDataURL('image/jpeg', quality);
          link.click();
      }
  };

  return (
      <div className="h-full flex flex-col p-4">
          <div className="flex bg-slate-200 p-1 rounded-2xl mb-4">
              <button onClick={() => { setActiveTab('pdf'); setSelectedImages([]); }} className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'pdf' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>PDF Maker</button>
              <button onClick={() => { setActiveTab('resize'); setSelectedImages([]); }} className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'resize' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Image Resizer</button>
          </div>

          <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
              {selectedImages.length > 0 ? (
                  <div className="flex-1 overflow-y-auto mb-4 grid grid-cols-2 gap-2">
                      {selectedImages.map((img, i) => (
                          <img key={i} src={img} className="w-full h-32 object-cover rounded-lg border border-slate-100" />
                      ))}
                  </div>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-2xl mb-4">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">Select Images</span>
                  </div>
              )}

              <div className="space-y-3">
                  <input type="file" accept="image/*" multiple={activeTab === 'pdf'} onChange={handleImageSelect} className="hidden" id="img-upload" />
                  <label htmlFor="img-upload" className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                      <Plus className="w-5 h-5" /> Add Images
                  </label>

                  {activeTab === 'resize' && selectedImages.length > 0 && (
                      <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                          <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Width (px)</label>
                              <input type="number" value={width} onChange={e => setWidth(parseInt(e.target.value))} className="w-full mt-1 p-2 bg-white border rounded-lg" />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Quality ({Math.round(quality*100)}%)</label>
                              <input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                          </div>
                          <button onClick={resizeImage} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200">Download Resized</button>
                      </div>
                  )}

                  {activeTab === 'pdf' && selectedImages.length > 0 && (
                      <button onClick={generatePDF} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                          <FileDown className="w-5 h-5" /> Generate PDF
                      </button>
                  )}
              </div>
          </div>
      </div>
  );
};

export default MediaTools;