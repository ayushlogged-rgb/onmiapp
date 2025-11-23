import React, { useState, useEffect } from 'react';
import { CloudSun, Activity, Clipboard, MapPin, Copy } from 'lucide-react';

const LifeTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('weather');

  return (
    <div className="h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            {[
                { id: 'weather', icon: CloudSun },
                { id: 'bmi', icon: Activity },
                { id: 'clipboard', icon: Clipboard }
            ].map(t => (
                <button 
                    key={t.id} 
                    onClick={() => setActiveTab(t.id)}
                    className={`p-3 rounded-xl transition-all ${activeTab === t.id ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400'}`}
                >
                    <t.icon className="w-6 h-6" />
                </button>
            ))}
        </div>

        <div className="flex-1">
            {activeTab === 'weather' && <WeatherModule />}
            {activeTab === 'bmi' && <BMIModule />}
            {activeTab === 'clipboard' && <ClipboardModule />}
        </div>
    </div>
  );
};

const WeatherModule = () => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                const data = await res.json();
                setWeather(data.current_weather);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }, () => setLoading(false));
    }, []);

    if (loading) return <div className="text-center py-10 text-slate-400">Locating...</div>;

    return (
        <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl p-8 text-white shadow-xl shadow-cyan-200 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-2 opacity-80 mb-4">
                    <MapPin className="w-4 h-4" /> <span>Current Location</span>
                </div>
                <div className="text-6xl font-bold mb-2">{weather?.temperature || '--'}°</div>
                <div className="text-xl font-medium opacity-90">Wind: {weather?.windspeed} km/h</div>
            </div>
            <CloudSun className="absolute -right-6 -top-6 w-40 h-40 opacity-20 text-white" />
        </div>
    );
};

const BMIModule = () => {
    const [h, setH] = useState('');
    const [w, setW] = useState('');
    const bmi = (parseFloat(w) / ((parseFloat(h)/100) ** 2)).toFixed(1);
    const val = parseFloat(bmi);

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-lg">BMI Calculator</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-400">Height (cm)</label>
                    <input type="number" value={h} onChange={e => setH(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl mt-1 outline-none" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400">Weight (kg)</label>
                    <input type="number" value={w} onChange={e => setW(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl mt-1 outline-none" />
                </div>
            </div>
            {h && w && (
                <div className={`p-4 rounded-2xl text-center text-white shadow-lg mt-4 ${val < 18.5 ? 'bg-blue-400' : val < 25 ? 'bg-emerald-500' : 'bg-orange-500'}`}>
                    <div className="text-4xl font-bold">{bmi}</div>
                    <div className="text-sm font-medium opacity-90">{val < 18.5 ? 'Underweight' : val < 25 ? 'Healthy' : 'Overweight'}</div>
                </div>
            )}
        </div>
    );
};

const ClipboardModule = () => {
    const [history, setHistory] = useState<string[]>([]);

    const paste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && !history.includes(text)) setHistory([text, ...history]);
        } catch (e) {
            alert("Permission required to read clipboard");
        }
    };

    return (
        <div className="space-y-4">
            <button onClick={paste} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition">Paste from Clipboard</button>
            <div className="space-y-2">
                {history.map((text, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center text-sm">
                        <span className="truncate max-w-[200px]">{text}</span>
                        <button onClick={() => navigator.clipboard.writeText(text)}><Copy className="w-4 h-4 text-slate-400" /></button>
                    </div>
                ))}
                {history.length === 0 && <div className="text-center text-slate-400 text-sm py-4">History empty</div>}
            </div>
        </div>
    );
};

export default LifeTools;