import { PrismaClient } from '../src/generated/client/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const dataPath = path.join(__dirname, 'data.json')
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  // Optional: Clear existing data to avoid duplicates
  // Uncomment these lines if you want data.json to be the single source of truth
  // await prisma.anime.deleteMany({})
  // await prisma.manga.deleteMany({})
  // console.log('Cleared existing data')

  // Seed Anime
  for (const anime of data.anime) {
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

    // Use upsert to avoid duplicates based on title
    // Note: This assumes title is unique enough for this purpose
    const existing = await prisma.anime.findFirst({
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

  // Seed Manga
  for (const manga of data.manga) {
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

    const existing = await prisma.manga.findFirst({
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
