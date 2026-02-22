import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DEMO_MODE, demoBibliotecaPosts, demoProfile } from '@/lib/demo-data'
import { BibliotecaPost } from '@/lib/types/database'
import { BlockRenderer } from '@/components/biblioteca/block-renderer'
import { ArrowLeft, Library, Lock } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ postId: string }>
}

export default async function BibliotecaPostPage({ params }: Props) {
  const { postId } = await params

  let post: BibliotecaPost | null = null
  let userPlan = 'free'

  if (DEMO_MODE) {
    post = (demoBibliotecaPosts.find((p) => p.id === postId) as BibliotecaPost) ?? null
    userPlan = demoProfile.plan
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [postResult, profileResult] = await Promise.all([
      supabase
        .from('biblioteca_posts')
        .select('*, blocks:biblioteca_blocks(*)')
        .eq('id', postId)
        .eq('published', true)
        .single(),
      user
        ? supabase.from('profiles').select('plan').eq('id', user.id).single()
        : Promise.resolve({ data: null }),
    ])

    post = postResult.data as BibliotecaPost | null
    userPlan = (profileResult.data as { plan?: string } | null)?.plan ?? 'free'
  }

  if (!post) notFound()

  const blocks = post.blocks?.sort((a, b) => a.order_index - b.order_index) ?? []

  // Verificação de acesso
  const isLocked =
    userPlan === 'free' ||
    (userPlan === 'basic' && post.plan_required === 'pro')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/biblioteca"
        className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar à Biblioteca
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Library className="h-3.5 w-3.5 text-brand" />
          <span className="text-xs text-brand uppercase tracking-widest font-semibold">{post.category}</span>
          {post.plan_required === 'pro' && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand/10 text-brand uppercase tracking-wider">Pro</span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white leading-snug">{post.title}</h1>
        {post.description && (
          <p className="text-white/50 text-sm leading-relaxed">{post.description}</p>
        )}
        {post.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-white/35 bg-white/[0.05] px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cover */}
      {post.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_url}
          alt={post.title}
          className={`w-full rounded-xl border border-white/[0.08] ${isLocked ? 'blur-sm opacity-50' : ''}`}
        />
      )}

      {/* Access gate */}
      {isLocked ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/[0.1] rounded-2xl bg-[#111]">
          <div className="w-12 h-12 bg-[#1a1a1a] border border-white/[0.1] rounded-xl flex items-center justify-center mb-4">
            <Lock className="h-5 w-5 text-white/40" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Conteúdo {post.plan_required === 'pro' ? 'Pro' : 'Basic'}
          </h2>
          <p className="text-white/40 text-sm max-w-xs mb-6">
            {post.plan_required === 'pro'
              ? 'Este conteúdo está disponível apenas para assinantes do plano Pro (R$ 45,90/mês).'
              : 'Este conteúdo está disponível para assinantes Basic (R$ 29,90/mês) ou Pro.'}
          </p>
          <Link
            href="/dashboard/configuracoes"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Ver planos
          </Link>
        </div>
      ) : (
        /* Blocks */
        blocks.length > 0 ? (
          <div className="space-y-4">
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-white/30 text-sm">
            Nenhum conteúdo disponível.
          </div>
        )
      )}
    </div>
  )
}
