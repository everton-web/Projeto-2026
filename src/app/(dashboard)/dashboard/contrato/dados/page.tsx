import { createClient } from '@/lib/supabase/server'
import { DEMO_MODE, demoWdProfile } from '@/lib/demo-data'
import { WdProfile } from '@/lib/types/database'
import { WdDataForm } from '@/components/contrato/wd-data-form'
import { ArrowLeft, UserCircle } from 'lucide-react'
import Link from 'next/link'

export default async function ContratosDadosPage() {
  let wd: WdProfile | null = null

  if (DEMO_MODE) {
    wd = demoWdProfile as WdProfile
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('wd_profiles').select('*').eq('user_id', user.id).single()
      wd = data as WdProfile | null
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/contrato"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <UserCircle className="h-4 w-4 text-brand" />
          <span className="text-xs text-brand uppercase tracking-widest font-semibold">Meus dados</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Dados profissionais</h1>
        <p className="text-white/40 text-sm mt-1">
          Estes dados aparecerão em todos os contratos que você gerar.
        </p>
      </div>

      <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5">
        <WdDataForm existing={wd} />
      </div>
    </div>
  )
}
