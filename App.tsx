import React from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calculator, NotebookPen, Languages, BrainCircuit, Scale, 
  CheckSquare, DollarSign, Coins, Calendar, Percent, 
  Bot, Image as ImageIcon, Mic, ScanLine, Shield, 
  FileText, CloudSun, HeartPulse, LayoutGrid, Settings,
  ChevronLeft
} from 'lucide-react';

// Pages
import Home from './pages/Home';
import Notes from './pages/Notes';
import StandardCalculator from './pages/StandardCalculator';
import Translator from './pages/Translator';
import MathQuiz from './pages/MathQuiz';
import ActivityTracker from './pages/ActivityTracker';
import Converters from './pages/Converters';
import SimpleTools from './pages/SimpleTools';
import AIAssistant from './pages/AIAssistant';
import ImageGenerator from './pages/ImageGenerator';
import TextToSpeech from './pages/TextToSpeech';
import Scanner from './pages/Scanner';
import Security from './pages/Security';
import VoiceNotes from './pages/VoiceNotes';
import MediaTools from './pages/MediaTools';
import LifeTools from './pages/LifeTools';

export const TOOLS = [
  { id: 'ai-chat', name: 'AI Chat', icon: Bot, path: '/ai-chat', color: 'bg-indigo-600' },
  { id: 'scanner', name: 'Scanner', icon: ScanLine, path: '/scanner', color: 'bg-slate-800' },
  { id: 'notes', name: 'Notes', icon: NotebookPen, path: '/notes', color: 'bg-amber-500' },
  { id: 'security', name: 'Security', icon: Shield, path: '/security', color: 'bg-emerald-600' },
  { id: 'calc', name: 'Calculator', icon: Calculator, path: '/calculator', color: 'bg-orange-500' },
  { id: 'voice', name: 'Voice Notes', icon: Mic, path: '/voice', color: 'bg-rose-500' },
  { id: 'media', name: 'PDF & Img', icon: FileText, path: '/media', color: 'bg-blue-600' },
  { id: 'life', name: 'Life & Health', icon: HeartPulse, path: '/life', color: 'bg-cyan-500' },
  { id: 'math', name: 'Math Gen', icon: BrainCircuit, path: '/math', color: 'bg-violet-600' },
  { id: 'translate', name: 'Translator', icon: Languages, path: '/translator', color: 'bg-blue-500' },
  { id: 'img-gen', name: 'Image Gen', icon: ImageIcon, path: '/image-gen', color: 'bg-fuchsia-500' },
  { id: 'tts', name: 'TTS', icon: Mic, path: '/tts', color: 'bg-violet-500' },
  { id: 'unit', name: 'Converter', icon: Scale, path: '/converters', color: 'bg-teal-600' },
  { id: 'currency', name: 'Currency', icon: DollarSign, path: '/converters?tab=currency', color: 'bg-emerald-600' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const currentTool = TOOLS.find(t => location.pathname.startsWith(t.path.split('?')[0]));

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col mx-auto max-w-md shadow-2xl overflow-hidden relative text-slate-900 font-sans">
      {/* Header */}
      <header className={`flex items-center px-5 py-4 justify-between z-50 transition-all ${isHome ? 'bg-slate-50 pt-6' : 'bg-white shadow-sm'}`}>
        {isHome ? (
          <div className="flex flex-col">
            <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight">OmniTool <span className="text-indigo-600">Pro</span></h1>
            <span className="text-xs text-slate-500 font-medium">All-in-One Utility Suite</span>
          </div>
        ) : (
          <div className="flex items-center w-full">
            <button 
              onClick={() => navigate('/')} 
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors -ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>
            <h1 className="font-bold text-lg ml-3 flex-1">{currentTool?.name || 'Tool'}</h1>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative bg-slate-50">
        {children}
      </main>

      {/* Mobile Bottom Nav (Only on Home for categories or simple actions, otherwise hidden to max screen space) */}
      {!isHome && (
        <div className="h-6 bg-gradient-to-t from-slate-100/50 to-transparent pointer-events-none absolute bottom-0 w-full" />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/calculator" element={<StandardCalculator />} />
          <Route path="/translator" element={<Translator />} />
          <Route path="/math" element={<MathQuiz />} />
          <Route path="/activity" element={<ActivityTracker />} />
          <Route path="/converters" element={<Converters />} />
          <Route path="/tools" element={<SimpleTools />} />
          <Route path="/ai-chat" element={<AIAssistant />} />
          <Route path="/image-gen" element={<ImageGenerator />} />
          <Route path="/tts" element={<TextToSpeech />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/security" element={<Security />} />
          <Route path="/voice" element={<VoiceNotes />} />
          <Route path="/media" element={<MediaTools />} />
          <Route path="/life" element={<LifeTools />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;