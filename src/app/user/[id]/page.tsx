import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserStats } from "@/components/user-stats"
import { GenreChart } from "@/components/genre-chart"
import { FavoriteAnimeList } from "@/components/favorite-anime-list"
import { FavoriteMangaList } from "@/components/favorite-manga-list"
import { LevelProgress, AchievementsList, BadgesList } from "@/components/gamification"
import { UserActivityFeed } from "@/components/user-activity-feed"
import { Edit, Settings, Calendar, Mail } from "lucide-react"

function getUserId(session: any): string | null {
  return (session?.user as any)?.id || session?.user?.id || null
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const currentUserId = getUserId(session)

  // Try to find user by ID first, then by username
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: id },
        { username: id },
      ],
    },
      include: {
      reviews: true,
      animeList: {
        include: {
          anime: {
            include: {
              genres: true,
            },
          },
        },
      },
      mangaList: {
        include: {
          manga: {
            include: {
              genres: true,
            },
          },
        },
      },
      favoriteAnime: {
        include: {
          anime: {
            include: {
              genres: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      favoriteManga: {
        include: {
          manga: {
            include: {
              genres: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      achievements: {
        include: {
          achievement: true,
        },
        orderBy: {
          unlockedAt: 'desc',
        },
      },
      badges: {
        include: {
          badge: true,
        },
        orderBy: {
          earnedAt: 'desc',
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  const isOwnProfile = currentUserId === user.id

  return (
    <main className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20">
        {user.bannerImage ? (
          <img
            src={user.bannerImage}
            alt={`${user.name || user.username || 'User'}'s banner`}
            className="object-cover w-full h-full"
            style={{ objectPosition: 'center center' }}
          />
        ) : (
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, var(--accent-color, #a855f7) 30%, transparent), color-mix(in srgb, var(--accent-color, #ec4899) 30%, transparent))`
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-32 md:-mt-24 mb-12 relative z-10">
          <div className="relative">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 border-4 border-background shadow-xl ring-4 ring-background/50">
              <AvatarImage src={user.image || ""} alt={user.name || user.username || ""} />
              <AvatarFallback 
                className="text-2xl md:text-4xl lg:text-5xl text-white"
                style={{
                  background: `linear-gradient(135deg, var(--accent-color, #a855f7), var(--accent-color, #ec4899))`
                }}
              >
                {(user.name || user.username || user.email || "U")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <div className="absolute -bottom-2 -right-2">
                <Link href="/profile/edit">
                  <Button variant="outline" size="icon" className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-2">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                {user.name || user.username || "User"}
              </h1>
              {isOwnProfile && (
                <div className="flex gap-2">
                  <Link href="/profile/edit">
                    <Button variant="outline" size="sm" className="shrink-0">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" size="sm" className="shrink-0">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {user.username && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">@</span>
                  <span>{user.username}</span>
                </div>
              )}
              {user.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            
            {user.bio && (
              <div className="max-w-3xl">
                <p className="text-base md:text-lg text-foreground leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mb-12">
          <UserActivityFeed userId={user.id} />
        </div>

        {/* Level & XP */}
        <div className="mb-12">
          <LevelProgress level={user.level} xp={user.xp} />
        </div>

        {/* Statistics */}
        <div className="mb-12">
          <UserStats
            animeList={user.animeList}
            mangaList={user.mangaList}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Genre Chart */}
          <div className="lg:col-span-2">
            <Card className="h-full border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Top Genres</CardTitle>
              </CardHeader>
              <CardContent>
                <GenreChart
                  animeList={user.animeList}
                  mangaList={user.mangaList}
                />
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Card */}
          <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground">Anime Total</span>
                  <span className="font-bold text-lg">{user.animeList.length}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground">Manga Total</span>
                  <span className="font-bold text-lg">{user.mangaList.length}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground">Favorites</span>
                  <span className="font-bold text-lg">{user.favoriteAnime.length + user.favoriteManga.length}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground">Reviews</span>
                  <span className="font-bold text-lg">{user.reviews?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Achievements</h2>
          <AchievementsList achievements={user.achievements.map((ua) => ({
            id: ua.id,
            unlockedAt: ua.unlockedAt,
            achievement: {
              id: ua.achievement.id,
              name: ua.achievement.name,
              description: ua.achievement.description,
              icon: ua.achievement.icon,
              rarity: ua.achievement.rarity,
              category: ua.achievement.category,
              xpReward: ua.achievement.xpReward,
            },
          }))} />
        </div>

        {/* Badges */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Badges</h2>
          <BadgesList badges={user.badges.map((ub) => ({
            id: ub.id,
            earnedAt: ub.earnedAt,
            badge: {
              id: ub.badge.id,
              name: ub.badge.name,
              description: ub.badge.description,
              icon: ub.badge.icon,
              rarity: ub.badge.rarity,
              category: ub.badge.category,
            },
          }))} />
        </div>

        {/* Favorites */}
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Favorite Anime</h2>
            {user.favoriteAnime.length > 0 ? (
              <FavoriteAnimeList favorites={user.favoriteAnime.map(f => f.anime)} />
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <p className="text-lg">No favorite anime yet</p>
                  <p className="text-sm mt-2">Start adding favorites to see them here!</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Favorite Manga</h2>
            {user.favoriteManga.length > 0 ? (
              <FavoriteMangaList favorites={user.favoriteManga.map(f => f.manga)} />
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <p className="text-lg">No favorite manga yet</p>
                  <p className="text-sm mt-2">Start adding favorites to see them here!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

