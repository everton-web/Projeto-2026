'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DEMO_MODE } from '@/lib/demo-data'

interface Props {
  postId: string
}

export function AdminDeletePost({ postId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 3000)
      return
    }

    setLoading(true)

    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 500))
      router.refresh()
      setLoading(false)
      return
    }

    const supabase = createClient()
    await supabase.from('biblioteca_posts').delete().eq('id', postId)
    router.refresh()
    setLoading(false)
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleDelete}
      disabled={loading}
      className={`h-8 text-xs gap-1.5 ${
        confirm
          ? 'text-red-400 bg-red-500/[0.1] hover:bg-red-500/[0.15]'
          : 'text-white/25 hover:text-red-400 hover:bg-red-500/[0.08]'
      }`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      {confirm ? 'Confirmar?' : ''}
    </Button>
  )
}
