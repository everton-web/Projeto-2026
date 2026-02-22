'use client'

import { useState } from 'react'
import { BibliotecaBlock, BibliotecaBlockType } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { GripVertical, Trash2, Upload, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  block: Partial<BibliotecaBlock> & { _tempId: string; type: BibliotecaBlockType }
  index: number
  onChange: (id: string, field: string, value: string) => void
  onRemove: (id: string) => void
}

const BLOCK_TYPES: { value: BibliotecaBlockType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'code', label: 'Código' },
  { value: 'image', label: 'Imagem' },
  { value: 'video', label: 'Vídeo' },
  { value: 'gif', label: 'GIF' },
  { value: 'svg', label: 'SVG' },
]

const LANGUAGES = ['html', 'css', 'js', 'text']

const ACCEPT: Record<string, string> = {
  image: 'image/png,image/jpeg,image/webp',
  gif: 'image/gif',
}

export function BlockEditor({ block, index, onChange, onRemove }: Props) {
  const [uploading, setUploading] = useState(false)

  async function handleFileUpload(file: File) {
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `blocks/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage.from('biblioteca').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('biblioteca').getPublicUrl(data.path)
      onChange(block._tempId, 'file_url', publicUrl)
    }
    setUploading(false)
  }

  const isUploadable = block.type === 'image' || block.type === 'gif'
  const isMedia = isUploadable || block.type === 'video'

  return (
    <div className="border border-white/[0.08] rounded-xl bg-[#111] overflow-hidden">
      {/* Block header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/[0.06]">
        <GripVertical className="h-4 w-4 text-white/20 cursor-grab" />
        <span className="text-xs text-white/40 font-mono">Bloco {index + 1}</span>
        <select
          value={block.type}
          onChange={(e) => onChange(block._tempId, 'type', e.target.value)}
          className="ml-auto bg-[#252525] border border-white/[0.1] text-white/70 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand"
        >
          {BLOCK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onRemove(block._tempId)}
          className="h-7 w-7 p-0 text-white/25 hover:text-red-400 hover:bg-red-500/[0.08]"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Block content */}
      <div className="p-4 space-y-3">
        {block.type === 'code' && (
          <div className="space-y-1">
            <Label className="text-white/50 text-xs">Linguagem</Label>
            <select
              value={block.language ?? 'html'}
              onChange={(e) => onChange(block._tempId, 'language', e.target.value)}
              className="w-full bg-[#252525] border border-white/[0.1] text-white/70 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>
        )}

        {(block.type === 'text' || block.type === 'code' || block.type === 'svg') && (
          <div className="space-y-1">
            <Label className="text-white/50 text-xs">
              {block.type === 'text' ? 'Conteúdo' : block.type === 'code' ? 'Código' : 'SVG (código ou URL)'}
            </Label>
            <textarea
              value={block.content ?? ''}
              onChange={(e) => onChange(block._tempId, 'content', e.target.value)}
              rows={block.type === 'code' ? 8 : 4}
              placeholder={
                block.type === 'text'
                  ? 'Digite o texto...'
                  : block.type === 'code'
                  ? `<!-- Código ${block.language?.toUpperCase() ?? 'HTML'} aqui -->`
                  : '<svg>...</svg>'
              }
              className="w-full px-3 py-2.5 rounded-md bg-[#0d0d0d] border border-white/[0.1] text-white/80 placeholder:text-white/20 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        )}

        {isMedia && (
          <div className="space-y-2">
            {/* Preview */}
            {block.file_url && (
              <div className="rounded-lg overflow-hidden border border-white/[0.08] bg-[#0d0d0d]">
                {block.type === 'video' ? (
                  <video src={block.file_url} controls className="w-full max-h-48 object-contain" />
                ) : (
                  <img src={block.file_url} alt="" className="w-full max-h-48 object-contain" />
                )}
              </div>
            )}

            {/* Upload (apenas imagem e gif) */}
            {isUploadable ? (
              <div className="flex gap-2 items-center">
                <label className="flex-1">
                  <input
                    type="file"
                    accept={ACCEPT[block.type]}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                  />
                  <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md border text-sm cursor-pointer transition-all ${
                    uploading
                      ? 'border-white/[0.1] text-white/25 bg-[#252525]'
                      : 'border-brand/30 text-brand/70 bg-brand/5 hover:bg-brand/10 hover:border-brand/50'
                  }`}>
                    {uploading ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Enviando...</>
                    ) : (
                      <><Upload className="h-3.5 w-3.5" /> {block.file_url ? 'Trocar arquivo' : 'Upload'}</>
                    )}
                  </div>
                </label>
                <span className="text-white/25 text-xs">ou</span>
                <input
                  type="url"
                  value={block.file_url ?? ''}
                  onChange={(e) => onChange(block._tempId, 'file_url', e.target.value)}
                  placeholder="URL direta..."
                  className="flex-1 px-3 py-2 rounded-md bg-[#252525] border border-white/[0.1] text-white/80 placeholder:text-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            ) : (
              /* Vídeo: somente URL (YouTube, Vimeo, etc.) */
              <div className="space-y-1">
                <Label className="text-white/50 text-xs">URL do vídeo (YouTube, Vimeo...)</Label>
                <input
                  type="url"
                  value={block.file_url ?? ''}
                  onChange={(e) => onChange(block._tempId, 'file_url', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2.5 rounded-md bg-[#252525] border border-white/[0.1] text-white/80 placeholder:text-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            )}
          </div>
        )}

        {block.type !== 'text' && (
          <div className="space-y-1">
            <Label className="text-white/50 text-xs">Legenda (opcional)</Label>
            <input
              type="text"
              value={block.caption ?? ''}
              onChange={(e) => onChange(block._tempId, 'caption', e.target.value)}
              placeholder="Descreva este bloco..."
              className="w-full px-3 py-2.5 rounded-md bg-[#252525] border border-white/[0.1] text-white/80 placeholder:text-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        )}
      </div>
    </div>
  )
}
