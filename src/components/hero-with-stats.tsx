import { prisma } from "@/lib/prisma"
import { Hero } from "@/components/hero"

// Helper to format large numbers (e.g. 1200 -> 1.2K)
function formatCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M+"
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K+"
  }
  return count.toString()
}

export async function HeroWithStats() {
  // Fetch stats in parallel
  const [userCount, animeCount, reviewCount, mangaCount] = await Promise.all([
    prisma.user.count(),
    prisma.anime.count(),
    prisma.review.count(),
    prisma.manga.count(),
  ])
  
  const stats = [
    { label: "Active Users", value: formatCount(userCount) },
    { label: "Anime Tracked", value: formatCount(animeCount) },
    { label: "Reviews", value: formatCount(reviewCount) },
    { label: "Manga Tracked", value: formatCount(mangaCount) },
  ]

  return <Hero stats={stats} />
}

