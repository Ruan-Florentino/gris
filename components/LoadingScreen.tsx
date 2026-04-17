'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Radar } from 'lucide-react';

export default function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING SECURE CONNECTION...');

  useEffect(() => {
    const statuses = [
      'INITIALIZING SECURE CONNECTION...',
      'ESTABLISHING SATELLITE UPLINK...',
      'DECRYPTING GEOSPATIAL DATA...',
      'LOADING STRATEGIC ASSETS...',
      'CALIBRATING RADAR SYSTEMS...',
      'SYSTEM ONLINE'
    ];

    let currentStatus = 0;
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          if (onComplete) setTimeout(onComplete, 500);
          return 100;
        }
        
        const newProgress = p + Math.random() * 15;
        
        if (newProgress > (currentStatus + 1) * (100 / statuses.length) && currentStatus < statuses.length - 1) {
          currentStatus++;
          setStatus(statuses[currentStatus]);
        }
        
        return Math.min(newProgress, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-[#02040A] flex flex-col items-center justify-center font-mono"
    >
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,194,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        <Radar className="w-16 h-16 text-[#00FF9C] mb-8 animate-[spin_3s_linear_infinite]" />
        
        <h1 className="text-2xl font-bold tracking-[0.3em] text-[#E8F0FF] mb-2 text-center">
          GRIS <span className="text-[#00FF9C]">v1.0</span>
        </h1>
        <div className="text-[10px] text-[#00A86B] tracking-[0.2em] uppercase mb-12 text-center">
          Global Resource Intelligence System
        </div>

        <div className="w-full space-y-4">
          <div className="flex justify-between text-[10px] text-[#00C2FF] tracking-widest">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          <div className="h-1 w-full bg-[#00C2FF]/10 rounded-sm overflow-hidden border border-[#00C2FF]/30">
            <div 
              className="h-full bg-[#00FF9C] transition-all duration-200 ease-out shadow-[0_0_10px_#00FF9C]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
