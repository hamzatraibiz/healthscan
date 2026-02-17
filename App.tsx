
import React, { useState, useEffect } from 'react';
import { AppState, HealthAnalysis } from './types';
import CameraScanner from './components/CameraScanner';
import ResultCard from './components/ResultCard';
import Logo from './components/Logo';
import InstallationModal from './components/InstallationModal';
import { analyzeFoodImage } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleCapture = async (base64: string) => {
    setState(AppState.ANALYZING);
    try {
      const result = await analyzeFoodImage(base64);
      setAnalysis(result);
      setState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError("L'analyse a échoué. Assurez-vous que l'image est bien éclairée et que le texte est lisible.");
      setState(AppState.ERROR);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
    setState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100">
      {/* Installation Guide Modal */}
      <InstallationModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Header */}
      <header className={`transition-all duration-500 z-30 ${state === AppState.RESULT ? 'bg-white shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={reset}>
            <div className={`p-2 rounded-xl transition-colors ${state === AppState.RESULT ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 shadow-lg'}`}>
              <Logo className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">
                HEALTH<span className="text-emerald-600">SCAN</span>
              </h1>
              {state !== AppState.RESULT && <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Intelligence Nutritionnelle</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors hidden sm:block"
            >
              Guide Mobile
            </button>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-slate-800 transition-all">S'abonner</button>
          </div>
        </div>
      </header>

      {/* Hero Section Background */}
      {state === AppState.IDLE && (
        <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none opacity-40">
           <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-200 blur-[120px] rounded-full" />
           <div className="absolute top-40 -right-20 w-96 h-96 bg-blue-200 blur-[120px] rounded-full" />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 relative z-10 pb-20">
        <div className="max-w-4xl mx-auto pt-10">
          {state === AppState.IDLE && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                  Mangez mieux,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">en un scan.</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
                  L'IA pour votre nutrition. Scannez n'importe quel produit pour une analyse complète.
                </p>
                
                <div className="flex flex-col items-center gap-6">
                  <button 
                    onClick={() => setState(AppState.SCANNING)}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 py-6 rounded-[2rem] transition-all active:scale-95 shadow-2xl shadow-emerald-200 text-xl flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Démarrer le Scan
                  </button>

                  <button 
                    onClick={() => setIsGuideOpen(true)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-[0.2em] sm:hidden flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Aide installation S24
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Nutri-Score IA", icon: "📊", desc: "Évaluation objective instantanée." },
                  { title: "Détection Additifs", icon: "🧪", desc: "Repérez les substances nocives." },
                  { title: "Alternatives", icon: "💡", desc: "Découvrez des produits plus sains." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {state === AppState.ANALYZING && (
            <div className="bg-white rounded-[40px] shadow-2xl p-16 text-center animate-in zoom-in-95 duration-300">
              <div className="relative w-32 h-32 mx-auto mb-10">
                <div className="absolute inset-0 border-8 border-emerald-50 rounded-full" />
                <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                  <Logo className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Analyse Magique...</h2>
              <p className="text-slate-400 font-medium italic">Gemini déchiffre l'étiquette...</p>
            </div>
          )}

          {state === AppState.RESULT && analysis && (
            <ResultCard data={analysis} onReset={reset} />
          )}

          {state === AppState.ERROR && (
            <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center border-2 border-rose-50 max-w-lg mx-auto">
               <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8">
                 <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
               </div>
               <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Analyse impossible</h2>
               <p className="text-slate-500 mb-10">{error}</p>
               <button onClick={reset} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200">
                Réessayer le scan
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Install Banner for Mobile */}
      {showInstallBanner && (
        <div className="fixed bottom-6 left-6 right-6 z-[200] animate-in slide-in-from-bottom-20 duration-500">
          <div className="bg-slate-900 text-white p-5 rounded-[2.5rem] shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md bg-slate-900/90">
            <div className="flex items-center gap-4 pl-2">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
                <Logo className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-black">Installer HealthScan</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accès direct sur votre S24</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={() => setShowInstallBanner(false)} className="px-4 py-3 text-slate-400 font-bold text-xs uppercase">Plus tard</button>
               <button onClick={handleInstall} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Installer</button>
            </div>
          </div>
        </div>
      )}

      {state === AppState.SCANNING && (
        <CameraScanner onCapture={handleCapture} onCancel={() => setState(AppState.IDLE)} />
      )}

      <footer className="mt-auto py-10 border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-50">
             <Logo className="w-6 h-6" />
             <span className="text-sm font-bold tracking-tighter">HEALTH<span className="text-emerald-600">SCAN</span></span>
          </div>
          <button 
            onClick={() => setIsGuideOpen(true)}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
          >
            Aide & Installation
          </button>
          <p className="text-xs font-medium text-slate-400 italic">© 2025 HealthScan Intelligence AI</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
