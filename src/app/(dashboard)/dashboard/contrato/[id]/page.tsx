import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DEMO_MODE, demoContracts, demoWdProfile } from '@/lib/demo-data'
import { Contract, WdProfile } from '@/lib/types/database'
import { ContratoDocument } from '@/components/contrato/contrato-document'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ContratoViewPage({ params }: Props) {
  const { id } = await params

  let contract: Contract | null = null
  let wd: WdProfile | null = null

  if (DEMO_MODE) {
    contract = (demoContracts.find((c) => c.id === id) as Contract) ?? null
    wd = demoWdProfile as WdProfile
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const [contractResult, wdResult] = await Promise.all([
        supabase.from('contracts').select('*').eq('id', id).eq('user_id', user.id).single(),
        supabase.from('wd_profiles').select('*').eq('user_id', user.id).single(),
      ])
      contract = contractResult.data as Contract | null
      wd = wdResult.data as WdProfile | null
    }
  }

  if (!contract || !wd) notFound()

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/contrato"
        className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors print:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos contratos
      </Link>

      <ContratoDocument contract={contract} wd={wd} />
    </div>
  )
}
