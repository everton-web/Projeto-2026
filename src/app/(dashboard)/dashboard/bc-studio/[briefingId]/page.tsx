import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Share2, Clock, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BriefingDetail } from '@/components/bc-studio/briefing-detail'
import { CopyLinkButton } from '@/components/clientes/copy-link-button'
import { DEMO_MODE, demoBriefings, demoCopies, demoProfile, demoClients } from '@/lib/demo-data'

import { PAGE_TYPE_LABELS } from '@/lib/briefing-questions'
import type { BriefingForm, GeneratedCopy } from '@/lib/types/database'

interface Props {
  params: Promise<{ briefingId: string }>
}

export default async function BriefingDetailPage({ params }: Props) {
  const { briefingId } = await params

  let briefing: BriefingForm | null = null
  let copies: GeneratedCopy[] = []
  let clientName: string | undefined
  let userId = 'demo-user-id'
  let isPro = false
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  if (DEMO_MODE) {
    briefing = demoBriefings.find((b) => b.id === briefingId) as unknown as BriefingForm ?? null
    copies = demoCopies.filter((c) => c.briefing_id === briefingId) as unknown as GeneratedCopy[]
    userId = demoProfile.id
    isPro = demoProfile.plan === 'pro'
    if (briefing?.client_id) {
      const client = demoClients.find((c) => c.id === briefing!.client_id)
      clientName = client?.name
    }
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id ?? ''

    const { data } = await supabase
      .from('briefing_forms')
      .select('*')
      .eq('id', briefingId)
      .eq('user_id', userId)
      .single()

    if (!data) notFound()
    briefing = data

    const [{ data: cData }, { data: clientData }, { data: profileData }] = await Promise.all([
      supabase.from('generated_copies').select('*').eq('briefing_id', briefingId).order('created_at', { ascending: false }),
      briefing?.client_id
        ? supabase.from('clients').select('name').eq('id', briefing.client_id).single()
        : Promise.resolve({ data: null }),
      supabase.from('profiles').select('plan').eq('id', userId).single(),
    ])

    copies = cData ?? []
    clientName = (clientData as { name: string } | null)?.name
    isPro = (profileData as { plan?: string } | null)?.plan === 'pro'
  }

  if (!briefing) notFound()

  const isAnswered = !!briefing.submitted_at
  const briefingLink = `${appUrl}/briefing/${briefing.token}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/bc-studio"
          className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white/80 transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          BC Studio
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {briefing.title ?? 'Briefing sem título'}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="border-white/[0.1] text-white/55 text-xs">
                {PAGE_TYPE_LABELS[briefing.page_type]}
              </Badge>
              <Badge variant="outline" className="border-white/[0.1] text-white/55 text-xs">
                {briefing.niche_selected}
              </Badge>
              {clientName && (
                <Badge variant="outline" className="border-white/[0.1] text-white/55 text-xs">
                  {clientName}
                </Badge>
              )}
              {isAnswered ? (
                <Badge className="bg-green-500/10 text-green-400 border border-green-500/30 text-xs gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Respondido
                </Badge>
              ) : (
                <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs gap-1">
                  <Clock className="h-3 w-3" />
                  Aguardando resposta
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Link do briefing */}
      {!isAnswered && (
        <div className="flex items-center gap-3 bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4">
          <Share2 className="h-4 w-4 text-white/35 flex-shrink-0" />
          <code className="text-brand-light text-sm flex-1 truncate">{briefingLink}</code>
          <CopyLinkButton url={briefingLink} />
        </div>
      )}

      {/* Conteúdo principal */}
      <BriefingDetail
        briefing={briefing}
        clientName={clientName}
        userId={userId}
        savedCopies={copies}
        isPro={isPro}
      />
    </div>
  )
}
