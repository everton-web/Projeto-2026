// BC Studio — Biblioteca de perguntas de briefing
// Desenvolvida com mentalidade de especialista em Copywriting
// Organizada por: tipo de página × nicho do cliente

export type PageType = 'landing_page' | 'one_page' | 'sales_page'

export interface Question {
  id: string
  label: string
  placeholder: string
  rows?: number
  hint?: string
}

export const PAGE_TYPE_LABELS: Record<PageType, string> = {
  landing_page: 'Landing Page',
  one_page: 'One Page',
  sales_page: 'Página de Vendas',
}

export const PAGE_TYPE_DESCRIPTIONS: Record<PageType, string> = {
  landing_page: 'Página de captura focada em gerar leads e conversões rápidas',
  one_page: 'Apresentação completa do negócio em uma única página',
  sales_page: 'Página longa e persuasiva focada em fechar vendas',
}

export const NICHES = [
  'Clínica / Saúde',
  'Advocacia / Jurídico',
  'Infoprodutos / Cursos',
  'Gestão de Tráfego / Marketing',
  'Academia / Personal / Nutrição',
  'Restaurante / Alimentação',
  'Imobiliária / Imóveis',
  'E-commerce / Loja Virtual',
  'Beleza / Estética',
  'Construção / Reforma',
  'Consultoria / Serviços',
  'Tecnologia / Software',
  'Fotografia / Vídeo',
  'Outro',
] as const

// ============================================================
// PERGUNTAS BASE POR TIPO DE PÁGINA
// Usadas como fallback para nichos sem perguntas específicas
// ============================================================

const BASE_LANDING_PAGE: Question[] = [
  {
    id: 'business_name',
    label: 'Nome do negócio / marca',
    placeholder: 'Ex: Studio Fit Personal, Dra. Ana Lima — Dermatologista',
  },
  {
    id: 'avatar',
    label: 'Descreva seu cliente ideal com detalhes',
    placeholder: 'Ex: Mulheres de 35 a 50 anos, casadas, com filhos, que trabalham em home office, sentem dor lombar crônica há mais de 2 anos e já tentaram academia sem sucesso',
    rows: 3,
    hint: 'Quanto mais específico, melhor a copy. Inclua: idade, gênero, situação de vida, maior dor/problema.',
  },
  {
    id: 'transformation',
    label: 'Qual a transformação ANTES e DEPOIS?',
    placeholder: 'ANTES: Vive com dor, evita atividades, tem medo de cirurgia\nDEPOIS: Dorme bem, volta a jogar com os filhos, sem remédio',
    rows: 3,
    hint: 'A copy mais poderosa vende o resultado, não o serviço. Descreva o estado ideal que o cliente alcança.',
  },
  {
    id: 'unique_mechanism',
    label: 'Qual o seu método / mecanismo único?',
    placeholder: 'Ex: Protocolo NeuroFit de 3 fases que trata a causa raiz da dor, não apenas o sintoma — diferente de academias que apenas fortalecem',
    rows: 2,
    hint: 'O que faz o seu método ser diferente de tudo que o cliente já tentou? Dê um nome se possível.',
  },
  {
    id: 'main_cta',
    label: 'Qual a ação principal (CTA)?',
    placeholder: 'Ex: Agendar avaliação gratuita de 30 min pelo WhatsApp',
  },
  {
    id: 'authority',
    label: 'Por que você / sua empresa é a pessoa certa para isso?',
    placeholder: 'Ex: 12 anos de experiência, CREFITO ativo, formação em Osteopatia pela USP, +800 pacientes tratados, cases publicados em revista especializada',
    rows: 2,
    hint: 'Credenciais, tempo de mercado, resultados já entregues, formações relevantes.',
  },
  {
    id: 'social_proof',
    label: 'Que provas sociais você tem com NÚMEROS?',
    placeholder: 'Ex: 847 pacientes atendidos, 94% de satisfação, "eliminei a dor em 3 semanas" — Marcos, 48 anos, engenheiro',
    rows: 2,
    hint: 'Números são mais convincentes que elogios vagos. Inclua depoimentos reais com nome e contexto.',
  },
  {
    id: 'main_objection',
    label: 'Qual a principal objeção / desculpa do cliente para não agir?',
    placeholder: 'Ex: "Já tentei outras coisas e não funcionou" / "Não tenho tempo" / "Está caro"',
    hint: 'Qual o maior medo ou dúvida que paralisa seu cliente na hora de contratar?',
  },
  {
    id: 'urgency',
    label: 'Existe alguma urgência ou escassez real?',
    placeholder: 'Ex: Apenas 8 vagas no mês / Desconto de R$150 apenas até sexta-feira / Turma fecha em 48h',
    hint: 'Urgência verdadeira. Não invente — o cliente percebe quando é falso.',
  },
  {
    id: 'tone',
    label: 'Qual o tom de comunicação ideal?',
    placeholder: 'Ex: Empático e próximo, como um amigo especialista que realmente se preocupa com o resultado',
  },
]

const BASE_ONE_PAGE: Question[] = [
  {
    id: 'business_name',
    label: 'Nome do negócio / marca',
    placeholder: 'Ex: Escritório Lima Advogados, Studio Glam — Ana Beatriz',
  },
  {
    id: 'description',
    label: 'O que a empresa faz? (seja completo)',
    placeholder: 'Ex: Escritório de advocacia trabalhista e previdenciária fundado em 2010, atende trabalhadores demitidos e aposentados do INSS em toda a região metropolitana de SP',
    rows: 3,
  },
  {
    id: 'avatar',
    label: 'Quem é o cliente ideal?',
    placeholder: 'Ex: Trabalhadores de 30 a 60 anos demitidos nos últimos 2 anos, que desconfiam estar sendo prejudicados mas não sabem por onde começar',
    rows: 2,
  },
  {
    id: 'history_mission',
    label: 'História e missão da empresa',
    placeholder: 'Ex: Fundada após o fundador vivenciar a injustiça na família — missão de devolver dignidade e direitos a quem trabalhou a vida toda',
    rows: 2,
  },
  {
    id: 'services',
    label: 'Serviços / produtos principais (liste todos)',
    placeholder: 'Ex: 1. Defesa em demissão sem justa causa | 2. Revisão de benefício do INSS | 3. Reclamação trabalhista | 4. Consulta jurídica online',
    rows: 3,
  },
  {
    id: 'differentials',
    label: 'Por que escolher vocês? (diferenciais reais)',
    placeholder: 'Ex: Sem honorários adiantados — só cobramos se ganharmos / Atendimento online para todo o Brasil / Mais de 1.200 casos ganhos',
    rows: 2,
  },
  {
    id: 'social_proof',
    label: 'Provas sociais com números e depoimentos',
    placeholder: 'Ex: +1.200 casos ganhos, R$8M recuperados para clientes, "recebi R$47k que nem sabia que tinha direito" — José, 52 anos',
    rows: 2,
  },
  {
    id: 'contact_cta',
    label: 'Como e onde o cliente entra em contato?',
    placeholder: 'Ex: WhatsApp (11) 99999-0000, formulário no site, visita ao escritório — Rua X, nº Y, SP',
  },
  {
    id: 'tone',
    label: 'Tom de comunicação',
    placeholder: 'Ex: Sério e confiável, mas acessível — sem juridiquês',
  },
]

