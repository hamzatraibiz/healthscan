
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraScannerProps {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions dans vos réglages.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const base64 = canvasRef.current.toDataURL('image/jpeg', 0.9).split(',')[1];
        onCapture(base64);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col animate-in fade-in duration-500">
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center p-10 max-w-sm">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="mb-8 font-medium leading-relaxed opacity-80">{error}</p>
            <button onClick={onCancel} className="w-full bg-white text-slate-950 px-8 py-4 rounded-2xl font-black transition-transform active:scale-95 shadow-xl">Retour à l'accueil</button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute min-w-full min-h-full object-cover scale-x-1 sm:scale-x-1"
            />
            
            {/* Visual Guidelines */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
              <div className="w-full max-w-md aspect-[3/4] border-2 border-emerald-400/50 rounded-[40px] relative">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-emerald-400 rounded-tl-3xl" />
                <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-emerald-400 rounded-tr-3xl" />
                <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-emerald-400 rounded-bl-3xl" />
                <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-emerald-400 rounded-br-3xl" />
                
                {/* Laser Animation */}
                <div className="absolute left-4 right-4 h-[2px] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-[scan_3s_infinite_ease-in-out]" />
                
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 text-center">
                   <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em]">Scanner Focus</p>
                </div>
              </div>
            </div>

            <div className="absolute top-12 left-0 right-0 text-center px-6">
               <h3 className="text-white font-black text-xl tracking-tight mb-2 drop-shadow-lg">Centrez l'étiquette</h3>
               <p className="text-white/60 text-sm font-medium">Assurez-vous que le texte est bien lisible</p>
            </div>
          </>
        )}
      </div>

      {/* Control Bar */}
      <div className="h-40 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-8">
        <button 
          onClick={onCancel}
          className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-0 group-active:opacity-40 transition-opacity" />
          <button 
            onClick={captureImage}
            disabled={!!error}
            className="relative w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center p-2 bg-transparent disabled:opacity-50 transition-transform active:scale-90"
          >
            <div className="w-full h-full rounded-full bg-white shadow-2xl" />
          </button>
        </div>

        <div className="w-14 h-14 flex items-center justify-center opacity-40">
           <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      <style>{`
        @keyframes scan {
          0%, 100% { top: 10%; opacity: 0.5; }
          50% { top: 90%; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CameraScanner;
