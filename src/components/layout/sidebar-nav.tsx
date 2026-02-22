'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Library,
  Settings,
  LogOut,
  Wand2,
  ShieldCheck,
  FileSignature,
  Lock,
} from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'BC Studio',
    href: '/dashboard/bc-studio',
    icon: Wand2,
    badge: 'Novo',
  },
  {
    label: 'Clientes',
    href: '/dashboard/clientes',
    icon: Users,
  },
  {
    label: 'Biblioteca',
    href: '/dashboard/biblioteca',
    icon: Library,
  },
]

const adminItems = [
  {
    label: 'Gerenciar Biblioteca',
    href: '/dashboard/admin/biblioteca',
    icon: Library,
  },
]

const bottomItems = [
  {
    label: 'Configurações',
    href: '/dashboard/configuracoes',
    icon: Settings,
  },
]

interface Props {
  role: string
  plan: string
}

export function SidebarNav({ role, plan }: Props) {
  const pathname = usePathname()
  const isAdmin = role === 'admin'
  const isPro = plan === 'pro'

  return (
    <aside className="flex flex-col h-full w-64 bg-[#0a0a0a] border-r border-white/[0.06]">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-black">BC</span>
          </div>
          <div>
            <span className="text-white font-bold text-sm leading-none block">BC Studio</span>
            <span className="text-white/30 text-[10px] font-medium tracking-wider uppercase">WebDesign Hub</span>
          </div>
        </Link>
      </div>

      {/* Nav principal */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-brand/[0.12] text-white'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
              )}
            >
              {isActive && (
                <span className="absolute left-3 w-0.5 h-4 bg-brand rounded-full" />
              )}
              <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-brand' : 'text-current')} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge className="bg-brand/20 text-brand border-0 text-[10px] px-1.5 py-0 font-semibold">{item.badge}</Badge>
              )}
            </Link>
          )
        })}

        {/* Contrato Rápido — só Pro */}
        {isPro ? (
          (() => {
            const isActive = pathname === '/dashboard/contrato' || pathname.startsWith('/dashboard/contrato/')
            return (
              <Link
                href="/dashboard/contrato"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand/[0.12] text-white'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                )}
              >
                {isActive && (
                  <span className="absolute left-3 w-0.5 h-4 bg-brand rounded-full" />
                )}
                <FileSignature className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-brand' : 'text-current')} />
                <span className="flex-1">Contrato Rápido</span>
                <Badge className="bg-brand/20 text-brand border-0 text-[10px] px-1.5 py-0 font-semibold">Pro</Badge>
              </Link>
            )
          })()
        ) : (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/20 cursor-not-allowed select-none">
            <FileSignature className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">Contrato Rápido</span>
            <Lock className="h-3 w-3 text-white/20" />
          </div>
        )}

        {/* Seção Admin */}
        {isAdmin && (
          <div className="pt-4">
            <div className="flex items-center gap-2 px-3 pb-2">
              <ShieldCheck className="h-3 w-3 text-white/20" />
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-widest">Admin</span>
            </div>
            {adminItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-brand/[0.12] text-white'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                  )}
                >
                  {isActive && (
                    <span className="absolute left-3 w-0.5 h-4 bg-brand rounded-full" />
                  )}
                  <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-brand' : 'text-current')} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-0.5">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-brand/[0.12] text-white'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 px-3 text-white/40 hover:text-red-400 hover:bg-red-500/[0.08]"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </form>
      </div>
    </aside>
  )
}