const BASE_SALES_PAGE: Question[] = [
  {
    id: 'product_name',
    label: 'Nome do produto / serviço / oferta',
    placeholder: 'Ex: Método Tráfego Premium, Mentoria Clínica 6 em 7, Curso Advocacia Digital',
  },
  {
    id: 'avatar',
    label: 'Para quem é EXATAMENTE? (avatar detalhado)',
    placeholder: 'Ex: Gestores de tráfego com 6+ meses de experiência, que faturam entre R$3k e R$8k/mês, trabalham sozinhos, sentem que estão num teto e não sabem como escalar sem trabalhar mais horas',
    rows: 3,
    hint: 'Quanto mais específico o avatar, mais a copy ressoa. Inclua: nível de experiência, faturamento atual, maior frustração.',
  },
  {
    id: 'problem',
    label: 'Qual o problema mais profundo do cliente?',
    placeholder: 'Ex: Trabalha 10h por dia, perde clientes toda hora porque não tem processo, cobra barato por medo de perder, sente que está num hamster sem saída',
    rows: 3,
    hint: 'Vá além do problema óbvio. Qual a dor emocional? O que o mantém acordado às 2h da manhã?',
  },
  {
    id: 'agitation',
    label: 'O que acontece se ele NÃO resolver isso agora?',
    placeholder: 'Ex: Continua preso no ciclo de cobrar barato → trabalhar muito → ter poucos resultados → perder clientes → baixar preço de novo. Daqui 1 ano estará exatamente no mesmo lugar, só mais cansado.',
    rows: 2,
  },
  {
    id: 'solution',
    label: 'Como seu produto resolve o problema? (mecanismo único)',
    placeholder: 'Ex: O Método Escala Assimétrica tem 3 pilares: Precificação por resultado, Sistema de retenção com relatórios automatizados, e Script de vendas consultivo',
    rows: 3,
    hint: 'Explique o PORQUÊ funciona quando outras soluções falharam. Dê nome ao método se possível.',
  },
  {
    id: 'transformation',
    label: 'Qual a transformação completa em X tempo?',
    placeholder: 'Ex: Em 90 dias: cobrar R$2.500+/cliente com contrato de 6 meses, ter 3-5 clientes premium pagando recorrência, trabalhar máx 6h/dia',
    rows: 2,
  },
  {
    id: 'authority',
    label: 'Quem vende e por que tem autoridade?',
    placeholder: 'Ex: Paulo Salave — 8 anos como gestor, construiu agência de R$0 a R$180k/mês, gerenciou R$4M em tráfego, hoje tem 3 funcionários e trabalha 4h/dia',
    rows: 2,
  },
  {
    id: 'social_proof',
    label: 'Cases de alunos/clientes com resultados ESPECÍFICOS',
    placeholder: 'Ex: João foi de R$2k para R$15k/mês em 4 meses / Ana demitiu o patrão em 60 dias / Rodrigo tem hoje 7 clientes fixos sem prospectar',
    rows: 3,
    hint: 'O case mais poderoso: cliente parecido com o avatar que tinha o mesmo problema e conseguiu o resultado.',
  },
  {
    id: 'objections',
    label: 'Quais as 3 principais objeções? Como você as quebra?',
    placeholder: 'OBJ 1: "Não tenho tempo" → RESPOSTA: O método leva 3h/semana de implementação\nOBJ 2: "Já tentei curso antes" → RESPOSTA: 90% dos alunos que aplicam o módulo 2 fecham o 1º cliente em 30 dias\nOBJ 3: "Está caro" → RESPOSTA: 1 cliente feito com o método paga o curso inteiro',
    rows: 4,
  },
  {
    id: 'offer',
    label: 'O que está incluso na oferta? (liste tudo)',
    placeholder: 'Ex: 6 módulos em vídeo HD / Comunidade no Telegram / 4 mentorias ao vivo / Templates de contrato e proposta / Bônus: Script de prospecção no DM',
    rows: 3,
  },
  {
    id: 'price_guarantee',
    label: 'Preço, parcelamento e garantia',
    placeholder: 'Ex: R$1.497 à vista ou 12x R$147 / Garantia incondicional de 30 dias — se não gostar, devolvemos 100% sem perguntas',
  },
  {
    id: 'urgency',
    label: 'Urgência ou bônus por tempo limitado (real)',
    placeholder: 'Ex: Turma fecha domingo às 23h59 / Os 20 primeiros ganham sessão 1:1 de 1h comigo / Preço sobe R$400 na próxima turma',
  },
]

// ============================================================
// PERGUNTAS ESPECÍFICAS POR NICHO — LANDING PAGE
// ============================================================

type NicheQuestions = Partial<Record<string, Question[]>>

