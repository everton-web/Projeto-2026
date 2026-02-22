'use client'

import type { ReactNode } from 'react'
import { Contract, WdProfile } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

interface Props {
  contract: Contract
  wd: WdProfile
}

const EXCLUDED_LABELS: Record<string, string> = {
  fotografia: 'Fotografia',
  banco_imagens: 'Banco de imagens',
  conteudo: 'Produção de conteúdo / textos',
  hospedagem: 'Hospedagem',
  dominio: 'Domínio',
  logo: 'Criação de logotipo',
  seo: 'Otimização SEO avançada',
}

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function addDays(iso: string, days: number) {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return fmtDate(d.toISOString())
}

export function ContratoDocument({ contract, wd }: Props) {
  const startFmt = fmtDate(contract.start_date)
  const deliveryFmt = addDays(contract.start_date, contract.delivery_days)
  const excludedList = (contract.excluded_services ?? [])
    .map((id) => EXCLUDED_LABELS[id] ?? id)

  return (
    <div>
      {/* Print button */}
      <div className="flex justify-end mb-6 print:hidden">
        <Button
          onClick={() => window.print()}
          variant="ghost"
          className="text-white/50 hover:text-white border border-white/[0.1] hover:bg-white/[0.04] gap-2"
        >
          <Printer className="h-4 w-4" />
          Imprimir / Salvar PDF
        </Button>
      </div>

      {/* Document */}
      <div
        id="contrato-doc"
        className="bg-white text-[#111] rounded-xl max-w-3xl mx-auto print:rounded-none print:max-w-none"
        style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: '12px',
          lineHeight: '1.7',
          padding: '60px 56px',
          color: '#1a1a1a',
        }}
      >
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', marginBottom: '6px' }}>
            Contrato de Prestação de Serviços
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 4px' }}>
            CONTRATO
          </h1>
          <p style={{ fontSize: '11px', color: '#888' }}>
            {contract.service_type} · Emitido em {fmtDate(contract.created_at)}
          </p>
          <div style={{ borderTop: '2px dashed #ccc', marginTop: '20px' }} />
        </div>

        {/* ── PARTES ─────────────────────────────────────────────── */}
        <section style={{ marginBottom: '24px' }}>
          <ClauseTitle num="1º" title="DAS PARTES" />
          <p style={{ marginBottom: '10px' }}>
            <strong>CONTRATADO(A):</strong> {wd.name}
            {wd.cpf_cnpj ? `, portador(a) do CPF/CNPJ nº ${wd.cpf_cnpj}` : ''}
            {wd.address ? `, residente e domiciliado(a) em ${wd.address}` : ''}
            {wd.city ? `, ${wd.city}/${wd.state}` : ''}
            {wd.phone ? `, telefone: ${wd.phone}` : ''}
            {wd.email ? `, e-mail: ${wd.email}` : ''}.
          </p>
          <p>
            <strong>CONTRATANTE:</strong> {contract.client_name}
            {contract.client_cpf_cnpj ? `, portador(a) do CPF/CNPJ nº ${contract.client_cpf_cnpj}` : ''}
            {contract.client_address ? `, residente e domiciliado(a) em ${contract.client_address}` : ''}
            {contract.client_city ? `, ${contract.client_city}/${contract.client_state}` : ''}.
          </p>
        </section>

        <Divider />

        {/* ── OBJETO / PRESTAÇÃO DE SERVIÇOS ─────────────────────── */}
        <section style={{ marginBottom: '24px' }}>
          <ClauseTitle num="2º" title="DA PRESTAÇÃO DE SERVIÇOS" />
          <p style={{ marginBottom: '8px' }}>
            O(A) CONTRATADO(A) se compromete a prestar os serviços de{' '}
            <strong>{contract.service_type}</strong> conforme as especificações abaixo:
          </p>
          <div style={{ background: '#f8f8f8', borderLeft: '3px solid #ddd', padding: '10px 14px', margin: '8px 0', borderRadius: '2px' }}>
            <p style={{ margin: 0, fontStyle: 'italic', color: '#444' }}>{contract.service_description}</p>
          </div>
        </section>

        <Divider />

        {/* ── CONDIÇÕES ──────────────────────────────────────────── */}
        <section style={{ marginBottom: '24px' }}>
          <ClauseTitle num="3º" title="DAS CONDIÇÕES" />
          <BulletItem letter="a">
            O CONTRATANTE é responsável por fornecer todos os materiais necessários para a execução
            do projeto (textos, imagens, logotipo, etc.) em até{' '}
            <strong>{contract.materials_days} dias</strong> após a assinatura deste contrato.
          </BulletItem>
          <BulletItem letter="b">
            O não fornecimento dos materiais dentro do prazo estipulado poderá acarretar no
            adiamento da entrega do projeto, sem qualquer penalidade ao CONTRATADO(A).
          </BulletItem>
          <BulletItem letter="c">
            O CONTRATANTE terá direito a até <strong>2 (duas) rodadas de revisão</strong> do projeto,
            desde que as alterações solicitadas estejam dentro do escopo contratado.
          </BulletItem>
          <BulletItem letter="d">
            Qualquer alteração fora do escopo original deverá ser acordada entre as partes e poderá
            implicar em custos adicionais.
          </BulletItem>
          {excludedList.length > 0 && (
            <BulletItem letter="e">
              <strong>Não estão incluídos</strong> no escopo deste contrato: {excludedList.join(', ')}.
              Tais itens, caso necessários, deverão ser contratados separadamente.
            </BulletItem>
          )}
        </section>

        <Divider />

        {/* ── PRAZOS ─────────────────────────────────────────────── */}
        <section style={{ marginBottom: '24px' }}>
          <ClauseTitle num="4º" title="DOS PRAZOS" />
          <BulletItem letter="a">
            O projeto terá início em <strong>{startFmt}</strong> e a entrega está prevista para{' '}
            <strong>{deliveryFmt}</strong> ({contract.delivery_days} dias corridos), contados após
            o recebimento de todos os materiais pelo CONTRATANTE.
          </BulletItem>
          <BulletItem letter="b">
            Após a entrega do projeto, o CONTRATADO(A) disponibilizará suporte técnico e manutenção
            por um período de <strong>{contract.maintenance_days} dias</strong>, para correção de
            eventuais bugs ou ajustes necessários.
          </BulletItem>
          <BulletItem letter="c">
            O prazo de entrega poderá ser prorrogado em casos de atraso no fornecimento de materiais
            pelo CONTRATANTE, eventos de força maior ou alterações de escopo solicitadas.
          </BulletItem>
        </section>

        <Divider />

        {/* ── VALORES ────────────────────────────────────────────── */}
        <section style={{ marginBottom: '24px' }}>
          <ClauseTitle num="5º" title="DOS VALORES E FORMA DE PAGAMENTO" />
          <p style={{ marginBottom: '8px' }}>
            O valor total pelos serviços prestados é de{' '}
            <strong style={{ fontSize: '13px' }}>{fmt(contract.value)}</strong>
            {', '}
            <PaymentDescription contract={contract} />
            {contract.payment_terms ? (
              <> Observação: <em>{contract.payment_terms}</em>.</>
            ) : null}
          </p>
          <BulletItem letter="a">
            O não pagamento nas datas acordadas poderá acarretar na suspensão dos serviços e/ou
            cancelamento do projeto, sem devolução dos valores já pagos.
          </BulletItem>
          <BulletItem letter="b">
            Os arquivos finais e o acesso ao projeto serão entregues somente após a quitação integral
            do valor contratado.
          </BulletItem>
        </section>

        <Divider />

        {/* ── LGPD ───────────────────────────────────────────────── */}
        <section style={{ marginBottom: '24px' }}>
          <ClauseTitle num="6º" title="DA PROTEÇÃO DE DADOS (LGPD)" />
          <p>
            As informações compartilhadas pelas partes durante a execução deste contrato serão
            utilizadas exclusivamente para fins de prestação dos serviços aqui acordados, em
            conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Ambas as
            partes comprometem-se a não divulgar, compartilhar ou utilizar os dados da outra
            parte para quaisquer outras finalidades.
          </p>
        </section>

        <Divider />

        {/* ── DIREITOS AUTORAIS ──────────────────────────────────── */}
        <section style={{ marginBottom: '24px' }}>
          <ClauseTitle num="7º" title="DOS DIREITOS AUTORAIS E PROPRIEDADE INTELECTUAL" />
          <BulletItem letter="a">
            Após a quitação integral do valor contratado, todos os direitos patrimoniais sobre
            os materiais desenvolvidos serão transferidos ao CONTRATANTE.
          </BulletItem>
          <BulletItem letter="b">
            Até o pagamento completo, todos os direitos sobre o trabalho realizado permanecem
            com o(a) CONTRATADO(A).
          </BulletItem>
          <BulletItem letter="c">
            O(A) CONTRATADO(A) reserva-se o direito de utilizar o projeto em seu portfólio
            profissional, salvo solicitação em contrário pelo CONTRATANTE por escrito.
          </BulletItem>
        </section>

        <Divider />

        {/* ── CONFIDENCIALIDADE ──────────────────────────────────── */}
        <section style={{ marginBottom: '24px' }}>
          <ClauseTitle num="8º" title="DA CONFIDENCIALIDADE" />
          <p>
            Ambas as partes comprometem-se a manter em sigilo todas as informações confidenciais
            trocadas durante a vigência deste contrato, incluindo dados estratégicos, técnicos
            e comerciais, não podendo divulgá-las a terceiros sem o consentimento expresso da
            outra parte.
          </p>
        </section>

        <Divider />

        {/* ── RESCISÃO ───────────────────────────────────────────── */}
        <section style={{ marginBottom: '24px' }}>
          <ClauseTitle num="9º" title="DA RESCISÃO" />
          <BulletItem letter="a">
            Qualquer das partes poderá rescindir este contrato mediante comunicação por escrito
            com antecedência mínima de <strong>15 (quinze) dias</strong>.
          </BulletItem>
          <BulletItem letter="b">
            Em caso de rescisão por iniciativa do CONTRATANTE, serão devidos os valores
            proporcionais aos serviços já executados, sem devolução do sinal pago.
          </BulletItem>
          <BulletItem letter="c">
            Em caso de descumprimento de qualquer cláusula deste contrato por parte do
            CONTRATANTE, o(a) CONTRATADO(A) poderá rescindir imediatamente, retendo os
            valores já recebidos.
          </BulletItem>
        </section>

        <Divider />

        {/* ── DISPOSIÇÕES GERAIS ─────────────────────────────────── */}
        <section style={{ marginBottom: '32px' }}>
          <ClauseTitle num="10º" title="DAS DISPOSIÇÕES GERAIS" />
          <BulletItem letter="a">
            As partes elegem o foro da comarca de{' '}
            <strong>{wd.city || '_______________'}/{wd.state || '__'}</strong> para dirimir
            quaisquer controvérsias oriundas do presente instrumento.
          </BulletItem>
          <BulletItem letter="b">
            Este contrato é celebrado em caráter irrevogável e irretratável, obrigando as partes
            e seus sucessores.
          </BulletItem>
          <BulletItem letter="c">
            Qualquer alteração neste contrato só terá validade se feita por escrito e assinada
            por ambas as partes.
          </BulletItem>
        </section>

        {/* ── LOCAL E DATA ───────────────────────────────────────── */}
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#555', marginBottom: '40px' }}>
          {wd.city || '_____________'}, {fmtDate(contract.created_at)}
        </p>

        {/* ── ASSINATURAS ────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <SignatureBlock label="CONTRATANTE" name={contract.client_name} />
          <SignatureBlock label="CONTRATADO(A)" name={wd.name} />
        </div>

        {(contract.witness_1 || contract.witness_2) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '8px' }}>
            <SignatureBlock label="TESTEMUNHA 01" name={contract.witness_1 ?? ''} />
            <SignatureBlock label="TESTEMUNHA 02" name={contract.witness_2 ?? ''} />
          </div>
        )}

        {!contract.witness_1 && !contract.witness_2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '8px' }}>
            <SignatureBlock label="TESTEMUNHA 01" name="" />
            <SignatureBlock label="TESTEMUNHA 02" name="" />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────

function PaymentDescription({ contract }: { contract: Contract }) {
  const { payment_type, value, entry_value, installments } = contract
  const rest = value - (entry_value ?? 0)
  const parcelValue = installments > 1 ? value / installments : value

  switch (payment_type) {
    case 'pix_avista':
      return <>a ser pago via <strong>PIX, à vista</strong>, no ato da contratação.</>
    case 'cartao_avista':
      return <>a ser pago via <strong>cartão de crédito, à vista</strong>, no ato da contratação.</>
    case 'parcelado_sem_juros':
      return (
        <>
          a ser pago em <strong>{installments}x de {fmt(parcelValue)}</strong> via{' '}
          <strong>cartão de crédito, sem juros</strong>.
        </>
      )
    case 'parcelado_com_juros':
      return (
        <>
          a ser parcelado em <strong>{installments}x</strong> via{' '}
          <strong>cartão de crédito, com juros a cargo do CONTRATANTE</strong>.
        </>
      )
    case 'pix_entrada':
    default:
      return (
        <>
          sendo <strong>{fmt(entry_value > 0 ? entry_value : value / 2)}</strong> pagos via{' '}
          <strong>PIX como entrada</strong> no ato da assinatura deste contrato
          {entry_value > 0 && rest > 0 ? (
            <> e <strong>{fmt(rest)}</strong> via PIX na entrega do projeto final</>
          ) : null}
          .
        </>
      )
  }
}

function ClauseTitle({ num, title }: { num: string; title: string }) {
  return (
    <h2 style={{
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: '#333',
      marginBottom: '10px',
      paddingBottom: '6px',
      borderBottom: '1px solid #e0e0e0',
    }}>
      {num} — {title}
    </h2>
  )
}

function BulletItem({ letter, children }: { letter: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
      <span style={{ fontWeight: 700, minWidth: '16px', color: '#555' }}>{letter})</span>
      <span>{children}</span>
    </div>
  )
}

function Divider() {
  return <div style={{ borderTop: '1px dashed #ddd', margin: '20px 0' }} />
}

function SignatureBlock({ label, name }: { label: string; name: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ borderTop: '1px solid #555', paddingTop: '10px', marginTop: '48px' }}>
        <p style={{ fontWeight: 600, margin: '0 0 2px', fontSize: '12px' }}>
          {name || '________________________________'}
        </p>
        <p style={{ fontSize: '10px', color: '#777', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>
          {label}
        </p>
      </div>
    </div>
  )
}
