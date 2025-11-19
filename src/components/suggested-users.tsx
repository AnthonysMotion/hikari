import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FollowButton } from "@/components/follow-button"
import { Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getFollowerCount, getFollowingCount, isFollowing } from "@/actions/follow"
import Link from "next/link"

interface SuggestedUsersProps {
  currentUserId: string
  limit?: number
}

export async function SuggestedUsers({ currentUserId, limit = 5 }: SuggestedUsersProps) {
  // Get users that the current user is not following
  const following = await (prisma as any).follow.findMany({
    where: {
      followerId: currentUserId,
    },
    select: {
      followingId: true,
    },
  })

  const followingIds = new Set(following.map((f: any) => f.followingId as string))
  followingIds.add(currentUserId) // Exclude self

  // Get suggested users (not following, ordered by follower count)
  const allUsers = await prisma.user.findMany({
    where: {
      id: {
        notIn: Array.from(followingIds) as string[],
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
    take: limit + 10, // Get more to filter
  })

  // Get follower counts and check follow status
  const usersWithStats = await Promise.all(
    allUsers.slice(0, limit).map(async (user) => {
      const [followerCount, followingCount, isFollowingUser] = await Promise.all([
        getFollowerCount(user.id),
        getFollowingCount(user.id),
        isFollowing(currentUserId, user.id),
      ])

      return {
        ...user,
        followerCount,
        followingCount,
        isFollowing: isFollowingUser,
      }
    })
  )

  // Sort by follower count (popularity)
  usersWithStats.sort((a, b) => b.followerCount - a.followerCount)

  if (usersWithStats.length === 0) {
    return null
  }

  return (
    <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          Suggested Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {usersWithStats.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-white/10 dark:border-white/5 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all"
          >
            <Link href={`/user/${user.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {(user.name || user.username || "U")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {user.name || user.username || "User"}
                </p>
                {user.username && (
                  <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {user.followerCount} {user.followerCount === 1 ? 'follower' : 'followers'}
                </p>
              </div>
            </Link>
            <FollowButton userId={user.id} isFollowing={user.isFollowing} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

