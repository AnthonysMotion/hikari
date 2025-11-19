import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/settings-form"

function getUserId(session: any): string | null {
  return (session?.user as any)?.id || session?.user?.id || null
}

export default async function SettingsPage() {
  const session = await auth()
  const userId = getUserId(session)

  if (!userId) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      accentColor: true,
    },
  })

  if (!user) {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your website experience</p>
        </div>
        <SettingsForm user={user} />
      </div>
    </main>
  )
}

