"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function getUserId(session: any): string {
  return (session?.user as any)?.id || session?.user?.id
}

export async function updateProfile(data: {
  username?: string
  bio?: string
  image?: string
  bannerImage?: string
}) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
    },
  })

  revalidatePath("/profile")
  revalidatePath(`/user/${data.username || userId}`)
}

export async function toggleFavoriteAnime(animeId: number) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  const existing = await prisma.userFavoriteAnime.findUnique({
    where: {
      userId_animeId: {
        userId: userId,
        animeId,
      },
    },
  })

  if (existing) {
    await prisma.userFavoriteAnime.delete({
      where: {
        userId_animeId: {
          userId: userId,
          animeId,
        },
      },
    })
  } else {
    await prisma.userFavoriteAnime.create({
      data: {
        userId: userId,
        animeId,
      },
    })
  }

  revalidatePath(`/anime/${animeId}`)
  revalidatePath(`/user/${userId}`)
}

export async function toggleFavoriteManga(mangaId: number) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  const existing = await prisma.userFavoriteManga.findUnique({
    where: {
      userId_mangaId: {
        userId: userId,
        mangaId,
      },
    },
  })

  if (existing) {
    await prisma.userFavoriteManga.delete({
      where: {
        userId_mangaId: {
          userId: userId,
          mangaId,
        },
      },
    })
  } else {
    await prisma.userFavoriteManga.create({
      data: {
        userId: userId,
        mangaId,
      },
    })
  }

  revalidatePath(`/manga/${mangaId}`)
  revalidatePath(`/user/${userId}`)
}

export async function isFavoriteAnime(animeId: number, userId: string): Promise<boolean> {
  const favorite = await prisma.userFavoriteAnime.findUnique({
    where: {
      userId_animeId: {
        userId,
        animeId,
      },
    },
  })
  return !!favorite
}

export async function isFavoriteManga(mangaId: number, userId: string): Promise<boolean> {
  const favorite = await prisma.userFavoriteManga.findUnique({
    where: {
      userId_mangaId: {
        userId,
        mangaId,
      },
    },
  })
  return !!favorite
}

