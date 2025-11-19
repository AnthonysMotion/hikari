"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { AnimeFilters, MangaFilters } from "@/actions/browse"

interface BrowseFiltersProps {
  type: "anime" | "manga"
  filters: AnimeFilters | MangaFilters
  genres: Array<{ id: number; name: string }>
  formats: string[]
  seasons?: string[]
  years: number[]
}

const ANIME_STATUSES = ["RELEASING", "FINISHED", "NOT_YET_RELEASED"]
const MANGA_STATUSES = ["RELEASING", "FINISHED", "NOT_YET_RELEASED"]
const ANIME_SEASONS = ["SPRING", "SUMMER", "FALL", "WINTER"]

export function BrowseFilters({
  type,
  filters,
  genres,
  formats,
  seasons = ANIME_SEASONS,
  years,
}: BrowseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(filters.search || "")
  const [selectedGenres, setSelectedGenres] = useState<string[]>(filters.genres || [])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(filters.status || [])
  const [selectedFormats, setSelectedFormats] = useState<string[]>(filters.format || [])
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(
    type === "anime" ? (filters as AnimeFilters).season || [] : []
  )
  const [showAllSeasons, setShowAllSeasons] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    filters.year
  )
  const [minScore, setMinScore] = useState<number | undefined>(filters.minScore)
  const [maxScore, setMaxScore] = useState<number | undefined>(filters.maxScore)
  const [sortBy, setSortBy] = useState<string>(filters.sortBy || "popularity")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(filters.sortOrder || "desc")

  const updateURL = () => {
    const params = new URLSearchParams()
    
    // Update type
    if (type === "manga") {
      params.set("type", "manga")
    }

    // Update search
    if (search) {
      params.set("search", search)
    }

    // Update genres
    selectedGenres.forEach((g) => params.append("genres", g))

    // Update status
    selectedStatuses.forEach((s) => params.append("status", s))

    // Update format
    selectedFormats.forEach((f) => params.append("format", f))

    // Update season (anime only)
    if (type === "anime") {
      selectedSeasons.forEach((s) => params.append("season", s))
    }

    // Update year
    if (selectedYear) {
      params.set("year", selectedYear.toString())
    }

    // Update minScore
    if (minScore !== undefined) {
      params.set("minScore", minScore.toString())
    }

    // Update maxScore
    if (maxScore !== undefined) {
      params.set("maxScore", maxScore.toString())
    }

    // Update sortBy
    if (sortBy !== "popularity") {
      params.set("sortBy", sortBy)
    }

    // Update sortOrder
    if (sortOrder !== "desc") {
      params.set("sortOrder", sortOrder)
    }

    router.push(`/anime?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedGenres([])
    setSelectedStatuses([])
    setSelectedFormats([])
    setSelectedSeasons([])
    setSelectedYear(undefined)
    setMinScore(undefined)
    setMaxScore(undefined)
    setSortBy("popularity")
    setSortOrder("desc")
    const params = new URLSearchParams()
    if (type === "manga") {
      params.set("type", "manga")
    }
    router.push(`/anime?${params.toString()}`)
  }

  // Debounce search updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL()
    }, 500)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const toggleGenre = (genreName: string) => {
    const newGenres = selectedGenres.includes(genreName)
      ? selectedGenres.filter((g) => g !== genreName)
      : [...selectedGenres, genreName]
    setSelectedGenres(newGenres)
    setTimeout(() => {
      const params = new URLSearchParams()
      if (type === "manga") params.set("type", "manga")
      if (search) params.set("search", search)
      newGenres.forEach((g) => params.append("genres", g))
      selectedStatuses.forEach((s) => params.append("status", s))
      selectedFormats.forEach((f) => params.append("format", f))
      if (type === "anime") selectedSeasons.forEach((s) => params.append("season", s))
      if (selectedYear) params.set("year", selectedYear.toString())
      if (minScore !== undefined) params.set("minScore", minScore.toString())
      if (maxScore !== undefined) params.set("maxScore", maxScore.toString())
      if (sortBy !== "popularity") params.set("sortBy", sortBy)
      if (sortOrder !== "desc") params.set("sortOrder", sortOrder)
      router.push(`/anime?${params.toString()}`)
    }, 0)
  }

  const toggleStatus = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]
    setSelectedStatuses(newStatuses)
    setTimeout(() => {
      const params = new URLSearchParams()
      if (type === "manga") params.set("type", "manga")
      if (search) params.set("search", search)
      selectedGenres.forEach((g) => params.append("genres", g))
      newStatuses.forEach((s) => params.append("status", s))
      selectedFormats.forEach((f) => params.append("format", f))
      if (type === "anime") selectedSeasons.forEach((s) => params.append("season", s))
      if (selectedYear) params.set("year", selectedYear.toString())
      if (minScore !== undefined) params.set("minScore", minScore.toString())
      if (maxScore !== undefined) params.set("maxScore", maxScore.toString())
      if (sortBy !== "popularity") params.set("sortBy", sortBy)
      if (sortOrder !== "desc") params.set("sortOrder", sortOrder)
      router.push(`/anime?${params.toString()}`)
    }, 0)
  }

  const toggleFormat = (format: string) => {
    const newFormats = selectedFormats.includes(format)
      ? selectedFormats.filter((f) => f !== format)
      : [...selectedFormats, format]
    setSelectedFormats(newFormats)
    setTimeout(() => {
      const params = new URLSearchParams()
      if (type === "manga") params.set("type", "manga")
      if (search) params.set("search", search)
      selectedGenres.forEach((g) => params.append("genres", g))
      selectedStatuses.forEach((s) => params.append("status", s))
      newFormats.forEach((f) => params.append("format", f))
      if (type === "anime") selectedSeasons.forEach((s) => params.append("season", s))
      if (selectedYear) params.set("year", selectedYear.toString())
      if (minScore !== undefined) params.set("minScore", minScore.toString())
      if (maxScore !== undefined) params.set("maxScore", maxScore.toString())
      if (sortBy !== "popularity") params.set("sortBy", sortBy)
      if (sortOrder !== "desc") params.set("sortOrder", sortOrder)
      router.push(`/anime?${params.toString()}`)
    }, 0)
  }

  const toggleSeason = (season: string) => {
    const newSeasons = selectedSeasons.includes(season)
      ? selectedSeasons.filter((s) => s !== season)
      : [...selectedSeasons, season]
    setSelectedSeasons(newSeasons)
    setTimeout(() => {
      const params = new URLSearchParams()
      if (type === "manga") params.set("type", "manga")
      if (search) params.set("search", search)
      selectedGenres.forEach((g) => params.append("genres", g))
      selectedStatuses.forEach((s) => params.append("status", s))
      selectedFormats.forEach((f) => params.append("format", f))
      newSeasons.forEach((s) => params.append("season", s))
      if (selectedYear) params.set("year", selectedYear.toString())
      if (minScore !== undefined) params.set("minScore", minScore.toString())
      if (maxScore !== undefined) params.set("maxScore", maxScore.toString())
      if (sortBy !== "popularity") params.set("sortBy", sortBy)
      if (sortOrder !== "desc") params.set("sortOrder", sortOrder)
      router.push(`/anime?${params.toString()}`)
    }, 0)
  }

  const hasActiveFilters =
    search ||
    selectedGenres.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedFormats.length > 0 ||
    (type === "anime" && selectedSeasons.length > 0) ||
    selectedYear ||
    minScore !== undefined ||
    maxScore !== undefined ||
    sortBy !== "popularity" ||
    sortOrder !== "desc"

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search titles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
          </div>

          {/* Sort */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value)
                  updateURL()
                }}
              >
                <SelectTrigger id="sortBy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  {type === "anime" ? (
                    <SelectItem value="episodes">Episodes</SelectItem>
                  ) : (
                    <SelectItem value="chapters">Chapters</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Order</Label>
              <Select
                value={sortOrder}
                onValueChange={(value: "asc" | "desc") => {
                  setSortOrder(value)
                  updateURL()
                }}
              >
                <SelectTrigger id="sortOrder">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <Label>Genres</Label>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {genres.map((genre) => (
                <div key={genre.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${genre.id}`}
                    checked={selectedGenres.includes(genre.name)}
                    onCheckedChange={() => {
                      toggleGenre(genre.name)
                    }}
                  />
                  <Label
                    htmlFor={`genre-${genre.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {genre.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="space-y-2">
              {(type === "anime" ? ANIME_STATUSES : MANGA_STATUSES).map(
                (status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => {
                        toggleStatus(status)
                      }}
                    />
                    <Label
                      htmlFor={`status-${status}`}
                      className="text-sm font-normal cursor-pointer capitalize"
                    >
                      {status.replace(/_/g, " ").toLowerCase()}
                    </Label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Format */}
          {formats.length > 0 && (
            <div className="space-y-2">
              <Label>Format</Label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {formats.map((format) => (
                  <div key={format} className="flex items-center space-x-2">
                    <Checkbox
                      id={`format-${format}`}
                      checked={selectedFormats.includes(format)}
                      onCheckedChange={() => {
                        toggleFormat(format)
                      }}
                    />
                    <Label
                      htmlFor={`format-${format}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {format}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Season (Anime only) */}
          {type === "anime" && seasons.length > 0 && (
            <div className="space-y-2">
              <Label>Season</Label>
              <div className="space-y-2">
                {(showAllSeasons ? seasons : seasons.slice(0, 2)).map((season) => (
                  <div key={season} className="flex items-center space-x-2">
                    <Checkbox
                      id={`season-${season}`}
                      checked={selectedSeasons.includes(season)}
                      onCheckedChange={() => {
                        toggleSeason(season)
                      }}
                    />
                    <Label
                      htmlFor={`season-${season}`}
                      className="text-sm font-normal cursor-pointer capitalize"
                    >
                      {season.toLowerCase()}
                    </Label>
                  </div>
                ))}
                {!showAllSeasons && seasons.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => setShowAllSeasons(true)}
                  >
                    View all
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
              <Select
                value={selectedYear?.toString() || "any"}
                onValueChange={(value) => {
                  if (value === "any") {
                    setSelectedYear(undefined)
                  } else {
                    setSelectedYear(parseInt(value))
                  }
                  updateURL()
                }}
              >
              <SelectTrigger id="year">
                <SelectValue placeholder="Any year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any year</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Score Range */}
          <div className="space-y-2">
            <Label>Score Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="minScore" className="text-xs text-muted-foreground">
                  Min
                </Label>
                <Input
                  id="minScore"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={minScore || ""}
                  onChange={(e) => {
                    const value = e.target.value
                    setMinScore(value ? parseInt(value) : undefined)
                    updateURL()
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="maxScore" className="text-xs text-muted-foreground">
                  Max
                </Label>
                <Input
                  id="maxScore"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="100"
                  value={maxScore || ""}
                  onChange={(e) => {
                    const value = e.target.value
                    setMaxScore(value ? parseInt(value) : undefined)
                    updateURL()
                  }}
                />
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

