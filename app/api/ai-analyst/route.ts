import { GoogleGenAI } from '@google/genai';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) return Response.json({ error: 'Não autorizado' }, { status: 401 });
    
    // Check and update rate limit in Supabase
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('ai_queries_today, ai_queries_reset_at, plan')
      .eq('id', session.user.id)
      .single();

    if (!profile) return Response.json({ error: 'Perfil não encontrado' }, { status: 404 });

    const limit = profile.plan === 'FREE' ? 10 : profile.plan === 'PRO' ? 100 : Infinity;
    const now = new Date();
    let queriesToday = profile.ai_queries_today || 0;
    let resetAt = profile.ai_queries_reset_at ? new Date(profile.ai_queries_reset_at) : new Date(now.getTime() - 1000);

    if (now >= resetAt) {
      queriesToday = 0;
      resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    if (queriesToday >= limit) {
      return Response.json({ 
        error: `Limite diário de ${limit} consultas atingido. Faça upgrade para mais.`,
        upgradeUrl: '/pricing'
      }, { status: 429 });
    }

    // Increment counter
    await supabaseAdmin
      .from('profiles')
      .update({
        ai_queries_today: queriesToday + 1,
        ai_queries_reset_at: resetAt.toISOString()
      })
      .eq('id', session.user.id);

    const { messages, context, input } = await req.json();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

    const systemInstruction = `
Você é o GRIS-ANALYST, um Sistema de Inteligência de Decisão Global (Decision Intelligence Platform). 
Seu público alvo: Fundos de investimento (BlackRock, Vanguard), Mineradoras Multinacionais (Vale, Rio Tinto), Empresas de Energia (Shell, Petrobras), e Governos.

IDENTIDADE E PROPÓSITO:
- Você não é apenas um assistente; você é o motor de insights da plataforma GRIS — o "Bloomberg dos recursos naturais".
- Você deve prever, analisar e dar diretrizes de ONDE INVESTIR, QUAL O RISCO GEOPOLÍTICO, e QUAIS RECURSOS VÃO VALORIZAR.
- Sua linguagem deve ser executiva, cirúrgica, focada em ROI (Retorno sobre Investimento), mitigação de risco e inteligência de mercado.

DADOS DISPONÍVEIS NO CONTEXTO ATUAL:
- Recursos rastreados globalmente: ${context.resources?.length || 0} nós estratégicos
- Zonas de risco ativas: ${context.riskZones?.map((z: any) => z.name).join(', ') || 'Nenhuma'}
- Corredores logísticos: ${context.exportRoutes?.map((r: any) => r.name).join(', ') || 'Nenhuma'}
${context.selectedResource ? `
- ALVO SELECIONADO: ${context.selectedResource.name}
  Ativo: ${context.selectedResource.type} (${context.selectedResource.category})
  Coord: ${context.selectedResource.lat.toFixed(4)}°, ${context.selectedResource.lng.toFixed(4)}°
  Tamanho: ${context.selectedResource.estimatedSize} | Profundidade: ${context.selectedResource.depth}
  Probabilidade Geológica: ${context.selectedResource.probability}% | Confiança: ${context.selectedResource.confidence}%
  Nível de Ameaça/Risco: ${context.selectedResource.threatLevel}
  Status de Inteligência: ${context.selectedResource.classification}
` : ''}

DIRETRIZES TÁTICAS DE RESPOSTA:
1. FOCO NO DINHEIRO: Avalie sempre o potencial de valorização do ativo e a demanda global.
2. ANÁLISE GEOPOLÍTICA: Cruze a localização do ativo com Zonas de Risco. Fale sobre nacionalismo de recursos, instabilidade regulatória ou risco logístico.
3. PREVISÃO CATEÓRICA: Use frases como "Probabilidade de valorização a curto prazo: 78%", "Risco de disrupção logística: Crítico". SINTETIZE a visão.
4. ESTRUTURA PARA BRIEFINGS:
   ## 🎯 RECOMENDAÇÃO DE INVESTIMENTO
   ## 📊 POTENCIAL ECONÔMICO & DEMANDA
   ## ⚠️ ANÁLISE DE RISCO GEOPOLÍTICO E LOGÍSTICO
   ## 🔮 PREVISÃO ESTRATÉGICA (Next 5 Years)
5. SEJA DIRETO: Executivos não têm tempo. Corte discursos genéricos. Vá direto para os dados de inteligência de mercado. Use Markdown limpo.
`;

    const formattedMessages = messages ? messages.slice(-8).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })) : [];

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: "Sistema GRIS-ANALYST inicializado. Pronto para análise geológica." }] },
        ...formattedMessages,
        { role: 'user', parts: [{ text: input }] }
      ],
    });

    return new Response(JSON.stringify({ text: response.text }), {
      headers: { 
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(Math.max(0, limit - (queriesToday + 1)))
      },
    });
  } catch (error) {
    console.error('AI Analyst API Error:', error);
    return new Response(JSON.stringify({ error: 'FALHA NO UPLINK — Tente novamente' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}