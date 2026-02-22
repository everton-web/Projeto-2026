import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { NovoBriefingForm } from '@/components/bc-studio/novo-briefing-form'
import { DEMO_MODE, demoClients } from '@/lib/demo-data'
import type { Client } from '@/lib/types/database'

export default async function NovoBriefingPage() {
  let clients: Client[] = []

  if (DEMO_MODE) {
    clients = demoClients as unknown as Client[]
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user?.id ?? '')
      .order('name')
    clients = data ?? []
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/bc-studio"
          className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white/80 transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          BC Studio
        </Link>
        <h1 className="text-2xl font-bold text-white">Novo Briefing</h1>
        <p className="text-white/55 mt-1">
          Configure o briefing e compartilhe o link com seu cliente para ele preencher.
        </p>
      </div>

      <NovoBriefingForm clients={clients} appUrl={appUrl} />
    </div>
  )
}
