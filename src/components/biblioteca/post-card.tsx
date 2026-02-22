import Link from 'next/link'
import { BibliotecaPost } from '@/lib/types/database'
import { Code2, Image, FileText, Lock, Pencil } from 'lucide-react'

interface Props {
  post: BibliotecaPost
  userPlan: string
  isAdmin?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  'Componentes UI': 'text-brand bg-brand/10',
  'Layouts & Seções': 'text-blue-400 bg-blue-400/10',
  'Tipografia': 'text-purple-400 bg-purple-400/10',
  'Animações': 'text-yellow-400 bg-yellow-400/10',
  'Paletas': 'text-pink-400 bg-pink-400/10',
  'Landing Pages': 'text-green-400 bg-green-400/10',
  'Inspiração': 'text-cyan-400 bg-cyan-400/10',
  'Ferramentas': 'text-indigo-400 bg-indigo-400/10',
  'Geral': 'text-white/40 bg-white/[0.06]',
}

function getBlockIcon(post: BibliotecaPost) {
  const blocks = post.blocks ?? []
  const hasCode = blocks.some((b) => b.type === 'code')
  const hasMedia = blocks.some((b) => ['image', 'video', 'gif', 'svg'].includes(b.type))
  if (hasCode) return <Code2 className="h-3.5 w-3.5" />
  if (hasMedia) return <Image className="h-3.5 w-3.5" />
  return <FileText className="h-3.5 w-3.5" />
}

function isLocked(userPlan: string, planRequired: 'basic' | 'pro'): boolean {
  if (userPlan === 'pro') return false
  if (userPlan === 'basic' && planRequired === 'basic') return false
  return true
}

export function PostCard({ post, userPlan, isAdmin }: Props) {
  const colorClass = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS['Geral']
  const blockCount = post.blocks?.length ?? 0
  const locked = isLocked(userPlan, post.plan_required)

  const card = (
    <div className={`group flex flex-col bg-[#111] border rounded-xl overflow-hidden transition-all ${
      locked
        ? 'border-white/[0.06] opacity-70 cursor-not-allowed'
        : 'border-white/[0.08] hover:border-white/[0.16] hover:bg-[#161616] cursor-pointer'
    }`}>
      {/* Cover / thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {post.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_url}
            alt={post.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${locked ? 'blur-sm' : 'group-hover:scale-105'}`}
          />
        ) : (
          <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
            <div className="text-white/10">{getBlockIcon(post)}</div>
          </div>
        )}

        {/* Lock overlay */}
        {locked && (
          <div className="absolute inset-0 bg-[#111]/60 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 bg-[#1a1a1a] border border-white/[0.12] rounded-lg flex items-center justify-center">
              <Lock className="h-4 w-4 text-white/50" />
            </div>
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">
              {post.plan_required === 'pro' ? 'Pro' : 'Basic'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category + plan badge */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${colorClass}`}>
            {post.category}
          </span>
          {post.plan_required === 'pro' && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand/10 text-brand uppercase tracking-wider">
              Pro
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-sm font-semibold leading-snug transition-colors ${locked ? 'text-white/50' : 'text-white group-hover:text-brand'}`}>
          {post.title}
        </h3>

        {/* Description */}
        {post.description && (
          <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{post.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-1.5 text-white/25 text-xs">
            {getBlockIcon(post)}
            <span>{blockCount} {blockCount === 1 ? 'bloco' : 'blocos'}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] text-white/25 bg-white/[0.04] px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (locked) return card

  return (
    <div className="relative group/wrap">
      <Link href={`/dashboard/biblioteca/${post.id}`}>
        {card}
      </Link>
      {isAdmin && (
        <Link
          href={`/dashboard/admin/biblioteca/${post.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 z-10 w-7 h-7 bg-[#111]/80 border border-white/[0.12] rounded-lg flex items-center justify-center opacity-0 group-hover/wrap:opacity-100 transition-opacity hover:bg-brand/20 hover:border-brand/40"
          title="Editar post"
        >
          <Pencil className="h-3.5 w-3.5 text-white/60 hover:text-brand" />
        </Link>
      )}
    </div>
  )
}
