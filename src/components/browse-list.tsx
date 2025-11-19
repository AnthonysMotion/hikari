"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AnimeItem {
  id: number
  title: string
  coverImage: string | null
  genres: Array<{ id: number; name: string }>
  status: string
  format: string | null
  seasonYear: number | null
  episodes: number | null
  averageScore: number | null
  popularity: number | null
}

interface MangaItem {
  id: number
  title: string
  coverImage: string | null
  genres: Array<{ id: number; name: string }>
  status: string
  format: string | null
  startDate: string | null
  chapters: number | null
  averageScore: number | null
  popularity: number | null
}

interface BrowseListProps {
  type: "anime" | "manga"
  items: AnimeItem[] | MangaItem[]
}

export function BrowseList({ type, items }: BrowseListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No {type} found matching your filters.</p>
        <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => {
        const href = type === "anime" ? `/anime/${item.id}` : `/manga/${item.id}`
        const year =
          type === "anime"
            ? (item as AnimeItem).seasonYear
            : (item as MangaItem).startDate
            ? parseInt((item as MangaItem).startDate!.split("-")[0])
            : null
        const count =
          type === "anime"
            ? (item as AnimeItem).episodes
            : (item as MangaItem).chapters

        return (
          <Link href={href} key={item.id} className="group">
            <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-white/10 dark:border-white/5">
              <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm bg-gradient-to-br from-muted to-muted/50">
                    No Image
                  </div>
                )}
                {item.averageScore && (
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-black/80 text-white backdrop-blur-sm font-semibold shadow-lg"
                    >
                      ⭐ {item.averageScore}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                  {item.title}
                </h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.genres.slice(0, 2).map((genre) => (
                    <Badge
                      key={genre.id}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0.5 border-primary/20 hover:border-primary/40 transition-colors"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {year && <span>{year}</span>}
                  {year && count && <span>•</span>}
                  {count && (
                    <span>
                      {count} {type === "anime" ? "eps" : "ch"}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

