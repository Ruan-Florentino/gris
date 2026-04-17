'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, Sparkles, Activity, ShieldAlert, Database, Terminal, ChevronRight, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ResourceData, RiskZone, ExportRoute } from '@/lib/data';

interface AIAnalystProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    resources: ResourceData[];
    riskZones: RiskZone[];
    exportRoutes: ExportRoute[];
    selectedResource?: ResourceData | null;
    cameraData?: { lat: number, lng: number, alt: number, heading: number, pitch: number };
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAnalyst({ isOpen, onClose, context }: AIAnalystProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Analista de Inteligência Estratégica online. Indexei todos os dados globais de recursos, zonas de risco e corredores de exportação. Como posso ajudar na sua avaliação situacional?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, context, input })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.text || "Erro: Falha no uplink de inteligência. Por favor, tente novamente.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Analyst Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "ERRO CRÍTICO: Link neural interrompido. Verifique a configuração da API ou o status da rede.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBriefing = async () => {
    setInput("Forneça um Briefing de Inteligência Estratégica completo baseado nos dados globais atuais.");
    setTimeout(() => handleSend(), 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 30, scale: 0.95 }}
          className="fixed inset-0 md:inset-auto md:top-24 md:right-6 md:bottom-24 w-full md:w-[420px] z-[60] flex flex-col pointer-events-auto group"
        >
          <div className="flex-1 bg-[var(--gris-surface)]/98 backdrop-blur-3xl border-t md:border border-[var(--gris-emerald)]/40 md:rounded-sm flex flex-col shadow-[0_-20px_60px_rgba(0,255,156,0.1)] md:shadow-[0_0_60px_rgba(0,255,156,0.2)] overflow-hidden font-mono relative mt-16 md:mt-0">
            
            {/* Hardware Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--gris-emerald)]/30 hidden md:block" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--gris-emerald)]/30 hidden md:block" />

            {/* Header */}
            <div className="p-2 md:p-6 border-b border-[var(--gris-emerald)]/30 bg-[var(--gris-emerald)]/5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,156,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_5s_infinite]" />
              <div className="flex items-center gap-1.5 md:gap-4 relative z-10">
                <div className="relative">
                  <div className="p-1 md:p-2 bg-[var(--gris-emerald)]/10 border border-[var(--gris-emerald)]/30 rounded-sm">
                    <BrainCircuit className="w-3 h-3 md:w-6 md:h-6 text-[var(--gris-emerald)]" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 md:w-3 md:h-3 bg-[var(--gris-emerald)] rounded-full animate-ping" />
                </div>
                <div>
                  <h3 className="text-[10px] md:text-sm font-black text-[var(--gris-text-primary)] tracking-[0.05em] md:tracking-[0.4em] uppercase leading-none mb-0.5 md:mb-1">INTELIGÊNCIA_GRIS</h3>
                  <div className="text-[7px] md:text-[9px] text-[var(--gris-emerald)] tracking-[0.1em] md:tracking-[0.2em] font-bold uppercase opacity-70">NÚCLEO_ANALISTA_NEURAL // ATIVO</div>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-1 md:p-2 hover:bg-[var(--gris-red)]/20 rounded-sm transition-all group/close border border-transparent hover:border-[var(--gris-red)]/30"
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-[var(--gris-emerald)]/50 group-hover/close:text-[var(--gris-red)] group-hover/close:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="relative flex-1 overflow-hidden">
              {/* Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,156,0.02)_50%)] bg-[length:100%_4px]" />
                <div className="w-full h-8 md:h-12 bg-gradient-to-b from-transparent via-[var(--gris-emerald)]/10 to-transparent animate-[scan_4s_linear_infinite]" />
              </div>
              
              <div 
                ref={scrollRef}
                className="absolute inset-0 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6 custom-scrollbar bg-[linear-gradient(rgba(0,255,156,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,156,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"
              >
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} relative z-20`}>
                    <div className={`max-w-[95%] p-3 md:p-4 rounded-sm text-[10px] md:text-[11px] leading-relaxed tracking-wide shadow-lg ${
                      msg.role === 'user' 
                        ? 'bg-[var(--gris-sky)]/10 border border-[var(--gris-sky)]/40 text-[var(--gris-text-primary)] rounded-tr-none' 
                        : 'bg-[var(--gris-emerald)]/5 border border-[var(--gris-emerald)]/30 text-[var(--gris-text-primary)] rounded-tl-none'
                    }`}>
                      <div className={`flex items-center gap-1 md:gap-2 mb-1.5 md:mb-2 opacity-50 text-[7px] md:text-[9px] font-black uppercase tracking-[0.05em] md:tracking-[0.2em] ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'user' ? 'COMANDO_OPERADOR' : 'RESPOSTA_NEURAL'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="prose prose-invert prose-xs max-w-none markdown-body font-medium">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex flex-col items-start relative z-20">
                    <div className="bg-[var(--gris-emerald)]/5 border border-[var(--gris-emerald)]/30 p-2 md:p-4 rounded-sm flex items-center gap-2 md:gap-4">
                      <div className="flex gap-1 md:gap-1.5">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[var(--gris-emerald)] rounded-full animate-bounce" />
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[var(--gris-emerald)] rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[var(--gris-emerald)] rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] md:text-[10px] text-[var(--gris-emerald)] tracking-[0.05em] md:tracking-[0.3em] font-black uppercase animate-pulse">
                          DESCRIPTOGRAFANDO_LINK_NEURAL
                        </span>
                        <span className="text-[6px] md:text-[8px] text-[var(--gris-emerald)]/50 tracking-widest uppercase font-bold">
                          ACESSANDO_NÓS_DISTRIBUÍDOS...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-2 md:p-4 border-t border-[var(--gris-emerald)]/30 bg-[var(--gris-void)]/80 flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => {
                  setInput("Forneça um Briefing de Inteligência de Decisão: Onde focar nossos fundos de capital nos próximos 18 meses com base nos clusters atuais?");
                  setTimeout(() => handleSend(), 0);
                }}
                className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 bg-[var(--gris-emerald)]/10 border border-[var(--gris-emerald)]/40 text-[var(--gris-emerald)] text-[8px] md:text-[10px] font-black tracking-[0.05em] md:tracking-[0.2em] uppercase hover:bg-[var(--gris-emerald)]/20 transition-all flex items-center gap-1.5 md:gap-2 group/btn"
              >
                <Terminal className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover/btn:scale-110 transition-transform" />
                ONDE_INVESTIR
              </button>
              <button 
                onClick={() => {
                  setInput("Cruze as zonas de risco geopolíticas ativas com nossos ativos restritos. Quais portfólios estão em risco crítico de desapropriação ou embargo logístico?");
                  setTimeout(() => handleSend(), 0);
                }}
                className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 bg-[var(--gris-red)]/10 border border-[var(--gris-red)]/40 text-[var(--gris-red)] text-[8px] md:text-[10px] font-black tracking-[0.05em] md:tracking-[0.2em] uppercase hover:bg-[var(--gris-red)]/20 transition-all flex items-center gap-1.5 md:gap-2 group/btn"
              >
                <ShieldAlert className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover/btn:scale-110 transition-transform" />
                RISCO_GEOPOLÍTICO
              </button>
              <button 
                onClick={() => {
                  setInput("Analise anomalias exploratórias e cruzamento de dados. Onde há alta probabilidade de novos recursos ainda não precificados pelo mercado?");
                  setTimeout(() => handleSend(), 0);
                }}
                className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 bg-[var(--gris-sky)]/10 border border-[var(--gris-sky)]/40 text-[var(--gris-sky)] text-[8px] md:text-[10px] font-black tracking-[0.05em] md:tracking-[0.2em] uppercase hover:bg-[var(--gris-sky)]/20 transition-all flex items-center gap-1.5 md:gap-2 group/btn"
              >
                <Database className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover/btn:scale-110 transition-transform" />
                RECURSOS_ESCONDIDOS
              </button>
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-6 border-t border-[var(--gris-emerald)]/30 bg-[var(--gris-void)]">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="INSERIR_COMANDO_OU_CONSULTA..."
                  className="w-full bg-[var(--gris-emerald)]/5 border border-[var(--gris-emerald)]/40 rounded-sm py-2 md:py-4 pl-3 md:pl-5 pr-10 md:pr-14 text-[9px] md:text-[11px] text-[var(--gris-text-primary)] placeholder-[var(--gris-emerald)]/20 focus:outline-none focus:border-[var(--gris-emerald)] focus:bg-[var(--gris-emerald)]/10 transition-all uppercase tracking-[0.05em] md:tracking-[0.2em] font-bold"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1 md:right-3 top-1/2 -translate-y-1/2 p-1.5 md:p-2.5 text-[var(--gris-emerald)] hover:bg-[var(--gris-emerald)]/20 rounded-sm transition-all disabled:opacity-20 disabled:pointer-events-none group/send"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5 group-hover/send:translate-x-1 group-hover/send:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
