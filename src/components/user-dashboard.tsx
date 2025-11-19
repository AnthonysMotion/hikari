import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
        <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.watching + stats.reading}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Star className="w-4 h-4 text-primary" />
              </div>
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{favoriteAnime.length + favoriteManga.length}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.reviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Tv className="w-4 h-4 text-primary" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/anime-list">
              <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 group">
                <ListChecks className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                My Anime List
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/manga-list">
              <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 group">
                <BookOpen className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                My Manga List
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href={`/user/${userId}`}>
              <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 group">
                <Star className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                My Profile
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        {reviews.length > 0 && (
          <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
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
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 group"
                  >
                    {item.coverImage && (
                      <div className="relative w-12 h-16 rounded overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate group-hover:text-primary transition-colors">{item.title}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
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

