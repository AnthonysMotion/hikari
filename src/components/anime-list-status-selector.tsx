"use client"

import { useState, useTransition } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { addToAnimeList, removeFromAnimeList } from "@/actions/list"
import { Loader2 } from "lucide-react"

type AnimeStatus = "WATCHING" | "PLANNING" | "DROPPED" | "COMPLETED" | "PAUSED" | null

interface ListStatusSelectorProps {
  animeId: number
  currentStatus: AnimeStatus
}

export function AnimeListStatusSelector({ animeId, currentStatus }: ListStatusSelectorProps) {
  const [status, setStatus] = useState<AnimeStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (value: string) => {
    const newStatus = value === "none" ? null : (value as AnimeStatus)
    setStatus(newStatus)
    
    startTransition(async () => {
      try {
        if (newStatus === null) {
          await removeFromAnimeList(animeId)
        } else {
          await addToAnimeList(animeId, newStatus)
        }
      } catch (error) {
        console.error("Failed to update list status:", error)
        setStatus(currentStatus) // Revert on error
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status || "none"}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Add to list" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Not in list</SelectItem>
          <SelectItem value="WATCHING">Watching</SelectItem>
          <SelectItem value="PLANNING">Planning</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="PAUSED">Paused</SelectItem>
          <SelectItem value="DROPPED">Dropped</SelectItem>
        </SelectContent>
      </Select>
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  )
}

