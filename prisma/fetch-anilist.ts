import 'dotenv/config'
import { PrismaClient } from '../src/generated/client/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const ANILIST_API = 'https://graphql.anilist.co'

// GraphQL query for top anime - fetching all available fields
const ANIME_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: ANIME, sort: SCORE_DESC) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
        }
        bannerImage
        status
        season
        seasonYear
        format
        episodes
        duration
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        averageScore
        popularity
        source
        studios {
          nodes {
            name
          }
        }
        synonyms
        tags {
          name
          category
          description
        }
        genres
        countryOfOrigin
        isAdult
      }
    }
  }
`

// GraphQL query for top manga - fetching all available fields
const MANGA_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: MANGA, sort: SCORE_DESC) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
        }
        bannerImage
        status
        format
        chapters
        volumes
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        averageScore
        popularity
        source
        synonyms
        tags {
          name
          category
          description
        }
        genres
        countryOfOrigin
        isAdult
      }
    }
  }
`

async function fetchAniListData(query: string, type: 'anime' | 'manga') {
  const allResults: any[] = []
  let page = 1
  const perPage = 50 // AniList allows up to 50 per page
  let hasNextPage = true

  while (hasNextPage && allResults.length < 100) {
    try {
      const response = await fetch(ANILIST_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { page, perPage },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.errors) {
        console.error('GraphQL errors:', result.errors)
        break
      }

      const media = result.data?.Page?.media || []
      allResults.push(...media)

      const pageInfo = result.data?.Page?.pageInfo
      hasNextPage = pageInfo?.hasNextPage || false
      page++

      // Rate limiting - be nice to their API
      await new Promise(resolve => setTimeout(resolve, 300))

    } catch (error) {
      console.error(`Error fetching ${type} page ${page}:`, error)
      break
    }
  }

  return allResults.slice(0, 100) // Ensure we only get 100
}

function mapAniListStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'FINISHED': 'FINISHED',
    'RELEASING': 'RELEASING',
    'NOT_YET_RELEASED': 'NOT_YET_RELEASED',
    'CANCELLED': 'FINISHED',
    'HIATUS': 'RELEASING',
  }
  return statusMap[status] || 'RELEASING'
}

function formatSeason(season: string | null, seasonYear: number | null): string | null {
  if (!season || !seasonYear) return null
  const seasonMap: Record<string, string> = {
    'WINTER': 'Winter',
    'SPRING': 'Spring',
    'SUMMER': 'Summer',
    'FALL': 'Fall',
  }
  return `${seasonMap[season] || season} ${seasonYear}`
}

function formatDate(date: { year: number | null; month: number | null; day: number | null } | null): string | null {
  if (!date || !date.year) return null
  const year = date.year
  const month = date.month ? String(date.month).padStart(2, '0') : '01'
  const day = date.day ? String(date.day).padStart(2, '0') : '01'
  return `${year}-${month}-${day}`
}

function cleanDescription(description: string | null): string | null {
  if (!description) return null
  // Remove HTML tags and truncate to reasonable length
  return description.replace(/<[^>]*>/g, '').trim() || null
}

