import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, CheckCircle2, Copy, Wand2 } from 'lucide-react'
import { DEMO_MODE, demoBriefings, demoCopies, demoProfile } from '@/lib/demo-data'
import { PAGE_TYPE_LABELS } from '@/lib/briefing-questions'
import type { BriefingForm, GeneratedCopy, PageType } from '@/lib/types/database'

export default async function BCStudioPage() {
  let briefings: BriefingForm[] = []
  let copies: GeneratedCopy[] = []
  let userId = 'demo-user-id'

  if (DEMO_MODE) {
    briefings = demoBriefings as unknown as BriefingForm[]
    copies = demoCopies as unknown as GeneratedCopy[]
    userId = demoProfile.id
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id ?? ''

    const [{ data: bData }, { data: cData }] = await Promise.all([
      supabase.from('briefing_forms').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('generated_copies').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ])

    briefings = bData ?? []
    copies = cData ?? []
  }

  const answered = briefings.filter((b) => b.submitted_at)
  const pending = briefings.filter((b) => !b.submitted_at)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-brand font-semibold uppercase tracking-widest mb-1">BC Studio</p>
          <h1 className="text-2xl font-bold text-white">Briefings & Copy</h1>
          <p className="text-white/40 mt-1 text-sm">Crie briefings, receba respostas e gere copy com IA.</p>
        </div>
        <Link href="/dashboard/bc-studio/novo">
          <Button className="bg-brand hover:bg-brand-dark text-white gap-2 font-semibold">
            <Plus className="h-4 w-4" />
            Novo Briefing
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#111] border-white/[0.08]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center">
              <FileText className="h-4 w-4 text-white/50" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{briefings.length}</p>
              <p className="text-xs text-white/30 uppercase tracking-wider">Briefings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-white/[0.08]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-white/50" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{answered.length}</p>
              <p className="text-xs text-white/30 uppercase tracking-wider">Respondidos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-white/[0.08]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <Copy className="h-4 w-4 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{copies.length}</p>
              <p className="text-xs text-white/30 uppercase tracking-wider">Copies</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Briefings pendentes */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-amber-500 rounded-full" />
            <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wider">
              Aguardando resposta <span className="text-amber-500">({pending.length})</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pending.map((b) => (
              <BriefingCard key={b.id} briefing={b} />
            ))}
          </div>
        </div>
      )}

      {/* Briefings respondidos */}
      {answered.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-brand rounded-full" />
            <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wider">
              Respondidos <span className="text-brand">({answered.length})</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {answered.map((b) => (
              <BriefingCard key={b.id} briefing={b} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {briefings.length === 0 && (
        <Card className="bg-[#111] border-white/[0.08] border-dashed">
          <CardContent className="py-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto">
              <Wand2 className="h-6 w-6 text-white/20" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Nenhum briefing ainda</h3>
              <p className="text-white/40 text-sm mt-1">
                Crie seu primeiro briefing para compartilhar com seu cliente.
              </p>
            </div>
            <Link href="/dashboard/bc-studio/novo">
              <Button className="bg-brand hover:bg-brand-dark text-white gap-2">
                <Plus className="h-4 w-4" />
                Criar primeiro briefing
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Copies recentes */}
      {copies.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-brand rounded-full" />
            <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wider">Copies recentes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {copies.slice(0, 4).map((copy) => (
              <Card key={copy.id} className="bg-[#111] border-white/[0.08]">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white/80 font-medium text-sm">{copy.title}</p>
                    <Badge variant="outline" className="text-[10px] border-white/[0.1] text-white/40 flex-shrink-0">
                      {PAGE_TYPE_LABELS[copy.type as PageType]}
                    </Badge>
                  </div>
                  <p className="text-white/25 text-xs">
                    {new Date(copy.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{copy.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BriefingCard({ briefing }: { briefing: BriefingForm }) {
  const isAnswered = !!briefing.submitted_at

  return (
    <Link href={`/dashboard/bc-studio/${briefing.id}`}>
      <Card className="bg-[#111] border-white/[0.08] hover:border-white/[0.16] hover:bg-[#161616] transition-all cursor-pointer group">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-white/80 font-medium text-sm truncate group-hover:text-white transition-colors">
                {briefing.title ?? `Briefing sem título`}
              </p>
              <p className="text-white/30 text-xs mt-0.5">{briefing.niche_selected}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <Badge variant="outline" className="text-[10px] border-white/[0.1] text-white/40">
                {PAGE_TYPE_LABELS[briefing.page_type]}
              </Badge>
              {isAnswered ? (
                <Badge className="text-[10px] bg-brand/10 text-brand border border-brand/20">
                  Respondido
                </Badge>
              ) : (
                <Badge className="text-[10px] bg-white/[0.04] text-white/40 border border-white/[0.08]">
                  Aguardando
                </Badge>
              )}
            </div>
          </div>
          <p className="text-white/20 text-xs">
            {new Date(briefing.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
