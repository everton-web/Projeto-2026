'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2, Copy, Check, Save } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface Props {
  briefingId: string
  clientId: string
  userId: string
  responses: Record<string, string>
  niche: string
  clientName: string
}

const copyTypes = [
  { id: 'landing_page', label: 'Landing Page', description: 'Página focada em conversão com CTA claro' },
  { id: 'one_page', label: 'One Page', description: 'Apresentação completa do negócio em uma página' },
  { id: 'sales_page', label: 'Página de Vendas', description: 'Copy longa focada em persuasão e venda' },
] as const

type CopyType = 'landing_page' | 'one_page' | 'sales_page'

export function CopyGenerator({ briefingId, clientId, userId, responses, niche, clientName }: Props) {
  const [selectedType, setSelectedType] = useState<CopyType>('landing_page')
  const [generatedCopy, setGeneratedCopy] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    setGeneratedCopy('')

    try {
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses, niche, copyType: selectedType, clientName }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Erro ao gerar copy')
      }

      setGeneratedCopy(data.copy)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar copy')
    }

    setLoading(false)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generatedCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copy copiada para a área de transferência!')
  }

  async function handleSave() {
    if (!generatedCopy) return
    setSaving(true)

    const supabase = createClient()
    const typeLabel = copyTypes.find((t) => t.id === selectedType)?.label ?? selectedType

    const { error } = await supabase.from('generated_copies').insert({
      user_id: userId,
      client_id: clientId,
      briefing_id: briefingId,
      type: selectedType,
      title: `${typeLabel} - ${clientName}`,
      content: generatedCopy,
    })

    if (error) {
      toast.error('Erro ao salvar copy')
    } else {
      toast.success('Copy salva com sucesso!')
    }

    setSaving(false)
  }

  // Resumo das respostas do briefing
  const briefingSummary = Object.entries(responses)
    .slice(0, 4)
    .map(([, v]) => v)
    .join(' · ')

  return (
    <div className="space-y-6">
      {/* Resumo do briefing */}
      <Card className="bg-[#1a1a1a] border-white/[0.08]">
        <CardHeader>
          <CardTitle className="text-white text-sm">Resumo do Briefing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/55 text-sm leading-relaxed line-clamp-3">{briefingSummary}...</p>
        </CardContent>
      </Card>

      {/* Seleção do tipo de copy */}
      <div className="space-y-3">
        <p className="text-white font-medium">Tipo de página</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {copyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                selectedType === type.id
                  ? 'border-brand bg-brand/10'
                  : 'border-white/[0.08] bg-[#1a1a1a] hover:border-white/[0.1]'
              }`}
            >
              <p className="text-white text-sm font-medium">{type.label}</p>
              <p className="text-white/55 text-xs mt-1">{type.description}</p>
              {selectedType === type.id && (
                <Badge className="mt-2 bg-brand/20 text-brand-light border border-brand/30 text-[10px]">
                  Selecionado
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Botão gerar */}
      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand hover:to-brand text-white gap-2 h-12"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Gerando copy com IA...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Gerar Copy com IA
          </>
        )}
      </Button>

      {/* Resultado */}
      {generatedCopy && (
        <Card className="bg-[#1a1a1a] border-white/[0.08]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-base">Copy Gerada</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="border-white/[0.1] text-white/70 hover:bg-[#252525] gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="bg-brand hover:bg-brand text-white gap-1.5"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Salvar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-[#0a0a0a] rounded-xl p-5 text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto">
              {generatedCopy}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
