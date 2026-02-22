'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { DEMO_MODE } from '@/lib/demo-data'

interface Question {
  id: string
  label: string
  placeholder: string
  hint?: string
  rows?: number
}

interface Props {
  token: string
  questions: Question[]
  niche: string
}

export function BriefingForm({ token, questions, niche }: Props) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const responses: Record<string, string> = {}
    questions.forEach((q) => {
      responses[q.id] = formData.get(q.id) as string ?? ''
    })

    if (DEMO_MODE) {
      // Simula envio no modo demo
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('briefing_forms')
      .update({
        responses,
        submitted_at: new Date().toISOString(),
      })
      .eq('token', token)

    if (updateError) {
      setError('Erro ao enviar. Tente novamente.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <Card className="border-white/[0.08] bg-[#1a1a1a]/50 backdrop-blur">
        <CardContent className="py-12 text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto" />
          <h2 className="text-xl font-semibold text-white">Briefing enviado!</h2>
          <p className="text-white/55 text-sm max-w-sm mx-auto">
            Suas respostas foram registradas com sucesso. Entraremos em contato em breve para iniciar o projeto.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/[0.08] bg-[#1a1a1a]/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white text-base">
          Nicho: <span className="text-brand-light">{niche}</span>
        </CardTitle>
        <p className="text-white/55 text-sm">Responda com o máximo de detalhes possível.</p>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {questions.map((question) => (
            <div key={question.id} className="space-y-1.5">
              <Label htmlFor={question.id} className="text-white/80 font-medium text-sm">
                {question.label}
              </Label>
              {question.hint && (
                <p className="text-xs text-white/35 leading-relaxed">{question.hint}</p>
              )}
              <textarea
                id={question.id}
                name={question.id}
                rows={question.rows ?? 3}
                placeholder={question.placeholder}
                required
                className="w-full px-3 py-2.5 rounded-md bg-[#252525]/80 border border-white/[0.1] text-white placeholder:text-white/25 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors leading-relaxed"
              />
            </div>
          ))}

          <Button
            type="submit"
            className="w-full bg-brand hover:bg-brand text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              'Enviar briefing'
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
