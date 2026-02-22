import { createClient } from '@/lib/supabase/server'
import { DEMO_MODE, demoBibliotecaPosts, demoProfile } from '@/lib/demo-data'
import { BibliotecaPost } from '@/lib/types/database'
import { PostCard } from '@/components/biblioteca/post-card'
import { Library } from 'lucide-react'

const CATEGORIES = [
  'Todos',
  'Componentes UI',
  'Layouts & Seções',
  'Tipografia',
  'Animações',
  'Paletas',
  'Landing Pages',
  'Inspiração',
  'Ferramentas',
  'Geral',
]

interface Props {
  searchParams: Promise<{ categoria?: string }>
}

export default async function BibliotecaPage({ searchParams }: Props) {
  const { categoria } = await searchParams
  const activeCategory = categoria && CATEGORIES.includes(categoria) ? categoria : 'Todos'

  let posts: BibliotecaPost[] = []
  let userPlan = 'free'

  if (DEMO_MODE) {
    posts = demoBibliotecaPosts as BibliotecaPost[]
    userPlan = demoProfile.plan
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const [postsResult, profileResult] = await Promise.all([
        supabase
          .from('biblioteca_posts')
          .select('*, blocks:biblioteca_blocks(*)')
          .eq('published', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single(),
      ])
      posts = (postsResult.data ?? []) as BibliotecaPost[]
      userPlan = profileResult.data?.plan ?? 'free'
    }
  }

  const filtered = activeCategory !== 'Todos'
    ? posts.filter((p) => p.category === activeCategory)
    : posts

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Library className="h-4 w-4 text-brand" />
            <span className="text-xs text-brand uppercase tracking-widest font-semibold">Recursos</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Biblioteca</h1>
          <p className="text-white/40 text-sm mt-1">Componentes, snippets e inspirações para seus projetos</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{filtered.length}</span>
          <p className="text-white/40 text-xs">{filtered.length === 1 ? 'recurso' : 'recursos'}</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <a
            key={cat}
            href={cat === 'Todos' ? '/dashboard/biblioteca' : `/dashboard/biblioteca?categoria=${encodeURIComponent(cat)}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat
                ? 'bg-brand text-white'
                : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.08] hover:text-white/70'
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Library className="h-10 w-10 text-white/10 mb-4" />
          <p className="text-white/40 text-sm">Nenhum recurso encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} userPlan={userPlan} />
          ))}
        </div>
      )}
    </div>
  )
}
