"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function getUserId(session: any): string {
  return (session?.user as any)?.id || session?.user?.id
}

export async function addToAnimeList(animeId: number, status: string) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  await prisma.userAnimeList.upsert({
    where: {
      userId_animeId: {
        userId: userId,
        animeId,
      },
    },
    update: {
      status,
      currentEpisode: status === "WATCHING" || status === "PAUSED" || status === "DROPPED" ? 1 : null,
    },
    create: {
      userId: userId,
      animeId,
      status,
      currentEpisode: status === "WATCHING" || status === "PAUSED" || status === "DROPPED" ? 1 : null,
    },
  })

  revalidatePath(`/anime/${animeId}`)
  revalidatePath("/")
}

export async function addToMangaList(mangaId: number, status: string) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  await prisma.userMangaList.upsert({
    where: {
      userId_mangaId: {
        userId: userId,
        mangaId,
      },
    },
    update: {
      status,
      currentChapter: status === "READING" || status === "PAUSED" || status === "DROPPED" ? 1 : null,
    },
    create: {
      userId: userId,
      mangaId,
      status,
      currentChapter: status === "READING" || status === "PAUSED" || status === "DROPPED" ? 1 : null,
    },
  })

  revalidatePath(`/manga/${mangaId}`)
  revalidatePath("/")
}

export async function updateAnimeEpisode(animeId: number, episode: number) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  const listEntry = await prisma.userAnimeList.findUnique({
    where: {
      userId_animeId: {
        userId: userId,
        animeId,
      },
    },
  })

  if (!listEntry || !["WATCHING", "PAUSED", "DROPPED"].includes(listEntry.status)) {
    throw new Error("Anime must be in WATCHING, PAUSED, or DROPPED status")
  }

  await prisma.userAnimeList.update({
    where: {
      userId_animeId: {
        userId: userId,
        animeId,
      },
    },
    data: {
      currentEpisode: episode,
    },
  })

  revalidatePath(`/anime/${animeId}`)
  revalidatePath("/")
}

export async function updateMangaChapter(mangaId: number, chapter: number) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  const listEntry = await prisma.userMangaList.findUnique({
    where: {
      userId_mangaId: {
        userId: userId,
        mangaId,
      },
    },
  })

  if (!listEntry || !["READING", "PAUSED", "DROPPED"].includes(listEntry.status)) {
    throw new Error("Manga must be in READING, PAUSED, or DROPPED status")
  }

  await prisma.userMangaList.update({
    where: {
      userId_mangaId: {
        userId: userId,
        mangaId,
      },
    },
    data: {
      currentChapter: chapter,
    },
  })

  revalidatePath(`/manga/${mangaId}`)
  revalidatePath("/")
}

export async function incrementAnimeEpisode(animeId: number) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  const listEntry = await prisma.userAnimeList.findUnique({
    where: {
      userId_animeId: {
        userId: userId,
        animeId,
      },
    },
  })

  if (!listEntry) {
    throw new Error("Anime not in list")
  }

  const currentEpisode = listEntry.currentEpisode || 0
  const anime = await prisma.anime.findUnique({
    where: { id: animeId },
    select: { episodes: true },
  })

  const maxEpisodes = anime?.episodes || Infinity
  const newEpisode = Math.min(currentEpisode + 1, maxEpisodes)

  await prisma.userAnimeList.update({
    where: {
      userId_animeId: {
        userId: userId,
        animeId,
      },
    },
    data: {
      currentEpisode: newEpisode,
    },
  })

  revalidatePath(`/anime/${animeId}`)
  revalidatePath("/")
}

export async function incrementMangaChapter(mangaId: number) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  const listEntry = await prisma.userMangaList.findUnique({
    where: {
      userId_mangaId: {
        userId: userId,
        mangaId,
      },
    },
  })

  if (!listEntry) {
    throw new Error("Manga not in list")
  }

  const currentChapter = listEntry.currentChapter || 0
  const manga = await prisma.manga.findUnique({
    where: { id: mangaId },
    select: { chapters: true },
  })

  const maxChapters = manga?.chapters || Infinity
  const newChapter = Math.min(currentChapter + 1, maxChapters)

  await prisma.userMangaList.update({
    where: {
      userId_mangaId: {
        userId: userId,
        mangaId,
      },
    },
    data: {
      currentChapter: newChapter,
    },
  })

  revalidatePath(`/manga/${mangaId}`)
  revalidatePath("/")
}

export async function submitReview(
  animeId: number | null,
  mangaId: number | null,
  rating: number,
  review: string
) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  if (!animeId && !mangaId) {
    throw new Error("Must provide either animeId or mangaId")
  }

  // Check if item is completed in user's list
  if (animeId) {
    const listEntry = await prisma.userAnimeList.findUnique({
      where: {
        userId_animeId: {
          userId: userId,
          animeId,
        },
      },
    })
    if (!listEntry || listEntry.status !== "COMPLETED") {
      throw new Error("Anime must be marked as COMPLETED to review")
    }
  }

  if (mangaId) {
    const listEntry = await prisma.userMangaList.findUnique({
      where: {
        userId_mangaId: {
          userId: userId,
          mangaId,
        },
      },
    })
    if (!listEntry || listEntry.status !== "COMPLETED") {
      throw new Error("Manga must be marked as COMPLETED to review")
    }
  }

  // Find existing review
  const existingReview = animeId
    ? await prisma.review.findUnique({
        where: {
          userId_animeId: { userId: userId, animeId },
        },
      })
    : await prisma.review.findUnique({
        where: {
          userId_mangaId: { userId: userId, mangaId: mangaId! },
        },
      })

  if (existingReview) {
    await prisma.review.update({
      where: { id: existingReview.id },
      data: {
        rating,
        review: review || null,
      },
    })
  } else {
    await prisma.review.create({
      data: {
        userId: userId,
        animeId: animeId || null,
        mangaId: mangaId || null,
        rating,
        review: review || null,
      },
    })
  }

  revalidatePath(animeId ? `/anime/${animeId}` : `/manga/${mangaId}`)
}

export async function removeFromAnimeList(animeId: number) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  await prisma.userAnimeList.delete({
    where: {
      userId_animeId: {
        userId: userId,
        animeId,
      },
    },
  })

  revalidatePath(`/anime/${animeId}`)
  revalidatePath("/")
}

export async function removeFromMangaList(mangaId: number) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  await prisma.userMangaList.delete({
    where: {
      userId_mangaId: {
        userId: userId,
        mangaId,
      },
    },
  })

  revalidatePath(`/manga/${mangaId}`)
  revalidatePath("/")
}

