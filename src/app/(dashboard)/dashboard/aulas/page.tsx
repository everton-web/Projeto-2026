import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Lock, Play, Clock } from 'lucide-react'
import Link from 'next/link'
import { DEMO_MODE, demoLessons, demoProfile } from '@/lib/demo-data'

export default async function AulasPage() {
  let lessons = demoLessons
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
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true })

    lessons = data ?? []
    isPro = profile?.plan === 'pro'
  }

  const categories = [...new Set(lessons.map((l) => l.category))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Aulas Exclusivas</h1>
        <p className="text-white/55 mt-1">Aprenda e evolua com conteúdos criados para webdesigners</p>
      </div>

      {lessons.length === 0 && (
        <Card className="bg-[#1a1a1a] border-white/[0.08] border-dashed">
          <CardContent className="py-16 text-center space-y-4">
            <GraduationCap className="h-12 w-12 text-white/25 mx-auto" />
            <div>
              <h3 className="text-white font-medium">Em breve</h3>
              <p className="text-white/55 text-sm mt-1">As primeiras aulas serão publicadas em breve.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h2 className="text-lg font-semibold text-white/80">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons
              .filter((l) => l.category === category)
              .map((lesson) => {
                const isLocked = lesson.is_premium && !isPro
                return (
                  <Card key={lesson.id} className="bg-[#1a1a1a] border-white/[0.08] overflow-hidden group">
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-[#252525] flex items-center justify-center">
                      {lesson.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={lesson.thumbnail_url} alt={lesson.title} className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="h-10 w-10 text-white/25" />
                      )}
                      {isLocked ? (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Lock className="h-8 w-8 text-amber-400" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="h-10 w-10 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-white leading-tight">{lesson.title}</h3>
                        {lesson.is_premium && (
                          <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">Pro</Badge>
                        )}
                      </div>
                      {lesson.duration_minutes && (
                        <div className="flex items-center gap-1 text-xs text-white/35">
                          <Clock className="h-3 w-3" />
                          {lesson.duration_minutes} min
                        </div>
                      )}
                      {isLocked ? (
                        <p className="text-xs text-amber-500/80">Disponível no plano Pro</p>
                      ) : (
                        <Link href={`/dashboard/aulas/${lesson.id}`} className="block">
                          <span className="text-xs text-brand-light hover:text-brand-light">Assistir aula →</span>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}
