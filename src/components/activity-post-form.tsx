"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { createActivityPost } from "@/actions/activity"
import { useRouter } from "next/navigation"

export function ActivityPostForm() {
  const [content, setContent] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() || content.length > 500) {
      return
    }

    startTransition(async () => {
      try {
        await createActivityPost(content)
        setContent("")
        router.refresh()
      } catch (error) {
        console.error("Failed to create activity post:", error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
        className="min-h-[100px] resize-none border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm focus:border-primary/50"
        disabled={isPending}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length}/500
        </span>
        <Button
          type="submit"
          disabled={!content.trim() || content.length > 500 || isPending}
          className="gap-2"
        >
          <Send className="w-4 h-4" />
          Post
        </Button>
      </div>
    </form>
  )
}

