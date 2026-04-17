'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommandTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (cmd: string) => void;
}

export default function CommandTerminal({ isOpen, onClose, onCommand }: CommandTerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: 'input' | 'output' | 'error' | 'system', text: string }[]>([
    { type: 'system', text: 'GRIS COMMAND UPLINK v4.0.2' },
    { type: 'system', text: 'CONNECTION SECURE. ENCRYPTION: AES-256' },
    { type: 'system', text: 'Type "help" for a list of commands.' }
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    setHistory(prev => [...prev, { type: 'input', text: `> ${input}` }]);
    
    // Process command locally or pass up
    let output = '';
    let isError = false;

    switch (cmd) {
      case 'help':
        output = 'AVAILABLE COMMANDS:\n- help: Show this message\n- clear: Clear terminal\n- scan: Initiate deep scan\n- defcon [1-5]: Set DEFCON level\n- mode [name]: Change map mode\n- hologram: Toggle holographic overlay\n- reboot: Restart GRIS system';
        break;
      case 'hologram':
        onCommand('hologram');
        output = 'TOGGLING HOLOGRAPHIC INTERFACE...';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'reboot':
        output = 'INITIATING SYSTEM REBOOT...';
        setTimeout(() => window.location.reload(), 2000);
        break;
      default:
        // Pass to parent for complex commands
        onCommand(cmd);
        output = `Executing: ${cmd}...`;
        break;
    }

    if (output) {
      setHistory(prev => [...prev, { type: isError ? 'error' : 'output', text: output }]);
    }
    
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className={`fixed bottom-0 md:bottom-8 left-0 md:left-1/2 md:-translate-x-1/2 z-[150] bg-[#02040A]/98 border-t md:border border-[#00FF9C]/40 shadow-[0_-20px_50px_rgba(0,255,156,0.1)] md:shadow-[0_0_50px_rgba(0,255,156,0.2)] backdrop-blur-xl font-mono flex flex-col transition-all duration-300 overflow-hidden group ${isExpanded ? 'w-full h-[80vh] md:w-[95vw] md:h-[70vh]' : 'w-full h-[40vh] md:w-[700px] md:h-[350px]'}`}
        style={{ borderRadius: '4px 4px 0 0' }}
      >
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,156,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
        
        {/* Hardware Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00FF9C]/30 hidden md:block" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00FF9C]/30 hidden md:block" />

        {/* Header */}
        <div className="flex items-center justify-between px-1.5 md:px-6 py-0.5 md:py-3 border-b border-[#00FF9C]/30 bg-[#00FF9C]/5 relative z-10">
          <div className="flex items-center gap-1 md:gap-3 text-[#00FF9C]">
            <div className="p-0.5 md:p-1 bg-[#00FF9C]/10 border border-[#00FF9C]/30 rounded-sm">
              <TerminalIcon className="w-2 h-2 md:w-4 md:h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[6px] md:text-[10px] font-black tracking-[0.05em] md:tracking-[0.3em] uppercase leading-none mb-0.5">COMMAND_UPLINK</span>
              <span className="text-[4px] md:text-[8px] text-[#00FF9C]/50 font-bold tracking-widest">SECURE_SHELL // AES_256_GCM</span>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-4">
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="p-0.5 md:p-1.5 text-[#00FF9C]/50 hover:text-[#00FF9C] hover:bg-white/5 transition-all rounded-sm"
            >
              {isExpanded ? <Minimize2 className="w-2.5 h-2.5 md:w-4 md:h-4" /> : <Maximize2 className="w-2.5 h-2.5 md:w-4 md:h-4" />}
            </button>
            <button 
              onClick={onClose} 
              className="p-0.5 md:p-1.5 text-[#00FF9C]/50 hover:text-[#FF3B3B] hover:bg-[#FF3B3B]/10 transition-all rounded-sm group/close"
            >
              <X className="w-2.5 h-2.5 md:w-4 md:h-4 group-hover/close:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 overflow-y-auto p-1.5 md:p-6 space-y-0.5 md:space-y-3 text-[6px] md:text-[11px] custom-scrollbar relative z-10 bg-black/20">
          {history.map((line, i) => (
            <div key={i} className={`whitespace-pre-wrap leading-relaxed tracking-wide ${
              line.type === 'input' ? 'text-white font-bold' :
              line.type === 'error' ? 'text-[#FF3B3B] font-bold' :
              line.type === 'system' ? 'text-[#00E5FF] font-black' :
              'text-[#00FF9C]/90'
            }`}>
              {line.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleCommand} className="p-1 md:p-4 border-t border-[#00FF9C]/30 flex items-center gap-0.5 md:gap-3 bg-black/60 relative z-10">
          <div className="flex items-center gap-0.5 md:gap-2 text-[#00FF9C] font-black text-[6px] md:text-[11px] tracking-widest">
            <span className="opacity-50">GRIS</span>
            <span className="text-[#00FF9C]/30">@</span>
            <span className="text-[#00E5FF]">SYS</span>
            <span className="text-white/50">:</span>
            <span className="text-[#FFB800]">~</span>
            <span className="text-white/50">#</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white text-[6px] md:text-[11px] font-mono placeholder:text-[#00FF9C]/20 tracking-wider"
            placeholder="ENTER_COMMAND..."
            autoComplete="off"
            spellCheck="false"
          />
          <div className="flex gap-0.5">
            <div className="w-0.5 md:w-1.5 h-1.5 md:h-3 bg-[#00FF9C] animate-pulse" />
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
