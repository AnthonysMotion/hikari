import { prisma } from "@/lib/prisma"
import { DashboardStats } from "@/components/dashboard-stats"
import { QuickActions, RecentReviews } from "@/components/dashboard-content"

interface UserDashboardProps {
  userId: string
}

export async function UserDashboard({ userId }: UserDashboardProps) {
  // Get user stats
  const [animeList, mangaList, reviews, favoriteAnime, favoriteManga] = await Promise.all([
    prisma.userAnimeList.findMany({
      where: { userId },
      select: { status: true },
    }),
    prisma.userMangaList.findMany({
      where: { userId },
      select: { status: true },
    }),
    prisma.review.findMany({
      where: { userId },
      take: 5,
      include: {
        anime: { select: { id: true, title: true, coverImage: true } },
        manga: { select: { id: true, title: true, coverImage: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.userFavoriteAnime.findMany({
      where: { userId },
      take: 4,
      include: {
        anime: { select: { id: true, title: true, coverImage: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.userFavoriteManga.findMany({
      where: { userId },
      take: 4,
      include: {
        manga: { select: { id: true, title: true, coverImage: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const stats = {
    watching: animeList.filter(a => a.status === "WATCHING").length,
    reading: mangaList.filter(m => m.status === "READING").length,
    completed: animeList.filter(a => a.status === "COMPLETED").length + 
               mangaList.filter(m => m.status === "COMPLETED").length,
    reviews: reviews.length,
    favorites: favoriteAnime.length + favoriteManga.length,
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <DashboardStats stats={stats} />

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <QuickActions userId={userId} />
        <RecentReviews reviews={reviews} />
      </div>
    </div>
  )
}
