"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserStatsProps {
  animeList: Array<{
    status: string
    anime: {
      id: number
    }
  }>
  mangaList: Array<{
    status: string
    manga: {
      id: number
    }
  }>
}

export function UserStats({ animeList, mangaList }: UserStatsProps) {
  const animeStats = {
    watching: animeList.filter(a => a.status === "WATCHING").length,
    completed: animeList.filter(a => a.status === "COMPLETED").length,
    planning: animeList.filter(a => a.status === "PLANNING").length,
    paused: animeList.filter(a => a.status === "PAUSED").length,
    dropped: animeList.filter(a => a.status === "DROPPED").length,
    total: animeList.length,
  }

  const mangaStats = {
    reading: mangaList.filter(m => m.status === "READING").length,
    completed: mangaList.filter(m => m.status === "COMPLETED").length,
    planning: mangaList.filter(m => m.status === "PLANNING").length,
    paused: mangaList.filter(m => m.status === "PAUSED").length,
    dropped: mangaList.filter(m => m.status === "DROPPED").length,
    total: mangaList.length,
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Watching</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{animeStats.watching}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completed (Anime)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{animeStats.completed}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Reading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mangaStats.reading}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completed (Manga)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mangaStats.completed}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{animeStats.planning + mangaStats.planning}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{animeStats.total + mangaStats.total}</div>
        </CardContent>
      </Card>
    </div>
  )
}

