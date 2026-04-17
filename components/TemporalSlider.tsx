import React from 'react';
import { Play, Pause, FastForward, Rewind } from 'lucide-react';

interface TemporalSliderProps {
  currentYear: number;
  minYear: number;
  maxYear: number;
  isPlaying: boolean;
  onYearChange: (year: number) => void;
  onPlayPause: () => void;
}

export default function TemporalSlider({ currentYear, minYear, maxYear, isPlaying, onYearChange, onPlayPause }: TemporalSliderProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[600px] bg-[var(--gris-void)]/90 backdrop-blur-md border border-[var(--gris-emerald)]/30 p-4 rounded-sm flex flex-col gap-2 shadow-[0_0_20px_rgba(0,255,156,0.1)]">
      <div className="flex justify-between items-center text-[var(--gris-emerald)] text-xs font-mono font-bold uppercase tracking-widest">
        <span>Análise Temporal</span>
        <span className="text-[var(--gris-pink)]">{currentYear}</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onPlayPause} className="p-2 bg-[var(--gris-emerald)]/10 hover:bg-[var(--gris-emerald)]/20 text-[var(--gris-emerald)] rounded-sm transition-colors">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={currentYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="flex-1 h-1 bg-[var(--gris-emerald)]/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--gris-pink)] [&::-webkit-slider-thumb]:rounded-full"
        />
      </div>
    </div>
  );
}
