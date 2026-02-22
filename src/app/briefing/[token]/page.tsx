import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BriefingForm } from '@/components/briefing/briefing-form'
import { getBriefingQuestions, PAGE_TYPE_LABELS, type PageType } from '@/lib/briefing-questions'
import { DEMO_MODE, demoBriefings } from '@/lib/demo-data'

interface Props {
  params: Promise<{ token: string }>
}

export default async function BriefingPage({ params }: Props) {
  const { token } = await params

  let pageType: PageType = 'landing_page'
  let niche = 'Outro'
  let alreadySubmitted = false

  if (DEMO_MODE) {
    // Tenta encontrar o token nos briefings demo
    const demoBriefing = demoBriefings.find((b) => b.token === token)

    if (demoBriefing) {
      pageType = demoBriefing.page_type
      niche = demoBriefing.niche_selected
      alreadySubmitted = !!demoBriefing.submitted_at
    } else if (token.startsWith('demo-token-')) {
      // Token criado dinamicamente no modo demo — mostra formulário genérico de LP
      pageType = 'landing_page'
      niche = 'Outro'
    } else {
      notFound()
    }
  } else {
    const supabase = await createClient()
    const { data: briefing } = await supabase
      .from('briefing_forms')
      .select('*')
      .eq('token', token)
      .single()

    if (!briefing) notFound()

    pageType = briefing.page_type ?? 'landing_page'
    niche = briefing.niche_selected ?? briefing.niche ?? 'Outro'
    alreadySubmitted = !!briefing.submitted_at
  }

  const questions = getBriefingQuestions(pageType, niche)
  const pageTypeLabel = PAGE_TYPE_LABELS[pageType as keyof typeof PAGE_TYPE_LABELS] ?? 'Briefing'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#1a1a1a] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand rounded-xl mb-4">
            <span className="text-white text-xl font-bold">B</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Briefing — {pageTypeLabel}</h1>
          <p className="text-white/55 mt-2">
            {alreadySubmitted
              ? 'Você já preencheu este formulário. Obrigado!'
              : `Preencha as informações abaixo para que possamos criar uma página incrível para o seu negócio.`}
          </p>
          {!alreadySubmitted && (
            <p className="text-white/35 text-sm mt-1">
              Nicho: <span className="text-white/55">{niche}</span>
            </p>
          )}
        </div>

        {alreadySubmitted ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-white">Briefing recebido!</h2>
            <p className="text-white/55 mt-2 text-sm">
              Suas respostas foram salvas. Entraremos em contato em breve.
            </p>
          </div>
        ) : (
          <BriefingForm token={token} questions={questions} niche={niche} />
        )}
      </div>
    </div>
  )
}
