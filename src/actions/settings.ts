"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function getUserId(session: any): string | null {
  return (session?.user as any)?.id || session?.user?.id || null
}

export async function updateSettings(data: {
  accentColor?: string | null
}) {
  const session = await auth()
  const userId = getUserId(session)

  if (!session?.user || !userId) {
    throw new Error("Unauthorized")
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      accentColor: data.accentColor || null,
    },
  })

  revalidatePath("/settings")
  revalidatePath("/")
}

export async function getUserSettings() {
  const session = await auth()
  const userId = getUserId(session)

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      accentColor: true,
    },
  })

  return user
}