const LP_NICHE: NicheQuestions = {

  'Clínica / Saúde': [
    { id: 'business_name', label: 'Nome da clínica / profissional de saúde', placeholder: 'Ex: Dra. Ana Lima — Dermatologista | Clínica Bem Estar Fisioterapia' },
    { id: 'specialty', label: 'Especialidade e procedimentos principais', placeholder: 'Ex: Dermatologia clínica e estética — Botox, preenchimento, peel químico, consultas de acne e manchas', rows: 2 },
    { id: 'avatar', label: 'Paciente ideal (avatar detalhado)', placeholder: 'Ex: Mulheres de 35 a 55 anos que perceberam sinais do envelhecimento, sentem vergonha do próprio rosto em fotos, buscam rejuvenescimento natural sem parecer "feito"', rows: 3, hint: 'Inclua: idade, gênero, maior dor emocional com o problema.' },
    { id: 'transformation', label: 'Antes e depois do tratamento', placeholder: 'ANTES: Insegura com manchas/rugas, evita fotos, se sente mais velha do que é\nDEPOIS: Pele renovada, autoestima recuperada, comentários de que parece mais jovem', rows: 2 },
    { id: 'unique_mechanism', label: 'Protocolo / método único que você usa', placeholder: 'Ex: Protocolo 360° que combina laser fracionado + ácido hialurônico + limpeza de pele — personalizado para cada biotipo. Resultado visível na primeira sessão.', rows: 2 },
    { id: 'authority', label: 'Formação, CRM/CREFITO e experiência', placeholder: 'Ex: CRM 12345, pós-graduação em Dermatologia Estética pela USP, 11 anos, +2.000 procedimentos realizados', rows: 2 },
    { id: 'social_proof', label: 'Depoimentos com transformação real', placeholder: 'Ex: "Depois de 3 sessões voltei a me sentir bonita. Minha filha perguntou o que eu tinha feito diferente." — Carla, 47 anos, professora', rows: 2 },
    { id: 'main_objection', label: 'Principal objeção do paciente', placeholder: 'Ex: "Tenho medo de ficar com aparência artificial" / "Não sei se funciona para o meu tipo de pele"' },
    { id: 'cta', label: 'CTA principal', placeholder: 'Ex: Agendar avaliação gratuita pelo WhatsApp para saber qual procedimento é ideal para você' },
    { id: 'urgency', label: 'Urgência ou disponibilidade limitada', placeholder: 'Ex: Agenda com apenas 6 novos pacientes/mês / Consulta de avaliação gratuita disponível até X' },
    { id: 'convenios', label: 'Convênios, localização e horários', placeholder: 'Ex: Particular e Unimed / Moema, SP / Seg a Sex 8h-18h, Sáb 8h-12h' },
  ],

  'Advocacia / Jurídico': [
    { id: 'business_name', label: 'Nome do escritório / advogado(a)', placeholder: 'Ex: Dr. Carlos Lima | Escritório Lima & Associados — Direito Trabalhista' },
    { id: 'specialty', label: 'Área de atuação e tipos de casos', placeholder: 'Ex: Direito Trabalhista — demissão sem justa causa, assédio moral, rescisão indireta, FGTS, horas extras não pagas', rows: 2 },
    { id: 'avatar', label: 'Quem é seu cliente ideal e qual problema ele tem?', placeholder: 'Ex: Trabalhador com carteira assinada há 5+ anos, demitido sem aviso prévio, desconfia que a empresa não pagou tudo corretamente, sente raiva mas medo de "brigar" com empresa grande', rows: 3 },
    { id: 'transformation', label: 'O que o cliente conquista quando você ganha o caso?', placeholder: 'Ex: Recebe na conta o que é de direito (multa de 40% FGTS, aviso prévio, verbas rescisórias) + indenização por dano moral, sem precisar enfrentar o ex-patrão pessoalmente', rows: 2 },
    { id: 'authority', label: 'Formação, OAB, anos de experiência e conquistas', placeholder: 'Ex: OAB/SP 123.456, 15 anos de advocacia trabalhista, pós-graduado pela FGV, +800 processos conduzidos, taxa de êxito de 87%', rows: 2 },
    { id: 'fees_model', label: 'Modelo de honorários (quebra objeção de custo)', placeholder: 'Ex: Trabalhamos com honorários de êxito — você não paga nada adiantado. Só cobramos uma porcentagem do que recuperarmos para você.', rows: 2, hint: 'Honorários de êxito é o principal diferencial para converter clientes com medo do custo.' },
    { id: 'social_proof', label: 'Cases reais com valores recuperados', placeholder: 'Ex: Marcos, 52 anos — recuperou R$47k em verbas que a empresa escondeu. "O Dr. Carlos me explicou tudo com paciência."', rows: 2 },
    { id: 'main_objection', label: 'Principal objeção do cliente', placeholder: 'Ex: "A empresa é grande, não vou ganhar" / "Vai demorar anos" / "Não quero problemas"' },
    { id: 'cta', label: 'CTA — como dar o primeiro passo', placeholder: 'Ex: Falar no WhatsApp agora para análise gratuita do seu caso (resposta em até 2h)' },
    { id: 'urgency', label: 'Urgência real (prazo prescricional funciona muito bem)', placeholder: 'Ex: Você tem apenas 2 anos após a demissão para entrar com a ação. Não perca seus direitos por esperar.' },
  ],

  'Infoprodutos / Cursos': [
    { id: 'business_name', label: 'Nome do produto / curso / mentoria', placeholder: 'Ex: Método Copy Mestre, Mentoria Copywriter 6 em 7, Curso Gestão de Tráfego do Zero' },
    { id: 'avatar', label: 'Para quem é EXATAMENTE?', placeholder: 'Ex: Iniciantes em marketing digital de 20 a 35 anos que querem renda extra de R$3-5k/mês trabalhando de casa, mas não sabem por onde começar e já viram muita "promessa sem resultado"', rows: 3 },
    { id: 'transformation', label: 'Transformação específica em quanto tempo?', placeholder: 'Ex: Em 30 dias: primeiro cliente fechado e primeiro pagamento recebido. Em 90 dias: renda recorrente de R$3k+/mês trabalhando 4h/dia', rows: 2 },
    { id: 'unique_mechanism', label: 'Método único (o que diferencia de todos os outros cursos?)', placeholder: 'Ex: O único curso que ensina a fechar clientes ANTES de terminar as aulas, com script testado em +500 alunos que nunca venderam nada na vida', rows: 2 },
    { id: 'authority', label: 'Quem ensina? Resultados que você mesmo alcançou', placeholder: 'Ex: Lucas Ramos — demitido em 2020, comecei do zero, em 18 meses faturando R$40k/mês como copy. Já ensinei +3.000 alunos.', rows: 2 },
    { id: 'social_proof', label: 'Cases de alunos com situação parecida ao avatar', placeholder: 'Ex: "Sem experiência, fechei meu primeiro cliente de R$1.200 na terceira semana" — Ana, 28 anos, dona de casa\n"Larguei o emprego CLT no mês 4" — Pedro, 31 anos', rows: 3 },
    { id: 'main_objection', label: 'Principal objeção e como você a quebra', placeholder: 'Ex: "Não tenho experiência" → você não precisa — nosso método foi criado para quem está começando do absoluto zero' },
    { id: 'cta', label: 'CTA da landing page', placeholder: 'Ex: Garantir minha vaga na lista VIP e receber uma aula bônus gratuita antes do lançamento' },
    { id: 'urgency', label: 'Urgência real', placeholder: 'Ex: Lista VIP fecha sexta-feira / Apenas 500 vagas / Aula gratuita para os primeiros 200 inscritos' },
  ],

  'Gestão de Tráfego / Marketing': [
    { id: 'business_name', label: 'Nome da agência / profissional', placeholder: 'Ex: Performance Digital — Bruno Silva | Agência Converte' },
    { id: 'specialty', label: 'Especialidade e plataformas que domina', placeholder: 'Ex: Tráfego pago no Meta Ads e Google Ads para clínicas e e-commerces de saúde e beleza' },
    { id: 'avatar', label: 'Cliente ideal (tipo de negócio, faturamento, problema)', placeholder: 'Ex: Donos de clínicas estéticas faturando R$30-100k/mês que já tentaram impulsionar posts sem resultado e precisam de clientes novos toda semana', rows: 3 },
    { id: 'transformation', label: 'Resultado concreto que você entrega em quanto tempo?', placeholder: 'Ex: Nos primeiros 30 dias: redução do custo por lead em 40% e primeiros clientes entrando. Em 90 dias: agenda lotada com ROI de 3:1', rows: 2 },
    { id: 'unique_mechanism', label: 'Seu processo / metodologia (o que te diferencia)', placeholder: 'Ex: Funil Inteligente de 3 Camadas — captura quente, retargeting com prova social e fechamento por WhatsApp automatizado. Diferente de agências que só "impulsionam post".', rows: 3 },
    { id: 'social_proof', label: 'Cases reais com números de ROI', placeholder: 'Ex: Clínica Bem Estar: investiu R$3k/mês e gerou R$28k em procedimentos no 1º mês. Loja Bella: ROAS 7,3 no Google Shopping.', rows: 2 },
    { id: 'main_objection', label: 'Principal objeção', placeholder: 'Ex: "Já contratei agência e foi dinheiro jogado fora" / "Não tenho verba para investir"' },
    { id: 'cta', label: 'CTA (diagnóstico gratuito funciona muito bem)', placeholder: 'Ex: Solicitar diagnóstico gratuito de 30 min para analisar seus anúncios atuais e mostrar onde está perdendo dinheiro' },
    { id: 'urgency', label: 'Urgência real', placeholder: 'Ex: Apenas 3 novos clientes por mês (agenda limitada para manter qualidade) / Proposta válida por 48h' },
  ],

  'Academia / Personal / Nutrição': [
    { id: 'business_name', label: 'Nome do profissional / academia', placeholder: 'Ex: Personal Trainer Rafael Gomes — Emagrecimento Masculino | Nutri Ana Clara | Studio Alpha' },
    { id: 'specialty', label: 'Foco e especialidade', placeholder: 'Ex: Emagrecimento para homens acima de 40 anos com metodologia anti-inflamatória + treino funcional de 3x/semana' },
    { id: 'avatar', label: 'Cliente ideal detalhado', placeholder: 'Ex: Homens de 35 a 55 anos, gerentes ou empreendedores, estressados, com barriga crescendo, que tentaram academia antes mas desistiram por falta de tempo ou resultado', rows: 3 },
    { id: 'transformation', label: 'Antes e depois específico (com tempo)', placeholder: 'ANTES: Barriga de 98cm, pressão 14x9, cansado, envergonhado na praia\nDEPOIS (90 dias): Barriga de 88cm, pressão controlada, camiseta M de volta, energia para brincar com os filhos', rows: 3 },
    { id: 'unique_mechanism', label: 'Metodologia / protocolo único', placeholder: 'Ex: Protocolo Homem 40+ — combina treino de força adaptado, protocolo nutricional anti-inflamatório e gestão do cortisol. Único método que trata as causas do ganho de peso masculino após os 40.', rows: 2 },
    { id: 'authority', label: 'Formação, CREF/CRN e resultados', placeholder: 'Ex: CREF 12345, pós-graduado em Fisiologia do Exercício, 9 anos de experiência, +400 alunos transformados, ex-obeso que perdeu 35kg usando o próprio método', rows: 2 },
    { id: 'social_proof', label: 'Depoimentos com transformação real', placeholder: 'Ex: "Perdi 18kg em 4 meses e parei de tomar remédio para pressão" — Roberto, 47 anos, sócio de empresa de TI', rows: 2 },
    { id: 'main_objection', label: 'Principal objeção', placeholder: 'Ex: "Não tenho tempo" / "Já tentei de tudo e não funcionou" / "Tenho problema no joelho"' },
    { id: 'cta', label: 'CTA', placeholder: 'Ex: Avaliação física gratuita de 30 min (presencial ou online) para montar seu plano personalizado' },
    { id: 'urgency', label: 'Urgência real', placeholder: 'Ex: Turma online abre dia X — apenas 20 vagas / 3 horários presenciais vagos neste mês' },
  ],
}

