import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, ExternalLink, FileText } from 'lucide-react'
import Link from 'next/link'
import { DEMO_MODE, demoClients } from '@/lib/demo-data'

export default async function ClientesPage() {
  let clients: typeof demoClients = []

  if (DEMO_MODE) {
    clients = demoClients
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user?.id ?? '')
      .order('created_at', { ascending: false })
    clients = data ?? []
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-white/55 mt-1">Gerencie seus clientes e crie briefings personalizados</p>
        </div>
        <Link href="/dashboard/clientes/novo">
          <Button className="bg-brand hover:bg-brand text-white gap-2">
            <Plus className="h-4 w-4" />
            Novo cliente
          </Button>
        </Link>
      </div>

      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Card key={client.id} className="bg-[#1a1a1a] border-white/[0.08] hover:border-white/[0.1] transition-colors">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{client.name}</h3>
                    <p className="text-sm text-white/55 mt-0.5">{client.email ?? 'Sem e-mail'}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-[#252525] text-white/70 border-white/[0.1]">
                    {client.niche}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/clientes/${client.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-white/[0.1] text-white/70 hover:bg-[#252525] gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      Ver detalhes
                    </Button>
                  </Link>
                  <Link href={`/briefing/demo-token-abc123`} target="_blank" className="flex-1">
                    <Button size="sm" className="w-full bg-brand/20 hover:bg-brand/30 text-brand-light border border-brand/30 gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Briefing
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-[#1a1a1a] border-white/[0.08] border-dashed">
          <CardContent className="py-16 text-center space-y-4">
            <Users className="h-12 w-12 text-white/25 mx-auto" />
            <div>
              <h3 className="text-white font-medium">Nenhum cliente ainda</h3>
              <p className="text-white/55 text-sm mt-1">
                Cadastre seu primeiro cliente para começar a criar briefings e copies.
              </p>
            </div>
            <Link href="/dashboard/clientes/novo">
              <Button className="bg-brand hover:bg-brand text-white gap-2">
                <Plus className="h-4 w-4" />
                Cadastrar primeiro cliente
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
