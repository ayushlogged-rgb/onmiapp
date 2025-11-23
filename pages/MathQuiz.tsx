import React, { useState } from 'react';
import { generateMathQuestions } from '../services/geminiService';
import { MathQuestion } from '../types';
import { BrainCircuit, CheckCircle, XCircle, RefreshCw, ChevronRight } from 'lucide-react';

const TOPICS = ["Algebra", "Geometry", "Calculus", "Arithmetic", "Trigonometry"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const MathQuiz: React.FC = () => {
  const [topic, setTopic] = useState("Arithmetic");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const startQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    
    const qs = await generateMathQuestions(topic, difficulty);
    setQuestions(qs);
    setLoading(false);
  };

  const handleAnswer = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    if (option === questions[currentIndex].answer) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // End screen logic handled in render
      setCurrentIndex(c => c + 1); 
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Generating Quiz</h3>
        <p className="text-slate-500">Consulting AI for {difficulty} {topic} problems...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-6 flex flex-col h-full">
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Math Generator</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">Topic</label>
              <div className="grid grid-cols-2 gap-2">
                {TOPICS.map(t => (
                  <button 
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${topic === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">Difficulty</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${difficulty === d ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={startQuiz}
          className="w-full bg-indigo-600 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <BrainCircuit className="w-5 h-5" /> Generate Questions
        </button>
      </div>
    );
  }

  if (currentIndex >= questions.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h3 className="text-3xl font-bold text-slate-800 mb-2">{score} / {questions.length}</h3>
        <p className="text-slate-500 mb-8">Great job! You've completed the quiz.</p>
        <button 
          onClick={() => setQuestions([])}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition"
        >
          New Quiz
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">{topic} • {difficulty}</span>
        <span className="text-sm font-medium text-slate-400">Q{currentIndex + 1}/{questions.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let stateClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
            if (selectedOption) {
              if (opt === currentQ.answer) stateClass = 'bg-green-100 border-green-500 text-green-800';
              else if (opt === selectedOption) stateClass = 'bg-red-100 border-red-500 text-red-800';
              else stateClass = 'bg-slate-50 border-slate-100 text-slate-400 opacity-50';
            }

            return (
              <button
                key={idx}
                disabled={!!selectedOption}
                onClick={() => handleAnswer(opt)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium flex justify-between items-center ${stateClass}`}
              >
                <span>{opt}</span>
                {selectedOption && opt === currentQ.answer && <CheckCircle className="w-5 h-5 text-green-600" />}
                {selectedOption && opt === selectedOption && opt !== currentQ.answer && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 leading-relaxed animate-in fade-in slide-in-from-bottom-2">
            <span className="font-bold block mb-1">Explanation:</span>
            {currentQ.explanation}
          </div>
        )}
      </div>

      {showExplanation && (
        <button 
          onClick={nextQuestion}
          className="mt-4 w-full bg-indigo-600 text-white h-14 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Next Question <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default MathQuiz;