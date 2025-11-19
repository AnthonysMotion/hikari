"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { checkAndAwardAchievements, addXP } from "@/lib/achievements"
import { createEpisodeActivity, createChapterActivity } from "@/actions/activity"

function getUserId(session: any): string {
  return (session?.user as any)?.id || session?.user?.id
}

export async function addToAnimeList(animeId: number, status: string) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  const wasCompleted = await prisma.userAnimeList.findUnique({
    where: {
      userId_animeId: {
        userId: userId,
        animeId,
      },
    },
    select: { status: true },
  })

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

  // Award XP and check achievements
  if (status === "COMPLETED" && wasCompleted?.status !== "COMPLETED") {
    await addXP(userId, 50, "Completed anime")
    await checkAndAwardAchievements(userId)
  } else if (status === "COMPLETED") {
    await checkAndAwardAchievements(userId)
  }

  revalidatePath(`/anime/${animeId}`)
  revalidatePath("/")
  revalidatePath(`/user/${userId}`)
}

export async function addToMangaList(mangaId: number, status: string) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  const wasCompleted = await prisma.userMangaList.findUnique({
    where: {
      userId_mangaId: {
        userId: userId,
        mangaId,
      },
    },
    select: { status: true },
  })

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

  // Award XP and check achievements
  if (status === "COMPLETED" && wasCompleted?.status !== "COMPLETED") {
    await addXP(userId, 50, "Completed manga")
    await checkAndAwardAchievements(userId)
  } else if (status === "COMPLETED") {
    await checkAndAwardAchievements(userId)
  }

  revalidatePath(`/manga/${mangaId}`)
  revalidatePath("/")
  revalidatePath(`/user/${userId}`)
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

  // Award XP for episode progress
  await addXP(userId, 5, "Watched episode")
  
  // Create activity post for episode progress
  await createEpisodeActivity(animeId, newEpisode)
  
  // Check if completed (anime already fetched above)
  if (anime?.episodes && newEpisode >= anime.episodes) {
    await prisma.userAnimeList.update({
      where: {
        userId_animeId: {
          userId: userId,
          animeId,
        },
      },
      data: {
        status: "COMPLETED",
      },
    })
    await addXP(userId, 50, "Completed anime")
    await checkAndAwardAchievements(userId)
  } else {
    await checkAndAwardAchievements(userId)
  }

  revalidatePath(`/anime/${animeId}`)
  revalidatePath("/")
  revalidatePath(`/user/${userId}`)
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

  // Award XP for chapter progress
  await addXP(userId, 3, "Read chapter")
  
  // Create activity post for chapter progress
  await createChapterActivity(mangaId, newChapter)
  
  // Check if completed (manga already fetched above)
  if (manga?.chapters && newChapter >= manga.chapters) {
    await prisma.userMangaList.update({
      where: {
        userId_mangaId: {
          userId: userId,
          mangaId,
        },
      },
      data: {
        status: "COMPLETED",
      },
    })
    await addXP(userId, 50, "Completed manga")
    await checkAndAwardAchievements(userId)
  } else {
    await checkAndAwardAchievements(userId)
  }

  revalidatePath(`/manga/${mangaId}`)
  revalidatePath("/")
  revalidatePath(`/user/${userId}`)
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

  const isNewReview = !existingReview

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

  // Award XP for new reviews
  if (isNewReview) {
    await addXP(userId, 25, "Wrote review")
    await checkAndAwardAchievements(userId)
  }

  revalidatePath(animeId ? `/anime/${animeId}` : `/manga/${mangaId}`)
  revalidatePath(`/user/${userId}`)
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

