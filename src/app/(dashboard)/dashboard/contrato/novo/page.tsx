import { createClient } from '@/lib/supabase/server'
import { DEMO_MODE, demoWdProfile } from '@/lib/demo-data'
import { WdProfile } from '@/lib/types/database'
import { ContratoForm } from '@/components/contrato/contrato-form'
import { ArrowLeft, FileSignature } from 'lucide-react'
import Link from 'next/link'

export default async function NovoContratoPage() {
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

  if (!wd) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/dashboard/contrato" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/[0.1] rounded-2xl bg-[#111]">
          <FileSignature className="h-10 w-10 text-white/15 mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Preencha seus dados primeiro</h2>
          <p className="text-white/40 text-sm max-w-xs mb-5">
            Para gerar contratos, você precisa cadastrar seus dados profissionais.
          </p>
          <Link href="/dashboard/contrato/dados" className="text-brand hover:text-brand-light text-sm font-semibold transition-colors">
            Preencher dados →
          </Link>
        </div>
      </div>
    )
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
          <FileSignature className="h-4 w-4 text-brand" />
          <span className="text-xs text-brand uppercase tracking-widest font-semibold">Novo contrato</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Dados do cliente</h1>
        <p className="text-white/40 text-sm mt-1">
          Preencha os dados do cliente e do serviço para gerar o contrato.
        </p>
      </div>

      <ContratoForm />
    </div>
  )
}
