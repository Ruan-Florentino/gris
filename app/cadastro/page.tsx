'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronRight, UserPlus } from 'lucide-react';
import Image from 'next/image';
import GrisLogo from '@/components/GrisLogo';

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: 'GEOLOGIST',
    organization: '',
    region: 'GLOBAL'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro no cadastro');
      }

      // Automatically sign in via NextAuth
      const signInRes = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          email: formData.email,
          password: formData.password,
        })
      });

      router.push('/login');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gris-void)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,156,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,156,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 pointer-events-none" />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,156,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

      <div className="panel w-full max-w-2xl relative z-10">
        <div className="panel-header">
          <span className="bracket-text">SOLICITAÇÃO_DE_ACESSO</span>
          <UserPlus className="w-4 h-4" />
        </div>
        
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <GrisLogo 
                size={56} 
                className="relative z-10 animate-float drop-shadow-[0_0_8px_rgba(0,255,156,0.6)]"
              />
              <div className="absolute inset-0 bg-[var(--gris-emerald)] opacity-20 blur-2xl animate-pulse-glow" />
            </div>
            <h1 className="text-2xl font-black tracking-[0.4em] text-white font-oxanium uppercase">GRIS</h1>
            <p className="text-[var(--gris-emerald)] text-[10px] font-mono mt-2 uppercase tracking-[0.3em] opacity-60">Solicitação de Credenciamento Orbital</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {errorMsg && (
              <div className="col-span-1 md:col-span-2 bg-[var(--gris-pink)]/10 border border-[var(--gris-pink)]/40 text-[var(--gris-pink)] p-3 rounded-sm text-xs font-mono uppercase tracking-widest text-center">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] text-[var(--gris-emerald)] font-mono uppercase tracking-widest">Nome Completo</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[rgba(0,255,156,0.03)] border border-[rgba(0,255,156,0.1)] rounded-sm py-3 pl-4 pr-3 text-sm text-[var(--gris-text-primary)] focus:outline-none focus:border-[var(--gris-emerald)] focus:shadow-[0_0_10px_rgba(0,255,156,0.1)] transition-all font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-[var(--gris-emerald)] font-mono uppercase tracking-widest">Email Corporativo</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[rgba(0,255,156,0.03)] border border-[rgba(0,255,156,0.1)] rounded-sm py-3 pl-4 pr-3 text-sm text-[var(--gris-text-primary)] focus:outline-none focus:border-[var(--gris-emerald)] focus:shadow-[0_0_10px_rgba(0,255,156,0.1)] transition-all font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-[var(--gris-emerald)] font-mono uppercase tracking-widest">Senha</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-[rgba(0,255,156,0.03)] border border-[rgba(0,255,156,0.1)] rounded-sm py-3 pl-4 pr-3 text-sm text-[var(--gris-text-primary)] focus:outline-none focus:border-[var(--gris-emerald)] focus:shadow-[0_0_10px_rgba(0,255,156,0.1)] transition-all font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-[var(--gris-emerald)] font-mono uppercase tracking-widest">Especialização</label>
              <select 
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                className="w-full bg-[rgba(0,255,156,0.03)] border border-[rgba(0,255,156,0.1)] rounded-sm py-3 pl-4 pr-3 text-sm text-[var(--gris-text-primary)] focus:outline-none focus:border-[var(--gris-emerald)] focus:shadow-[0_0_10px_rgba(0,255,156,0.1)] transition-all font-mono appearance-none"
              >
                <option value="GEOLOGIST">Geólogo</option>
                <option value="MINING_ENGINEER">Engenheiro de Minas</option>
                <option value="INVESTOR">Investidor</option>
                <option value="RESEARCHER">Pesquisador</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-[var(--gris-emerald)] font-mono uppercase tracking-widest">Empresa / Consultoria (Opcional)</label>
              <input 
                type="text" 
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
                className="w-full bg-[rgba(0,255,156,0.03)] border border-[rgba(0,255,156,0.1)] rounded-sm py-3 pl-4 pr-3 text-sm text-[var(--gris-text-primary)] focus:outline-none focus:border-[var(--gris-emerald)] focus:shadow-[0_0_10px_rgba(0,255,156,0.1)] transition-all font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-[var(--gris-emerald)] font-mono uppercase tracking-widest">Região de Interesse</label>
              <select 
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                className="w-full bg-[rgba(0,255,156,0.03)] border border-[rgba(0,255,156,0.1)] rounded-sm py-3 pl-4 pr-3 text-sm text-[var(--gris-text-primary)] focus:outline-none focus:border-[var(--gris-emerald)] focus:shadow-[0_0_10px_rgba(0,255,156,0.1)] transition-all font-mono appearance-none"
              >
                <option value="GLOBAL">Global</option>
                <option value="BR_AMAZONIA">Brasil - Amazônia Legal</option>
                <option value="BR_QUADRILATERO">Brasil - Quadrilátero Ferrífero</option>
                <option value="BR_CARAJAS">Brasil - Província Mineral de Carajás</option>
                <option value="LATAM">América Latina</option>
                <option value="AFRICA">África</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
              <button type="submit" className="w-full btn-tactical py-4 flex items-center justify-center gap-2 group">
                <span className="font-bold tracking-widest text-sm">ENVIAR SOLICITAÇÃO</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-[var(--gris-text-secondary)] font-mono uppercase">
              Já possui credenciais? <a href="/login" className="text-[var(--gris-sky)] hover:underline">Iniciar Sessão</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
