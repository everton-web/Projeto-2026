import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CopyGenerator } from '@/components/copy/copy-generator'

interface Props {
  params: Promise<{ id: string; briefingId: string }>
}

export default async function GenerateCopyPage({ params }: Props) {
  const { id: clientId, briefingId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: briefing }, { data: client }] = await Promise.all([
    supabase
      .from('briefing_forms')
      .select('*')
      .eq('id', briefingId)
      .eq('user_id', user?.id ?? '')
      .single(),
    supabase
      .from('clients')
      .select('name, niche')
      .eq('id', clientId)
      .single(),
  ])

  if (!briefing || !briefing.responses) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/clientes/${clientId}`}>
          <Button variant="ghost" size="icon" className="text-white/55 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Gerar Copy com IA</h1>
          <p className="text-white/55 text-sm mt-0.5">
            Cliente: <span className="text-brand-light">{client?.name}</span> · Nicho: {briefing.niche}
          </p>
        </div>
      </div>

      <CopyGenerator
        briefingId={briefingId}
        clientId={clientId}
        userId={user?.id ?? ''}
        responses={briefing.responses as Record<string, string>}
        niche={briefing.niche}
        clientName={client?.name ?? ''}
      />
    </div>
  )
}