async function main() {
  console.log('Fetching top 100 anime from AniList...')
  const animeData = await fetchAniListData(ANIME_QUERY, 'anime')
  console.log(`Fetched ${animeData.length} anime`)

  console.log('Fetching top 100 manga from AniList...')
  const mangaData = await fetchAniListData(MANGA_QUERY, 'manga')
  console.log(`Fetched ${mangaData.length} manga`)

  const transformedAnime = animeData.map((item) => {
    const title = item.title.english || item.title.romaji || item.title.native
    return {
      anilistId: item.id,
      title,
      titleRomaji: item.title.romaji || null,
      titleEnglish: item.title.english || null,
      titleNative: item.title.native || null,
      description: cleanDescription(item.description),
      coverImage: item.coverImage?.large || null,
      bannerImage: item.bannerImage || null,
      status: mapAniListStatus(item.status),
      season: formatSeason(item.season, item.seasonYear),
      seasonYear: item.seasonYear || null,
      format: item.format || null,
      episodes: item.episodes || null,
      duration: item.duration || null,
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
      averageScore: item.averageScore || null,
      popularity: item.popularity || null,
      source: item.source || null,
      studios: item.studios?.nodes?.length > 0 
        ? JSON.stringify(item.studios.nodes.map((s: any) => s.name)) 
        : null,
      synonyms: item.synonyms?.length > 0 
        ? JSON.stringify(item.synonyms) 
        : null,
      tags: item.tags?.length > 0
        ? JSON.stringify(item.tags.map((t: any) => ({
            name: t.name,
            category: t.category,
            description: t.description,
          })))
        : null,
      genres: item.genres || [],
      countryOfOrigin: item.countryOfOrigin || null,
      isAdult: item.isAdult || false,
    }
  })

  const transformedManga = mangaData.map((item) => {
    const title = item.title.english || item.title.romaji || item.title.native
    return {
      anilistId: item.id,
      title,
      titleRomaji: item.title.romaji || null,
      titleEnglish: item.title.english || null,
      titleNative: item.title.native || null,
      description: cleanDescription(item.description),
      coverImage: item.coverImage?.large || null,
      bannerImage: item.bannerImage || null,
      status: mapAniListStatus(item.status),
      format: item.format || null,
      chapters: item.chapters || null,
      volumes: item.volumes || null,
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
      averageScore: item.averageScore || null,
      popularity: item.popularity || null,
      source: item.source || null,
      synonyms: item.synonyms?.length > 0 
        ? JSON.stringify(item.synonyms) 
        : null,
      tags: item.tags?.length > 0
        ? JSON.stringify(item.tags.map((t: any) => ({
            name: t.name,
            category: t.category,
            description: t.description,
          })))
        : null,
      genres: item.genres || [],
      countryOfOrigin: item.countryOfOrigin || null,
      isAdult: item.isAdult || false,
    }
  })

  // Save to data.json
  const dataPath = path.join(__dirname, 'data.json')
  const output = {
    anime: transformedAnime,
    manga: transformedManga,
  }
  fs.writeFileSync(dataPath, JSON.stringify(output, null, 2))
  console.log(`\nSaved data to ${dataPath}`)

  // Now seed to database
  console.log('\nSeeding anime to database...')
  for (const anime of transformedAnime) {
    const { genres, ...animeData } = anime

    // Create or connect genres
    const genreConnect = []
    for (const genreName of genres) {
      const genre = await prisma.genre.upsert({
        where: { name: genreName },
        update: {},
        create: { name: genreName },
      })
      genreConnect.push({ id: genre.id })
    }

    // Try to find by anilistId first, then by title
    const existing = animeData.anilistId
      ? await prisma.anime.findUnique({
          where: { anilistId: animeData.anilistId }
        })
      : await prisma.anime.findFirst({
          where: { title: anime.title }
        })

    if (existing) {
      await prisma.anime.update({
        where: { id: existing.id },
        data: {
          ...animeData,
          genres: {
            set: genreConnect,
          },
        },
      })
      console.log(`Updated anime: ${anime.title}`)
    } else {
      await prisma.anime.create({
        data: {
          ...animeData,
          genres: {
            connect: genreConnect,
          },
        },
      })
      console.log(`Created anime: ${anime.title}`)
    }
  }

  console.log('\nSeeding manga to database...')
  for (const manga of transformedManga) {
    const { genres, ...mangaData } = manga

    // Create or connect genres
    const genreConnect = []
    for (const genreName of genres) {
      const genre = await prisma.genre.upsert({
        where: { name: genreName },
        update: {},
        create: { name: genreName },
      })
      genreConnect.push({ id: genre.id })
    }

    // Try to find by anilistId first, then by title
    const existing = mangaData.anilistId
      ? await prisma.manga.findUnique({
          where: { anilistId: mangaData.anilistId }
        })
      : await prisma.manga.findFirst({
          where: { title: manga.title }
        })

    if (existing) {
      await prisma.manga.update({
        where: { id: existing.id },
        data: {
          ...mangaData,
          genres: {
            set: genreConnect,
          },
        },
      })
      console.log(`Updated manga: ${manga.title}`)
    } else {
      await prisma.manga.create({
        data: {
          ...mangaData,
          genres: {
            connect: genreConnect,
          },
        },
      })
      console.log(`Created manga: ${manga.title}`)
    }
  }

  console.log('\nDone!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
