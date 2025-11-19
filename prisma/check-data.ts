import 'dotenv/config'
import { PrismaClient } from '../src/generated/client/client'

const prisma = new PrismaClient()

async function checkData() {
  const anime = await prisma.anime.findFirst({
    where: {
      bannerImage: { not: null }
    },
    select: {
      id: true,
      title: true,
      bannerImage: true,
      countryOfOrigin: true,
      studios: true,
      source: true,
    }
  })

  console.log('Anime with banner:', JSON.stringify(anime, null, 2))

  const animeSample = await prisma.anime.findFirst({
    select: {
      id: true,
      title: true,
      bannerImage: true,
      countryOfOrigin: true,
      studios: true,
      source: true,
    }
  })

  console.log('\nFirst anime sample:', JSON.stringify(animeSample, null, 2))

  const manga = await prisma.manga.findFirst({
    where: {
      bannerImage: { not: null }
    },
    select: {
      id: true,
      title: true,
      bannerImage: true,
      countryOfOrigin: true,
      source: true,
    }
  })

  console.log('\nManga with banner:', JSON.stringify(manga, null, 2))

  const mangaSample = await prisma.manga.findFirst({
    select: {
      id: true,
      title: true,
      bannerImage: true,
      countryOfOrigin: true,
      source: true,
    }
  })

  console.log('\nFirst manga sample:', JSON.stringify(mangaSample, null, 2))

  await prisma.$disconnect()
}

checkData().catch(console.error)

