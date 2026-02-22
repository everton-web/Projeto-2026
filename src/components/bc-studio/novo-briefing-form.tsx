'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PAGE_TYPE_LABELS, PAGE_TYPE_DESCRIPTIONS, NICHES, type PageType } from '@/lib/briefing-questions'
import type { Client } from '@/lib/types/database'
import { Copy, Check, FileText, TrendingUp, Layout } from 'lucide-react'
import { DEMO_MODE } from '@/lib/demo-data'

const PAGE_TYPE_ICONS = {
  landing_page: FileText,
  one_page: Layout,
  sales_page: TrendingUp,
}

interface Props {
  clients: Client[]
  appUrl: string
}

export function NovoBriefingForm({ clients, appUrl }: Props) {
  const router = useRouter()
  const [pageType, setPageType] = useState<PageType>('landing_page')
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [briefingId, setBriefingId] = useState('')

  const isOutro = niche === 'Outro'
  const finalNiche = isOutro ? customNiche.trim() : niche
  const canSubmit = finalNiche.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!finalNiche) { setError('Informe o nicho do cliente.'); return }
    setError('')
    setLoading(true)

    if (DEMO_MODE) {
      const fakeToken = 'demo-token-' + Math.random().toString(36).slice(2, 10)
      const link = `${appUrl}/briefing/${fakeToken}`
      setGeneratedLink(link)
      setBriefingId('demo-new-briefing')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error: err } = await supabase
      .from('briefing_forms')
      .insert({
        user_id: user!.id,
        client_id: clientId || null,
        page_type: pageType,
        niche_selected: finalNiche,
        niche: finalNiche,
        title: title || null,
      })
      .select('id, token')
      .single()

    if (err || !data) {
      setError('Erro ao criar briefing. Tente novamente.')
      setLoading(false)
      return
    }

    const link = `${appUrl}/briefing/${data.token}`
    setGeneratedLink(link)
    setBriefingId(data.id)
    setLoading(false)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (generatedLink) {
    return (
      <div className="space-y-6">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <div>
            <h2 className="text-lg font-semibold text-white">Briefing criado com sucesso!</h2>
            <p className="text-white/55 text-sm mt-1">
              Copie o link abaixo e envie para seu cliente preencher.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/[0.1] rounded-lg p-3">
            <code className="text-brand-light text-sm flex-1 text-left break-all">{generatedLink}</code>
            <Button size="sm" variant="ghost" onClick={copyLink} className="flex-shrink-0 text-white/55 hover:text-white">
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" className="border-white/[0.1] text-white/70" onClick={() => router.push('/dashboard/bc-studio')}>
              Ver todos os briefings
            </Button>
            {briefingId && !DEMO_MODE && (
              <Button className="bg-brand hover:bg-brand-dark" onClick={() => router.push(`/dashboard/bc-studio/${briefingId}`)}>
                Abrir briefing
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Tipo de página */}
      <div className="space-y-3">
        <Label className="text-white/80 text-base font-semibold">Tipo de página</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(Object.keys(PAGE_TYPE_LABELS) as PageType[]).map((type) => {
            const Icon = PAGE_TYPE_ICONS[type]
            const isSelected = pageType === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => setPageType(type)}
                className={cn(
                  'relative p-4 rounded-xl border-2 text-left transition-all',
                  isSelected
                    ? 'border-brand bg-brand/10'
                    : 'border-white/[0.1] bg-[#252525]/50 hover:border-white/[0.12]'
                )}
              >
                <Icon className={cn('h-5 w-5 mb-2', isSelected ? 'text-brand-light' : 'text-white/35')} />
                <p className={cn('font-semibold text-sm', isSelected ? 'text-white' : 'text-white/70')}>
                  {PAGE_TYPE_LABELS[type]}
                </p>
                <p className="text-xs text-white/35 mt-1 leading-snug">{PAGE_TYPE_DESCRIPTIONS[type]}</p>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Nicho */}
      <div className="space-y-3">
        <Label htmlFor="niche" className="text-white/80 text-base font-semibold">
          Nicho do cliente <span className="text-red-400">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNiche(n)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                niche === n
                  ? 'bg-brand border-brand text-white'
                  : 'bg-[#252525] border-white/[0.1] text-white/55 hover:border-white/[0.2] hover:text-white/80'
              )}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Campo para nicho personalizado */}
        {isOutro && (
          <div className="pt-1 space-y-1">
            <Input
              autoFocus
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="Ex: Pet Shop / Veterinária, Jurídico Trabalhista..."
              className="bg-[#252525] border-white/[0.1] text-white placeholder:text-white/35"
            />
            <p className="text-xs text-white/35">
              Digite o nicho do seu cliente. As perguntas do briefing serão as base para o tipo de página selecionado.
            </p>
          </div>
        )}

        {finalNiche && (
          <p className="text-xs text-white/35">
            Nicho selecionado: <span className="text-brand-light font-medium">{finalNiche}</span>
          </p>
        )}
      </div>

      {/* Título interno */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white/80 font-semibold">
          Título interno do briefing
          <Badge variant="outline" className="ml-2 text-[10px] border-white/[0.1] text-white/35">opcional</Badge>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Ex: LP - ${finalNiche || 'Cliente'} - ${new Date().toLocaleDateString('pt-BR')}`}
          className="bg-[#252525] border-white/[0.1] text-white placeholder:text-white/35"
        />
        <p className="text-xs text-white/35">Identificação interna para você organizar seus briefings.</p>
      </div>

      {/* Vincular cliente */}
      {clients.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="client" className="text-white/80 font-semibold">
            Vincular a um cliente
            <Badge variant="outline" className="ml-2 text-[10px] border-white/[0.1] text-white/35">opcional</Badge>
          </Label>
          <select
            id="client"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full bg-[#252525] border border-white/[0.1] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">— Sem cliente vinculado —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={loading || !canSubmit}
        className="w-full bg-brand hover:bg-brand-dark text-white h-11 text-base font-semibold"
      >
        {loading ? 'Criando briefing...' : 'Criar Briefing e Gerar Link'}
      </Button>
    </form>
  )
}
