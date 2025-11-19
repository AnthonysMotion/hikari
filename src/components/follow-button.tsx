"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"
import { followUser, unfollowUser } from "@/actions/follow"
import { useRouter } from "next/navigation"

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
}

export function FollowButton({ userId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleFollow = () => {
    startTransition(async () => {
      try {
        if (isFollowing) {
          await unfollowUser(userId)
          setIsFollowing(false)
        } else {
          await followUser(userId)
          setIsFollowing(true)
        }
        router.refresh()
      } catch (error) {
        console.error("Failed to toggle follow:", error)
      }
    })
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isPending}
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className="gap-2"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </Button>
  )
}