// ============================================================
// PERGUNTAS ESPECÍFICAS POR NICHO — ONE PAGE
// ============================================================

const OP_NICHE: NicheQuestions = {

  'Clínica / Saúde': [
    { id: 'business_name', label: 'Nome completo da clínica / profissional', placeholder: 'Ex: Clínica Neuropsicológica Mente Viva — Dr. Paulo Neves' },
    { id: 'description', label: 'O que a clínica faz? (descrição completa)', placeholder: 'Ex: Clínica de neuropsicologia que atende crianças com TDAH, dislexia e autismo, e adultos com ansiedade, burnout e depressão, com abordagem integrativa e parecer neuropsicológico', rows: 3 },
    { id: 'history', label: 'História e missão da clínica', placeholder: 'Ex: Fundada em 2015 depois que o Dr. Paulo viu crianças com TDAH sendo medicadas sem diagnóstico preciso — missão de oferecer avaliação completa antes de qualquer tratamento', rows: 2 },
    { id: 'services', label: 'Serviços oferecidos (liste todos)', placeholder: 'Ex: Avaliação neuropsicológica completa / Parecer para escola / Psicoterapia individual / Orientação a pais / Laudos para INSS', rows: 3 },
    { id: 'differentials', label: 'Diferenciais reais', placeholder: 'Ex: Única clínica da região com avaliação neuropsicológica E psicoterapia no mesmo local / Laudos em até 15 dias / Atendimento online disponível', rows: 2 },
    { id: 'team', label: 'Equipe (nomes, formações, especialidades)', placeholder: 'Ex: Dr. Paulo Neves — neuropsicólogo CRP 01/12345, doutorado USP / Dra. Mariana Lima — psicóloga CRP, especialista em TCC infantil', rows: 2 },
    { id: 'social_proof', label: 'Números e depoimentos', placeholder: 'Ex: +1.500 avaliações realizadas, 96% de satisfação, "finalmente entendemos por que nosso filho tinha dificuldade na escola" — família Silva', rows: 2 },
    { id: 'contact_cta', label: 'Contato e CTA final', placeholder: 'Ex: WhatsApp (11) 99999-0000 / Rua X, nº Y, Bairro / Seg a Sex 8h-18h / Agende sua avaliação' },
  ],

  'Advocacia / Jurídico': [
    { id: 'business_name', label: 'Nome do escritório', placeholder: 'Ex: Lima & Associados — Advocacia Trabalhista e Previdenciária' },
    { id: 'description', label: 'Descrição completa do escritório', placeholder: 'Ex: Escritório fundado em 2009 especializado em direito trabalhista e previdenciário, com foco em recuperar verbas de empregados prejudicados e benefícios negados pelo INSS', rows: 3 },
    { id: 'history', label: 'História / missão', placeholder: 'Ex: Criado por advogados que acreditam que o trabalhador brasileiro merece defesa de qualidade, independente do tamanho da empresa do outro lado', rows: 2 },
    { id: 'areas', label: 'Áreas de atuação (detalhe cada uma)', placeholder: 'Ex: 1. Trabalhista — demissão, assédio, horas extras | 2. Previdenciário — aposentadoria, benefício negado | 3. Acidente de trabalho | 4. FGTS', rows: 3 },
    { id: 'differentials', label: 'Diferenciais do escritório', placeholder: 'Ex: Honorários só no êxito / Atendimento online para todo Brasil / Equipe de 6 advogados especialistas / Resposta em até 24h', rows: 2 },
    { id: 'social_proof', label: 'Resultados e números', placeholder: 'Ex: +2.000 casos ganhos / R$12M recuperados para clientes / 89% de taxa de êxito em 15 anos', rows: 2 },
    { id: 'fees', label: 'Modelo de honorários', placeholder: 'Ex: Consulta inicial gratuita / Honorários somente em caso de êxito — sem custo antecipado' },
    { id: 'contact_cta', label: 'Contato', placeholder: 'Ex: WhatsApp (11) 99999-0000 / OAB/SP 123.456 / Rua X, SP / Também atendemos online' },
  ],

  'Gestão de Tráfego / Marketing': [
    { id: 'business_name', label: 'Nome da agência / profissional', placeholder: 'Ex: Agência Converte — Performance em Meta e Google Ads' },
    { id: 'description', label: 'O que a agência faz e para quem', placeholder: 'Ex: Agência de performance digital especializada em tráfego pago para clínicas e e-commerces — geramos leads qualificados que se convertem em clientes reais', rows: 3 },
    { id: 'history', label: 'História / como surgiu', placeholder: 'Ex: Fundada por Bruno Silva em 2019 depois de 4 anos gerenciando R$2M+/mês em tráfego para grandes marcas — hoje focados exclusivamente em PMEs do setor de saúde', rows: 2 },
    { id: 'services', label: 'Serviços oferecidos', placeholder: 'Ex: Gestão de Meta Ads / Google Ads / Funil de vendas completo / Criação de landing pages / Relatórios semanais', rows: 3 },
    { id: 'differentials', label: 'Diferenciais reais', placeholder: 'Ex: Contrato mensal sem fidelidade / Relatório toda semana / Especialistas no nicho de saúde / Reunião de alinhamento quinzenal', rows: 2 },
    { id: 'social_proof', label: 'Cases com números reais', placeholder: 'Ex: Clínica X: 127 leads/mês a R$18 o lead / E-commerce Y: ROAS 6.2 / R$0 para R$80k em vendas em 3 meses', rows: 2 },
    { id: 'contact_cta', label: 'Contato e CTA', placeholder: 'Ex: WhatsApp para diagnóstico gratuito / contato@agencia.com / @agenciaconverte no Instagram' },
  ],

  'Infoprodutos / Cursos': [
    { id: 'business_name', label: 'Nome da escola / plataforma / especialista', placeholder: 'Ex: Escola Copy Pro — Lucas Ramos | Instituto Gestão Digital' },
    { id: 'description', label: 'O que você ensina e para quem', placeholder: 'Ex: Escola online que ensina copywriting e vendas digitais para profissionais que querem trabalhar de casa com liberdade financeira', rows: 3 },
    { id: 'history', label: 'Sua história / como chegou aqui', placeholder: 'Ex: Fui demitido em 2020, aprendi copywriting por conta própria, em 18 meses estava faturando R$40k/mês. Criei a escola para encurtar esse caminho para outros.', rows: 2 },
    { id: 'services', label: 'Cursos e programas oferecidos', placeholder: 'Ex: Formação Copywriter Profissional (6 meses) / Curso de Lançamentos / Mentoria Individual / Comunidade mensal', rows: 3 },
    { id: 'differentials', label: 'Diferenciais reais', placeholder: 'Ex: Único curso onde você fecha cliente durante as aulas / Suporte no Discord 7 dias/semana / Atualização vitalícia do conteúdo', rows: 2 },
    { id: 'social_proof', label: 'Números e depoimentos de alunos', placeholder: 'Ex: +3.000 alunos formados / "Saí do emprego em 4 meses" — Ana, 28 anos / "Primeiro cliente fechado na semana 3" — Pedro', rows: 2 },
    { id: 'contact_cta', label: 'Como se inscrever / CTA', placeholder: 'Ex: Próxima turma abre em março — lista de espera disponível / WhatsApp para tirar dúvidas' },
  ],

  'Academia / Personal / Nutrição': [
    { id: 'business_name', label: 'Nome do profissional / academia / studio', placeholder: 'Ex: Studio Alpha — Personal Training Especializado | Nutri Ana Clara | Academia Performance' },
    { id: 'description', label: 'O que você oferece e para quem', placeholder: 'Ex: Studio de personal training especializado em emagrecimento masculino para homens de 40+ com rotina intensa e histórico de tentativas frustradas com academia convencional', rows: 3 },
    { id: 'history', label: 'Sua história', placeholder: 'Ex: Fui personal trainer de academia por 5 anos, vi dezenas de homens desistindo porque o método convencional não funciona para eles. Criei o Protocolo 40+ especificamente para essa fase.', rows: 2 },
    { id: 'services', label: 'Serviços / programas oferecidos', placeholder: 'Ex: Personal presencial / Acompanhamento online / Programa intensivo 90 dias / Consultoria nutricional / Grupo de emagrecimento', rows: 3 },
    { id: 'differentials', label: 'Diferenciais reais', placeholder: 'Ex: Protocolo exclusivo para 40+ / Treinos de 45 min sem lesão / Plano alimentar sem restrições extremas / Suporte diário pelo app', rows: 2 },
    { id: 'social_proof', label: 'Resultados e depoimentos', placeholder: 'Ex: +400 alunos transformados / "Perdi 22kg e parei o remédio de pressão" — Eduardo, 52 anos / "Mais energia do que aos 35" — Marcos, 48 anos', rows: 2 },
    { id: 'contact_cta', label: 'Contato e CTA', placeholder: 'Ex: WhatsApp para avaliação gratuita / Endereço da academia / Horários de atendimento' },
  ],
}

