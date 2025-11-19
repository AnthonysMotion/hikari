"use client"

import { useState, useTransition } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addToMangaList, removeFromMangaList } from "@/actions/list"
import { Loader2 } from "lucide-react"

type MangaStatus = "READING" | "PLANNING" | "DROPPED" | "COMPLETED" | "PAUSED" | null

interface ListStatusSelectorProps {
  mangaId: number
  currentStatus: MangaStatus
}

export function MangaListStatusSelector({ mangaId, currentStatus }: ListStatusSelectorProps) {
  const [status, setStatus] = useState<MangaStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (value: string) => {
    const newStatus = value === "none" ? null : (value as MangaStatus)
    setStatus(newStatus)
    
    startTransition(async () => {
      try {
        if (newStatus === null) {
          await removeFromMangaList(mangaId)
        } else {
          await addToMangaList(mangaId, newStatus)
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
          <SelectItem value="READING">Reading</SelectItem>
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

