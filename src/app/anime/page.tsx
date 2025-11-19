import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrowseFilters } from "@/components/browse-filters"
import { BrowseList } from "@/components/browse-list"
import {
  getFilteredAnime,
  getFilteredManga,
  getAllGenres,
  getAnimeFormats,
  getMangaFormats,
  getAnimeSeasons,
  getAnimeYears,
  getMangaYears,
  AnimeFilters,
  MangaFilters,
} from "@/actions/browse"
import { Card, CardContent } from "@/components/ui/card"

interface SearchParams {
  type?: string
  search?: string
  genres?: string | string[]
  status?: string | string[]
  format?: string | string[]
  season?: string | string[]
  year?: string
  minScore?: string
  maxScore?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

interface AnimePageProps {
  searchParams: Promise<SearchParams>
}

async function BrowseContent({ searchParams }: { searchParams: SearchParams }) {
  const activeTab = searchParams.type === "manga" ? "manga" : "anime"

  // Fetch filter options
  const [genres, animeFormats, mangaFormats, animeSeasons, animeYears, mangaYears] =
    await Promise.all([
      getAllGenres(),
      getAnimeFormats(),
      getMangaFormats(),
      getAnimeSeasons(),
      getAnimeYears(),
      getMangaYears(),
    ])

  // Parse filters
  const parseArray = (value: string | string[] | undefined): string[] => {
    if (!value) return []
    if (Array.isArray(value)) return value
    return [value]
  }

  const animeFilters: AnimeFilters = {
    search: searchParams.search,
    genres: parseArray(searchParams.genres),
    status: parseArray(searchParams.status),
    format: parseArray(searchParams.format),
    season: parseArray(searchParams.season),
    year: searchParams.year ? parseInt(searchParams.year) : undefined,
    minScore: searchParams.minScore ? parseInt(searchParams.minScore) : undefined,
    maxScore: searchParams.maxScore ? parseInt(searchParams.maxScore) : undefined,
    sortBy: (searchParams.sortBy as any) || "popularity",
    sortOrder: searchParams.sortOrder || "desc",
  }

  const mangaFilters: MangaFilters = {
    search: searchParams.search,
    genres: parseArray(searchParams.genres),
    status: parseArray(searchParams.status),
    format: parseArray(searchParams.format),
    year: searchParams.year ? parseInt(searchParams.year) : undefined,
    minScore: searchParams.minScore ? parseInt(searchParams.minScore) : undefined,
    maxScore: searchParams.maxScore ? parseInt(searchParams.maxScore) : undefined,
    sortBy: (searchParams.sortBy as any) || "popularity",
    sortOrder: searchParams.sortOrder || "desc",
  }

  // Fetch filtered data
  const [anime, manga] = await Promise.all([
    getFilteredAnime(animeFilters),
    getFilteredManga(mangaFilters),
  ])

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="anime">Anime</TabsTrigger>
        <TabsTrigger value="manga">Manga</TabsTrigger>
      </TabsList>
      <TabsContent value="anime" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <BrowseFilters
              type="anime"
              filters={animeFilters}
              genres={genres}
              formats={animeFormats}
              seasons={animeSeasons}
              years={animeYears}
            />
          </div>
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Anime</h2>
              <p className="text-muted-foreground text-base">
                {anime.length} {anime.length === 1 ? "result" : "results"}
              </p>
            </div>
            <BrowseList type="anime" items={anime} />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="manga" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <BrowseFilters
              type="manga"
              filters={mangaFilters}
              genres={genres}
              formats={mangaFormats}
              years={mangaYears}
            />
          </div>
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Manga</h2>
              <p className="text-muted-foreground text-base">
                {manga.length} {manga.length === 1 ? "result" : "results"}
              </p>
            </div>
            <BrowseList type="manga" items={manga} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default async function AnimePage({ searchParams }: AnimePageProps) {
  const params = await searchParams

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Browse</h1>
          <p className="text-lg text-muted-foreground">
            Discover and filter through all anime and manga
          </p>
        </div>
        <Suspense
          fallback={
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          }
        >
          <BrowseContent searchParams={params} />
        </Suspense>
      </div>
    </main>
  )
}

