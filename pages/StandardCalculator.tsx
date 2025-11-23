import React, { useState } from 'react';
import { Delete, History } from 'lucide-react';

const StandardCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string>('');
  const [isSci, setIsSci] = useState(false);

  const handlePress = (val: string) => {
    if (val === 'AC') {
      setDisplay('0');
      setHistory('');
    } else if (val === 'DEL') {
      setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (val === '=') {
      try {
        // Safe evaluation for basic math
        // eslint-disable-next-line no-eval
        const result = eval(display.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E').replace(/√/g, 'Math.sqrt'));
        setHistory(display);
        setDisplay(String(Number(result.toFixed(8)))); // Limit decimals
      } catch (e) {
        setDisplay('Error');
      }
    } else if (['sin', 'cos', 'tan', 'log'].includes(val)) {
       setDisplay(prev => {
         const func = val === 'log' ? 'Math.log10(' : `Math.${val}(`;
         return prev === '0' ? func : prev + func;
       });
    } else {
      setDisplay(prev => prev === '0' || prev === 'Error' ? val : prev + val);
    }
  };

  const Btn = ({ v, c, span }: { v: string, c?: string, span?: boolean }) => (
    <button 
      onClick={() => handlePress(v)}
      className={`${span ? 'col-span-2' : ''} h-16 rounded-2xl text-xl font-medium active:scale-95 transition-transform flex items-center justify-center ${c || 'bg-slate-100 text-slate-700'}`}
    >
      {v === 'DEL' ? <Delete className="w-6 h-6" /> : v}
    </button>
  );

  return (
    <div className="h-full flex flex-col p-4">
      <div className="bg-slate-900 rounded-3xl p-6 mb-4 flex-1 flex flex-col justify-end items-end shadow-lg">
        <div className="text-slate-400 text-sm mb-2 h-6 font-mono flex items-center gap-2">
          {history && <History className="w-3 h-3" />} {history}
        </div>
        <div className="text-5xl font-light text-white break-all text-right w-full">
          {display}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-slate-500 text-sm">Mode</span>
        <button 
          onClick={() => setIsSci(!isSci)} 
          className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
        >
          {isSci ? 'Scientific' : 'Standard'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {isSci && (
          <>
            <Btn v="(" c="bg-slate-200" />
            <Btn v=")" c="bg-slate-200" />
            <Btn v="π" c="bg-slate-200" />
            <Btn v="√" c="bg-slate-200" />
            <Btn v="sin" c="bg-slate-200" />
            <Btn v="cos" c="bg-slate-200" />
            <Btn v="tan" c="bg-slate-200" />
            <Btn v="log" c="bg-slate-200" />
          </>
        )}
        <Btn v="AC" c="bg-red-100 text-red-600" />
        <Btn v="DEL" c="bg-red-100 text-red-600" />
        <Btn v="%" c="bg-slate-200 text-slate-900" />
        <Btn v="÷" c="bg-orange-100 text-orange-600" />
        
        <Btn v="7" />
        <Btn v="8" />
        <Btn v="9" />
        <Btn v="×" c="bg-orange-100 text-orange-600" />
        
        <Btn v="4" />
        <Btn v="5" />
        <Btn v="6" />
        <Btn v="-" c="bg-orange-100 text-orange-600" />
        
        <Btn v="1" />
        <Btn v="2" />
        <Btn v="3" />
        <Btn v="+" c="bg-orange-100 text-orange-600" />
        
        <Btn v="0" span />
        <Btn v="." />
        <Btn v="=" c="bg-orange-500 text-white shadow-lg shadow-orange-200" />
      </div>
    </div>
  );
};

export default StandardCalculator;