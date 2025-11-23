import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';

const UNITS: Record<string, Record<string, number>> = {
  'Length': { 'Meters': 1, 'Feet': 3.28084, 'Inches': 39.3701, 'Kilometers': 0.001, 'Miles': 0.000621371 },
  'Weight': { 'Kilograms': 1, 'Pounds': 2.20462, 'Ounces': 35.274, 'Grams': 1000 },
  'Temp': { 'Celsius': 1, 'Fahrenheit': 0, 'Kelvin': 0 } // Custom logic for temp handled separately
};

// Hardcoded Approx Rates (In real app, fetch from API)
const CURRENCIES: Record<string, number> = {
  'USD': 1, 'EUR': 0.92, 'GBP': 0.79, 'JPY': 150.5, 'INR': 83.1, 'CAD': 1.35, 'AUD': 1.52
};

const Converters: React.FC = () => {
  const location = useLocation();
  const isCurrency = new URLSearchParams(location.search).get('tab') === 'currency';
  
  const [category, setCategory] = useState(isCurrency ? 'Currency' : 'Length');
  const [val, setVal] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState(isCurrency ? 'USD' : 'Meters');
  const [toUnit, setToUnit] = useState(isCurrency ? 'EUR' : 'Feet');

  const convert = () => {
    const v = parseFloat(val);
    if (isNaN(v)) return '---';

    if (category === 'Currency') {
       // Convert from Base USD then to Target
       const inUSD = v / CURRENCIES[fromUnit];
       return (inUSD * CURRENCIES[toUnit]).toFixed(2);
    }

    if (category === 'Temp') {
      if (fromUnit === toUnit) return v.toString();
      let c = v;
      if (fromUnit === 'Fahrenheit') c = (v - 32) * 5/9;
      if (fromUnit === 'Kelvin') c = v - 273.15;
      
      if (toUnit === 'Celsius') return c.toFixed(2);
      if (toUnit === 'Fahrenheit') return ((c * 9/5) + 32).toFixed(2);
      if (toUnit === 'Kelvin') return (c + 273.15).toFixed(2);
      return v.toString();
    }

    const base = v / UNITS[category][fromUnit];
    return (base * UNITS[category][toUnit]).toFixed(4);
  };

  const categories = isCurrency ? ['Currency'] : Object.keys(UNITS);
  const units = isCurrency ? Object.keys(CURRENCIES) : Object.keys(UNITS[category]);

  return (
    <div className="p-4 h-full flex flex-col">
      {!isCurrency && (
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(c => (
            <button 
              key={c}
              onClick={() => { setCategory(c); setFromUnit(Object.keys(UNITS[c])[0]); setToUnit(Object.keys(UNITS[c])[1]); }}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${category === c ? 'bg-cyan-600 text-white' : 'bg-white border text-slate-500'}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <label className="text-xs font-bold text-slate-400 uppercase">From</label>
          <div className="flex items-end gap-2 mt-2">
            <input 
              type="number" 
              value={val}
              onChange={e => setVal(e.target.value)}
              className="flex-1 text-3xl font-bold text-slate-800 outline-none border-b border-slate-200 focus:border-cyan-500 transition-colors pb-1"
            />
            <select 
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="w-1/3 bg-slate-50 text-sm font-semibold text-slate-600 p-2 rounded-lg outline-none"
            >
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-center -my-3 z-10">
          <div className="bg-slate-100 p-2 rounded-full border-4 border-slate-50">
             <ArrowLeftRight className="w-6 h-6 text-slate-400 rotate-90" />
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">
          <label className="text-xs font-bold text-slate-400 uppercase">To</label>
          <div className="flex items-end gap-2 mt-2">
            <div className="flex-1 text-3xl font-bold text-white pb-1 overflow-hidden text-ellipsis">
              {convert()}
            </div>
            <select 
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="w-1/3 bg-slate-800 text-sm font-semibold text-white p-2 rounded-lg outline-none border border-slate-700"
            >
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converters;