import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Video, Lock, Calendar, Play } from 'lucide-react'
import Link from 'next/link'
import { DEMO_MODE, demoLives, demoProfile } from '@/lib/demo-data'

export default async function LivesPage() {
  let lives = demoLives
  let isPro = false

  if (DEMO_MODE) {
    isPro = demoProfile.plan === 'pro'
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user?.id ?? '')
      .single()

    const { data } = await supabase
      .from('lives')
      .select('*')
      .order('scheduled_at', { ascending: false })

    lives = data ?? []
    isPro = profile?.plan === 'pro'
  }

  const now = new Date()
  const upcoming = lives.filter((l) => new Date(l.scheduled_at) > now)
  const past = lives.filter((l) => new Date(l.scheduled_at) <= now)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Lives & Mentorias</h1>
        <p className="text-white/55 mt-1">Sessões ao vivo e gravações exclusivas</p>
      </div>

      {lives.length === 0 && (
        <Card className="bg-[#1a1a1a] border-white/[0.08] border-dashed">
          <CardContent className="py-16 text-center space-y-4">
            <Video className="h-12 w-12 text-white/25 mx-auto" />
            <div>
              <h3 className="text-white font-medium">Em breve</h3>
              <p className="text-white/55 text-sm mt-1">As próximas lives serão anunciadas em breve.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white/80 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Próximas lives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((live) => {
              const isLocked = live.is_premium && !isPro
              const date = new Date(live.scheduled_at)
              return (
                <Card key={live.id} className="bg-[#1a1a1a] border-white/[0.08]">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white font-semibold">{live.title}</h3>
                      <div className="flex gap-2">
                        <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs">Ao vivo</Badge>
                        {live.is_premium && (
                          <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">Pro</Badge>
                        )}
                      </div>
                    </div>
                    {live.description && <p className="text-sm text-white/55">{live.description}</p>}
                    <div className="flex items-center gap-2 text-xs text-white/35">
                      <Calendar className="h-3.5 w-3.5" />
                      {date.toLocaleDateString('pt-BR', {
                        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                    {isLocked ? (
                      <div className="flex items-center gap-2 text-xs text-amber-500/80">
                        <Lock className="h-3.5 w-3.5" />Disponível no plano Pro
                      </div>
                    ) : (
                      <Link href={live.stream_url} target="_blank">
                        <Badge className="bg-brand/20 text-brand-light border border-brand/30 cursor-pointer hover:bg-brand/30">
                          Participar da live →
                        </Badge>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white/80">Gravações anteriores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {past.map((live) => {
              const isLocked = live.is_premium && !isPro
              return (
                <Card key={live.id} className="bg-[#1a1a1a] border-white/[0.08]">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white font-semibold">{live.title}</h3>
                      {live.is_premium && (
                        <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">Pro</Badge>
                      )}
                    </div>
                    {live.description && <p className="text-sm text-white/55">{live.description}</p>}
                    {isLocked ? (
                      <div className="flex items-center gap-2 text-xs text-amber-500/80">
                        <Lock className="h-3.5 w-3.5" />Disponível no plano Pro
                      </div>
                    ) : live.is_recorded && live.recording_url ? (
                      <Link href={live.recording_url} target="_blank">
                        <Badge className="bg-[#252525] text-white/70 border border-white/[0.1] cursor-pointer hover:bg-[#333] gap-1 flex items-center w-fit">
                          <Play className="h-3 w-3" />Ver gravação
                        </Badge>
                      </Link>
                    ) : (
                      <span className="text-xs text-white/35">Gravação não disponível</span>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
