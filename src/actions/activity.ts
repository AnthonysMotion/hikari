"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function getUserId(session: any): string {
  return (session?.user as any)?.id || session?.user?.id
}

export async function createActivityPost(content: string) {
  const session = await auth()
  const userId = getUserId(session)

  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  if (!content || content.trim().length === 0) {
    throw new Error("Content cannot be empty")
  }

  if (content.length > 500) {
    throw new Error("Content cannot exceed 500 characters")
  }

  await prisma.activityPost.create({
    data: {
      userId,
      type: "post",
      content: content.trim(),
    },
  })

  revalidatePath("/")
}

export async function createEpisodeActivity(animeId: number, episode: number) {
  const session = await auth()
  const userId = getUserId(session)

  if (!session?.user || !userId) {
    return
  }

  // Only create activity for significant episodes (every 3rd episode or final episode)
  const anime = await prisma.anime.findUnique({
    where: { id: animeId },
    select: { episodes: true, title: true },
  })

  if (!anime) return

  // Create activity if it's a milestone episode or we haven't created one recently
  const shouldCreate = 
    episode % 3 === 0 || 
    (anime.episodes && episode === anime.episodes)

  if (!shouldCreate) return

  // Check if we already created an activity for this episode recently (within last hour)
  const recentActivity = await prisma.activityPost.findFirst({
    where: {
      userId,
      type: "episode",
      animeId,
      episode,
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
  })

  if (recentActivity) return

  await prisma.activityPost.create({
    data: {
      userId,
      type: "episode",
      animeId,
      episode,
    },
  })

  revalidatePath("/")
}

export async function createChapterActivity(mangaId: number, chapter: number) {
  const session = await auth()
  const userId = getUserId(session)

  if (!session?.user || !userId) {
    return
  }

  // Only create activity for significant chapters (every 5th chapter or final chapter)
  const manga = await prisma.manga.findUnique({
    where: { id: mangaId },
    select: { chapters: true, title: true },
  })

  if (!manga) return

  // Create activity if it's a milestone chapter or we haven't created one recently
  const shouldCreate = 
    chapter % 5 === 0 || 
    (manga.chapters && chapter === manga.chapters)

  if (!shouldCreate) return

  // Check if we already created an activity for this chapter recently (within last hour)
  const recentActivity = await prisma.activityPost.findFirst({
    where: {
      userId,
      type: "chapter",
      mangaId,
      chapter,
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
  })

  if (recentActivity) return

  await prisma.activityPost.create({
    data: {
      userId,
      type: "chapter",
      mangaId,
      chapter,
    },
  })

  revalidatePath("/")
}

export async function getActivityFeed(limit: number = 20) {
  const activity = await prisma.activityPost.findMany({
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      anime: {
        select: {
          id: true,
          title: true,
          coverImage: true,
        },
      },
      manga: {
        select: {
          id: true,
          title: true,
          coverImage: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return activity
}

