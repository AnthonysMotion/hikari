import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface ReviewsSectionProps {
  animeId: number | null
  mangaId: number | null
}

export async function ReviewsSection({ animeId, mangaId }: ReviewsSectionProps) {
  const reviews = await prisma.review.findMany({
    where: {
      ...(animeId ? { animeId } : { mangaId }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  if (reviews.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 rounded-lg border bg-card space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={review.user.image || ""} alt={review.user.name || "User"} />
                <AvatarFallback>
                  {review.user.name?.[0] || review.user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">{review.user.name || "Anonymous"}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-1">{review.rating}/5</span>
                </div>
              </div>
              <time className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </time>
            </div>
            {review.review && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {review.review}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