// ============================================================
// PERGUNTAS ESPECÍFICAS POR NICHO — SALES PAGE
// ============================================================

const SP_NICHE: NicheQuestions = {

  'Infoprodutos / Cursos': [
    { id: 'product_name', label: 'Nome do produto / curso / mentoria', placeholder: 'Ex: Método Copy que Converte / Formação Gestor de Tráfego Premium / Mentoria Clínica 6 em 7' },
    { id: 'avatar', label: 'Avatar ULTRA específico (seja preciso)', placeholder: 'Ex: Copywriters freelancer com 1-3 anos de experiência faturando entre R$3k e R$6k/mês, que escrevem bem mas não sabem precificar, não têm processo e vivem na ansiedade de saber se o próximo mês vai pagar as contas', rows: 3, hint: 'Quanto mais específico o avatar, mais o leitor certo vai pensar "isso foi escrito pra mim".' },
    { id: 'problem', label: 'A dor mais profunda (emocional, não técnica)', placeholder: 'Ex: A sensação de que trabalha mais que qualquer CLT, cobra barato com medo de perder o cliente, e quando olha para colegas que faturam 3x mais não entende o que está faltando', rows: 3 },
    { id: 'agitation', label: 'O que acontece se ele não agir? (futuro sombrio)', placeholder: 'Ex: Continua preso nos R$3-4k/mês, aceitando qualquer cliente, sem poder recusar trabalho ruim — daqui 2 anos estará exatamente igual, só mais cansado e frustrado', rows: 2 },
    { id: 'solution', label: 'A solução: seu método / produto (com nome)', placeholder: 'Ex: O Método Precificação Estratégica ensina os 4 pilares que copies de elite usam para cobrar R$5-15k por projeto: posicionamento de nicho, proposta irrecusável, processo de vendas consultivo e entrega que gera referência', rows: 3 },
    { id: 'authority', label: 'Sua história / autoridade (o que você JÁ fez)', placeholder: 'Ex: Sou Lucas Ramos — saí de R$800/mês para R$42k/mês como copywriter em 3 anos. Escrevi para 80+ empresas, gerei R$18M+ em vendas para clientes e formei mais de 1.400 copies no Brasil', rows: 2 },
    { id: 'social_proof', label: 'Cases de alunos com contexto similar ao avatar', placeholder: 'Ex: "Cobrava R$500 por landing page. Depois do módulo 3, fechei um cliente de R$4.800 na mesma semana" — Fernanda, 29 anos\n"Larguei o emprego no mês 5 da mentoria" — Thiago, 33 anos', rows: 4 },
    { id: 'objections', label: 'As 3 objeções mais comuns + como você quebra cada uma', placeholder: 'OBJ 1: "Não tenho experiência suficiente"\n→ O curso começa do zero e a maioria dos alunos fecha o primeiro cliente ainda durante as aulas\n\nOBJ 2: "Já comprei curso e não funcionou"\n→ Aqui você aprende implementando — cada módulo tem missão de aplicar e grupo de feedback\n\nOBJ 3: "Está caro"\n→ 1 cliente fechado com o método paga o investimento. E você vai fechar no mês 1.', rows: 6 },
    { id: 'offer', label: 'O que está incluso na oferta (liste TUDO, com bônus)', placeholder: 'PRINCIPAL:\n• 8 módulos em vídeo (atualização vitalícia)\n• Comunidade no Discord com mentoria coletiva semanal\n\nBÔNUS:\n• Templates de proposta e contrato (valor R$497)\n• Script de descoberta para call de vendas (valor R$297)', rows: 5 },
    { id: 'price_guarantee', label: 'Preço, condições e garantia', placeholder: 'Ex: R$1.997 à vista ou 12x R$197 / Garantia incondicional de 30 dias — devolução de 100% sem perguntas' },
    { id: 'urgency', label: 'Urgência / escassez (real e específica)', placeholder: 'Ex: Turma fecha domingo dia 25 às 23h59 / Os 50 primeiros ganham sessão de diagnóstico 1:1 de 45 min / Preço sobe R$500 na próxima turma' },
  ],

  'Clínica / Saúde': [
    { id: 'product_name', label: 'Nome do programa / método / serviço', placeholder: 'Ex: Programa Mente Leve — 8 semanas para ansiedade / Método Anti-Dor Crônica / Protocolo Emagrecimento 90 dias' },
    { id: 'avatar', label: 'Paciente ideal ultra específico', placeholder: 'Ex: Mulheres de 30-45 anos com episódios de ansiedade e síndrome do pânico há mais de 1 ano, que já tentaram medicação mas odeiam os efeitos colaterais e vão perdendo espaço na própria vida', rows: 3 },
    { id: 'problem', label: 'A dor mais profunda do paciente', placeholder: 'Ex: Acorda já ansiosa, fica esperando o próximo ataque de pânico, evita situações que podem desencadear, vai perdendo viagens, festas, reuniões — e sente que está encolhendo enquanto os outros vivem normalmente', rows: 3 },
    { id: 'agitation', label: 'Consequências de não tratar (com empatia)', placeholder: 'Ex: Sem tratamento adequado, a ansiedade tende a se intensificar e limitar cada vez mais. Muitos chegam à agorafobia sem perceber o processo. E a medicação sem psicoterapia trata o sintoma, não a causa.', rows: 2 },
    { id: 'solution', label: 'Seu protocolo / programa único', placeholder: 'Ex: Programa Mente Leve de 8 semanas — combina TCC, técnicas de regulação do sistema nervoso e plano de exposição gradual. Diferente da consulta avulsa: é um processo estruturado com começo, meio e fim.', rows: 3 },
    { id: 'authority', label: 'Credenciais e experiência', placeholder: 'Ex: Dra. Ana Paula, CRP 01/23456, psicóloga especialista em TCC pela PUC, 10 anos com ansiedade, +600 pacientes atendidos', rows: 2 },
    { id: 'social_proof', label: 'Depoimentos com transformação real', placeholder: 'Ex: "Depois de 4 semanas no programa, fui sozinha ao shopping pela primeira vez em 2 anos. Chorei de emoção." — Carla, 39 anos, professora', rows: 2 },
    { id: 'objections', label: 'Objeções e respostas', placeholder: 'OBJ 1: "Já fiz terapia antes e não funcionou"\n→ O programa tem estrutura e protocolo definido — não é terapia de suporte genérica\n\nOBJ 2: "Vou ter tempo para os exercícios?"\n→ São 20-30 min/dia de prática guiada', rows: 4 },
    { id: 'offer', label: 'O que está incluso no programa', placeholder: 'Ex: 8 sessões semanais de 1h (online ou presencial) / Material de apoio e exercícios diários / Suporte por WhatsApp entre sessões / Acesso a grupo exclusivo', rows: 3 },
    { id: 'price_guarantee', label: 'Investimento e garantia', placeholder: 'Ex: R$2.400 à vista ou 6x R$420 / Garantia: se após as 2 primeiras semanas você não sentir diferença, devolvemos o valor integral' },
    { id: 'urgency', label: 'Urgência ou disponibilidade', placeholder: 'Ex: Próxima turma começa dia 1º de março — apenas 12 vagas / Agenda presencial: 2 horários disponíveis neste mês' },
  ],

  'Academia / Personal / Nutrição': [
    { id: 'product_name', label: 'Nome do programa / método', placeholder: 'Ex: Protocolo Homem 40+ / Programa Emagrecimento com Saúde 90 Dias / Consultoria Nutricional Online' },
    { id: 'avatar', label: 'Cliente ideal específico', placeholder: 'Ex: Homens de 40-55 anos, empresários ou executivos, com rotina estressante e 15-30kg a perder, que já tentaram emagrecer mas falham na consistência por falta de tempo', rows: 3 },
    { id: 'problem', label: 'Dor profunda (física + emocional)', placeholder: 'Ex: Cansa ao subir escada, barriga crescendo mesmo sem comer muito, médico falou em risco metabólico, vergonha de tirar a camisa, sente que perdeu o controle do próprio corpo', rows: 3 },
    { id: 'agitation', label: 'O que acontece se não agir', placeholder: 'Ex: Sem intervenção, o quadro metabólico tende a piorar. Pré-diabetes vira diabetes. Hipertensão aumenta. E cada ano mais difícil perder o que acumulou.', rows: 2 },
    { id: 'solution', label: 'Seu protocolo único', placeholder: 'Ex: Protocolo Homem 40+ — 3 treinos de 45 min/semana adaptados para metabolismo masculino pós-40, plano alimentar anti-inflamatório e suporte via app com check-in diário', rows: 3 },
    { id: 'authority', label: 'Sua autoridade + resultado próprio', placeholder: 'Ex: CREF 12345, esp. em fisiologia do exercício, 11 anos de experiência, ex-obeso que perdeu 28kg aos 38 anos usando o próprio método. +500 homens transformados.', rows: 2 },
    { id: 'social_proof', label: 'Cases com antes/depois e contexto', placeholder: 'Ex: "Perdi 22kg em 5 meses e parei o remédio de pressão" — Eduardo, 52 anos, dono de construtora. "Tenho mais energia hoje do que aos 35" — Marcos, 48 anos, diretor comercial.', rows: 3 },
    { id: 'objections', label: 'Objeções + respostas', placeholder: 'OBJ 1: "Não tenho tempo"\n→ 3 treinos de 45 min — menos tempo do que qualquer academia convencional\n\nOBJ 2: "Tenho problema no joelho"\n→ O protocolo é adaptado — trabalhamos com suas limitações, não contra elas', rows: 5 },
    { id: 'offer', label: 'O que está incluso', placeholder: 'Ex: 3 treinos semanais personalizados / Plano alimentar + receitas práticas / Check-in diário no app / Consulta de revisão mensal / Suporte via WhatsApp', rows: 3 },
    { id: 'price_guarantee', label: 'Investimento e garantia', placeholder: 'Ex: R$497/mês (contrato de 3 meses) ou R$1.297 à vista / Garantia de resultado: se não perder ao menos 5kg no primeiro mês seguindo o protocolo, devolvemos o valor' },
    { id: 'urgency', label: 'Urgência real', placeholder: 'Ex: Apenas 8 vagas disponíveis para acompanhamento individual em março / Inscrições encerram sexta-feira' },
  ],

  'Gestão de Tráfego / Marketing': [
    { id: 'product_name', label: 'Nome do serviço / programa / consultoria', placeholder: 'Ex: Gestão de Tráfego Premium / Programa Agência Escalável / Mentoria Performance Digital' },
    { id: 'avatar', label: 'Cliente ideal ultra específico', placeholder: 'Ex: Gestores de tráfego solo com 1-3 anos de experiência, faturando R$4-10k/mês, que querem ter sua própria agência mas não sabem como precificar, contratar ou sistematizar para escalar sem trabalhar mais', rows: 3 },
    { id: 'problem', label: 'Dor mais profunda', placeholder: 'Ex: Sente que trabalha feito louco para clientes que não valorizam, cobra barato com medo de perder, cada mês começa do zero sem previsibilidade, e vê outros gestores cobrando 3x mais com menos esforço', rows: 3 },
    { id: 'agitation', label: 'O que acontece se não mudar', placeholder: 'Ex: Continua trocando hora por dinheiro, dependendo de indicação, sem sistema, sem escala. Daqui a 2 anos ainda vai estar no mesmo lugar, só mais cansado — enquanto o mercado evolui sem ele.', rows: 2 },
    { id: 'solution', label: 'Sua solução / método', placeholder: 'Ex: Método Agência Assimétrica — você aprende a montar uma operação de R$15-30k/mês com 2-3 colaboradores, contratos de 6 meses e relatórios que vendem sozinhos', rows: 3 },
    { id: 'authority', label: 'Sua autoridade comprovada', placeholder: 'Ex: Construí minha agência de R$0 a R$120k/mês em 3 anos, gerenciei R$8M+ em tráfego, hoje trabalho 4h/dia com equipe de 5 pessoas e 12 clientes fixos', rows: 2 },
    { id: 'social_proof', label: 'Cases de clientes / alunos', placeholder: 'Ex: "Saí de gestor solo para agência de R$25k/mês em 6 meses" — Rodrigo, 29 anos / "Fechei meu primeiro contrato de R$4.500 na primeira semana" — Juliana, 26 anos', rows: 3 },
    { id: 'objections', label: 'Objeções + respostas', placeholder: 'OBJ 1: "Não tenho clientes para montar agência"\n→ O módulo 2 ensina a prospectar 3 clientes em 30 dias usando apenas DM e indicação estruturada\n\nOBJ 2: "Não sei gerenciar equipe"\n→ Você só vai contratar quando já tiver o processo documentado — ensinamos isso antes', rows: 5 },
    { id: 'offer', label: 'O que está incluso', placeholder: 'Ex: 8 semanas de formação / Mentoria ao vivo semanal / Comunidade exclusiva / Templates de proposta, contrato e relatório / Bônus: auditoria de anúncios 1:1', rows: 3 },
    { id: 'price_guarantee', label: 'Preço e garantia', placeholder: 'Ex: R$2.997 à vista ou 12x R$297 / Garantia de 30 dias sem perguntas' },
    { id: 'urgency', label: 'Urgência real', placeholder: 'Ex: Turma de março: 40 vagas / Inscrições encerram no dia 10 / Bônus de R$1.200 para os 15 primeiros inscritos' },
  ],
}

