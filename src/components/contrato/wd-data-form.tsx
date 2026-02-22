'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WdProfile } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DEMO_MODE } from '@/lib/demo-data'

interface Props {
  existing?: WdProfile | null
}

export function WdDataForm({ existing }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(existing?.name ?? '')
  const [cpfCnpj, setCpfCnpj] = useState(existing?.cpf_cnpj ?? '')
  const [address, setAddress] = useState(existing?.address ?? '')
  const [city, setCity] = useState(existing?.city ?? '')
  const [state, setState] = useState(existing?.state ?? '')
  const [phone, setPhone] = useState(existing?.phone ?? '')
  const [email, setEmail] = useState(existing?.email ?? '')

  async function handleSave() {
    if (!name.trim() || !cpfCnpj.trim()) {
      setError('Nome e CPF/CNPJ são obrigatórios.')
      return
    }

    setSaving(true)
    setError(null)

    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 700))
      router.push('/dashboard/contrato')
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Sessão expirada.'); setSaving(false); return }

    const payload = { user_id: user.id, name, cpf_cnpj: cpfCnpj, address, city, state, phone, email }

    if (existing) {
      await supabase.from('wd_profiles').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', existing.id)
    } else {
      await supabase.from('wd_profiles').insert(payload)
    }

    router.push('/dashboard/contrato')
    router.refresh()
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-md bg-[#252525] border border-white/[0.1] text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-brand'

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1 sm:col-span-2">
          <Label className="text-white/70 text-sm">Nome completo / Razão social</Label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="João da Silva" className={inputClass} />
        </div>

        <div className="space-y-1">
          <Label className="text-white/70 text-sm">CPF / CNPJ</Label>
          <input type="text" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} placeholder="000.000.000-00" className={inputClass} />
        </div>

        <div className="space-y-1">
          <Label className="text-white/70 text-sm">Telefone / WhatsApp</Label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" className={inputClass} />
        </div>

        <div className="space-y-1">
          <Label className="text-white/70 text-sm">E-mail profissional</Label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className={inputClass} />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label className="text-white/70 text-sm">Endereço</Label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, bairro" className={inputClass} />
        </div>

        <div className="space-y-1">
          <Label className="text-white/70 text-sm">Cidade</Label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="São Paulo" className={inputClass} />
        </div>

        <div className="space-y-1">
          <Label className="text-white/70 text-sm">Estado</Label>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="SP" maxLength={2} className={inputClass} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving} className="bg-brand hover:bg-brand-dark text-white gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar dados
        </Button>
      </div>
    </div>
  )
}
