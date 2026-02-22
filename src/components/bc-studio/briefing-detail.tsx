'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, Sparkles, Loader2, Save, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { generatePrompt, getBriefingQuestions, PAGE_TYPE_LABELS } from '@/lib/briefing-questions'
import type { BriefingForm, GeneratedCopy } from '@/lib/types/database'
import { DEMO_MODE } from '@/lib/demo-data'

interface Props {
  briefing: BriefingForm
  clientName?: string
  userId: string
  savedCopies: GeneratedCopy[]
  isPro: boolean
}

export function BriefingDetail({ briefing, clientName, userId, savedCopies, isPro }: Props) {
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [generatedCopy, setGeneratedCopy] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copiedOutput, setCopiedOutput] = useState(false)
  const [showAllResponses, setShowAllResponses] = useState(false)

  const responses = briefing.responses ?? {}
  const questions = getBriefingQuestions(briefing.page_type, briefing.niche_selected)
  const prompt = Object.keys(responses).length > 0
    ? generatePrompt(briefing.page_type, briefing.niche_selected, responses)
    : ''

  // Map question id → label for display
  const questionMap = Object.fromEntries(questions.map((q) => [q.id, q.label]))

  const responseEntries = Object.entries(responses).filter(([, v]) => v?.trim())
  const visibleEntries = showAllResponses ? responseEntries : responseEntries.slice(0, 5)

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt)
    setCopiedPrompt(true)
    toast.success('Prompt copiado! Cole no ChatGPT ou Claude.')
    setTimeout(() => setCopiedPrompt(false), 2500)
  }

  async function handleGenerate() {
    setLoading(true)
    setGeneratedCopy('')

    try {
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          niche: briefing.niche_selected,
          copyType: briefing.page_type,
          clientName: clientName ?? briefing.title ?? 'Cliente',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao gerar copy')
      setGeneratedCopy(data.copy)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar copy')
    }

    setLoading(false)
  }

  async function handleSave() {
    if (!generatedCopy) return
    setSaving(true)

    if (DEMO_MODE) {
      toast.success('Copy salva! (modo demo)')
      setSaving(false)
      return
    }

    const supabase = createClient()
    const typeLabel = PAGE_TYPE_LABELS[briefing.page_type]
    const { error } = await supabase.from('generated_copies').insert({
      user_id: userId,
      client_id: briefing.client_id,
      briefing_id: briefing.id,
      type: briefing.page_type,
      title: `${typeLabel} - ${clientName ?? briefing.title ?? 'Sem título'}`,
      content: generatedCopy,
    })

    if (error) { toast.error('Erro ao salvar copy') } else { toast.success('Copy salva com sucesso!') }
    setSaving(false)
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(generatedCopy)
    setCopiedOutput(true)
    toast.success('Copy copiada!')
    setTimeout(() => setCopiedOutput(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT — Respostas do cliente */}
      <div className="space-y-4">
        <h2 className="text-white/80 font-semibold text-sm uppercase tracking-wider">
          Respostas do cliente
        </h2>

        {responseEntries.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-white/[0.08] border-dashed">
            <CardContent className="py-10 text-center text-white/35 text-sm">
              Nenhuma resposta ainda.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {visibleEntries.map(([key, value]) => (
              <Card key={key} className="bg-[#1a1a1a] border-white/[0.08]">
                <CardContent className="p-4">
                  <p className="text-xs text-white/35 mb-1 font-medium uppercase tracking-wide">
                    {questionMap[key] ?? key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
                </CardContent>
              </Card>
            ))}

            {responseEntries.length > 5 && (
              <button
                onClick={() => setShowAllResponses(!showAllResponses)}
                className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors mx-auto"
              >
                {showAllResponses
                  ? <><ChevronUp className="h-3.5 w-3.5" /> Mostrar menos</>
                  : <><ChevronDown className="h-3.5 w-3.5" /> Ver mais {responseEntries.length - 5} respostas</>
                }
              </button>
            )}
          </div>
        )}
      </div>

      {/* RIGHT — Prompt + Gerador */}
      <div className="space-y-4">
        <h2 className="text-white/80 font-semibold text-sm uppercase tracking-wider">
          Gerador de Copy
        </h2>

        {/* Prompt gerado */}
        {prompt ? (
          <Card className="bg-[#1a1a1a] border-white/[0.08]">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-white/70">Prompt gerado automaticamente</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyPrompt}
                className="text-white/55 hover:text-white gap-1.5 h-7 text-xs"
              >
                {copiedPrompt ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                {copiedPrompt ? 'Copiado!' : 'Copiar prompt'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-[#0a0a0a] rounded-lg p-3 max-h-48 overflow-y-auto">
                <pre className="text-white/55 text-xs leading-relaxed whitespace-pre-wrap font-mono">{prompt}</pre>
              </div>
              <p className="text-xs text-white/25 mt-2">
                Cole este prompt no ChatGPT ou Claude para gerar a copy externamente.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#1a1a1a] border-white/[0.08] border-dashed">
            <CardContent className="py-8 text-center text-white/35 text-sm">
              O prompt aparecerá aqui após o cliente responder o briefing.
            </CardContent>
          </Card>
        )}

        {/* Botão gerar com IA — só Pro */}
        {prompt && (
          isPro ? (
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand hover:to-brand text-white gap-2 h-11"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Gerando com IA...</>
              ) : (
                <><Sparkles className="h-4 w-4" />Gerar Copy com IA</>
              )}
            </Button>
          ) : (
            <div className="w-full border border-dashed border-white/[0.1] rounded-xl p-4 flex flex-col items-center gap-3 text-center">
              <div className="w-8 h-8 bg-[#1a1a1a] border border-white/[0.1] rounded-lg flex items-center justify-center">
                <Lock className="h-4 w-4 text-white/30" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">Geração de copy com IA</p>
                <p className="text-xs text-white/30 mt-0.5">Disponível no plano Pro (R$ 45,90/mês)</p>
              </div>
              <a
                href="/dashboard/configuracoes"
                className="text-xs font-semibold text-brand hover:text-brand-light transition-colors"
              >
                Fazer upgrade →
              </a>
            </div>
          )
        )}

        {/* Copy gerada */}
        {generatedCopy && (
          <Card className="bg-[#1a1a1a] border-white/[0.08]">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-white">Copy gerada</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyOutput}
                  className="border-white/[0.1] text-white/70 hover:bg-[#252525] gap-1.5 h-7 text-xs"
                >
                  {copiedOutput ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                  {copiedOutput ? 'Copiado!' : 'Copiar'}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-brand hover:bg-brand text-white gap-1.5 h-7 text-xs"
                >
                  {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                  Salvar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-[#0a0a0a] rounded-xl p-4 text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-mono max-h-[500px] overflow-y-auto">
                {generatedCopy}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Copies salvas */}
        {savedCopies.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-white/35 font-medium uppercase tracking-wide">Copies salvas</p>
            {savedCopies.map((copy) => (
              <Card key={copy.id} className="bg-[#1a1a1a] border-white/[0.08]">
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-white/70 font-medium">{copy.title}</p>
                    <p className="text-xs text-white/35">
                      {new Date(copy.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-white/[0.1] text-white/55">
                    {PAGE_TYPE_LABELS[copy.type]}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
