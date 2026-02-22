'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, FileSignature } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DEMO_MODE } from '@/lib/demo-data'

const SERVICE_TYPES = [
  'Landing Page',
  'One Page',
  'Sales Page',
]

const EXCLUDED_OPTIONS: { id: string; label: string }[] = [
  { id: 'fotografia', label: 'Fotografia' },
  { id: 'banco_imagens', label: 'Banco de imagens' },
  { id: 'conteudo', label: 'Produção de conteúdo / textos' },
  { id: 'hospedagem', label: 'Hospedagem' },
  { id: 'dominio', label: 'Domínio' },
  { id: 'logo', label: 'Criação de logotipo' },
  { id: 'seo', label: 'Otimização SEO avançada' },
]

export function ContratoForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Dados do cliente
  const [clientName, setClientName] = useState('')
  const [clientCpfCnpj, setClientCpfCnpj] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [clientCity, setClientCity] = useState('')
  const [clientState, setClientState] = useState('')

  // Serviço
  const [serviceType, setServiceType] = useState('Landing Page')
  const [serviceDescription, setServiceDescription] = useState('')

  // Valores
  const [value, setValue] = useState('')
  const [entryValue, setEntryValue] = useState('')
  const [paymentType, setPaymentType] = useState('pix_entrada')
  const [installments, setInstallments] = useState('2')
  const [paymentTerms, setPaymentTerms] = useState('')

  // Prazos
  const [deliveryDays, setDeliveryDays] = useState('15')
  const [materialsDays, setMaterialsDays] = useState('3')
  const [maintenanceDays, setMaintenanceDays] = useState('7')
  const [startDate, setStartDate] = useState('')
  const [durationMonths, setDurationMonths] = useState('1')

  // Excluídos e testemunhas
  const [excludedServices, setExcludedServices] = useState<string[]>([])
  const [witness1, setWitness1] = useState('')
  const [witness2, setWitness2] = useState('')

  function toggleExcluded(id: string) {
    setExcludedServices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleGenerate() {
    if (!clientName.trim() || !serviceDescription.trim() || !value.trim()) {
      setError('Nome do cliente, descrição do serviço e valor são obrigatórios.')
      return
    }

    setSaving(true)
    setError(null)

    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 700))
      router.push('/dashboard/contrato/demo-contract-1')
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Sessão expirada.'); setSaving(false); return }

    const { data, error: insertError } = await supabase
      .from('contracts')
      .insert({
        user_id: user.id,
        client_name: clientName.trim(),
        client_cpf_cnpj: clientCpfCnpj.trim(),
        client_address: clientAddress.trim(),
        client_city: clientCity.trim(),
        client_state: clientState.trim().toUpperCase(),
        service_type: serviceType,
        service_description: serviceDescription.trim(),
        value: parseFloat(value.replace(/\./g, '').replace(',', '.')),
        entry_value: entryValue ? parseFloat(entryValue.replace(/\./g, '').replace(',', '.')) : 0,
        payment_type: paymentType,
        installments: parseInt(installments) || 2,
        payment_terms: paymentTerms.trim(),
        delivery_days: parseInt(deliveryDays) || 15,
        materials_days: parseInt(materialsDays) || 3,
        maintenance_days: parseInt(maintenanceDays) || 7,
        start_date: startDate || new Date().toISOString().split('T')[0],
        duration_months: parseInt(durationMonths) || 1,
        excluded_services: excludedServices,
        witness_1: witness1.trim() || null,
        witness_2: witness2.trim() || null,
      })
      .select()
      .single()

    if (insertError || !data) {
      setError('Erro ao gerar o contrato. Tente novamente.')
      setSaving(false)
      return
    }

    router.push(`/dashboard/contrato/${data.id}`)
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-md bg-[#252525] border border-white/[0.1] text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-brand'
  const selectClass = `${inputClass} appearance-none`

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Dados do cliente */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Dados do contratante (cliente)</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-white/70 text-sm">Nome completo / Razão social *</Label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Maria Souza"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-white/70 text-sm">CPF / CNPJ <span className="text-white/30">(opcional)</span></Label>
            <input
              type="text"
              value={clientCpfCnpj}
              onChange={(e) => setClientCpfCnpj(e.target.value)}
              placeholder="000.000.000-00"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Estado <span className="text-white/30">(UF)</span></Label>
            <input
              type="text"
              value={clientState}
              onChange={(e) => setClientState(e.target.value)}
              placeholder="SP"
              maxLength={2}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Endereço <span className="text-white/30">(opcional)</span></Label>
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Rua, número, bairro"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Cidade <span className="text-white/30">(opcional)</span></Label>
            <input
              type="text"
              value={clientCity}
              onChange={(e) => setClientCity(e.target.value)}
              placeholder="São Paulo"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Dados do serviço */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Serviço contratado</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Tipo de serviço *</Label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className={selectClass}
            >
              {SERVICE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Data de início</Label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-white/70 text-sm">Descrição do serviço *</Label>
          <textarea
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            rows={3}
            placeholder="Desenvolvimento de landing page com design responsivo, formulário de contato e integração com WhatsApp..."
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Prazos */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Prazos</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Prazo de entrega (dias)</Label>
            <input
              type="number"
              min="1"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Materiais pelo cliente (dias)</Label>
            <input
              type="number"
              min="1"
              value={materialsDays}
              onChange={(e) => setMaterialsDays(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Manutenção pós-entrega (dias)</Label>
            <input
              type="number"
              min="0"
              value={maintenanceDays}
              onChange={(e) => setMaintenanceDays(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Duração do contrato (meses)</Label>
            <input
              type="number"
              min="1"
              max="24"
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Valores e pagamento</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Valor total (R$) *</Label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="1.500,00"
              className={inputClass}
            />
          </div>

          {(paymentType === 'pix_entrada') && (
            <div className="space-y-1">
              <Label className="text-white/70 text-sm">Valor de entrada (R$)</Label>
              <input
                type="text"
                value={entryValue}
                onChange={(e) => setEntryValue(e.target.value)}
                placeholder="750,00"
                className={inputClass}
              />
            </div>
          )}
        </div>

        {/* Tipo de pagamento */}
        <div className="space-y-2">
          <Label className="text-white/70 text-sm">Forma de pagamento</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'pix_entrada',          label: 'PIX — Entrada + restante' },
              { id: 'pix_avista',           label: 'PIX — À vista' },
              { id: 'cartao_avista',        label: 'Cartão de crédito — À vista' },
              { id: 'parcelado_sem_juros',  label: 'Parcelado — Sem juros' },
              { id: 'parcelado_com_juros',  label: 'Parcelado — Com juros (pelo cliente)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPaymentType(opt.id)}
                className={`text-left px-3 py-2.5 rounded-md border text-sm transition-colors ${
                  paymentType === opt.id
                    ? 'border-brand bg-brand/10 text-white'
                    : 'border-white/[0.1] bg-[#252525] text-white/50 hover:text-white/80 hover:border-white/20'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Parcelas — só para parcelado */}
        {(paymentType === 'parcelado_sem_juros' || paymentType === 'parcelado_com_juros') && (
          <div className="space-y-1 max-w-[180px]">
            <Label className="text-white/70 text-sm">Número de parcelas</Label>
            <input
              type="number"
              min="2"
              max="24"
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              className={inputClass}
            />
          </div>
        )}

        <div className="space-y-1">
          <Label className="text-white/70 text-sm">Observações adicionais <span className="text-white/30">(opcional)</span></Label>
          <input
            type="text"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            placeholder="Ex: pagamento até o dia 10 de cada mês"
            className={inputClass}
          />
        </div>
      </div>

      {/* Serviços não incluídos */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Não incluído no contrato</h2>
        <p className="text-xs text-white/35">Marque os serviços que NÃO estão incluídos no escopo deste contrato.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXCLUDED_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                onClick={() => toggleExcluded(opt.id)}
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                  excludedServices.includes(opt.id)
                    ? 'bg-brand border-brand'
                    : 'border-white/20 bg-[#252525] group-hover:border-white/40'
                }`}
              >
                {excludedServices.includes(opt.id) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span
                onClick={() => toggleExcluded(opt.id)}
                className="text-sm text-white/60 group-hover:text-white/80 transition-colors select-none"
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Testemunhas */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Testemunhas <span className="normal-case text-white/25 font-normal">(opcional)</span></h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Testemunha 1</Label>
            <input
              type="text"
              value={witness1}
              onChange={(e) => setWitness1(e.target.value)}
              placeholder="Nome completo"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-white/70 text-sm">Testemunha 2</Label>
            <input
              type="text"
              value={witness2}
              onChange={(e) => setWitness2(e.target.value)}
              placeholder="Nome completo"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button onClick={handleGenerate} disabled={saving} className="bg-brand hover:bg-brand-dark text-white gap-2 px-6">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSignature className="h-4 w-4" />}
          Gerar contrato
        </Button>
      </div>
    </div>
  )
}
