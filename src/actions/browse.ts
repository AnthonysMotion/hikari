"use server"

import { prisma } from "@/lib/prisma"

export interface AnimeFilters {
  search?: string
  genres?: string[]
  status?: string[]
  format?: string[]
  season?: string[]
  year?: number
  minScore?: number
  maxScore?: number
  sortBy?: "popularity" | "score" | "title" | "year" | "episodes"
  sortOrder?: "asc" | "desc"
}

export interface MangaFilters {
  search?: string
  genres?: string[]
  status?: string[]
  format?: string[]
  year?: number
  minScore?: number
  maxScore?: number
  sortBy?: "popularity" | "score" | "title" | "year" | "chapters"
  sortOrder?: "asc" | "desc"
}

export async function getFilteredAnime(filters: AnimeFilters = {}) {
  const {
    search,
    genres = [],
    status = [],
    format = [],
    season = [],
    year,
    minScore,
    maxScore,
    sortBy = "popularity",
    sortOrder = "desc",
  } = filters

  const where: any = {}

  // Search filter
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { titleEnglish: { contains: search } },
      { titleRomaji: { contains: search } },
      { synonyms: { contains: search } },
    ]
  }

  // Genre filter
  if (genres.length > 0) {
    where.genres = {
      some: {
        name: {
          in: genres,
        },
      },
    }
  }

  // Status filter
  if (status.length > 0) {
    where.status = {
      in: status,
    }
  }

  // Format filter
  if (format.length > 0) {
    where.format = {
      in: format,
    }
  }

  // Season filter
  if (season.length > 0) {
    where.season = {
      in: season,
    }
  }

  // Year filter
  if (year) {
    where.seasonYear = year
  }

  // Score filters
  if (minScore !== undefined || maxScore !== undefined) {
    where.averageScore = {}
    if (minScore !== undefined) {
      where.averageScore.gte = minScore
    }
    if (maxScore !== undefined) {
      where.averageScore.lte = maxScore
    }
  }

  // Sort order
  const orderBy: any = {}
  switch (sortBy) {
    case "popularity":
      orderBy.popularity = sortOrder
      break
    case "score":
      orderBy.averageScore = sortOrder
      break
    case "title":
      orderBy.title = sortOrder
      break
    case "year":
      orderBy.seasonYear = sortOrder
      break
    case "episodes":
      orderBy.episodes = sortOrder
      break
    default:
      orderBy.popularity = "desc"
  }

  const anime = await prisma.anime.findMany({
    where,
    include: {
      genres: true,
    },
    orderBy,
  })

  return anime
}

export async function getFilteredManga(filters: MangaFilters = {}) {
  const {
    search,
    genres = [],
    status = [],
    format = [],
    year,
    minScore,
    maxScore,
    sortBy = "popularity",
    sortOrder = "desc",
  } = filters

  const where: any = {}

  // Search filter
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { titleEnglish: { contains: search } },
      { titleRomaji: { contains: search } },
      { synonyms: { contains: search } },
    ]
  }

  // Genre filter
  if (genres.length > 0) {
    where.genres = {
      some: {
        name: {
          in: genres,
        },
      },
    }
  }

  // Status filter
  if (status.length > 0) {
    where.status = {
      in: status,
    }
  }

  // Format filter
  if (format.length > 0) {
    where.format = {
      in: format,
    }
  }

  // Year filter
  if (year) {
    where.startDate = {
      startsWith: year.toString(),
    }
  }

  // Score filters
  if (minScore !== undefined || maxScore !== undefined) {
    where.averageScore = {}
    if (minScore !== undefined) {
      where.averageScore.gte = minScore
    }
    if (maxScore !== undefined) {
      where.averageScore.lte = maxScore
    }
  }

  // Sort order
  const orderBy: any = {}
  switch (sortBy) {
    case "popularity":
      orderBy.popularity = sortOrder
      break
    case "score":
      orderBy.averageScore = sortOrder
      break
    case "title":
      orderBy.title = sortOrder
      break
    case "year":
      orderBy.startDate = sortOrder
      break
    case "chapters":
      orderBy.chapters = sortOrder
      break
    default:
      orderBy.popularity = "desc"
  }

  const manga = await prisma.manga.findMany({
    where,
    include: {
      genres: true,
    },
    orderBy,
  })

  return manga
}

export async function getAllGenres() {
  return await prisma.genre.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

export async function getAnimeFormats() {
  const formats = await prisma.anime.findMany({
    select: {
      format: true,
    },
    distinct: ["format"],
    where: {
      format: {
        not: null,
      },
    },
  })
  return formats.map((f) => f.format).filter(Boolean) as string[]
}

export async function getMangaFormats() {
  const formats = await prisma.manga.findMany({
    select: {
      format: true,
    },
    distinct: ["format"],
    where: {
      format: {
        not: null,
      },
    },
  })
  return formats.map((f) => f.format).filter(Boolean) as string[]
}

export async function getAnimeSeasons() {
  const seasons = await prisma.anime.findMany({
    select: {
      season: true,
    },
    distinct: ["season"],
    where: {
      season: {
        not: null,
      },
    },
  })
  return seasons.map((s) => s.season).filter(Boolean) as string[]
}

export async function getAnimeYears() {
  const years = await prisma.anime.findMany({
    select: {
      seasonYear: true,
    },
    distinct: ["seasonYear"],
    where: {
      seasonYear: {
        not: null,
      },
    },
    orderBy: {
      seasonYear: "desc",
    },
  })
  return years.map((y) => y.seasonYear).filter(Boolean) as number[]
}

export async function getMangaYears() {
  const mangas = await prisma.manga.findMany({
    select: {
      startDate: true,
    },
    where: {
      startDate: {
        not: null,
      },
    },
  })

  const years = new Set<number>()
  mangas.forEach((m) => {
    if (m.startDate) {
      const year = parseInt(m.startDate.split("-")[0])
      if (!isNaN(year)) {
        years.add(year)
      }
    }
  })

  return Array.from(years).sort((a, b) => b - a)
}

