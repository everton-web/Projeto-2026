import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const copyTypePrompts: Record<string, string> = {
  landing_page: `Crie uma copy profissional para Landing Page com as seguintes seções:
1. HEADLINE PRINCIPAL (impactante, máx 10 palavras)
2. SUBTÍTULO (reforça o valor, máx 20 palavras)
3. SEÇÃO DE BENEFÍCIOS (3-5 benefícios no formato "✓ benefício")
4. PROVA SOCIAL (1 depoimento fictício mas realista)
5. CHAMADA PARA AÇÃO - CTA (frase de ação + botão sugerido)

Seja direto, persuasivo e voltado para conversão.`,

  one_page: `Crie uma copy completa para uma One Page com as seguintes seções:
1. HERO (headline + subtítulo + CTA)
2. SOBRE (história e missão da empresa)
3. SERVIÇOS/PRODUTOS (descrição dos 3 principais)
4. DIFERENCIAIS (3 razões para escolher)
5. DEPOIMENTOS (2 depoimentos realistas)
6. CONTATO (texto de encerramento + CTA)

Use linguagem profissional e envolvente.`,

  sales_page: `Crie uma copy longa de vendas (Sales Page) com as seguintes seções:
1. HEADLINE PODEROSA
2. PROBLEMA (dor que o cliente sente)
3. AGITAÇÃO (consequências de não resolver)
4. SOLUÇÃO (como o produto/serviço resolve)
5. BENEFÍCIOS DETALHADOS (5-7 itens)
6. PROVA SOCIAL (2-3 depoimentos)
7. OFERTA (o que está incluso)
8. GARANTIA
9. CTA FINAL (urgência e ação)

Use técnicas de copywriting (AIDA, PAS) e seja persuasivo sem ser agressivo.`,
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { responses, niche, copyType, clientName } = await request.json()

  if (!responses || !niche || !copyType) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY

  // Se não há chave da OpenAI, retorna copy de demonstração
  if (!apiKey) {
    const demoCopy = generateDemoCopy(copyType, responses, niche, clientName)
    return NextResponse.json({ copy: demoCopy })
  }

  // Monta o contexto do briefing
  const briefingContext = Object.entries(responses)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  const systemPrompt = `Você é um especialista em copywriting para websites e landing pages no Brasil.
Crie textos persuasivos, profissionais e adaptados ao nicho informado.
Use português brasileiro coloquial mas profissional.
Não use asteriscos ou markdown — use apenas texto limpo com quebras de linha.`

  const userPrompt = `Nicho: ${niche}
Cliente: ${clientName}

INFORMAÇÕES DO BRIEFING:
${briefingContext}

INSTRUÇÃO:
${copyTypePrompts[copyType]}`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message ?? 'Erro na API OpenAI')
    }

    const copy = data.choices[0]?.message?.content ?? ''
    return NextResponse.json({ copy })
  } catch (err) {
    console.error('OpenAI error:', err)
    return NextResponse.json({ error: 'Erro ao gerar copy. Tente novamente.' }, { status: 500 })
  }
}

// Copy de demonstração quando não há API Key configurada
function generateDemoCopy(
  type: string,
  responses: Record<string, string>,
  niche: string,
  clientName: string
): string {
  const name = responses.business_name ?? clientName
  const description = responses.description ?? responses.services ?? ''
  const audience = responses.target_audience ?? 'seus clientes'
  const cta = responses.cta ?? 'Entre em contato'

  if (type === 'landing_page') {
    return `HEADLINE PRINCIPAL
${name} — Transformando ${niche} com qualidade e resultado

SUBTÍTULO
Soluções completas para ${audience} que buscam excelência.

BENEFÍCIOS
✓ Atendimento personalizado para cada cliente
✓ Resultados comprovados com décadas de experiência
✓ Suporte completo do início ao fim do projeto
✓ Preços justos e transparentes
✓ Satisfação garantida ou seu dinheiro de volta

DEPOIMENTO
"Contratei os serviços de ${name} e fiquei impressionado com o profissionalismo e os resultados. Superou todas as minhas expectativas!"
— João Silva, cliente satisfeito

CHAMADA PARA AÇÃO
Não perca mais tempo. ${cta} agora e descubra como podemos transformar o seu negócio.
[BOTÃO: ${cta} →]

---
⚠️ MODO DEMONSTRAÇÃO — Configure a OPENAI_API_KEY no .env.local para gerar copies personalizadas com IA.`
  }

  if (type === 'sales_page') {
    return `HEADLINE
Descubra Como ${name} Está Ajudando ${audience} a Conquistar Resultados Extraordinários

PROBLEMA
Você está cansado de ${niche} que não entregam o que prometem? Que cobram caro e somem quando o problema aparece?

AGITAÇÃO
Cada dia sem a solução certa é um dia perdendo dinheiro, oportunidades e clientes para a concorrência.

SOLUÇÃO
${name} chegou para mudar isso. ${description}

BENEFÍCIOS
1. Atendimento 100% personalizado
2. Profissionais com vasta experiência no setor
3. Resultados mensuráveis e comprovados
4. Suporte completo durante todo o processo
5. Investimento com retorno garantido

DEPOIMENTOS
"${name} transformou completamente minha visão. Recomendo a todos!" — Maria Costa
"Profissionalismo, agilidade e resultado. Melhor investimento que fiz!" — Carlos Lima

OFERTA
Ao contratar ${name} você recebe:
- Consulta inicial gratuita
- Proposta personalizada
- Acompanhamento completo
- Garantia de satisfação

GARANTIA
Se você não ficar satisfeito nos primeiros 30 dias, devolvemos seu investimento integralmente.

CTA FINAL
Não deixe para amanhã o que pode mudar seu negócio hoje.
[BOTÃO: ${cta} AGORA →]

---
⚠️ MODO DEMONSTRAÇÃO — Configure a OPENAI_API_KEY no .env.local para gerar copies personalizadas com IA.`
  }

  return `HERO
${name} — ${description}
Para ${audience} que buscam qualidade e resultado.
[CTA: ${cta}]

SOBRE
Somos especialistas em ${niche} com foco total na satisfação do cliente.

SERVIÇOS
1. Consulta personalizada
2. Execução com excelência
3. Acompanhamento e suporte

DIFERENCIAIS
• Experiência comprovada no setor
• Atendimento humanizado e próximo
• Resultados que falam por si

DEPOIMENTOS
"Excelente serviço! ${name} superou minhas expectativas." — Ana Rodrigues
"Recomendo de olhos fechados. Qualidade e seriedade." — Pedro Alves

CONTATO
Pronto para dar o próximo passo? ${cta} e vamos conversar!

---
⚠️ MODO DEMONSTRAÇÃO — Configure a OPENAI_API_KEY no .env.local para gerar copies personalizadas com IA.`
}
