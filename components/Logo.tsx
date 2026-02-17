
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" className="opacity-20" />
        <path d="M20 50 L35 50 L45 20 L55 80 L65 50 L80 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="4" fill="currentColor" className="animate-pulse" />
      </svg>
    </div>
  </div>
);

export default Logo;
