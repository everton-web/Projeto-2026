// Dados fictícios para modo demo
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const demoProfile = {
  id: 'demo-user-id',
  email: 'demo@webdesignhub.com',
  full_name: 'Everton Brito',
  avatar_url: null,
  role: 'admin' as const,   // admin para testar o painel no modo demo
  plan: 'pro' as const,
  plan_expires_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const demoClients = [
  {
    id: 'client-1',
    user_id: 'demo-user-id',
    name: 'Clínica Bem Estar',
    email: 'contato@clinicabemestar.com',
    phone: '(11) 99999-0001',
    niche: 'Clínica / Saúde',
    notes: 'Cliente interessado em página de agendamento online.',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'client-2',
    user_id: 'demo-user-id',
    name: 'Restaurante Casa da Vó',
    email: 'casa.vovo@gmail.com',
    phone: '(11) 98888-0002',
    niche: 'Restaurante / Alimentação',
    notes: 'Quer atrair mais clientes para o delivery.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'client-3',
    user_id: 'demo-user-id',
    name: 'Studio Glam - Ana Beatriz',
    email: 'anaglam@studio.com',
    phone: '(11) 97777-0003',
    niche: 'Beleza / Estética',
    notes: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const demoBriefings = [
  {
    id: 'briefing-1',
    client_id: 'client-1',
    user_id: 'demo-user-id',
    token: 'demo-token-abc123',
    page_type: 'landing_page' as const,
    niche_selected: 'Clínica / Saúde',
    niche: 'Clínica / Saúde',
    title: 'LP - Clínica Bem Estar (Fisioterapia)',
    responses: {
      business_name: 'Clínica Bem Estar',
      value_proposition: 'Elimine a dor crônica em até 8 sessões com fisioterapia especializada',
      target_audience: 'Adultos com dores crônicas e atletas em recuperação',
      main_benefit: 'Retorne às atividades que você ama sem dor e sem cirurgia',
      cta: 'Agendar avaliação gratuita pelo WhatsApp',
      tone: 'Empático e profissional, transmitindo segurança e cuidado',
      differentials: 'Equipe com CREFITO ativo, equipamentos modernos, planos de saúde aceitos',
      urgency: 'Apenas 5 vagas de avaliação gratuita disponíveis este mês',
      specialty: 'Fisioterapia e Reabilitação Ortopédica',
      certifications: 'CREFITO ativo, pós-graduação em Ortopedia pela USP, 10 anos de experiência',
    },
    submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'briefing-2',
    client_id: 'client-3',
    user_id: 'demo-user-id',
    token: 'demo-token-xyz456',
    page_type: 'one_page' as const,
    niche_selected: 'Beleza / Estética',
    niche: 'Beleza / Estética',
    title: 'One Page - Studio Glam',
    responses: {
      business_name: 'Studio Glam - Ana Beatriz',
      description: 'Estúdio de beleza especializado em coloração, corte e design de sobrancelhas com técnicas exclusivas e produtos importados',
      history: 'Fundado em 2018, o Studio Glam nasceu do sonho de Ana Beatriz de transformar a autoestima das mulheres...',
      services: 'Coloração cabelo, corte feminino e masculino, design de sobrancelha, lash lifting, manicure e pedicure gel',
      target_audience: 'Mulheres de 20 a 55 anos que valorizam aparência e buscam um atendimento personalizado',
      differentials: 'Atendimento exclusivo por agendamento, produtos sem amônia, técnica de coloração 3D importada da Europa',
      social_proof: '+300 clientes satisfeitas, nota 5 estrelas no Google, 15k seguidores no Instagram',
      contact_cta: 'WhatsApp (11) 97777-0003, Instagram @studioglomoficial, seg a sáb 9h às 19h',
      main_service: 'Coloração 3D sem amônia a partir de R$180, resultado que dura 3 meses',
      location_hours: 'Vila Madalena, São Paulo — Segunda a Sábado das 9h às 19h',
    },
    submitted_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'briefing-3',
    client_id: null,
    user_id: 'demo-user-id',
    token: 'demo-token-def789',
    page_type: 'sales_page' as const,
    niche_selected: 'Educação / Cursos',
    niche: 'Educação / Cursos',
    title: 'Sales Page - Curso Webdesign Pro',
    responses: null,
    submitted_at: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const demoCopies = [
  {
    id: 'copy-1',
    user_id: 'demo-user-id',
    client_id: 'client-1',
    briefing_id: 'briefing-1',
    type: 'landing_page' as const,
    title: 'Landing Page - Clínica Bem Estar',
    content: `ELIMINE A DOR CRÔNICA SEM CIRURGIA

Recupere sua qualidade de vida com fisioterapia especializada — resultado comprovado em até 8 sessões

✓ Atendimento com fisioterapeutas com CREFITO ativo e pós-graduação
✓ Equipamentos modernos de última geração
✓ Planos de saúde aceitos — sem surpresas no final
✓ Avaliação inicial gratuita para novos pacientes
✓ Localização central com fácil acesso

COMO FUNCIONA:
1. Agende sua avaliação gratuita pelo WhatsApp
2. Nossa equipe identifica a causa raiz da sua dor
3. Inicie seu protocolo personalizado e veja os resultados

"Depois de 3 anos com dor no joelho, em 6 sessões voltei a correr. Recomendo para todos!" — Marcio S., 42 anos

VAGAS LIMITADAS: Apenas 5 avaliações gratuitas disponíveis este mês.

[QUERO MINHA AVALIAÇÃO GRATUITA →]`,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const demoSnippets = [
  {
    id: 'snippet-1',
    title: 'Botão CTA com hover animado',
    description: 'Botão de chamada para ação com animação suave no hover',
    code: `.btn-cta {
  display: inline-flex;
  align-items: center;
  padding: 14px 32px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.6);
}`,
    language: 'css',
    category: 'Botões',
    tags: ['cta', 'hover', 'animação'],
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'snippet-2',
    title: 'Hero Section responsiva',
    description: 'Seção hero com gradiente e texto centralizado',
    code: `<section class="hero">
  <div class="hero__content">
    <h1>Transforme sua ideia em realidade</h1>
    <p>Soluções digitais que geram resultados reais</p>
    <a href="#contato" class="btn-cta">Fale conosco</a>
  </div>
</section>`,
    language: 'html',
    category: 'Seções',
    tags: ['hero', 'landing-page'],
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'snippet-3',
    title: 'Grid de cards responsivo',
    description: 'Layout de 3 colunas que se adapta a mobile automaticamente',
    code: `.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 40px 0;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}`,
    language: 'css',
    category: 'Layouts',
    tags: ['grid', 'responsivo', 'cards'],
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'snippet-4',
    title: 'Animação de entrada com Intersection Observer',
    description: 'Elementos surgem suavemente ao rolar a página',
    code: `/* CSS */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* JavaScript */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up')
  .forEach(el => observer.observe(el));`,
    language: 'css',
    category: 'Animações',
    tags: ['animação', 'scroll', 'javascript'],
    is_premium: true,
    created_at: new Date().toISOString(),
  },
]

export const demoBibliotecaPosts = [
  {
    id: 'post-1',
    title: 'Botão CTA laranja com efeito glow',
    description: 'Botão de alta conversão com efeito de brilho animado no hover. Perfeito para CTAs principais em landing pages.',
    category: 'Componentes UI',
    tags: ['botão', 'cta', 'hover', 'animação'],
    cover_url: null,
    published: true,
    plan_required: 'basic' as const,
    created_by: 'demo-user-id',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    blocks: [
      {
        id: 'block-1-1',
        post_id: 'post-1',
        type: 'text' as const,
        content: 'Um botão CTA bem construído pode aumentar a conversão em até 30%. Use cores de alto contraste, texto de ação claro e um leve efeito de hover para criar urgência visual.',
        file_url: null,
        language: null,
        caption: null,
        order_index: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: 'block-1-2',
        post_id: 'post-1',
        type: 'code' as const,
        content: `.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: #FF4000;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 64, 0, 0.35);
}

.btn-cta:hover {
  background: #E63800;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 64, 0, 0.55);
}

.btn-cta:active {
  transform: translateY(0);
}`,
        file_url: null,
        language: 'css',
        caption: null,
        order_index: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'block-1-3',
        post_id: 'post-1',
        type: 'code' as const,
        content: `<button class="btn-cta">
  Quero começar agora →
</button>`,
        file_url: null,
        language: 'html',
        caption: null,
        order_index: 2,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'post-2',
    title: 'Hero Section minimalista em dark mode',
    description: 'Seção hero com fundo escuro, tipografia bold e linha de acento laranja. Ideal para landing pages de serviços digitais.',
    category: 'Layouts & Seções',
    tags: ['hero', 'dark', 'tipografia', 'landing-page'],
    cover_url: null,
    published: true,
    plan_required: 'pro' as const,
    created_by: 'demo-user-id',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    blocks: [
      {
        id: 'block-2-1',
        post_id: 'post-2',
        type: 'text' as const,
        content: 'Hero sections em dark mode transmitem modernidade e profissionalismo. A chave está no contraste: texto branco pesado sobre fundo quase-preto, com um único acento colorido para direcionar o olhar.',
        file_url: null,
        language: null,
        caption: null,
        order_index: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: 'block-2-2',
        post_id: 'post-2',
        type: 'code' as const,
        content: `<section class="hero">
  <div class="hero__inner">
    <span class="hero__label">Serviços Digitais</span>
    <h1 class="hero__title">
      Criamos sites que<br>
      <em>geram resultado</em>
    </h1>
    <p class="hero__subtitle">
      Landing pages, one pages e lojas que convertem visitantes em clientes.
    </p>
    <a href="#contato" class="btn-cta">Solicitar orçamento →</a>
  </div>
</section>`,
        file_url: null,
        language: 'html',
        caption: null,
        order_index: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 'block-2-3',
        post_id: 'post-2',
        type: 'code' as const,
        content: `.hero {
  min-height: 100vh;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  padding: 0 24px;
}
.hero__inner { max-width: 680px; }
.hero__label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #FF4000;
  margin-bottom: 16px;
  display: block;
}
.hero__title {
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 20px;
}
.hero__title em {
  font-style: normal;
  color: rgba(255,255,255,0.4);
}
.hero__subtitle {
  font-size: 18px;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
  margin-bottom: 40px;
}`,
        file_url: null,
        language: 'css',
        caption: null,
        order_index: 2,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'post-3',
    title: 'Grid de serviços com ícone + hover',
    description: 'Cards de serviços com borda sutil, ícone e efeito de hover com linha de acento. Funciona bem em seções "O que faço".',
    category: 'Componentes UI',
    tags: ['cards', 'serviços', 'hover', 'grid'],
    cover_url: null,
    published: true,
    plan_required: 'basic' as const,
    created_by: 'demo-user-id',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    blocks: [
      {
        id: 'block-3-1',
        post_id: 'post-3',
        type: 'code' as const,
        content: `.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.service-card {
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 28px;
  transition: border-color 0.3s, transform 0.3s;
  cursor: pointer;
}
.service-card:hover {
  border-color: #FF4000;
  transform: translateY(-4px);
}
.service-card__icon {
  width: 44px;
  height: 44px;
  background: rgba(255,64,0,0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #FF4000;
  font-size: 20px;
}
.service-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}
.service-card__desc {
  font-size: 14px;
  color: rgba(255,255,255,0.45);
  line-height: 1.6;
}`,
        file_url: null,
        language: 'css',
        caption: null,
        order_index: 0,
        created_at: new Date().toISOString(),
      },
    ],
  },
]

export const demoTips = [
  {
    id: 'tip-1',
    title: 'Use lazy loading em todas as imagens',
    content: 'Adicione o atributo loading="lazy" em todas as tags <img> que não estejam visíveis na tela inicial. Isso reduz o tempo de carregamento inicial em até 40%, pois o browser só carrega as imagens quando o usuário rola até elas.',
    category: 'Performance',
    tags: ['imagens', 'lazy-loading'],
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tip-2',
    title: 'Comprima imagens antes de subir',
    content: 'Use ferramentas como TinyPNG ou Squoosh para comprimir imagens antes de fazer upload. Uma imagem de 2MB comprimida pode chegar a 200KB sem perda visual perceptível, melhorando drasticamente o PageSpeed Score.',
    category: 'Performance',
    tags: ['imagens', 'otimização'],
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tip-3',
    title: 'Hierarquia visual clara aumenta conversão',
    content: 'A ordem de leitura do usuário segue o padrão F ou Z. Posicione seu CTA principal no final do fluxo natural dos olhos. Títulos grandes, subtítulo médio e corpo menor criam hierarquia que guia o leitor até a ação desejada.',
    category: 'Conversão',
    tags: ['cta', 'hierarquia', 'ux'],
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tip-4',
    title: 'Teste A/B nos headlines para dobrar conversão',
    content: 'O headline é o elemento mais importante de uma landing page. Pequenas mudanças no texto podem aumentar a conversão em 200%. Teste ao menos 3 variações diferentes com Google Optimize ou VWO antes de definir a versão final.',
    category: 'Conversão',
    tags: ['teste-ab', 'headline', 'conversão'],
    is_premium: true,
    created_at: new Date().toISOString(),
  },
]

export const demoLessons = [
  {
    id: 'lesson-1',
    title: 'Fundamentos de Landing Page de Alta Conversão',
    description: 'Aprenda os elementos essenciais de uma LP que converte',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: null,
    duration_minutes: 42,
    category: 'Landing Pages',
    order_index: 1,
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'lesson-2',
    title: 'Copywriting para Webdesigners',
    description: 'Como escrever textos que vendem mesmo sem ser redator',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: null,
    duration_minutes: 58,
    category: 'Copy',
    order_index: 2,
    is_premium: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'lesson-3',
    title: 'SEO On-Page: Rankeie Seus Clientes no Google',
    description: 'Técnicas práticas de SEO que todo webdesigner precisa saber',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: null,
    duration_minutes: 65,
    category: 'SEO',
    order_index: 3,
    is_premium: true,
    created_at: new Date().toISOString(),
  },
]

export const demoLives = [
  {
    id: 'live-1',
    title: 'Como Precificar Seus Projetos em 2026',
    description: 'Live especial sobre precificação e posicionamento de mercado',
    stream_url: 'https://youtube.com/live/demo',
    scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 90,
    is_recorded: false,
    recording_url: null,
    is_premium: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'live-2',
    title: 'Mentoria: Criando One Page do Zero ao Deploy',
    description: 'Gravação da mentoria completa de criação de One Page profissional',
    stream_url: 'https://youtube.com/live/demo2',
    scheduled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 120,
    is_recorded: true,
    recording_url: 'https://youtube.com/watch?v=demo',
    is_premium: true,
    created_at: new Date().toISOString(),
  },
]

// ---------------------------------------------------------------
// Contrato Rápido — Demo
// ---------------------------------------------------------------

export const demoWdProfile = {
  id: 'wd-profile-demo',
  user_id: 'demo-user-id',
  name: 'Everton Brito',
  cpf_cnpj: '123.456.789-00',
  address: 'Rua das Inovações, 42',
  city: 'São Paulo',
  state: 'SP',
  phone: '(11) 99999-0000',
  email: 'everton@webdesignhub.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const demoContracts = [
  {
    id: 'demo-contract-1',
    user_id: 'demo-user-id',
    client_name: 'Clínica Bem Estar',
    client_cpf_cnpj: '12.345.678/0001-99',
    client_address: 'Av. Paulista, 1000, Bela Vista',
    client_city: 'São Paulo',
    client_state: 'SP',
    service_type: 'Landing Page',
    service_description: 'Desenvolvimento de landing page institucional com design responsivo, formulário de agendamento online integrado ao WhatsApp, galeria de fotos da clínica e otimização básica para SEO.',
    value: 1500,
    entry_value: 750,
    payment_type: 'pix_entrada',
    installments: 2,
    payment_terms: '',
    delivery_days: 15,
    materials_days: 3,
    maintenance_days: 7,
    start_date: new Date().toISOString().split('T')[0],
    duration_months: 1,
    excluded_services: ['fotografia', 'hospedagem', 'dominio'],
    witness_1: 'Carlos Eduardo Santos',
    witness_2: null,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-contract-2',
    user_id: 'demo-user-id',
    client_name: 'Studio Glam - Ana Beatriz',
    client_cpf_cnpj: '987.654.321-00',
    client_address: 'Rua dos Salões, 55, Vila Madalena',
    client_city: 'São Paulo',
    client_state: 'SP',
    service_type: 'One Page',
    service_description: 'Criação de one page para salão de beleza com galeria de fotos, lista de serviços com preços, depoimentos de clientes e integração com WhatsApp para agendamentos.',
    value: 900,
    entry_value: 0,
    payment_type: 'pix_avista',
    installments: 1,
    payment_terms: '',
    delivery_days: 10,
    materials_days: 3,
    maintenance_days: 7,
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration_months: 1,
    excluded_services: ['banco_imagens', 'conteudo'],
    witness_1: null,
    witness_2: null,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
