import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Tv, 
  Star,
  ArrowRight,
  ListChecks
} from "lucide-react"

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
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.watching + stats.reading}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoriteAnime.length + favoriteManga.length}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-white/10 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tv className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/anime-list">
              <Button variant="ghost" className="w-full justify-start">
                <ListChecks className="w-4 h-4 mr-2" />
                My Anime List
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
            <Link href="/manga-list">
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                My Manga List
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
            <Link href={`/user/${userId}`}>
              <Button variant="ghost" className="w-full justify-start">
                <Star className="w-4 h-4 mr-2" />
                My Profile
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        {reviews.length > 0 && (
          <Card className="border-white/10 bg-card/50">
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviews.slice(0, 3).map((review) => {
                const item = review.anime || review.manga
                if (!item) return null
                
                return (
                  <Link
                    key={review.id}
                    href={review.anime ? `/anime/${item.id}` : `/manga/${item.id}`}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors"
                  >
                    {item.coverImage && (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