// ============================================================
// FUNÇÃO PRINCIPAL — retorna perguntas para um tipo + nicho
// ============================================================

export function getBriefingQuestions(pageType: PageType, niche: string): Question[] {
  const nicheMap: Record<PageType, NicheQuestions> = {
    landing_page: LP_NICHE,
    one_page: OP_NICHE,
    sales_page: SP_NICHE,
  }

  const baseMap: Record<PageType, Question[]> = {
    landing_page: BASE_LANDING_PAGE,
    one_page: BASE_ONE_PAGE,
    sales_page: BASE_SALES_PAGE,
  }

  return nicheMap[pageType]?.[niche] ?? baseMap[pageType]
}

// ============================================================
// GERADOR DE PROMPT — monta prompt de copywriting a partir das respostas
// ============================================================

export function generatePrompt(
  pageType: PageType,
  niche: string,
  responses: Record<string, string>
): string {
  const typeLabel = PAGE_TYPE_LABELS[pageType]

  const lines = Object.entries(responses)
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => {
      const label = k.toUpperCase().replace(/_/g, ' ')
      return `${label}:\n${v}`
    })
    .join('\n\n')

  const structureMap: Record<PageType, string> = {
    landing_page: `ESTRUTURA DA LANDING PAGE:
1. HEADLINE PRINCIPAL — impactante, focada na transformação, máx 12 palavras
2. SUBTÍTULO — reforça o benefício e quem é o público, máx 20 palavras
3. PROVA SOCIAL RÁPIDA — número ou depoimento curto para validar antes de mais nada
4. BENEFÍCIOS — 3 a 5 bullets no formato "✓ Benefício claro e direto" (venda resultado, não feature)
5. COMO FUNCIONA — 3 passos simples e sem jargão
6. QUEBRA DE OBJEÇÃO — parágrafo que antecipa e elimina o maior medo do cliente
7. SOBRE / AUTORIDADE — 2-3 linhas que constroem credibilidade (sem ser arrogante)
8. PROVA SOCIAL — 1 depoimento realista com nome, contexto e resultado específico
9. CTA COM URGÊNCIA — frase de ação + texto do botão + reforço de urgência`,

    one_page: `ESTRUTURA DO ONE PAGE:
1. HERO — Headline forte + subtítulo + CTA de contato (botão de WhatsApp/formulário)
2. SOBRE — Breve história, missão e propósito (humaniza a empresa)
3. SERVIÇOS — 3-4 serviços principais com título, descrição curta e benefício
4. DIFERENCIAIS — 3 razões concretas para escolher esta empresa (sem ser genérico)
5. NÚMEROS / RESULTADOS — dados que constroem credibilidade (anos, casos, clientes)
6. DEPOIMENTOS — 2-3 depoimentos com nome, contexto e transformação real
7. EQUIPE — Apresentação breve dos profissionais (se aplicável)
8. CONTATO / CTA FINAL — endereço, telefone, horários + botão de ação`,

    sales_page: `ESTRUTURA DA PÁGINA DE VENDAS (formato longo):
1. HEADLINE PODEROSA — foca no resultado final, não no produto
2. IDENTIFICAÇÃO COM O AVATAR — "Se você é [perfil específico] e sente [dor específica]..."
3. AGITAÇÃO DO PROBLEMA — aprofunda a dor com empatia e sem julgamento
4. PROMESSA + VIRADA — "Existe uma saída. E não é o que você está pensando."
5. SOLUÇÃO (MECANISMO ÚNICO) — apresenta o método com nome e lógica clara
6. AUTORIDADE — quem é você e por que pode entregar essa transformação
7. O QUE ESTÁ INCLUSO — lista completa da oferta (cria valor antes de mostrar preço)
8. PARA QUEM É (E PARA QUEM NÃO É) — qualificação honesta do público
9. PROVA SOCIAL — 2-3 cases detalhados com situação inicial, processo e resultado
10. QUEBRA DE OBJEÇÕES — FAQ com as 3 maiores barreiras
11. GARANTIA — redução de risco com linguagem de confiança
12. OFERTA E PREÇO — apresentação do valor percebido ANTES do número
13. CTA FINAL — urgência real + chamada direta para ação`,
  }

  return `Você é um especialista em copywriting com foco em alta conversão para o mercado brasileiro.
Escreva uma copy profissional e persuasiva para ${typeLabel} no nicho: ${niche}.

Use português brasileiro natural, direto e sem termos técnicos de marketing.
A copy deve soar como uma conversa real, não como publicidade genérica.
Seja específico — use as informações do briefing em cada seção.
Adapte o tom ao nicho e ao avatar descrito.

Não use asteriscos, hashtags, emojis ou formatação markdown — apenas texto limpo e estruturado.

═══════════════════════════════════════
BRIEFING DO CLIENTE
═══════════════════════════════════════
TIPO DE PÁGINA: ${typeLabel}
NICHO: ${niche}

${lines}

═══════════════════════════════════════
${structureMap[pageType]}
═══════════════════════════════════════

Importante: seja ultra específico. Use as informações do briefing em cada seção — nenhum parágrafo pode ser genérico. O leitor ideal deve sentir que a copy foi escrita especificamente para ele.`
}
