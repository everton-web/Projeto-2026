export type UserRole = 'admin' | 'subscriber'
export type PlanType = 'free' | 'basic' | 'pro'
export type NicheType = string

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  plan: PlanType
  plan_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  niche: string
  notes: string | null
  created_at: string
  updated_at: string
}

export type PageType = 'landing_page' | 'one_page' | 'sales_page'

export interface BriefingForm {
  id: string
  client_id: string | null   // opcional — briefing pode existir sem cliente
  user_id: string
  token: string
  page_type: PageType        // tipo de página: LP, SP, OP
  niche_selected: string     // nicho escolhido pelo WD na criação
  niche: string              // mantido para compatibilidade
  title: string | null       // título interno do briefing (identificação do WD)
  responses: Record<string, string> | null
  submitted_at: string | null
  created_at: string
}

export interface GeneratedCopy {
  id: string
  user_id: string
  client_id: string | null   // opcional
  briefing_id: string | null
  type: PageType
  title: string
  content: string
  created_at: string
}

export interface CodeSnippet {
  id: string
  title: string
  description: string | null
  code: string
  language: string
  category: string
  tags: string[]
  is_premium: boolean
  created_at: string
}

export interface Tip {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  is_premium: boolean
  created_at: string
}

export interface Lesson {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  duration_minutes: number | null
  category: string
  order_index: number
  is_premium: boolean
  created_at: string
}

export interface Live {
  id: string
  title: string
  description: string | null
  stream_url: string
  scheduled_at: string
  duration_minutes: number | null
  is_recorded: boolean
  recording_url: string | null
  is_premium: boolean
  created_at: string
}

export type BibliotecaBlockType = 'text' | 'code' | 'image' | 'video' | 'gif' | 'svg'
export type BibliotecaCategory =
  | 'Componentes UI'
  | 'Layouts & Seções'
  | 'Tipografia'
  | 'Animações'
  | 'Paletas'
  | 'Landing Pages'
  | 'Inspiração'
  | 'Ferramentas'
  | 'Geral'

export interface BibliotecaPost {
  id: string
  title: string
  description: string | null
  category: BibliotecaCategory | string
  tags: string[]
  cover_url: string | null
  published: boolean
  plan_required: 'basic' | 'pro'   // nível mínimo de plano para acessar
  created_by: string | null
  created_at: string
  updated_at: string
  blocks?: BibliotecaBlock[]
}

export interface BibliotecaBlock {
  id: string
  post_id: string
  type: BibliotecaBlockType
  content: string | null       // texto ou código
  file_url: string | null      // URL de mídia
  language: string | null      // 'html' | 'css' | 'js' | 'text'
  caption: string | null
  order_index: number
  created_at: string
}

// ---------------------------------------------------------------
// Contrato Rápido (Pro)
// ---------------------------------------------------------------

export interface WdProfile {
  id: string
  user_id: string
  name: string
  cpf_cnpj: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  created_at: string
  updated_at: string
}

export interface Contract {
  id: string
  user_id: string
  // Dados do cliente
  client_name: string
  client_cpf_cnpj: string
  client_address: string
  client_city: string
  client_state: string
  // Serviço
  service_type: string              // Landing Page | One Page | Sales Page | etc.
  service_description: string
  // Valores
  value: number
  entry_value: number               // valor de entrada
  payment_type: string              // 'pix_entrada' | 'pix_avista' | 'cartao_avista' | 'parcelado_sem_juros' | 'parcelado_com_juros'
  installments: number              // número de parcelas (quando parcelado)
  payment_terms: string             // observações adicionais sobre pagamento
  // Prazos
  delivery_days: number             // prazo de desenvolvimento (dias)
  materials_days: number            // prazo para cliente entregar materiais (dias)
  maintenance_days: number          // período de manutenção pós-entrega (dias)
  start_date: string
  duration_months: number
  // Serviços excluídos do escopo
  excluded_services: string[]       // ex: ['fotografia', 'banco_imagens', 'conteudo', 'hospedagem', 'dominio']
  // Testemunhas (opcional)
  witness_1: string | null
  witness_2: string | null
  created_at: string
}
