import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FollowButton } from "@/components/follow-button"
import { isFollowing } from "@/actions/follow"

function getUserId(session: any): string | null {
  return (session?.user as any)?.id || session?.user?.id || null
}

export default async function FollowingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const currentUserId = getUserId(session)

  if (!currentUserId) {
    redirect("/login")
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: id },
        { username: id },
      ],
    },
  })

  if (!user) {
    notFound()
  }

  // Get following list
  const follows = await (prisma as any).follow.findMany({
    where: {
      followerId: user.id,
    },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Check follow status for each following
  const followingWithStatus = await Promise.all(
    follows.map(async (follow: any) => {
      const isFollowingUser = currentUserId ? await isFollowing(currentUserId, follow.following.id) : false
      return {
        ...follow.following,
        isFollowing: isFollowingUser,
      }
    })
  )

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <Link href={`/user/${user.id}`}>
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Following</h1>
          <p className="text-muted-foreground">
            {followingWithStatus.length} {followingWithStatus.length === 1 ? 'user' : 'users'}
          </p>
        </div>

        <div className="space-y-3">
          {followingWithStatus.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Not following anyone yet</p>
                <p className="text-sm mt-2">Start following users to see their activity in your feed!</p>
              </CardContent>
            </Card>
          ) : (
            followingWithStatus.map((following: any) => (
              <Card key={following.id} className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <Link href={`/user/${following.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={following.image || ""} alt={following.name || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {(following.name || following.username || "U")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold group-hover:text-primary transition-colors truncate">
                          {following.name || following.username || "User"}
                        </p>
                        {following.username && (
                          <p className="text-sm text-muted-foreground truncate">@{following.username}</p>
                        )}
                      </div>
                    </Link>
                    {following.id !== currentUserId && (
                      <FollowButton userId={following.id} isFollowing={following.isFollowing} />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

