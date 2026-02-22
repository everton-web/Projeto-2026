'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stayConnected, setStayConnected] = useState(true)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.set('stayConnected', stayConnected ? 'true' : 'false')
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card className="border-white/[0.08] bg-[#1a1a1a]/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white">Entrar</CardTitle>
        <CardDescription className="text-white/55">
          Acesse sua conta para continuar
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white/70">Senha</Label>
              <Link
                href="/esqueci-senha"
                className="text-xs text-brand-light hover:text-brand-light transition-colors"
              >
                Esqueci a senha
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-[#252525] border-white/[0.1] text-white placeholder:text-white/35"
            />
          </div>

          {/* Stay connected */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={stayConnected}
              onClick={() => setStayConnected((v) => !v)}
              className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                stayConnected
                  ? 'bg-brand border-brand'
                  : 'bg-transparent border-white/25 hover:border-white/50'
              }`}
            >
              {stayConnected && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <label
              onClick={() => setStayConnected((v) => !v)}
              className="text-sm text-white/55 cursor-pointer select-none"
            >
              Deixar conectado
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button
            type="submit"
            className="w-full bg-brand hover:bg-brand text-white"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Entrar'}
          </Button>
          <p className="text-sm text-white/55 text-center">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-brand-light hover:text-brand-light transition-colors">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
