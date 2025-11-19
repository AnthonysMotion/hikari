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

  // Verify anime exists
  const anime = await prisma.anime.findUnique({
    where: { id: animeId },
    select: { episodes: true, title: true },
  })

  if (!anime) return

  // Check if we already created an activity for this episode recently (within last 5 minutes)
  // This prevents duplicate activities if the function is called multiple times quickly
  const recentActivity = await prisma.activityPost.findFirst({
    where: {
      userId,
      type: "episode",
      animeId,
      episode,
      createdAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
      },
    },
  })

  if (recentActivity) return

  // Create activity for every episode increment
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

  // Verify manga exists
  const manga = await prisma.manga.findUnique({
    where: { id: mangaId },
    select: { chapters: true, title: true },
  })

  if (!manga) return

  // Check if we already created an activity for this chapter recently (within last 5 minutes)
  // This prevents duplicate activities if the function is called multiple times quickly
  const recentActivity = await prisma.activityPost.findFirst({
    where: {
      userId,
      type: "chapter",
      mangaId,
      chapter,
      createdAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
      },
    },
  })

  if (recentActivity) return

  // Create activity for every chapter increment
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

export async function createStatusActivity(
  type: "anime" | "manga",
  itemId: number,
  status: string
) {
  const session = await auth()
  const userId = getUserId(session)

  if (!session?.user || !userId) {
    return
  }

  // Only create activity for status changes (DROPPED, PLANNING, PAUSED, COMPLETED)
  if (!["DROPPED", "PLANNING", "PAUSED", "COMPLETED"].includes(status)) {
    return
  }

  // Check if we already created an activity for this status change recently (within last 5 minutes)
  const recentActivity = await prisma.activityPost.findFirst({
    where: {
      userId,
      type: status.toLowerCase(),
      ...(type === "anime" ? { animeId: itemId } : { mangaId: itemId }),
      createdAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
      },
    },
  })

  if (recentActivity) return

  // Create activity for status change
  await prisma.activityPost.create({
    data: {
      userId,
      type: status.toLowerCase(),
      ...(type === "anime" ? { animeId: itemId } : { mangaId: itemId }),
    },
  })

  revalidatePath("/")
  revalidatePath(`/user/${userId}`)
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

export async function getUserActivityFeed(userId: string, limit: number = 20) {
  const activity = await prisma.activityPost.findMany({
    where: {
      userId,
    },
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

