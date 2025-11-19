"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GenreChartProps {
  animeList: Array<{
    anime: {
      genres: Array<{ name: string }>
    }
  }>
  mangaList: Array<{
    manga: {
      genres: Array<{ name: string }>
    }
  }>
}

export function GenreChart({ animeList, mangaList }: GenreChartProps) {
  const genreCounts: Record<string, number> = {}

  // Count genres from anime
  animeList.forEach(({ anime }) => {
    anime.genres.forEach((genre) => {
      genreCounts[genre.name] = (genreCounts[genre.name] || 0) + 1
    })
  })

  // Count genres from manga
  mangaList.forEach(({ manga }) => {
    manga.genres.forEach((genre) => {
      genreCounts[genre.name] = (genreCounts[genre.name] || 0) + 1
    })
  })

  // Sort by count and take top 10
  const topGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  const maxCount = topGenres[0]?.[1] || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Genres</CardTitle>
      </CardHeader>
      <CardContent>
        {topGenres.length > 0 ? (
          <div className="space-y-4">
            {topGenres.map(([genre, count]) => (
              <div key={genre} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{genre}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">No genre data available</p>
        )}
      </CardContent>
    </Card>
  )
}

