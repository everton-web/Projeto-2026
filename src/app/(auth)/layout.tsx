export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">WebDesign Hub</h1>
          <p className="text-white/55 mt-2">Ferramentas para webdesigners profissionais</p>
        </div>
        {children}
      </div>
    </div>
  )
}
