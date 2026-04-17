'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, ChevronRight, Terminal } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('FALHA NA AUTENTICAÇÃO. VERIFIQUE CREDENCIAIS.');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gris-void)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,156,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,156,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 pointer-events-none" />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,156,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

      <div className="panel w-full max-w-md relative z-10">
        <div className="panel-header">
          <span className="bracket-text">AUTENTICAÇÃO_SISTEMA</span>
          <Shield className="w-4 h-4" />
        </div>
        
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <Terminal className="w-12 h-12 text-[var(--gris-emerald)] mb-4" />
            <h1 className="text-2xl font-bold tracking-widest text-[var(--gris-emerald)] uppercase">GRIS</h1>
            <p className="text-[var(--gris-text-secondary)] text-xs font-mono mt-2 uppercase tracking-widest">Global Resource Intelligence</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[var(--gris-red)]/10 border border-[var(--gris-red)]/30 text-[var(--gris-red)] p-3 text-xs font-mono text-center uppercase">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] text-[var(--gris-emerald)] font-mono uppercase tracking-widest">Identificação (Email)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 w-[2px] bg-[var(--gris-emerald)] opacity-50" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[rgba(0,255,156,0.03)] border border-[rgba(0,255,156,0.1)] rounded-sm py-3 pl-4 pr-3 text-sm text-[var(--gris-text-primary)] focus:outline-none focus:border-[var(--gris-emerald)] focus:shadow-[0_0_10px_rgba(0,255,156,0.1)] transition-all font-mono"
                  placeholder="operador@gris.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-[var(--gris-emerald)] font-mono uppercase tracking-widest">Código de Acesso (Senha)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 w-[2px] bg-[var(--gris-emerald)] opacity-50" />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gris-text-secondary)]" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[rgba(0,255,156,0.03)] border border-[rgba(0,255,156,0.1)] rounded-sm py-3 pl-4 pr-10 text-sm text-[var(--gris-text-primary)] focus:outline-none focus:border-[var(--gris-emerald)] focus:shadow-[0_0_10px_rgba(0,255,156,0.1)] transition-all font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-tactical py-4 flex items-center justify-center gap-2 group mt-8">
              <span className="font-bold tracking-widest text-sm">INICIAR SESSÃO</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-[var(--gris-text-secondary)] font-mono uppercase">
              Sem credenciais? <a href="/cadastro" className="text-[var(--gris-sky)] hover:underline">Solicitar Acesso</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
