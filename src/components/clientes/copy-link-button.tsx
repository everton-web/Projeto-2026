'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link2, Check } from 'lucide-react'

interface Props {
  url: string
}

export function CopyLinkButton({ url }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleCopy}
      className="border-white/[0.1] text-white/70 hover:bg-[#333] gap-1 text-xs"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-green-400" />
          Copiado!
        </>
      ) : (
        <>
          <Link2 className="h-3 w-3" />
          Copiar link
        </>
      )}
    </Button>
  )
}
