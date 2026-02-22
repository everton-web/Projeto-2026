import { createClient } from '@/lib/supabase/server'
import { DEMO_MODE, demoProfile, demoContracts, demoWdProfile } from '@/lib/demo-data'
import { Contract, WdProfile } from '@/lib/types/database'
import Link from 'next/link'
import { FileSignature, PlusCircle, Settings2, Lock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function ContratoPage() {
  let contracts: Contract[] = []
  let wd: WdProfile | null = null
  let plan = 'free'

  if (DEMO_MODE) {
    contracts = demoContracts as Contract[]
    wd = demoWdProfile as WdProfile
    plan = demoProfile.plan
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const [profileResult, contractsResult, wdResult] = await Promise.all([
        supabase.from('profiles').select('plan').eq('id', user.id).single(),
        supabase.from('contracts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('wd_profiles').select('*').eq('user_id', user.id).single(),
      ])
      plan = profileResult.data?.plan ?? 'free'
      contracts = (contractsResult.data ?? []) as Contract[]
      wd = wdResult.data as WdProfile | null
    }
  }

  const isPro = plan === 'pro'
  const isBasic = plan === 'basic'

  if (!isPro) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto">
        <div className="w-14 h-14 bg-[#111] border border-white/[0.08] rounded-2xl flex items-center justify-center mb-5">
          <FileSignature className="h-6 w-6 text-white/25" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Contrato Rápido</h1>

        {isBasic ? (
          <>
            <p className="text-white/40 text-sm mb-5">
              Você está no plano <strong className="text-white/60">Basic</strong>. O Contrato Rápido é exclusivo do plano Pro.
            </p>

            {/* Card comparativo */}
            <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5 mb-5 w-full text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-sm">Plano Basic (atual)</span>
                <span className="text-white font-semibold text-sm">R$&nbsp;29,90<span className="text-white/35 font-normal text-xs">/mês</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand text-sm font-semibold flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  Plano Pro
                </span>
                <span className="text-brand font-semibold text-sm">R$&nbsp;45,90<span className="text-white/35 font-normal text-xs">/mês</span></span>
              </div>
              <div className="border-t border-white/[0.08] pt-3 flex items-center justify-between">
                <span className="text-white/50 text-sm">Diferença</span>
                <span className="text-white font-bold">+ R$&nbsp;16,00/mês</span>
              </div>

              {/* O que você ganha */}
              <div className="pt-1 space-y-1.5">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Incluído no Pro</p>
                {[
                  'Contrato Rápido (geração ilimitada)',
                  'Geração de copy com IA',
                  'Conteúdo Pro na Biblioteca',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-brand flex-shrink-0" />
                    <span className="text-xs text-white/50">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard/configuracoes" className="w-full">
              <Button className="bg-brand hover:bg-brand-dark text-white gap-2 w-full">
                <Zap className="h-4 w-4" />
                Fazer upgrade para Pro
              </Button>
            </Link>
          </>
        ) : (
          <>
            <p className="text-white/40 text-sm max-w-xs mb-3">
              Gere contratos profissionais em segundos. Disponível no plano Pro.
            </p>
            <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5 mb-5 w-full text-left space-y-2">
              {[
                { plan: 'Basic', price: 'R$ 29,90/mês', items: ['Briefings', 'Biblioteca Basic'] },
                { plan: 'Pro', price: 'R$ 45,90/mês', items: ['Tudo do Basic', 'Contrato Rápido', 'Copy com IA', 'Biblioteca Pro'] },
              ].map(({ plan: p, price, items }) => (
                <div key={p} className={`rounded-lg px-3 py-2.5 ${p === 'Pro' ? 'bg-brand/10 border border-brand/30' : 'bg-[#1a1a1a]'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold ${p === 'Pro' ? 'text-brand' : 'text-white/60'}`}>{p}</span>
                    <span className="text-white text-sm font-semibold">{price}</span>
                  </div>
                  <p className="text-xs text-white/35">{items.join(' · ')}</p>
                </div>
              ))}
            </div>
            <Link href="/dashboard/configuracoes" className="w-full">
              <Button className="bg-brand hover:bg-brand-dark text-white gap-2 w-full">
                <Lock className="h-4 w-4" />
                Ver planos
              </Button>
            </Link>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileSignature className="h-4 w-4 text-brand" />
            <span className="text-xs text-brand uppercase tracking-widest font-semibold">Pro</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Contrato Rápido</h1>
          <p className="text-white/40 text-sm mt-1">{contracts.length} {contracts.length === 1 ? 'contrato gerado' : 'contratos gerados'}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/contrato/dados">
            <Button variant="ghost" className="text-white/40 hover:text-white/70 border border-white/[0.08] gap-2">
              <Settings2 className="h-4 w-4" />
              Meus dados
            </Button>
          </Link>
          <Link href="/dashboard/contrato/novo">
            <Button className="bg-brand hover:bg-brand-dark text-white gap-2">
              <PlusCircle className="h-4 w-4" />
              Novo contrato
            </Button>
          </Link>
        </div>
      </div>

      {/* Aviso: sem dados do WD */}
      {!wd && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3.5 flex items-center justify-between gap-4">
          <p className="text-amber-400 text-sm">
            Preencha seus dados profissionais antes de gerar contratos.
          </p>
          <Link href="/dashboard/contrato/dados">
            <Button size="sm" className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30">
              Preencher agora
            </Button>
          </Link>
        </div>
      )}

      {/* Lista de contratos */}
      {contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/[0.08] rounded-xl">
          <FileSignature className="h-10 w-10 text-white/10 mb-4" />
          <p className="text-white/30 text-sm mb-4">Nenhum contrato gerado ainda.</p>
          <Link href="/dashboard/contrato/novo">
            <Button variant="ghost" className="text-brand border border-brand/30 hover:bg-brand/[0.06] gap-2">
              <PlusCircle className="h-4 w-4" />
              Gerar primeiro contrato
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {contracts.map((contract) => (
            <Link
              key={contract.id}
              href={`/dashboard/contrato/${contract.id}`}
              className="flex items-center gap-4 bg-[#111] border border-white/[0.08] rounded-xl px-4 py-3.5 hover:border-white/[0.16] transition-all"
            >
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center flex-shrink-0">
                <FileSignature className="h-4 w-4 text-white/30" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{contract.client_name}</p>
                <p className="text-xs text-white/35 truncate">{contract.service_type} · {contract.service_description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-brand">{fmt(contract.value)}</p>
                <p className="text-xs text-white/30">
                  {new Date(contract.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
