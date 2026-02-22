import { createClient } from '@/lib/supabase/server'
import { DEMO_MODE, demoBibliotecaPosts } from '@/lib/demo-data'
import { BibliotecaPost } from '@/lib/types/database'
import Link from 'next/link'
import { PlusCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminDeletePost } from '@/components/admin/admin-delete-post'

export default async function AdminBibliotecaPage() {
  let posts: BibliotecaPost[] = []

  if (DEMO_MODE) {
    posts = demoBibliotecaPosts as BibliotecaPost[]
  } else {
    const supabase = await createClient()
    const { data } = await supabase
      .from('biblioteca_posts')
      .select('*, blocks:biblioteca_blocks(*)')
      .order('created_at', { ascending: false })
    posts = (data ?? []) as BibliotecaPost[]
  }

  const published = posts.filter((p) => p.published)
  const drafts = posts.filter((p) => !p.published)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-4 w-4 text-brand" />
            <span className="text-xs text-brand uppercase tracking-widest font-semibold">Admin</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Gerenciar Biblioteca</h1>
          <p className="text-white/40 text-sm mt-1">
            {published.length} publicados · {drafts.length} rascunhos
          </p>
        </div>
        <Link href="/dashboard/admin/biblioteca/novo">
          <Button className="bg-brand hover:bg-brand-dark text-white gap-2">
            <PlusCircle className="h-4 w-4" />
            Novo post
          </Button>
        </Link>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/[0.08] rounded-xl">
          <p className="text-white/30 text-sm mb-4">Nenhum post criado ainda.</p>
          <Link href="/dashboard/admin/biblioteca/novo">
            <Button variant="ghost" className="text-brand hover:text-brand border border-brand/30 hover:bg-brand/[0.06] gap-2">
              <PlusCircle className="h-4 w-4" />
              Criar primeiro post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 bg-[#111] border border-white/[0.08] rounded-xl px-4 py-3.5 hover:border-white/[0.14] transition-all"
            >
              {/* Status */}
              <div className={`flex-shrink-0 w-1.5 h-8 rounded-full ${post.published ? 'bg-green-500' : 'bg-white/20'}`} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{post.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-white/30">{post.category}</span>
                  {post.blocks && (
                    <span className="text-xs text-white/20">· {post.blocks.length} blocos</span>
                  )}
                  <span className="text-xs text-white/20">
                    · {post.published ? (
                      <span className="text-green-400/70 inline-flex items-center gap-1"><Eye className="h-2.5 w-2.5" /> Publicado</span>
                    ) : (
                      <span className="text-white/30 inline-flex items-center gap-1"><EyeOff className="h-2.5 w-2.5" /> Rascunho</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/dashboard/biblioteca/${post.id}`}>
                  <Button size="sm" variant="ghost" className="h-8 text-xs text-white/40 hover:text-white/70">
                    Ver
                  </Button>
                </Link>
                <Link href={`/dashboard/admin/biblioteca/${post.id}`}>
                  <Button size="sm" variant="ghost" className="h-8 text-xs text-white/40 hover:text-white/70">
                    Editar
                  </Button>
                </Link>
                <AdminDeletePost postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
