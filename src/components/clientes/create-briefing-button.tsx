'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  clientId: string
  niche: string
}

export function CreateBriefingButton({ clientId, niche }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCreate() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('briefing_forms')
      .insert({
        client_id: clientId,
        user_id: user.id,
        niche,
      })

    if (error) {
      toast.error('Erro ao gerar briefing')
    } else {
      toast.success('Link de briefing gerado!')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Button
      size="sm"
      onClick={handleCreate}
      disabled={loading}
      className="bg-brand hover:bg-brand text-white gap-1.5 text-xs"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
      Gerar briefing
    </Button>
  )
}
