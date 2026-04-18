'use client';

import React, { useState } from 'react';
import { Check, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const plans = {
  FREE: {
    name: "OPERADOR",
    price: "$ 0/mês",
    description: "Para exploração inicial e reconhecimento",
    features: [
      "Acesso ao globo 3D",
      "50 recursos no mapa",
      "Eventos sísmicos (delay 24h)",
      "10 varreduras IA/dia",
    ],
    cta: "INICIAR MISSÃO",
    highlight: false,
    planId: "FREE"
  },
  PRO: {
    name: "PRO EDITION",
    price: "$ 12k/mês",
    description: "Para tomadores de decisão governamentais e mega-corporações",
    features: [
      "Integração de +500 recursos globais",
      "Telemetria em Tempo Real",
      "Analista IA sem limites (Contexto Tático)",
      "Exportação PDF C-Level",
      "Acesso a depósitos 'Black Site'",
    ],
    cta: "ASSINAR AGORA",
    highlight: true,
    planId: "PRO"
  },
  ENTERPRISE: {
    name: "COMANDO",
    price: "Custom",
    description: "Controle absoluto infraestrutural",
    features: [
      "Tudo do PRO",
      "Multi-usuários (até 50)",
      "API Direct-Link",
      "Integração White-Label",
      "Dados privados da corporação inseridos no mapa no-code",
    ],
    cta: "SOLICITAR BRIEFING",
    highlight: false,
    planId: "ENTERPRISE"
  }
};

export default function PricingPage() {
  const router = useRouter();
  const sessionContext = useSession();
  const session = sessionContext?.data;
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleAction = async (planId: string) => {
    if (!session && planId !== 'FREE') { // Allowing Free to just navigate
      router.push('/login');
      return;
    }

    if (planId === 'FREE') {
      router.push('/');
      return;
    }

    if (planId === 'ENTERPRISE') {
      window.location.href = 'mailto:contact@gris.com?subject=Enterprise%20Plan';
      return;
    }

    try {
      setLoadingPlan(planId);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erro ao iniciar checkout');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão ao processar checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gris-void)] p-4 md:p-8 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-[rgba(0,255,156,0.05)] to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--gris-primary)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--gris-border)] bg-[rgba(255,255,255,0.03)] mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--gris-primary)] animate-pulse" />
            <span className="font-oxanium text-[10px] text-[var(--gris-text-2)] uppercase tracking-widest">Acesso Restrito</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-inter font-black text-[var(--gris-text-1)] tracking-tight mb-4">
            Níveis de Autorização
          </h1>
          <p className="text-[var(--gris-text-2)] text-base md:text-lg font-inter max-w-2xl px-4">
            Escolha sua matriz de acesso. Sistemas avançados requerem credenciamento superior de operações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0 items-center">
          {Object.entries(plans).map(([key, plan]) => (
            <div 
              key={key} 
              className={`glass-panel rounded-3xl flex flex-col relative overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                plan.highlight 
                  ? 'border-[var(--gris-primary)] shadow-[0_20px_60px_rgba(0,255,156,0.15)] md:scale-105 z-10' 
                  : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 inset-x-0 h-1 bg-[var(--gris-primary)] shadow-[0_0_15px_var(--gris-primary)]" />
              )}
              
              <div className="p-8 pb-6 border-b border-[rgba(255,255,255,0.05)]">
                {plan.highlight && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-oxanium text-[10px] text-[var(--gris-primary)] font-bold tracking-[0.2em] uppercase">✦ Autorização Recomendada</span>
                  </div>
                )}
                <h2 className="text-2xl font-inter font-black tracking-tight text-[var(--gris-text-1)] mb-2">{plan.name}</h2>
                <p className="text-[var(--gris-text-2)] text-sm font-inter leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-inter font-black text-[var(--gris-text-1)]">{plan.price}</span>
                </div>
              </div>

              <div className="p-8 pt-6 flex-1 flex flex-col bg-[rgba(0,0,0,0.2)]">
                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 shrink-0 w-4 h-4 rounded-full bg-[rgba(0,255,156,0.1)] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-[var(--gris-primary)]" />
                      </div>
                      <span className="text-sm text-[var(--gris-text-2)] font-inter leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleAction(plan.planId)}
                  disabled={loadingPlan === plan.planId}
                  className={`w-full py-4 px-6 rounded-xl flex items-center justify-between font-oxanium font-bold tracking-[2px] text-xs uppercase transition-all group overflow-hidden relative ${
                    plan.highlight 
                      ? 'bg-[var(--gris-primary)] text-black hover:shadow-[0_0_20px_var(--gris-primary)]' 
                      : 'bg-[rgba(255,255,255,0.05)] text-[var(--gris-text-1)] hover:bg-[rgba(255,255,255,0.1)]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {plan.highlight && (
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full group-hover:animate-[slideRight_1.5s_ease-in-out_infinite]" />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {loadingPlan === plan.planId ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {plan.cta}
                  </span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass-panel border border-[rgba(255,255,255,0.05)] opacity-60">
            <ShieldAlert className="w-5 h-5 text-[var(--gris-text-3)]" />
            <span className="text-xs font-inter text-[var(--gris-text-3)]">Criptografia AES-256 GCM. Sujeito à verificação de conformidade ECCN.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
