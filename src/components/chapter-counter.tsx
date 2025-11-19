"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { incrementMangaChapter, updateMangaChapter } from "@/actions/list"
import { Minus, Plus } from "lucide-react"
import { Loader2 } from "lucide-react"

interface ChapterCounterProps {
  mangaId: number
  currentChapter: number | null
  maxChapters: number | null
}

export function ChapterCounter({ mangaId, currentChapter, maxChapters }: ChapterCounterProps) {
  const [chapter, setChapter] = useState(currentChapter || 1)
  const [isPending, startTransition] = useTransition()
  const [isManualInput, setIsManualInput] = useState(false)

  const handleIncrement = () => {
    const newChapter = Math.min(chapter + 1, maxChapters || Infinity)
    setChapter(newChapter)
    startTransition(async () => {
      try {
        await updateMangaChapter(mangaId, newChapter)
      } catch (error) {
        console.error("Failed to update chapter:", error)
        setChapter(currentChapter || 1) // Revert on error
      }
    })
  }

  const handleDecrement = () => {
    const newChapter = Math.max(chapter - 1, 1)
    setChapter(newChapter)
    startTransition(async () => {
      try {
        await updateMangaChapter(mangaId, newChapter)
      } catch (error) {
        console.error("Failed to update chapter:", error)
        setChapter(currentChapter || 1) // Revert on error
      }
    })
  }

  const handleManualUpdate = () => {
    const newChapter = Math.max(1, Math.min(chapter, maxChapters || Infinity))
    setChapter(newChapter)
    setIsManualInput(false)
    startTransition(async () => {
      try {
        await updateMangaChapter(mangaId, newChapter)
      } catch (error) {
        console.error("Failed to update chapter:", error)
        setChapter(currentChapter || 1) // Revert on error
      }
    })
  }

  const handleQuickIncrement = () => {
    startTransition(async () => {
      try {
        await incrementMangaChapter(mangaId)
        setChapter((prev) => Math.min(prev + 1, maxChapters || Infinity))
      } catch (error) {
        console.error("Failed to increment chapter:", error)
      }
    })
  }

  return (
    <div className="space-y-2 p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Current Chapter</Label>
        {maxChapters && (
          <span className="text-xs text-muted-foreground">of {maxChapters}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={isPending || chapter <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        {isManualInput ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={maxChapters || undefined}
              value={chapter}
              onChange={(e) => setChapter(parseInt(e.target.value) || 1)}
              onBlur={handleManualUpdate}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleManualUpdate()
                } else if (e.key === "Escape") {
                  setIsManualInput(false)
                  setChapter(currentChapter || 1)
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
            <span className="text-lg font-semibold">{chapter}</span>
            {isPending && <Loader2 className="inline-block ml-2 h-4 w-4 animate-spin" />}
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={isPending || (maxChapters !== null && chapter >= maxChapters)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="default"
        size="sm"
        className="w-full"
        onClick={handleQuickIncrement}
        disabled={isPending || (maxChapters !== null && chapter >= maxChapters)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Next Chapter
      </Button>
    </div>
  )
}

