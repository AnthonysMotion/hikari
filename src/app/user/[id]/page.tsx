import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserStats } from "@/components/user-stats"
import { GenreChart } from "@/components/genre-chart"
import { FavoriteAnimeList } from "@/components/favorite-anime-list"
import { FavoriteMangaList } from "@/components/favorite-manga-list"
import { Edit, Settings } from "lucide-react"

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
    },
  })

  if (!user) {
    notFound()
  }

  const isOwnProfile = currentUserId === user.id

  return (
    <main className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-muted">
        {user.bannerImage ? (
          <img
            src={user.bannerImage}
            alt={`${user.name || user.username || 'User'}'s banner`}
            className="object-cover w-full h-full"
            style={{ objectPosition: 'center center' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20" />
        )}
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-24 mb-8">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background">
            <AvatarImage src={user.image || ""} alt={user.name || user.username || ""} />
            <AvatarFallback className="text-2xl md:text-4xl">
              {(user.name || user.username || user.email || "U")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold">
                {user.name || user.username || "User"}
              </h1>
              {isOwnProfile && (
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
            {user.username && (
              <p className="text-muted-foreground">@{user.username}</p>
            )}
            {user.bio && (
              <p className="text-lg text-muted-foreground max-w-2xl">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Statistics */}
        <UserStats
          animeList={user.animeList}
          mangaList={user.mangaList}
        />

        {/* Genre Chart */}
        <div className="my-8">
          <GenreChart
            animeList={user.animeList}
            mangaList={user.mangaList}
          />
        </div>

        {/* Favorites */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Favorite Anime</h2>
            {user.favoriteAnime.length > 0 ? (
              <FavoriteAnimeList favorites={user.favoriteAnime.map(f => f.anime)} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No favorite anime yet
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Favorite Manga</h2>
            {user.favoriteManga.length > 0 ? (
              <FavoriteMangaList favorites={user.favoriteManga.map(f => f.manga)} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No favorite manga yet
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

