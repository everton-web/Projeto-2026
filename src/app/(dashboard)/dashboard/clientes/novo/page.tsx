'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const niches = [
  'Restaurante / Alimentação',
  'Clínica / Saúde',
  'Imobiliária / Imóveis',
  'E-commerce / Loja Virtual',
  'Advocacia / Jurídico',
  'Educação / Cursos',
  'Beleza / Estética',
  'Academia / Personal',
  'Consultoria / Serviços',
  'Tecnologia / Software',
  'Construção / Reforma',
  'Moda / Roupas',
  'Fotografia / Vídeo',
  'Marketing Digital',
  'Outro',
]

export default function NovoClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error: insertError } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        name: formData.get('name') as string,
        email: formData.get('email') as string || null,
        phone: formData.get('phone') as string || null,
        niche: formData.get('niche') as string,
        notes: formData.get('notes') as string || null,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push(`/dashboard/clientes/${data.id}`)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/clientes">
          <Button variant="ghost" size="icon" className="text-white/55 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Novo cliente</h1>
          <p className="text-white/55 mt-0.5 text-sm">Preencha os dados do cliente para começar</p>
        </div>
      </div>

      <Card className="bg-[#1a1a1a] border-white/[0.08]">
        <CardHeader>
          <CardTitle className="text-white text-base">Dados do cliente</CardTitle>
          <CardDescription className="text-white/55">
            Após cadastrar, você poderá compartilhar o link do briefing com o cliente.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/70">Nome *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nome do cliente"
                  required
                  className="bg-[#252525] border-white/[0.1] text-white placeholder:text-white/35"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="cliente@email.com"
                  className="bg-[#252525] border-white/[0.1] text-white placeholder:text-white/35"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/70">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(11) 99999-9999"
                  className="bg-[#252525] border-white/[0.1] text-white placeholder:text-white/35"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="niche" className="text-white/70">Nicho *</Label>
                <select
                  id="niche"
                  name="niche"
                  required
                  className="w-full h-10 px-3 rounded-md bg-[#252525] border border-white/[0.1] text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="" className="bg-[#252525]">Selecione o nicho</option>
                  {niches.map((n) => (
                    <option key={n} value={n} className="bg-[#252525]">{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white/70">Observações</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Anotações sobre o cliente..."
                className="w-full px-3 py-2 rounded-md bg-[#252525] border border-white/[0.1] text-white placeholder:text-white/35 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link href="/dashboard/clientes">
                <Button type="button" variant="outline" className="border-white/[0.1] text-white/70 hover:bg-[#252525]">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-brand hover:bg-brand text-white gap-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cadastrar cliente'}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
