import { createClient } from '@/lib/supabase/server'
import { DEMO_MODE, demoSnippets } from '@/lib/demo-data'
import { CodeSnippet } from '@/lib/types/database'
import { Code2, ShieldCheck, Lock, Unlock } from 'lucide-react'

export default async function AdminCodigosPage() {
  let snippets: CodeSnippet[] = []

  if (DEMO_MODE) {
    snippets = demoSnippets as CodeSnippet[]
  } else {
    const supabase = await createClient()
    const { data } = await supabase
      .from('code_snippets')
      .select('*')
      .order('created_at', { ascending: false })
    snippets = (data ?? []) as CodeSnippet[]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-4 w-4 text-brand" />
            <span className="text-xs text-brand uppercase tracking-widest font-semibold">Admin</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Gerenciar Códigos</h1>
          <p className="text-white/40 text-sm mt-1">
            {snippets.length} snippets · {snippets.filter((s) => s.is_premium).length} premium
          </p>
        </div>
      </div>

      {/* Snippets list */}
      {snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/[0.08] rounded-xl">
          <Code2 className="h-10 w-10 text-white/10 mb-4" />
          <p className="text-white/30 text-sm">Nenhum snippet cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {snippets.map((snippet) => (
            <div
              key={snippet.id}
              className="flex items-center gap-4 bg-[#111] border border-white/[0.08] rounded-xl px-4 py-3.5"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                <Code2 className="h-4 w-4 text-white/30" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{snippet.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-white/30">{snippet.category}</span>
                  <span className="text-xs text-white/20">· {snippet.language}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {snippet.is_premium ? (
                  <span className="inline-flex items-center gap-1 text-xs text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                    <Lock className="h-2.5 w-2.5" /> Premium
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full">
                    <Unlock className="h-2.5 w-2.5" /> Free
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-white/25 text-center">
        Gerenciamento completo de snippets em breve.
      </p>
    </div>
  )
}
