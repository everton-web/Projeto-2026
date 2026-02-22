import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Code2, Lock } from 'lucide-react'
import { CopyButton } from '@/components/ui/copy-button'
import { DEMO_MODE, demoSnippets, demoProfile } from '@/lib/demo-data'

export default async function CodigosPage() {
  let snippets = demoSnippets
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
      .from('code_snippets')
      .select('*')
      .order('category', { ascending: true })

    snippets = data ?? []
    isPro = profile?.plan === 'pro'
  }

  const categories = [...new Set(snippets.map((s) => s.category))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Códigos Prontos</h1>
        <p className="text-white/55 mt-1">Snippets e componentes para usar nos seus projetos</p>
      </div>

      {categories.length === 0 && (
        <Card className="bg-[#1a1a1a] border-white/[0.08] border-dashed">
          <CardContent className="py-16 text-center space-y-4">
            <Code2 className="h-12 w-12 text-white/25 mx-auto" />
            <div>
              <h3 className="text-white font-medium">Em breve</h3>
              <p className="text-white/55 text-sm mt-1">Os primeiros códigos serão publicados em breve.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h2 className="text-lg font-semibold text-white/80">{category}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {snippets
              .filter((s) => s.category === category)
              .map((snippet) => {
                const isLocked = snippet.is_premium && !isPro
                return (
                  <Card key={snippet.id} className="bg-[#1a1a1a] border-white/[0.08]">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-white text-sm font-semibold">
                          {snippet.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline" className="text-[10px] border-white/[0.1] text-white/55">
                            {snippet.language}
                          </Badge>
                          {snippet.is_premium && (
                            <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Pro
                            </Badge>
                          )}
                        </div>
                      </div>
                      {snippet.description && (
                        <p className="text-xs text-white/55 mt-1">{snippet.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      {isLocked ? (
                        <div className="bg-[#252525] rounded-lg p-4 text-center space-y-2">
                          <Lock className="h-5 w-5 text-amber-400 mx-auto" />
                          <p className="text-xs text-white/55">Disponível no plano Pro</p>
                        </div>
                      ) : (
                        <div className="relative">
                          <pre className="bg-[#0a0a0a] rounded-lg p-4 overflow-x-auto text-xs text-white/70 font-mono">
                            {snippet.code}
                          </pre>
                          <div className="absolute top-2 right-2">
                            <CopyButton text={snippet.code} />
                          </div>
                        </div>
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
