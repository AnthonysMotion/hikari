import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimeListStatusSelector } from "@/components/anime-list-status-selector"
import { EpisodeCounter } from "@/components/episode-counter"

function getUserId(session: any): string | null {
  return (session?.user as any)?.id || session?.user?.id || null
}

export default async function AnimeListPage() {
  const session = await auth()
  const userId = getUserId(session)

  if (!userId) {
    redirect("/login")
  }

  // Get all anime lists for the user, grouped by status
  const animeList = await prisma.userAnimeList.findMany({
    where: { userId },
    include: {
      anime: {
        include: {
          genres: true,
        },
      },
    },
    orderBy: [
      { status: "asc" },
      { updatedAt: "desc" },
    ],
  })

  const groupedByStatus = {
    WATCHING: animeList.filter(a => a.status === "WATCHING"),
    COMPLETED: animeList.filter(a => a.status === "COMPLETED"),
    PLANNING: animeList.filter(a => a.status === "PLANNING"),
    PAUSED: animeList.filter(a => a.status === "PAUSED"),
    DROPPED: animeList.filter(a => a.status === "DROPPED"),
  }

  const statusLabels = {
    WATCHING: "Watching",
    COMPLETED: "Completed",
    PLANNING: "Planning",
    PAUSED: "Paused",
    DROPPED: "Dropped",
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Anime List</h1>
          <p className="text-muted-foreground">
            {animeList.length} {animeList.length === 1 ? "anime" : "anime"} in your list
          </p>
        </div>

        {animeList.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">Your anime list is empty.</p>
              <Link href="/#anime" className="text-primary hover:underline">
                Browse anime →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedByStatus).map(([status, items]) => {
              if (items.length === 0) return null

              return (
                <div key={status}>
                  <h2 className="text-2xl font-semibold mb-4">
                    {statusLabels[status as keyof typeof statusLabels]} ({items.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((listEntry) => (
                      <Card key={listEntry.id} className="overflow-hidden">
                        <Link href={`/anime/${listEntry.anime.id}`}>
                          <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                            {listEntry.anime.coverImage ? (
                              <img
                                src={listEntry.anime.coverImage}
                                alt={listEntry.anime.title}
                                className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                No Image
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary">{statusLabels[status as keyof typeof statusLabels]}</Badge>
                            </div>
                          </div>
                        </Link>
                        <CardContent className="p-4">
                          <Link href={`/anime/${listEntry.anime.id}`}>
                            <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                              {listEntry.anime.title}
                            </h3>
                          </Link>

                          {/* Progress Info */}
                          {listEntry.currentEpisode && (
                            <p className="text-sm text-muted-foreground mb-2">
                              Episode {listEntry.currentEpisode}
                              {listEntry.anime.episodes && ` / ${listEntry.anime.episodes}`}
                            </p>
                          )}

                          {/* Genres */}
                          {listEntry.anime.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {listEntry.anime.genres.slice(0, 3).map((genre) => (
                                <Badge key={genre.id} variant="outline" className="text-xs">
                                  {genre.name}
                                </Badge>
                              ))}
                              {listEntry.anime.genres.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{listEntry.anime.genres.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Quick Status Change */}
                          <div className="mt-3 pt-3 border-t">
                            <AnimeListStatusSelector
                              animeId={listEntry.anime.id}
                              currentStatus={listEntry.status as any}
                            />
                          </div>

                          {/* Episode Counter for Watching/Paused/Dropped */}
                          {["WATCHING", "PAUSED", "DROPPED"].includes(listEntry.status) && (
                            <div className="mt-3">
                              <EpisodeCounter
                                animeId={listEntry.anime.id}
                                currentEpisode={listEntry.currentEpisode}
                                maxEpisodes={listEntry.anime.episodes}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

