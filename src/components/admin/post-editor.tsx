'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BibliotecaBlock, BibliotecaBlockType, BibliotecaCategory, BibliotecaPost } from '@/lib/types/database'
import { BlockEditor } from '@/components/admin/block-editor'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PlusCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DEMO_MODE } from '@/lib/demo-data'

type DraftBlock = Partial<BibliotecaBlock> & { _tempId: string; type: BibliotecaBlockType }

const CATEGORIES: BibliotecaCategory[] = [
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
  post?: BibliotecaPost
}

function genId() {
  return Math.random().toString(36).slice(2)
}

function newBlock(type: BibliotecaBlockType = 'code'): DraftBlock {
  return { _tempId: genId(), type, language: 'html', content: '', caption: '' }
}

export function PostEditor({ post }: Props) {
  const router = useRouter()
  const isEditing = !!post

  const [title, setTitle] = useState(post?.title ?? '')
  const [description, setDescription] = useState(post?.description ?? '')
  const [category, setCategory] = useState<string>(post?.category ?? 'Componentes UI')
  const [tags, setTags] = useState(post?.tags?.join(', ') ?? '')
  const [planRequired, setPlanRequired] = useState<'basic' | 'pro'>(post?.plan_required ?? 'basic')
  const [published, setPublished] = useState(post?.published ?? false)
  const [blocks, setBlocks] = useState<DraftBlock[]>(
    post?.blocks?.map((b) => ({ ...b, _tempId: genId() })) ?? [newBlock()]
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addBlock() {
    setBlocks((prev) => [...prev, newBlock()])
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b._tempId !== id))
  }

  function updateBlock(id: string, field: string, value: string) {
    setBlocks((prev) =>
      prev.map((b) => (b._tempId === id ? { ...b, [field]: value } : b))
    )
  }

  async function handleSave(publish?: boolean) {
    if (!title.trim()) {
      setError('O título é obrigatório.')
      return
    }

    setSaving(true)
    setError(null)

    const shouldPublish = publish !== undefined ? publish : published

    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 800))
      router.push('/dashboard/admin/biblioteca')
      return
    }

    const supabase = createClient()
    const tagsArr = tags.split(',').map((t) => t.trim()).filter(Boolean)

    if (isEditing && post) {
      const { error: postError } = await supabase
        .from('biblioteca_posts')
        .update({ title, description: description || null, category, tags: tagsArr, plan_required: planRequired, published: shouldPublish, updated_at: new Date().toISOString() })
        .eq('id', post.id)

      if (postError) {
        setError('Erro ao salvar o post.')
        setSaving(false)
        return
      }

      // Delete existing blocks and re-insert
      await supabase.from('biblioteca_blocks').delete().eq('post_id', post.id)
    } else {
      const { data: newPost, error: postError } = await supabase
        .from('biblioteca_posts')
        .insert({ title, description: description || null, category, tags: tagsArr, plan_required: planRequired, published: shouldPublish })
        .select()
        .single()

      if (postError || !newPost) {
        setError('Erro ao criar o post.')
        setSaving(false)
        return
      }

      const blocksToInsert = blocks.map((b, i) => ({
        post_id: newPost.id,
        type: b.type,
        content: b.content ?? null,
        file_url: b.file_url ?? null,
        language: b.language ?? null,
        caption: b.caption ?? null,
        order_index: i,
      }))

      await supabase.from('biblioteca_blocks').insert(blocksToInsert)
      router.push('/dashboard/admin/biblioteca')
      return
    }

    const blocksToInsert = blocks.map((b, i) => ({
      post_id: post!.id,
      type: b.type,
      content: b.content ?? null,
      file_url: b.file_url ?? null,
      language: b.language ?? null,
      caption: b.caption ?? null,
      order_index: i,
    }))

    await supabase.from('biblioteca_blocks').insert(blocksToInsert)
    router.push('/dashboard/admin/biblioteca')
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Meta */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Informações</h2>

        <div className="space-y-1">
          <Label className="text-white/70 text-sm">Título</Label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do post..."
            className="w-full px-3 py-2.5 rounded-md bg-[#252525] border border-white/[0.1] text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-white/70 text-sm">Descrição <span className="text-white/30">(opcional)</span></Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Breve descrição do conteúdo..."
            className="w-full px-3 py-2.5 rounded-md bg-[#252525] border border-white/[0.1] text-white placeholder:text-white/25 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Categoria</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#252525] border border-white/[0.1] text-white text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Tags <span className="text-white/30">(separadas por vírgula)</span></Label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="dark-mode, botão, hover"
              className="w-full px-3 py-2.5 rounded-md bg-[#252525] border border-white/[0.1] text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        {/* Plano necessário */}
        <div className="space-y-1">
          <Label className="text-white/70 text-sm">Nível de acesso</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPlanRequired('basic')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                planRequired === 'basic'
                  ? 'bg-brand/10 border-brand/40 text-brand'
                  : 'bg-[#252525] border-white/[0.1] text-white/40 hover:text-white/70'
              }`}
            >
              Basic — R$ 29,90
            </button>
            <button
              type="button"
              onClick={() => setPlanRequired('pro')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                planRequired === 'pro'
                  ? 'bg-brand/10 border-brand/40 text-brand'
                  : 'bg-[#252525] border-white/[0.1] text-white/40 hover:text-white/70'
              }`}
            >
              Pro — R$ 45,90
            </button>
          </div>
          <p className="text-xs text-white/25">Define qual plano o usuário precisa ter para acessar este conteúdo.</p>
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Blocos de conteúdo</h2>
          <span className="text-xs text-white/30">{blocks.length} {blocks.length === 1 ? 'bloco' : 'blocos'}</span>
        </div>

        {blocks.map((block, i) => (
          <BlockEditor
            key={block._tempId}
            block={block}
            index={i}
            onChange={updateBlock}
            onRemove={removeBlock}
          />
        ))}

        <Button
          type="button"
          variant="ghost"
          onClick={addBlock}
          className="w-full border border-dashed border-white/[0.12] text-white/35 hover:text-white/60 hover:bg-white/[0.03] hover:border-white/[0.2] py-6 gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar bloco
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => handleSave(false)}
          disabled={saving}
          className="text-white/50 hover:text-white/80 gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <EyeOff className="h-4 w-4" />}
          Salvar rascunho
        </Button>
        <Button
          type="button"
          onClick={() => handleSave(true)}
          disabled={saving}
          className="bg-brand hover:bg-brand-dark text-white gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          {isEditing ? 'Salvar e publicar' : 'Publicar'}
        </Button>
      </div>
    </div>
  )
}
