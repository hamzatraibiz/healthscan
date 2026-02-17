
import React from 'react';
import { HealthAnalysis } from '../types';

interface ResultCardProps {
  data: HealthAnalysis;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-lime-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case 'Excellent': return 'bg-emerald-500 text-white shadow-emerald-100';
      case 'Bon': return 'bg-lime-500 text-white shadow-lime-100';
      case 'Médiocre': return 'bg-amber-500 text-white shadow-amber-100';
      case 'Mauvais': return 'bg-rose-500 text-white shadow-rose-100';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Hero Header Card */}
      <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-50">
        <div className="p-8 sm:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div className="flex-1">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight leading-tight">{data.productName}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-lg ${getVerdictStyles(data.verdict)}`}>
                  {data.verdict}
                </span>
                <span className="text-slate-400 font-bold text-sm">Analyse certifiée par IA</span>
              </div>
            </div>
            <div className="relative group">
              <div className={`absolute inset-0 blur-2xl opacity-20 ${getScoreColor(data.healthScore).replace('text', 'bg')} transition-all group-hover:scale-110`} />
              <div className="relative bg-slate-50 rounded-3xl p-6 flex flex-col items-center justify-center min-w-[140px] border border-white">
                <span className={`text-6xl font-black ${getScoreColor(data.healthScore)}`}>{data.healthScore}</span>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mt-1">Health Score</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Nutrients */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Profil Nutritionnel
                </h3>
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="font-bold text-slate-600">Calories</span>
                    <span className="text-xl font-black text-slate-900">{data.calories}</span>
                  </div>
                  {data.nutrients.map((n, i) => (
                    <div key={i} className="flex justify-between items-center group">
                      <span className="text-slate-500 font-medium group-hover:text-slate-900 transition-colors">{n.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800">{n.value}</span>
                        <div className={`w-3 h-3 rounded-full shadow-sm ${n.impact === 'positive' ? 'bg-emerald-500' : n.impact === 'negative' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Points Positifs</h3>
                <div className="grid grid-cols-1 gap-3">
                  {data.pros.map((pro, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">✓</div>
                      <span className="text-sm font-semibold text-emerald-900">{pro}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Warnings & Advice */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Points de Vigilance</h3>
                <div className="grid grid-cols-1 gap-3">
                  {data.cons.map((con, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold shrink-0">!</div>
                      <span className="text-sm font-semibold text-rose-900">{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              {data.additives.length > 0 && (
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Additifs</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.additives.map((add, i) => (
                      <span key={i} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-widest uppercase">
                        {add}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[32px] text-white shadow-xl shadow-slate-200">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                     <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                     </svg>
                   </div>
                   <h3 className="font-bold text-lg">Alternative Saine</h3>
                </div>
                <p className="text-slate-300 text-sm italic mb-4 leading-relaxed">"Nous vous recommandons de privilégier :"</p>
                <div className="space-y-2">
                  {data.alternatives.map((alt, i) => (
                    <div key={i} className="flex items-center gap-2 text-emerald-400 font-bold">
                      <span className="text-lg">→</span> {alt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-blue-50/50 rounded-[32px] border border-blue-100">
             <div className="flex items-start gap-4">
                <span className="text-3xl">📝</span>
                <div>
                  <h4 className="font-black text-blue-900 text-sm uppercase tracking-widest mb-2">Verdict Final & Conseil</h4>
                  <p className="text-blue-800 leading-relaxed font-medium">
                    {data.recommendation}
                  </p>
                </div>
             </div>
          </div>

          <button 
            onClick={onReset}
            className="w-full mt-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 rounded-3xl transition-all active:scale-95 shadow-2xl shadow-emerald-200 text-lg flex items-center justify-center gap-3"
          >
            Scanner un autre produit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
