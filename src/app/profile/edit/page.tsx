import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ProfileEditForm } from "@/components/profile-edit-form"

function getUserId(session: any): string | null {
  return (session?.user as any)?.id || session?.user?.id || null
}

export default async function ProfileEditPage() {
  const session = await auth()
  const userId = getUserId(session)

  if (!userId) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 md:px-6 py-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        <ProfileEditForm user={user} />
      </div>
    </main>
  )
}

