import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, Lock } from 'lucide-react'
import { DEMO_MODE, demoTips, demoProfile } from '@/lib/demo-data'

export default async function DicasPage() {
  let tips = demoTips
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
      .from('tips')
      .select('*')
      .order('created_at', { ascending: false })

    tips = data ?? []
    isPro = profile?.plan === 'pro'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dicas de Otimização</h1>
        <p className="text-white/55 mt-1">Melhore o desempenho e conversão das suas páginas</p>
      </div>

      {tips.length === 0 && (
        <Card className="bg-[#1a1a1a] border-white/[0.08] border-dashed">
          <CardContent className="py-16 text-center space-y-4">
            <Lightbulb className="h-12 w-12 text-white/25 mx-auto" />
            <div>
              <h3 className="text-white font-medium">Em breve</h3>
              <p className="text-white/55 text-sm mt-1">As primeiras dicas serão publicadas em breve.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip) => {
          const isLocked = tip.is_premium && !isPro
          return (
            <Card key={tip.id} className="bg-[#1a1a1a] border-white/[0.08]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <CardTitle className="text-white text-sm font-semibold">{tip.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] border-white/[0.1] text-white/55">
                      {tip.category}
                    </Badge>
                    {tip.is_premium && (
                      <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Pro
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLocked ? (
                  <div className="flex items-center gap-2 text-white/35">
                    <Lock className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Disponível no plano Pro</span>
                  </div>
                ) : (
                  <p className="text-sm text-white/55 leading-relaxed">{tip.content}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
