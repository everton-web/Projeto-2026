import { SidebarNav } from '@/components/layout/sidebar-nav'
import { Topbar } from '@/components/layout/topbar'
import { DEMO_MODE, demoProfile } from '@/lib/demo-data'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let role: string = 'subscriber'
  let plan: string = 'free'

  if (DEMO_MODE) {
    role = demoProfile.role
    plan = demoProfile.plan
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, plan')
        .eq('id', user.id)
        .single()
      if (profile?.role) role = profile.role
      if (profile?.plan) plan = profile.plan
    }
  }

  return (
    <div className="flex h-screen bg-[#040404] overflow-hidden">
      <SidebarNav role={role} plan={plan} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
