import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DEMO_MODE, demoBibliotecaPosts } from '@/lib/demo-data'
import { BibliotecaPost } from '@/lib/types/database'
import { PostEditor } from '@/components/admin/post-editor'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ postId: string }>
}

export default async function AdminBibliotecaEditPage({ params }: Props) {
  const { postId } = await params

  let post: BibliotecaPost | null = null

  if (DEMO_MODE) {
    post = (demoBibliotecaPosts.find((p) => p.id === postId) as BibliotecaPost) ?? null
  } else {
    const supabase = await createClient()
    const { data } = await supabase
      .from('biblioteca_posts')
      .select('*, blocks:biblioteca_blocks(*)')
      .eq('id', postId)
      .single()
    post = data as BibliotecaPost | null
  }

  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/admin/biblioteca"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-4 w-4 text-brand" />
          <span className="text-xs text-brand uppercase tracking-widest font-semibold">Admin · Editar</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Editar post</h1>
        <p className="text-white/40 text-sm mt-1 truncate">{post.title}</p>
      </div>

      <PostEditor post={post} />
    </div>
  )
}
