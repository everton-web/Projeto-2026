import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Link2, CheckCircle2, Clock, FileText, Plus } from 'lucide-react'
import Link from 'next/link'
import { CreateBriefingButton } from '@/components/clientes/create-briefing-button'
import { CopyLinkButton } from '@/components/clientes/copy-link-button'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ClienteDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('user_id', user?.id ?? '')
    .single()

  if (!client) notFound()

  const { data: briefings } = await supabase
    .from('briefing_forms')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const { data: copies } = await supabase
    .from('generated_copies')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  const copyTypeLabels: Record<string, string> = {
    landing_page: 'Landing Page',
    one_page: 'One Page',
    sales_page: 'Página de Vendas',
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/clientes">
          <Button variant="ghost" size="icon" className="text-white/55 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{client.name}</h1>
            <Badge variant="secondary" className="bg-[#252525] text-white/70 border-white/[0.1]">
              {client.niche}
            </Badge>
          </div>
          <p className="text-white/55 text-sm mt-0.5">
            {client.email ?? ''} {client.phone ? `· ${client.phone}` : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">

          {/* Briefings */}
          <Card className="bg-[#1a1a1a] border-white/[0.08]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white text-base">Formulários de Briefing</CardTitle>
                <p className="text-white/55 text-xs mt-1">
                  Gere um link para o cliente preencher o briefing do projeto
                </p>
              </div>
              <CreateBriefingButton clientId={client.id} niche={client.niche} />
            </CardHeader>
            <CardContent className="space-y-3">
              {(!briefings || briefings.length === 0) ? (
                <div className="text-center py-8 text-white/35 text-sm">
                  Nenhum briefing gerado ainda. Clique em &quot;Gerar briefing&quot; para criar o link.
                </div>
              ) : (
                briefings.map((briefing) => (
                  <div
                    key={briefing.id}
                    className="flex items-center justify-between p-3 bg-[#252525] rounded-lg gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {briefing.submitted_at ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-400 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">
                          Briefing — {new Date(briefing.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-white/55">
                          {briefing.submitted_at
                            ? `Respondido em ${new Date(briefing.submitted_at).toLocaleDateString('pt-BR')}`
                            : 'Aguardando resposta do cliente'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {briefing.submitted_at && (
                        <Link href={`/dashboard/clientes/${client.id}/copy/${briefing.id}`}>
                          <Button size="sm" className="bg-brand/20 text-brand-light border border-brand/30 hover:bg-brand/30 gap-1 text-xs">
                            <FileText className="h-3 w-3" />
                            Gerar copy
                          </Button>
                        </Link>
                      )}
                      <CopyLinkButton url={`${appUrl}/briefing/${briefing.token}`} />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Copies geradas */}
          <Card className="bg-[#1a1a1a] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white text-base">Copies Geradas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(!copies || copies.length === 0) ? (
                <div className="text-center py-8 text-white/35 text-sm">
                  Nenhuma copy gerada ainda. Responda um briefing para gerar.
                </div>
              ) : (
                copies.map((copy) => (
                  <Link key={copy.id} href={`/dashboard/clientes/${client.id}/copy/${copy.id}/ver`}>
                    <div className="flex items-center justify-between p-3 bg-[#252525] rounded-lg hover:bg-[#333] transition-colors cursor-pointer">
                      <div>
                        <p className="text-sm text-white font-medium">{copy.title}</p>
                        <p className="text-xs text-white/55 mt-0.5">
                          {copyTypeLabels[copy.type]} · {new Date(copy.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <FileText className="h-4 w-4 text-white/35" />
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="bg-[#1a1a1a] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white text-sm">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-white/35 text-xs uppercase tracking-wide">Nicho</p>
                <p className="text-white/80 mt-1">{client.niche}</p>
              </div>
              {client.email && (
                <div>
                  <p className="text-white/35 text-xs uppercase tracking-wide">E-mail</p>
                  <p className="text-white/80 mt-1">{client.email}</p>
                </div>
              )}
              {client.phone && (
                <div>
                  <p className="text-white/35 text-xs uppercase tracking-wide">Telefone</p>
                  <p className="text-white/80 mt-1">{client.phone}</p>
                </div>
              )}
              {client.notes && (
                <div>
                  <p className="text-white/35 text-xs uppercase tracking-wide">Observações</p>
                  <p className="text-white/55 mt-1 text-xs leading-relaxed">{client.notes}</p>
                </div>
              )}
              <div>
                <p className="text-white/35 text-xs uppercase tracking-wide">Cadastrado em</p>
                <p className="text-white/80 mt-1">{new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-white/[0.08]">
            <CardContent className="pt-5 space-y-2">
              <p className="text-xs text-white/55 flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5 text-brand-light" />
                Compartilhe o link do briefing com o cliente para ele preencher as informações do projeto.
              </p>
              <p className="text-xs text-white/35">
                Os dados preenchidos ficam salvos e você pode gerar a copy quando quiser.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
