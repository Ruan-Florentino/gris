'use client';

import React, { useState } from 'react';
import { Check, Terminal, ShieldAlert, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const plans = {
  FREE: {
    name: "OPERADOR",
    price: "R$ 0/mês",
    description: "Para exploração inicial",
    features: [
      "Acesso ao globo 3D com dados públicos",
      "50 recursos minerais no mapa",
      "Dados sísmicos USGS em tempo real",
      "10 consultas ao AI Analyst por dia",
      "Exportação em PNG",
    ],
    cta: "INICIAR MISSÃO",
    highlight: false,
    planId: "FREE"
  },
  PRO: {
    name: "ANALISTA",
    price: "R$ 297/mês",
    description: "Para geólogos e engenheiros ativos",
    features: [
      "Todos os 500+ recursos minerais",
      "Dados ANM/IBRAM integrados",
      "AI Analyst ilimitado com contexto geológico",
      "Relatórios PDF profissionais",
      "Filtros avançados por litologia e época",
      "Exportação shapefile (.shp) e GeoJSON",
      "Alertas de novos depósitos por região",
      "Suporte prioritário",
    ],
    cta: "ATIVAR PROTOCOLO PRO",
    highlight: true,
    planId: "PRO"
  },
  ENTERPRISE: {
    name: "COMANDO",
    price: "Consultar",
    description: "Para empresas de mineração e consultorias",
    features: [
      "Tudo do PRO",
      "Multi-usuários (até 20 assentos)",
      "API própria com sua chave",
      "White-label opcional",
      "Integração com software próprio",
      "Dados proprietários da sua empresa no mapa",
      "SLA 99.9% e suporte dedicado",
    ],
    cta: "SOLICITAR BRIEFING",
    highlight: false,
    planId: "ENTERPRISE"
  }
};

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleAction = async (planId: string) => {
    if (!session) {
      router.push('/cadastro');
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
    <div className="min-h-screen bg-[var(--gris-void)] p-4 md:p-8 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,156,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,156,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 pointer-events-none" />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,156,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <Terminal className="w-16 h-16 text-[var(--gris-emerald)] mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-[var(--gris-emerald)] uppercase mb-4">NÍVEIS DE ACESSO</h1>
          <p className="text-[var(--gris-text-secondary)] text-sm md:text-base font-mono uppercase tracking-widest max-w-2xl">
            Selecione o nível de autorização apropriado para suas operações de inteligência mineral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(plans).map(([key, plan]) => (
            <div 
              key={key} 
              className={`panel flex flex-col ${plan.highlight ? 'border-[var(--gris-emerald)] shadow-[0_0_30px_rgba(0,255,156,0.15)] scale-105 z-10' : 'border-[rgba(0,255,156,0.1)]'}`}
            >
              {plan.highlight && (
                <div className="bg-[var(--gris-emerald)] text-[var(--gris-void)] text-center py-1 text-[10px] font-bold tracking-widest uppercase">
                  RECOMENDADO PARA OPERAÇÕES TÁTICAS
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold tracking-widest text-[var(--gris-text-primary)] uppercase mb-2">{plan.name}</h2>
                <div className="text-3xl font-black text-[var(--gris-emerald)] mb-2">{plan.price}</div>
                <p className="text-[var(--gris-text-secondary)] text-xs font-mono uppercase tracking-widest mb-8 h-8">
                  {plan.description}
                </p>

                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[var(--gris-emerald)] shrink-0 mt-0.5" />
                      <span className="text-sm text-[var(--gris-text-primary)] font-mono">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleAction(plan.planId)}
                  disabled={loadingPlan === plan.planId}
                  className={`w-full py-4 flex items-center justify-center gap-2 font-bold tracking-widest text-sm uppercase transition-all ${
                    plan.highlight 
                      ? 'bg-[var(--gris-emerald)] text-[var(--gris-void)] hover:bg-[var(--gris-emerald)]/80 shadow-[0_0_15px_rgba(0,255,156,0.3)]' 
                      : 'btn-tactical'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingPlan === plan.planId ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center flex flex-col items-center justify-center gap-4">
          <ShieldAlert className="w-8 h-8 text-[var(--gris-text-secondary)]" />
          <p className="text-[10px] text-[var(--gris-text-secondary)] font-mono uppercase tracking-widest max-w-xl">
            Todos os dados são criptografados e armazenados em servidores seguros. O acesso a dados confidenciais está sujeito a verificação de identidade e conformidade regulatória.
          </p>
        </div>
      </div>
    </div>
  );
}
