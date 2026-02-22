'use client'

import { useState } from 'react'
import { BibliotecaBlock } from '@/lib/types/database'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  block: BibliotecaBlock
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleCopy}
      className="h-7 px-2 text-white/40 hover:text-white hover:bg-white/[0.08] gap-1.5 text-xs"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-400" />
          <span className="text-green-400">Copiado</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copiar
        </>
      )}
    </Button>
  )
}

const LANGUAGE_LABELS: Record<string, string> = {
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
  text: 'Texto',
}

export function BlockRenderer({ block }: Props) {
  if (block.type === 'text') {
    return (
      <div className="prose prose-invert prose-sm max-w-none">
        <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{block.content}</p>
      </div>
    )
  }

  if (block.type === 'code') {
    const lang = block.language ?? 'text'
    const label = LANGUAGE_LABELS[lang] ?? lang.toUpperCase()

    return (
      <div className="rounded-xl overflow-hidden border border-white/[0.08]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border-b border-white/[0.06]">
          <span className="text-xs font-mono text-white/40 font-medium">{label}</span>
          {block.content && <CopyButton text={block.content} />}
        </div>
        {/* Code */}
        <div className="bg-[#0d0d0d] p-4 overflow-x-auto">
          <pre className="text-sm text-white/80 font-mono leading-relaxed whitespace-pre">
            <code>{block.content}</code>
          </pre>
        </div>
        {block.caption && (
          <div className="px-4 py-2 bg-[#1a1a1a] border-t border-white/[0.06]">
            <p className="text-xs text-white/30 italic">{block.caption}</p>
          </div>
        )}
      </div>
    )
  }

  if (block.type === 'image' || block.type === 'gif') {
    return (
      <figure className="space-y-2">
        {block.file_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={block.file_url}
            alt={block.caption ?? ''}
            className="w-full rounded-xl border border-white/[0.08]"
          />
        )}
        {block.caption && (
          <figcaption className="text-xs text-white/35 text-center italic">{block.caption}</figcaption>
        )}
      </figure>
    )
  }

  if (block.type === 'video') {
    return (
      <figure className="space-y-2">
        {block.file_url && (
          <video
            src={block.file_url}
            controls
            className="w-full rounded-xl border border-white/[0.08]"
          />
        )}
        {block.caption && (
          <figcaption className="text-xs text-white/35 text-center italic">{block.caption}</figcaption>
        )}
      </figure>
    )
  }

  if (block.type === 'svg') {
    return (
      <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a] p-6 flex items-center justify-center">
        {block.file_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={block.file_url} alt={block.caption ?? 'SVG'} className="max-h-64" />
        ) : block.content ? (
          <div
            className="max-h-64 [&_*]:max-w-full"
            // SVG content is admin-provided, displayed as-is
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        ) : null}
        {block.caption && (
          <p className="text-xs text-white/35 italic mt-3">{block.caption}</p>
        )}
      </div>
    )
  }

  return null
}
