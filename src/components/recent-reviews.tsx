import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { ReviewItem } from "@/components/review-item"

export async function RecentActivity() {
  const reviews = await prisma.review.findMany({
    take: 4,
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

  if (reviews.length === 0) {
    return null
  }

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

  return (
    <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {reviews.map((review) => {
          const item = review.anime || review.manga
          if (!item) return null
          
          const itemUrl = review.anime ? `/anime/${item.id}` : `/manga/${item.id}`
          const userUrl = `/user/${review.user.id}`
          
          return (
            <ReviewItem
              key={review.id}
              reviewId={review.id}
              itemUrl={itemUrl}
              itemTitle={item.title}
              itemCoverImage={item.coverImage}
              itemType={review.anime ? "anime" : "manga"}
              rating={review.rating}
              reviewText={review.review}
              userUrl={userUrl}
              userName={review.user.name}
              userUsername={review.user.username}
              userImage={review.user.image}
              formattedDate={formatDate(review.createdAt)}
            />
          )
        })}
      </CardContent>
    </Card>
  )
}

