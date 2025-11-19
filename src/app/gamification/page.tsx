import { auth } from "@/auth"
import { ChallengesList } from "@/components/challenges"
import { BingoCardsList } from "@/components/bingo"
import { getActiveChallenges, getActiveBingoCards } from "@/actions/challenges"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"

function getUserId(session: any): string | null {
  return (session?.user as any)?.id || session?.user?.id || null
}

export default async function GamificationPage() {
  const session = await auth()
  const userId = getUserId(session)

  if (!userId) {
    redirect("/login")
  }

  const [challenges, bingoCards] = await Promise.all([
    getActiveChallenges(),
    getActiveBingoCards(),
  ])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Challenges & Bingo</h1>
          <p className="text-muted-foreground">Complete challenges and bingo cards to earn XP and achievements!</p>
        </div>

        <div className="space-y-12">
          {/* Daily & Weekly Challenges */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Active Challenges</h2>
            <ChallengesList challenges={challenges as any} />
          </section>

          {/* Seasonal Bingo Cards */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Seasonal Bingo Cards</h2>
            <BingoCardsList bingoCards={bingoCards as any} />
          </section>
        </div>
      </div>
    </main>
  )
}

