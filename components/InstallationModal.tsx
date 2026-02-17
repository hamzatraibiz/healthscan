
import React from 'react';

interface InstallationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstallationModal: React.FC<InstallationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Comment l'ouvrir sur votre S24 ?</h3>
          
          <div className="space-y-6 text-slate-600">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">1</div>
              <p className="text-sm leading-relaxed">
                <span className="font-bold text-slate-900">Pourquoi le lien Gmail ne marche pas ?</span> Le lien d'AI Studio est votre bureau de travail. Pour l'ouvrir sur Chrome mobile, vous devez utiliser le lien de l'aperçu ("Preview").
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">2</div>
              <p className="text-sm leading-relaxed">
                <span className="font-bold text-slate-900">Le lien direct :</span> Sur votre ordinateur, cliquez sur l'icône <span className="inline-block p-1 bg-slate-100 rounded border">↗️</span> (Open in new tab) en haut de l'aperçu à droite. Copiez ce nouveau lien et envoyez-le à votre S24.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">3</div>
              <p className="text-sm leading-relaxed">
                <span className="font-bold text-slate-900">Installation :</span> Une fois ouvert sur Chrome (S24), cliquez sur le bouton <span className="text-emerald-600 font-bold">"Installer"</span> qui apparaîtra en bas de l'écran pour l'ajouter à vos applications.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-xs text-emerald-800 font-medium">
                <span className="font-bold">Astuce Pro :</span> Pour une adresse permanente (ex: healthscan.fr), vous pouvez glisser ces fichiers sur <span className="font-bold underline">Vercel.com</span> gratuitement.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all"
          >
            J'ai compris !
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallationModal;
