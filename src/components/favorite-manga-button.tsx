"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { toggleFavoriteManga } from "@/actions/profile"
import { Loader2 } from "lucide-react"

interface FavoriteButtonProps {
  mangaId: number
  isFavorite: boolean
  userId: string
}

export function FavoriteMangaButton({ mangaId, isFavorite: initialIsFavorite, userId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const newValue = !isFavorite
    setIsFavorite(newValue)
    
    startTransition(async () => {
      try {
        await toggleFavoriteManga(mangaId)
      } catch (error) {
        console.error("Failed to toggle favorite:", error)
        setIsFavorite(!newValue) // Revert on error
      }
    })
  }

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className="gap-2"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Star className={`h-4 w-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
      )}
      {isFavorite ? "Favorited" : "Favorite"}
    </Button>
  )
}

