import { PostEditor } from '@/components/admin/post-editor'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function AdminBibliotecaNovoPage() {
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
          <span className="text-xs text-brand uppercase tracking-widest font-semibold">Admin</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Novo post</h1>
        <p className="text-white/40 text-sm mt-1">Crie um novo recurso para a Biblioteca</p>
      </div>

      <PostEditor />
    </div>
  )
}
