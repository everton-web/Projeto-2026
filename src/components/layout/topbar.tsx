import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DEMO_MODE, demoProfile } from '@/lib/demo-data'

export async function Topbar() {
  const planLabels: Record<string, string> = {
    free: 'Gratuito',
    basic: 'Basic',
    pro: 'Pro',
  }

  let fullName = 'Designer'
  let plan = 'free'

  if (DEMO_MODE) {
    fullName = demoProfile.full_name
    plan = demoProfile.plan
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, plan')
      .eq('id', user?.id ?? '')
      .single()

    fullName = profile?.full_name ?? user?.email ?? 'Designer'
    plan = profile?.plan ?? 'free'
  }

  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="h-14 bg-[#0a0a0a] border-b border-white/[0.06] flex items-center justify-between px-6 flex-shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white/55 hover:text-white/80 relative">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white/80">{fullName}</p>
            <Badge
              className="text-[10px] px-1.5 py-0"
              variant={plan === 'pro' ? 'default' : 'secondary'}
            >
              {planLabels[plan] ?? 'Gratuito'}
            </Badge>
          </div>
          <Avatar className="h-9 w-9 border-2 border-brand/30">
            <AvatarFallback className="bg-brand/20 text-brand-light text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
