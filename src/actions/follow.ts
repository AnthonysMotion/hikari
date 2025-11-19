"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createActivityPost } from "./activity"

function getUserId(session: any): string {
  return (session?.user as any)?.id || session?.user?.id
}

export async function followUser(userIdToFollow: string) {
  const session = await auth()
  const currentUserId = getUserId(session)

  if (!session?.user || !currentUserId) {
    throw new Error("Unauthorized")
  }

  if (currentUserId === userIdToFollow) {
    throw new Error("Cannot follow yourself")
  }

  // Check if already following
  const existingFollow = await (prisma as any).follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: userIdToFollow,
      },
    },
  })

  if (existingFollow) {
    return { success: true, message: "Already following" }
  }

  // Create follow relationship
  await (prisma as any).follow.create({
    data: {
      followerId: currentUserId,
      followingId: userIdToFollow,
    },
  })

  // Create activity post when someone follows you
  const followedUser = await prisma.user.findUnique({
    where: { id: userIdToFollow },
    select: { name: true, username: true },
  })

  if (followedUser) {
    // Note: This creates an activity from the followed user's perspective
    // showing that they gained a follower. We'll handle this differently
    // by showing "followed" activities from the follower's perspective in the feed
  }

  revalidatePath(`/user/${userIdToFollow}`)
  revalidatePath(`/user/${currentUserId}`)
  revalidatePath("/")

  return { success: true, message: "Successfully followed user" }
}

export async function unfollowUser(userIdToUnfollow: string) {
  const session = await auth()
  const currentUserId = getUserId(session)

  if (!session?.user || !currentUserId) {
    throw new Error("Unauthorized")
  }

  await (prisma as any).follow.delete({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: userIdToUnfollow,
      },
    },
  })

  revalidatePath(`/user/${userIdToUnfollow}`)
  revalidatePath(`/user/${currentUserId}`)
  revalidatePath("/")

  return { success: true, message: "Successfully unfollowed user" }
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const follow = await (prisma as any).follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  })

  return !!follow
}

export async function getFollowerCount(userId: string): Promise<number> {
  return await (prisma as any).follow.count({
    where: {
      followingId: userId,
    },
  })
}

export async function getFollowingCount(userId: string): Promise<number> {
  return await (prisma as any).follow.count({
    where: {
      followerId: userId,
    },
  })
}

export async function getFollowingIds(userId: string): Promise<string[]> {
  const follows = await (prisma as any).follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  })

  return follows.map((f: any) => f.followingId)
}

