'use client';

import React, { useState, useEffect, memo, useCallback } from 'react';
import { X, Shield, FileText, Loader2, AlertTriangle, Download, Share2, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { ResourceData } from '@/lib/data';

interface MissionBriefingProps {
  resource: ResourceData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export default memo(function MissionBriefing({ resource, isOpen, onClose }: MissionBriefingProps) {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [displayedBriefing, setDisplayedBriefing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateBriefing = useCallback(async () => {
    if (!resource) return;
    
    setIsLoading(true);
    setError(null);
    setBriefing(null);
    setDisplayedBriefing(null);

    try {
      const prompt = `
        You are the Chief Intelligence Officer for GRIS (Global Resource Intelligence System).
        Generate a CLASSIFIED MISSION BRIEFING for the following resource:
        
        Name: ${resource.name}
        Type: ${resource.type}
        Location: ${resource.lat}, ${resource.lng} (${resource.country}, ${resource.region})
        Classification: ${resource.classification || 'SECRET'}
        Threat Level: ${resource.threatLevel || 'LOW'}
        Probability: ${resource.probability}%
        Description: ${resource.description}
        
        The briefing should include:
        1. EXECUTIVE SUMMARY: High-level overview of the strategic importance.
        2. GEOPOLITICAL IMPACT: How this resource affects regional stability and global markets.
        3. TACTICAL RECOMMENDATIONS: Immediate actions for extraction or surveillance.
        4. POTENTIAL RISKS: Environmental, political, or security threats.
        
        Use a cold, professional, and slightly futuristic intelligence agency tone. 
        Format the output using Markdown with clear headers.
        Keep it concise but impactful (approx 300-400 words).
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      if (response.text) {
        setBriefing(response.text);
      } else {
        throw new Error("Failed to generate briefing content.");
      }
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      setError(err.message || "An unexpected error occurred during intelligence synthesis.");
    } finally {
      setIsLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    if (isOpen && resource && !briefing && !isLoading) {
      generateBriefing();
    }
  }, [isOpen, resource, briefing, isLoading, generateBriefing]);

  useEffect(() => {
    if (briefing) {
      let i = 0;
      setDisplayedBriefing('');
      const timer = setInterval(() => {
        setDisplayedBriefing(briefing.substring(0, i));
        i += 3; // Type 3 characters at a time for speed
        if (i > briefing.length) {
          setDisplayedBriefing(briefing);
          clearInterval(timer);
        }
      }, 10);
      return () => clearInterval(timer);
    }
  }, [briefing]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#02040A]/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-[#081018]/98 backdrop-blur-3xl border border-[#00FF9C]/40 rounded-sm shadow-[0_0_80px_rgba(0,255,156,0.3)] flex flex-col overflow-hidden font-mono group"
          >
            {/* Hardware Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 md:w-12 md:h-12 border-t-2 border-l-2 border-[#00FF9C]/30" />
            <div className="absolute bottom-0 right-0 w-4 h-4 md:w-12 md:h-12 border-b-2 border-r-2 border-[#00FF9C]/30" />

            {/* Header */}
            <div className="flex justify-between items-center p-1.5 md:p-6 border-b border-[#00FF9C]/30 bg-[#00FF9C]/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,156,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_5s_infinite]" />
              <div className="flex items-center gap-1 md:gap-4 relative z-10">
                <div className="p-0.5 md:p-2 bg-[#00FF9C]/10 border border-[#00FF9C]/30 rounded-sm">
                  <Shield className="w-2.5 h-2.5 md:w-6 md:h-6 text-[#00FF9C]" />
                </div>
                <div>
                  <h2 className="text-[8px] md:text-lg font-black tracking-[0.05em] md:tracking-[0.4em] text-[#00FF9C] uppercase leading-none mb-0.5 md:mb-1">CLASSIFIED_INTEL</h2>
                  <div className="text-[4px] md:text-[10px] text-[#00FF9C]/60 tracking-[0.05em] md:tracking-[0.2em] font-bold">GRIS_PROTOCOL // LEVEL_5</div>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-1 md:p-2 text-[#00FF9C]/50 hover:text-[#FF3B3B] transition-all hover:bg-[#FF3B3B]/10 border border-transparent hover:border-[#FF3B3B]/30 rounded-sm relative z-10 group/close"
              >
                <X className="w-3 h-3 md:w-6 md:h-6 group-hover/close:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-1.5 md:p-16 custom-scrollbar relative">
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,156,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />

              {isLoading ? (
                <div className="h-40 md:h-96 flex flex-col items-center justify-center gap-1.5 md:gap-6 text-[#00FF9C]">
                  <div className="relative w-8 h-8 md:w-20 md:h-20">
                    <Loader2 className="w-8 h-8 md:w-20 md:h-20 animate-spin opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Terminal className="w-2.5 h-2.5 md:w-8 md:h-8 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 md:gap-2">
                    <div className="text-[7px] md:text-sm font-black tracking-[0.05em] md:tracking-[0.5em] animate-pulse uppercase">SYNTHESIZING_INTELLIGENCE</div>
                    <div className="text-[4px] md:text-[10px] text-[#00FF9C]/50 font-bold tracking-[0.05em] md:tracking-[0.2em]">ESTABLISHING_UPLINK</div>
                  </div>
                </div>
              ) : error ? (
                <div className="h-40 md:h-96 flex flex-col items-center justify-center gap-1.5 md:gap-6 text-[#FF3B3B]">
                  <div className="p-1 md:p-4 bg-[#FF3B3B]/10 border border-[#FF3B3B]/30 rounded-full animate-pulse">
                    <AlertTriangle className="w-4 h-4 md:w-12 md:h-12" />
                  </div>
                  <div className="text-center space-y-0.5 md:space-y-2">
                    <div className="text-[8px] md:text-lg font-black tracking-[0.05em] md:tracking-[0.3em] uppercase">ACCESS_DENIED</div>
                    <div className="text-[5px] md:text-[11px] text-[#FF3B3B]/70 max-w-xs font-bold tracking-wider">{error}</div>
                  </div>
                  <button 
                    onClick={generateBriefing}
                    className="mt-1 md:mt-6 px-2 py-0.5 md:px-8 md:py-3 bg-[#FF3B3B]/10 border border-[#FF3B3B]/40 hover:bg-[#FF3B3B]/20 transition-all text-[5px] md:text-[11px] font-black uppercase tracking-[0.05em] md:tracking-[0.3em] rounded-sm"
                  >
                    RETRY_UPLINK
                  </button>
                </div>
              ) : briefing ? (
                <div className="prose prose-invert prose-sm max-w-none relative">
                  {/* TOP SECRET Stamp */}
                  <div className="absolute -top-1 -right-1 md:-top-10 md:-right-10 border-[1px] md:border-[6px] border-[#FF3B3B] text-[#FF3B3B] text-[10px] md:text-6xl font-black tracking-[0.05em] md:tracking-[0.5em] p-0.5 md:p-6 rotate-[25deg] opacity-20 pointer-events-none select-none mix-blend-screen border-double">
                    TOP SECRET
                  </div>

                  <div className="mb-2 md:mb-12 grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-6 text-[5px] md:text-[11px] text-[#00FF9C]/80 border-b border-[#00FF9C]/20 pb-1.5 md:pb-8">
                    <div className="flex items-center gap-1 md:gap-3 bg-white/2 p-0.5 md:p-3 border border-white/5 rounded-sm">
                      <Terminal className="w-1.5 h-1.5 md:w-4 md:h-4 text-[#00FF9C]" />
                      <span className="font-black tracking-widest uppercase">ID: {resource?.id}</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-3 bg-white/2 p-0.5 md:p-3 border border-white/5 rounded-sm">
                      <FileText className="w-1.5 h-1.5 md:w-4 md:h-4 text-[#00FF9C]" />
                      <span className="font-black tracking-widest uppercase">CLEARANCE: LEVEL_5</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-3 bg-white/2 p-0.5 md:p-3 border border-white/5 rounded-sm">
                      <Shield className="w-1.5 h-1.5 md:w-4 md:h-4 text-[#FF3B3B]" />
                      <span className="font-black tracking-widest uppercase">THREAT: {resource?.threatLevel}</span>
                    </div>
                  </div>
                  
                  <div className="markdown-body text-[#E8F0FF]/95 leading-relaxed tracking-wide font-medium relative z-10">
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-1.5 md:mb-6 text-[8px] md:text-sm" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-[10px] md:text-3xl font-black text-[#00FF9C] mb-1.5 md:mb-8 border-b-2 border-[#00FF9C]/30 pb-1 md:pb-4 uppercase tracking-[0.05em] md:tracking-[0.2em] leading-tight" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-[9px] md:text-xl font-black text-[#00FF9C] mt-3 md:mt-12 mb-1.5 md:mb-6 uppercase tracking-[0.05em] md:tracking-[0.15em] flex items-center gap-1 md:gap-3 before:content-['>>'] before:text-[#00FF9C]/50" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-[8px] md:text-lg font-black text-[#00E5FF] mt-2 md:mt-10 mb-1 md:mb-4 uppercase tracking-[0.05em] border-l-4 border-[#00E5FF] pl-1 md:pl-4" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-[#FFB800] font-black bg-[#FFB800]/10 px-0.5 md:px-1" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-none space-y-1 md:space-y-4 mb-2 md:mb-8" {...props} />,
                        li: ({node, ...props}) => <li className="flex items-start gap-1 md:gap-4 text-[8px] md:text-base before:content-['[+]'] before:text-[#00FF9C] before:font-black before:mt-0.5" {...props} />,
                      }}
                    >
                      {displayedBriefing || ''}
                    </ReactMarkdown>
                    {displayedBriefing !== briefing && (
                      <span className="inline-block w-1 h-2 md:w-3 md:h-6 bg-[#00FF9C] animate-pulse ml-0.5 md:ml-2 align-middle" />
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="p-1.5 md:p-6 border-t border-[#00FF9C]/30 bg-[#081018] flex flex-col md:flex-row justify-between items-center gap-1.5 md:gap-6">
              <div className="text-[4px] md:text-[9px] text-[#00FF9C]/40 tracking-[0.05em] md:tracking-[0.2em] uppercase font-bold max-w-2xl text-center md:text-left leading-relaxed">
                WARNING: UNAUTHORIZED DISTRIBUTION PROHIBITED. ALL ACCESS LOGGED.
              </div>
              <div className="flex gap-1 md:gap-4">
                <button className="p-0.5 md:p-3 text-[#00FF9C]/60 hover:text-[#00FF9C] transition-all border border-[#00FF9C]/20 hover:border-[#00FF9C]/50 rounded-sm bg-white/2 group/btn">
                  <Download className="w-2.5 h-2.5 md:w-5 md:h-5 group-hover/btn:scale-110 transition-transform" />
                </button>
                <button className="p-0.5 md:p-3 text-[#00FF9C]/60 hover:text-[#00FF9C] transition-all border border-[#00FF9C]/20 hover:border-[#00FF9C]/50 rounded-sm bg-white/2 group/btn">
                  <Share2 className="w-2.5 h-2.5 md:w-5 md:h-5 group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
