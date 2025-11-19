import 'dotenv/config'
import { PrismaClient } from '../src/generated/client/client'

const prisma = new PrismaClient()

async function cleanupDuplicates() {
  console.log('Starting duplicate cleanup...\n')

  // Clean up Anime duplicates
  console.log('Cleaning up Anime duplicates...')
  const allAnime = await prisma.anime.findMany({
    orderBy: { id: 'asc' },
  })

  // Group by title
  const animeByTitle = new Map<string, typeof allAnime>()
  for (const anime of allAnime) {
    const key = anime.title.toLowerCase().trim()
    if (!animeByTitle.has(key)) {
      animeByTitle.set(key, [])
    }
    animeByTitle.get(key)!.push(anime)
  }

  let animeDeleted = 0
  for (const [title, duplicates] of animeByTitle.entries()) {
    if (duplicates.length > 1) {
      // Find the one with anilistId (preferred)
      const withAnilistId = duplicates.find(a => a.anilistId !== null)
      
      if (withAnilistId) {
        // Delete all others
        const toDelete = duplicates.filter(a => a.id !== withAnilistId.id)
        for (const duplicate of toDelete) {
          await prisma.anime.delete({
            where: { id: duplicate.id },
          })
          animeDeleted++
          console.log(`  Deleted duplicate anime (ID: ${duplicate.id}): ${duplicate.title}`)
        }
        console.log(`  Kept anime with anilistId (ID: ${withAnilistId.id}): ${withAnilistId.title}`)
      } else {
        // No anilistId found, keep the first one (oldest)
        const toDelete = duplicates.slice(1)
        for (const duplicate of toDelete) {
          await prisma.anime.delete({
            where: { id: duplicate.id },
          })
          animeDeleted++
          console.log(`  Deleted duplicate anime (ID: ${duplicate.id}): ${duplicate.title}`)
        }
        console.log(`  Kept first anime (ID: ${duplicates[0].id}): ${duplicates[0].title}`)
      }
    }
  }

  console.log(`\nDeleted ${animeDeleted} duplicate anime entries.\n`)

  // Clean up Manga duplicates
  console.log('Cleaning up Manga duplicates...')
  const allManga = await prisma.manga.findMany({
    orderBy: { id: 'asc' },
  })

  // Group by title
  const mangaByTitle = new Map<string, typeof allManga>()
  for (const manga of allManga) {
    const key = manga.title.toLowerCase().trim()
    if (!mangaByTitle.has(key)) {
      mangaByTitle.set(key, [])
    }
    mangaByTitle.get(key)!.push(manga)
  }

  let mangaDeleted = 0
  for (const [title, duplicates] of mangaByTitle.entries()) {
    if (duplicates.length > 1) {
      // Find the one with anilistId (preferred)
      const withAnilistId = duplicates.find(m => m.anilistId !== null)
      
      if (withAnilistId) {
        // Delete all others
        const toDelete = duplicates.filter(m => m.id !== withAnilistId.id)
        for (const duplicate of toDelete) {
          await prisma.manga.delete({
            where: { id: duplicate.id },
          })
          mangaDeleted++
          console.log(`  Deleted duplicate manga (ID: ${duplicate.id}): ${duplicate.title}`)
        }
        console.log(`  Kept manga with anilistId (ID: ${withAnilistId.id}): ${withAnilistId.title}`)
      } else {
        // No anilistId found, keep the first one (oldest)
        const toDelete = duplicates.slice(1)
        for (const duplicate of toDelete) {
          await prisma.manga.delete({
            where: { id: duplicate.id },
          })
          mangaDeleted++
          console.log(`  Deleted duplicate manga (ID: ${duplicate.id}): ${duplicate.title}`)
        }
        console.log(`  Kept first manga (ID: ${duplicates[0].id}): ${duplicates[0].title}`)
      }
    }
  }

  console.log(`\nDeleted ${mangaDeleted} duplicate manga entries.`)

  // Summary
  const finalAnimeCount = await prisma.anime.count()
  const finalMangaCount = await prisma.manga.count()

  console.log('\n=== Cleanup Summary ===')
  console.log(`Total anime deleted: ${animeDeleted}`)
  console.log(`Total manga deleted: ${mangaDeleted}`)
  console.log(`Final anime count: ${finalAnimeCount}`)
  console.log(`Final manga count: ${finalMangaCount}`)
  console.log('\nCleanup complete!')
}

cleanupDuplicates()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error during cleanup:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

