import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MangaListStatusSelector } from "@/components/manga-list-status-selector"
import { ChapterCounter } from "@/components/chapter-counter"

function getUserId(session: any): string | null {
  return (session?.user as any)?.id || session?.user?.id || null
}

export default async function MangaListPage() {
  const session = await auth()
  const userId = getUserId(session)

  if (!userId) {
    redirect("/login")
  }

  // Get all manga lists for the user, grouped by status
  const mangaList = await prisma.userMangaList.findMany({
    where: { userId },
    include: {
      manga: {
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
    READING: mangaList.filter(m => m.status === "READING"),
    COMPLETED: mangaList.filter(m => m.status === "COMPLETED"),
    PLANNING: mangaList.filter(m => m.status === "PLANNING"),
    PAUSED: mangaList.filter(m => m.status === "PAUSED"),
    DROPPED: mangaList.filter(m => m.status === "DROPPED"),
  }

  const statusLabels = {
    READING: "Reading",
    COMPLETED: "Completed",
    PLANNING: "Planning",
    PAUSED: "Paused",
    DROPPED: "Dropped",
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Manga List</h1>
          <p className="text-muted-foreground">
            {mangaList.length} {mangaList.length === 1 ? "manga" : "manga"} in your list
          </p>
        </div>

        {mangaList.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">Your manga list is empty.</p>
              <Link href="/#manga" className="text-primary hover:underline">
                Browse manga →
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
                        <Link href={`/manga/${listEntry.manga.id}`}>
                          <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                            {listEntry.manga.coverImage ? (
                              <img
                                src={listEntry.manga.coverImage}
                                alt={listEntry.manga.title}
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
                          <Link href={`/manga/${listEntry.manga.id}`}>
                            <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                              {listEntry.manga.title}
                            </h3>
                          </Link>

                          {/* Progress Info */}
                          {listEntry.currentChapter && (
                            <p className="text-sm text-muted-foreground mb-2">
                              Chapter {listEntry.currentChapter}
                              {listEntry.manga.chapters && ` / ${listEntry.manga.chapters}`}
                            </p>
                          )}

                          {/* Genres */}
                          {listEntry.manga.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {listEntry.manga.genres.slice(0, 3).map((genre) => (
                                <Badge key={genre.id} variant="outline" className="text-xs">
                                  {genre.name}
                                </Badge>
                              ))}
                              {listEntry.manga.genres.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{listEntry.manga.genres.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Quick Status Change */}
                          <div className="mt-3 pt-3 border-t">
                            <MangaListStatusSelector
                              mangaId={listEntry.manga.id}
                              currentStatus={listEntry.status as any}
                            />
                          </div>

                          {/* Chapter Counter for Reading/Paused/Dropped */}
                          {["READING", "PAUSED", "DROPPED"].includes(listEntry.status) && (
                            <div className="mt-3">
                              <ChapterCounter
                                mangaId={listEntry.manga.id}
                                currentChapter={listEntry.currentChapter}
                                maxChapters={listEntry.manga.chapters}
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

