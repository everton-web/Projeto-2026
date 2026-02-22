'use client'

import { useState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail } from 'lucide-react'

export default function EsqueciSenhaPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await forgotPassword(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <Card className="border-white/[0.08] bg-[#1a1a1a]/50 backdrop-blur">
        <CardContent className="pt-8 pb-6 text-center space-y-4">
          <Mail className="h-12 w-12 text-brand-light mx-auto" />
          <h2 className="text-xl font-semibold text-white">E-mail enviado!</h2>
          <p className="text-white/55 text-sm">{success}</p>
          <Link href="/login">
            <Button variant="outline" className="border-white/[0.1] text-white/70 hover:bg-[#252525] w-full mt-2">
              Voltar para o login
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/[0.08] bg-[#1a1a1a]/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white">Recuperar senha</CardTitle>
        <CardDescription className="text-white/55">
          Enviaremos um link de recuperação para seu e-mail
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              className="bg-[#252525] border-white/[0.1] text-white placeholder:text-white/35"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-brand hover:bg-brand text-white"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar link'}
          </Button>
          <Link href="/login" className="text-sm text-white/55 hover:text-white/70 transition-colors text-center">
            ← Voltar para o login
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
