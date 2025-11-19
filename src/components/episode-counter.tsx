"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { incrementAnimeEpisode, updateAnimeEpisode } from "@/actions/list"
import { Minus, Plus, Loader2 } from "lucide-react"

interface EpisodeCounterProps {
  animeId: number
  currentEpisode: number | null
  maxEpisodes: number | null
}

export function EpisodeCounter({ animeId, currentEpisode, maxEpisodes }: EpisodeCounterProps) {
  const [episode, setEpisode] = useState(currentEpisode || 1)
  const [isPending, startTransition] = useTransition()
  const [isManualInput, setIsManualInput] = useState(false)

  const handleIncrement = () => {
    const newEpisode = Math.min(episode + 1, maxEpisodes || Infinity)
    setEpisode(newEpisode)
    startTransition(async () => {
      try {
        await updateAnimeEpisode(animeId, newEpisode)
      } catch (error) {
        console.error("Failed to update episode:", error)
        setEpisode(currentEpisode || 1) // Revert on error
      }
    })
  }

  const handleDecrement = () => {
    const newEpisode = Math.max(episode - 1, 1)
    setEpisode(newEpisode)
    startTransition(async () => {
      try {
        await updateAnimeEpisode(animeId, newEpisode)
      } catch (error) {
        console.error("Failed to update episode:", error)
        setEpisode(currentEpisode || 1) // Revert on error
      }
    })
  }

  const handleManualUpdate = () => {
    const newEpisode = Math.max(1, Math.min(episode, maxEpisodes || Infinity))
    setEpisode(newEpisode)
    setIsManualInput(false)
    startTransition(async () => {
      try {
        await updateAnimeEpisode(animeId, newEpisode)
      } catch (error) {
        console.error("Failed to update episode:", error)
        setEpisode(currentEpisode || 1) // Revert on error
      }
    })
  }

  const handleQuickIncrement = () => {
    startTransition(async () => {
      try {
        await incrementAnimeEpisode(animeId)
        setEpisode((prev) => Math.min(prev + 1, maxEpisodes || Infinity))
      } catch (error) {
        console.error("Failed to increment episode:", error)
      }
    })
  }

  return (
    <div className="space-y-2 p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Current Episode</Label>
        {maxEpisodes && (
          <span className="text-xs text-muted-foreground">of {maxEpisodes}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={isPending || episode <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        {isManualInput ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={maxEpisodes || undefined}
              value={episode}
              onChange={(e) => setEpisode(parseInt(e.target.value) || 1)}
              onBlur={handleManualUpdate}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleManualUpdate()
                } else if (e.key === "Escape") {
                  setIsManualInput(false)
                  setEpisode(currentEpisode || 1)
                }
              }}
              className="w-20 text-center"
              autoFocus
            />
          </div>
        ) : (
          <div
            className="flex-1 text-center px-4 py-2 border rounded cursor-pointer hover:bg-accent"
            onClick={() => setIsManualInput(true)}
          >
            <span className="text-lg font-semibold">{episode}</span>
            {isPending && <Loader2 className="inline-block ml-2 h-4 w-4 animate-spin" />}
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={isPending || (maxEpisodes !== null && episode >= maxEpisodes)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="default"
        size="sm"
        className="w-full"
        onClick={handleQuickIncrement}
        disabled={isPending || (maxEpisodes !== null && episode >= maxEpisodes)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Next Episode
      </Button>
    </div>
  )
}

