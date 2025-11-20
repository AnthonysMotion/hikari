"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tv, ListChecks, BookOpen, Star, ArrowRight } from "lucide-react"
import { FadeIn, HoverCard } from "@/components/ui/motion"
import { motion } from "framer-motion"

interface QuickActionsProps {
  userId: string
}

export function QuickActions({ userId }: QuickActionsProps) {
  return (
    <FadeIn delay={0.2} direction="up">
      <HoverCard>
        <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Tv className="w-4 h-4 text-primary" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/anime-list">
              <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 group">
                <ListChecks className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                My Anime List
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/manga-list">
              <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 group">
                <BookOpen className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                My Manga List
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href={`/user/${userId}`}>
              <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 group">
                <Star className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                My Profile
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </HoverCard>
    </FadeIn>
  )
}

interface RecentReviewsProps {
  reviews: {
    id: string
    rating: number
    anime: { id: number; title: string; coverImage: string | null } | null
    manga: { id: number; title: string; coverImage: string | null } | null
  }[]
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  if (reviews.length === 0) return null

  return (
    <FadeIn delay={0.3} direction="up">
      <HoverCard>
        <Card className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm h-full">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviews.slice(0, 3).map((review) => {
              const item = review.anime || review.manga
              if (!item) return null
              
              return (
                <Link
                  key={review.id}
                  href={review.anime ? `/anime/${item.id}` : `/manga/${item.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 group"
                >
                  {item.coverImage && (
                    <div className="relative w-12 h-16 rounded overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate group-hover:text-primary transition-colors">{item.title}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </HoverCard>
    </FadeIn>
  )
}

