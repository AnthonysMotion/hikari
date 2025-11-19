import 'dotenv/config'
import { PrismaClient } from '../src/generated/client/client'

const prisma = new PrismaClient()

async function deleteAnimeById() {
  try {
    const anime = await prisma.anime.findUnique({
      where: { id: 1 },
    })

    if (!anime) {
      console.log('Anime with ID 1 not found.')
      return
    }

    console.log(`Found anime: ${anime.title} (ID: ${anime.id})`)
    
    await prisma.anime.delete({
      where: { id: 1 },
    })

    console.log(`Successfully deleted anime ID 1: ${anime.title}`)
  } catch (error) {
    console.error('Error deleting anime:', error)
    throw error
  }
}

deleteAnimeById()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

