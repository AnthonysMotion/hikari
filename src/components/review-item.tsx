"use client"

import Link from "next/link"
import { Star, Tv, BookOpen } from "lucide-react"
import { UserLink } from "@/components/user-link"

interface ReviewItemProps {
  reviewId: number
  itemUrl: string
  itemTitle: string
  itemCoverImage: string | null
  itemType: "anime" | "manga"
  rating: number
  reviewText: string | null
  userUrl: string
  userName: string | null
  userUsername: string | null
  userImage: string | null
  formattedDate: string
}

export function ReviewItem({
  reviewId,
  itemUrl,
  itemTitle,
  itemCoverImage,
  itemType,
  rating,
  reviewText,
  userUrl,
  userName,
  userUsername,
  userImage,
  formattedDate,
}: ReviewItemProps) {
  return (
    <Link
      key={reviewId}
      href={itemUrl}
      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-primary/10 transition-all duration-200 group border border-transparent hover:border-primary/20"
    >
      {itemCoverImage ? (
        <div className="relative w-10 h-14 rounded overflow-hidden shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
          <img
            src={itemCoverImage}
            alt={itemTitle}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-10 h-14 rounded bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center flex-shrink-0">
          {itemType === "anime" ? (
            <Tv className="w-4 h-4 text-muted-foreground" />
          ) : (
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="font-semibold text-xs line-clamp-1 group-hover:text-primary transition-colors">
            {itemTitle}
          </p>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 ${
                  i < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px]" onClick={(e) => e.stopPropagation()}>
          <UserLink 
            href={userUrl}
            image={userImage}
            name={userName}
            username={userUsername}
          />
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{formattedDate}</span>
        </div>
      </div>
    </Link>
  )
}

