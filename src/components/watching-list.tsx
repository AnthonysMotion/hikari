"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { incrementAnimeEpisode, incrementMangaChapter } from "@/actions/list"
import { Plus, Loader2 } from "lucide-react"
import Link from "next/link"

interface WatchingAnime {
  id: number
  title: string
  coverImage: string | null
  episodes: number | null
  currentEpisode: number | null
}

interface ReadingManga {
  id: number
  title: string
  coverImage: string | null
  chapters: number | null
  currentChapter: number | null
}

interface WatchingListProps {
  watchingAnime: WatchingAnime[]
  readingManga: ReadingManga[]
}

export function WatchingList({ watchingAnime, readingManga }: WatchingListProps) {
  const [isPending, startTransition] = useTransition()

  const handleAnimeIncrement = (animeId: number) => {
    startTransition(async () => {
      try {
        await incrementAnimeEpisode(animeId)
      } catch (error) {
        console.error("Failed to increment episode:", error)
      }
    })
  }

  const handleMangaIncrement = (mangaId: number) => {
    startTransition(async () => {
      try {
        await incrementMangaChapter(mangaId)
      } catch (error) {
        console.error("Failed to increment chapter:", error)
      }
    })
  }

  if (watchingAnime.length === 0 && readingManga.length === 0) {
    return null
  }

  return (
    <div className="space-y-12">
      {watchingAnime.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-6 text-muted-foreground">Currently Watching</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {watchingAnime.map((anime) => (
              <div key={anime.id} className="group relative">
                <Link href={`/anime/${anime.id}`}>
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted mb-3">
                    {anime.coverImage ? (
                      <img
                        src={anime.coverImage}
                        alt={anime.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                    {/* Progress Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                      <div className="text-xs font-medium text-white mb-1">
                        Ep {anime.currentEpisode || 0} / {anime.episodes || "?"}
                      </div>
                      <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, ((anime.currentEpisode || 0) / (anime.episodes || 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
                
                <div className="flex justify-between items-start gap-2">
                  <Link href={`/anime/${anime.id}`} className="flex-1">
                    <h4 className="font-medium leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {anime.title}
                    </h4>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 -mt-1 hover:bg-primary hover:text-primary-foreground rounded-full"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAnimeIncrement(anime.id)
                    }}
                    disabled={isPending || (anime.episodes !== null && (anime.currentEpisode || 0) >= anime.episodes)}
                  >
                    {isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {readingManga.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-6 text-muted-foreground">Currently Reading</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {readingManga.map((manga) => (
              <div key={manga.id} className="group relative">
                <Link href={`/manga/${manga.id}`}>
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted mb-3">
                    {manga.coverImage ? (
                      <img
                        src={manga.coverImage}
                        alt={manga.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                    {/* Progress Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                      <div className="text-xs font-medium text-white mb-1">
                        Ch {manga.currentChapter || 0} / {manga.chapters || "?"}
                      </div>
                      <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, ((manga.currentChapter || 0) / (manga.chapters || 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
                
                <div className="flex justify-between items-start gap-2">
                  <Link href={`/manga/${manga.id}`} className="flex-1">
                    <h4 className="font-medium leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {manga.title}
                    </h4>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 -mt-1 hover:bg-primary hover:text-primary-foreground rounded-full"
                    onClick={(e) => {
                      e.preventDefault()
                      handleMangaIncrement(manga.id)
                    }}
                    disabled={isPending || (manga.chapters !== null && (manga.currentChapter || 0) >= manga.chapters)}
                  >
                    {isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
