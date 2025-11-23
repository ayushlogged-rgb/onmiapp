import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SimpleTools: React.FC = () => {
  const location = useLocation();
  const tab = new URLSearchParams(location.search).get('tab') || 'age';
  const [activeTab, setActiveTab] = useState(tab);

  useEffect(() => setActiveTab(tab), [tab]);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        {['age', 'gst', 'tip'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-2 text-sm font-bold capitalize rounded-lg transition-all ${activeTab === t ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        {activeTab === 'age' && <AgeCalc />}
        {activeTab === 'gst' && <GstCalc />}
        {activeTab === 'tip' && <TipCalc />}
      </div>
    </div>
  );
};

const AgeCalc = () => {
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<{y: number, m: number, d: number} | null>(null);

  const calculate = () => {
    if(!dob) return;
    const birth = new Date(dob);
    const now = new Date();
    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) y--;
    if (m < 0) m += 12;
    if (d < 0) {
       const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
       d += prevMonth.getDate();
       m--;
    }
    setAge({ y, m, d });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Age Calculator</h3>
      <div>
        <label className="block text-sm font-medium text-slate-500 mb-2">Date of Birth</label>
        <input 
          type="date" 
          value={dob}
          onChange={e => setDob(e.target.value)}
          className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-purple-500"
        />
      </div>
      <button onClick={calculate} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-200">Calculate Age</button>
      
      {age && (
        <div className="grid grid-cols-3 gap-2 text-center mt-4">
          <div className="bg-purple-50 p-3 rounded-xl">
            <span className="block text-2xl font-bold text-purple-700">{age.y}</span>
            <span className="text-xs text-purple-400 font-bold uppercase">Years</span>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl">
            <span className="block text-2xl font-bold text-purple-700">{age.m}</span>
            <span className="text-xs text-purple-400 font-bold uppercase">Months</span>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl">
            <span className="block text-2xl font-bold text-purple-700">{age.d}</span>
            <span className="text-xs text-purple-400 font-bold uppercase">Days</span>
          </div>
        </div>
      )}
    </div>
  );
};

const GstCalc = () => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('18');
  const [type, setType] = useState<'add' | 'remove'>('add');

  const amt = parseFloat(amount) || 0;
  const r = parseFloat(rate) || 0;
  
  let gstAmt = 0;
  let netAmt = 0;

  if (type === 'add') {
    gstAmt = (amt * r) / 100;
    netAmt = amt + gstAmt;
  } else {
    gstAmt = amt - (amt * (100 / (100 + r)));
    netAmt = amt - gstAmt;
  }

  return (
    <div className="space-y-6">
       <h3 className="text-xl font-bold text-slate-800">GST Calculator</h3>
       <div className="flex bg-slate-100 p-1 rounded-lg">
         <button onClick={() => setType('add')} className={`flex-1 py-1.5 text-xs font-bold rounded-md ${type === 'add' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-400'}`}>Add GST</button>
         <button onClick={() => setType('remove')} className={`flex-1 py-1.5 text-xs font-bold rounded-md ${type === 'remove' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-400'}`}>Remove GST</button>
       </div>
       <div className="grid grid-cols-2 gap-4">
         <div>
           <label className="text-xs font-bold text-slate-400">Amount</label>
           <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 rounded-xl outline-none border focus:border-teal-500" placeholder="0" />
         </div>
         <div>
           <label className="text-xs font-bold text-slate-400">GST %</label>
           <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 rounded-xl outline-none border focus:border-teal-500" placeholder="18" />
         </div>
       </div>

       <div className="bg-teal-50 p-4 rounded-xl space-y-2">
         <div className="flex justify-between text-sm">
           <span className="text-teal-600">GST Amount</span>
           <span className="font-bold">{gstAmt.toFixed(2)}</span>
         </div>
         <div className="flex justify-between text-lg font-bold border-t border-teal-100 pt-2">
           <span className="text-teal-800">Total</span>
           <span>{type === 'add' ? netAmt.toFixed(2) : netAmt.toFixed(2)}</span>
         </div>
       </div>
    </div>
  );
};

const TipCalc = () => {
  const [bill, setBill] = useState('');
  const [tip, setTip] = useState(15);
  const [people, setPeople] = useState(1);

  const b = parseFloat(bill) || 0;
  const totalTip = (b * tip) / 100;
  const total = b + totalTip;
  const perPerson = total / (people || 1);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Tip Calculator</h3>
      <div>
        <label className="text-xs font-bold text-slate-400">Bill Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-3.5 text-slate-400">$</span>
          <input type="number" value={bill} onChange={e => setBill(e.target.value)} className="w-full p-3 pl-7 bg-slate-50 rounded-xl outline-none border focus:border-pink-500 text-lg font-semibold" placeholder="0.00" />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
           <label className="text-xs font-bold text-slate-400">Tip %</label>
           <span className="text-xs font-bold text-pink-600">{tip}%</span>
        </div>
        <input type="range" min="0" max="50" value={tip} onChange={e => setTip(parseInt(e.target.value))} className="w-full accent-pink-500" />
      </div>

      <div className="flex items-center gap-4">
        <label className="text-xs font-bold text-slate-400 whitespace-nowrap">Split by</label>
        <div className="flex items-center gap-3 bg-slate-100 px-3 py-1 rounded-lg">
          <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600">-</button>
          <span className="font-bold w-4 text-center">{people}</span>
          <button onClick={() => setPeople(people + 1)} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600">+</button>
        </div>
      </div>

      <div className="bg-pink-600 text-white p-4 rounded-xl text-center shadow-lg shadow-pink-200">
        <span className="text-sm opacity-80 uppercase tracking-wider font-medium">Per Person</span>
        <div className="text-4xl font-bold mt-1">${perPerson.toFixed(2)}</div>
        <div className="text-xs opacity-60 mt-2">Total Bill: ${total.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default SimpleTools;