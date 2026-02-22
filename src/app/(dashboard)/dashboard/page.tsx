import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Code2, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DEMO_MODE, demoProfile, demoClients, demoCopies } from '@/lib/demo-data'

export default async function DashboardPage() {
  let firstName = 'Designer'
  let totalClients = 0
  let totalCopies = 0

  if (DEMO_MODE) {
    firstName = demoProfile.full_name.split(' ')[0]
    totalClients = demoClients.length
    totalCopies = demoCopies.length
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: profile }, { count: clients }, { count: copies }] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user?.id ?? '').single(),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('user_id', user?.id ?? ''),
      supabase.from('generated_copies').select('*', { count: 'exact', head: true }).eq('user_id', user?.id ?? ''),
    ])

    firstName = profile?.full_name?.split(' ')[0] ?? 'Designer'
    totalClients = clients ?? 0
    totalCopies = copies ?? 0
  }

  return (
    <div className="space-y-6">
      {/* Banner modo demo */}
      {DEMO_MODE && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 text-sm text-amber-400 flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <span>Modo demonstração ativo — dados fictícios para visualização. Configure o Supabase para usar de verdade.</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Olá, {firstName}! 👋
        </h1>
        <p className="text-white/55 mt-1">
          Bem-vindo de volta ao seu hub de ferramentas.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#111] border-white/[0.08]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-white/40 uppercase tracking-wider">Clientes</CardTitle>
            <Users className="h-4 w-4 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalClients}</div>
            <p className="text-xs text-white/30 mt-1">cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/[0.08]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-white/40 uppercase tracking-wider">Copies</CardTitle>
            <FileText className="h-4 w-4 text-white/40" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalCopies}</div>
            <p className="text-xs text-white/30 mt-1">geradas com IA</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/[0.08]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-white/40 uppercase tracking-wider">Códigos</CardTitle>
            <Code2 className="h-4 w-4 text-white/40" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+50</div>
            <p className="text-xs text-white/30 mt-1">snippets prontos</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/[0.08]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-white/40 uppercase tracking-wider">Aulas</CardTitle>
            <GraduationCap className="h-4 w-4 text-white/40" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+20</div>
            <p className="text-xs text-white/30 mt-1">exclusivas</p>
          </CardContent>
        </Card>
      </div>

      {/* Atalhos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#111] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white text-sm font-semibold">Começar agora</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Link href="/dashboard/clientes/novo">
              <Button className="w-full bg-brand hover:bg-brand-dark text-white justify-start gap-2 font-medium">
                <Users className="h-4 w-4" />
                Cadastrar novo cliente
              </Button>
            </Link>
            <Link href="/dashboard/codigos">
              <Button variant="outline" className="w-full border-white/[0.1] text-white/60 hover:bg-white/[0.05] hover:text-white justify-start gap-2">
                <Code2 className="h-4 w-4" />
                Ver códigos prontos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-brand/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.08] to-transparent pointer-events-none" />
          <CardHeader className="relative">
            <div className="w-1.5 h-1.5 bg-brand rounded-full mb-2" />
            <CardTitle className="text-white text-sm font-semibold">Upgrade do plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 relative">
            <p className="text-sm text-white/50 leading-relaxed">
              Desbloqueie IA ilimitada, todos os códigos e aulas exclusivas com o plano Pro.
            </p>
            <Button className="w-full bg-brand hover:bg-brand-dark text-white font-semibold">
              Ver planos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
