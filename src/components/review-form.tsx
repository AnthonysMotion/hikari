"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitReview } from "@/actions/list"
import { Star } from "lucide-react"
import { Loader2 } from "lucide-react"

interface ReviewFormProps {
  animeId: number | null
  mangaId: number | null
  existingReview?: {
    rating: number
    review: string | null
  } | null
}

export function ReviewForm({ animeId, mangaId, existingReview }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [review, setReview] = useState(existingReview?.review || "")
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        await submitReview(animeId, mangaId, rating, review)
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 2000)
      } catch (error) {
        console.error("Failed to submit review:", error)
        alert(error instanceof Error ? error.message : "Failed to submit review")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg border bg-card">
      <div>
        <Label className="text-sm font-semibold mb-2 block">Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating > 0 && `${rating}/5`}
          </span>
        </div>
      </div>
      <div>
        <Label htmlFor="review-text" className="text-sm font-semibold mb-2 block">
          Review
        </Label>
        <Textarea
          id="review-text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here..."
          rows={5}
          className="resize-none"
        />
      </div>
      <Button type="submit" disabled={isPending || rating === 0}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : submitted ? (
          "Review Saved!"
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  )
}

