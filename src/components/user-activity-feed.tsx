import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, Tv, BookOpen } from "lucide-react"
import { getUserActivityFeed } from "@/actions/activity"
import Link from "next/link"

function formatDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

interface UserActivityFeedProps {
  userId: string
}

export async function UserActivityFeed({ userId }: UserActivityFeedProps) {
  const activities = await getUserActivityFeed(userId, 20)

  if (activities.length === 0) {
    return null
  }

  return (
    <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Activity Feed - Scrollable */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-3 p-4 rounded-lg border border-white/10 dark:border-white/5 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all"
            >
              {/* User Avatar */}
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={activity.user.image || ""} alt={activity.user.name || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {(activity.user.name || activity.user.username || "U")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {activity.user.name || activity.user.username || "Anonymous"}
                    </span>
                    {activity.type === "post" && (
                      <span className="text-xs text-muted-foreground">posted</span>
                    )}
                    {activity.type === "episode" && (
                      <>
                        <span className="text-xs text-muted-foreground">watched</span>
                        <span className="text-xs font-medium text-primary">Episode {activity.episode}</span>
                      </>
                    )}
                    {activity.type === "chapter" && (
                      <>
                        <span className="text-xs text-muted-foreground">read</span>
                        <span className="text-xs font-medium text-primary">Chapter {activity.chapter}</span>
                      </>
                    )}
                    {activity.type === "dropped" && (
                      <span className="text-xs text-muted-foreground">dropped</span>
                    )}
                    {activity.type === "planning" && (
                      <span className="text-xs text-muted-foreground">added to plan</span>
                    )}
                    {activity.type === "paused" && (
                      <span className="text-xs text-muted-foreground">paused</span>
                    )}
                    {activity.type === "completed" && (
                      <span className="text-xs text-muted-foreground">completed</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(activity.createdAt)}
                  </span>
                </div>

                {/* Post Content */}
                {activity.type === "post" && activity.content && (
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words mb-2">
                    {activity.content}
                  </p>
                )}

                {/* Anime/Manga Card */}
                {(activity.anime || activity.manga) && (
                  <Link
                    href={activity.anime ? `/anime/${activity.anime.id}` : `/manga/${activity.manga?.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group mt-2"
                  >
                    {(activity.anime?.coverImage || activity.manga?.coverImage) ? (
                      <div className="relative w-12 h-16 rounded overflow-hidden shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
                        <img
                          src={(activity.anime || activity.manga)?.coverImage || ""}
                          alt={(activity.anime || activity.manga)?.title || ""}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-16 rounded bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center flex-shrink-0">
                        {activity.anime ? (
                          <Tv className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {(activity.anime || activity.manga)?.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.anime ? "Anime" : "Manga"}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

