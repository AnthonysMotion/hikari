"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, Target, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { updateChallengeProgress } from "@/actions/challenges"

interface ChallengeCardProps {
  challenge: {
    id: string
    code: string
    name: string
    description: string
    type: string
    category: string
    target: number
    targetGenre: string | null
    xpReward: number
    startDate: Date
    endDate: Date
    userProgress: {
      id: string
      progress: number
      completed: boolean
      completedAt: Date | null
    } | null
  }
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const [progress, setProgress] = useState(challenge.userProgress?.progress || 0)
  const [isLoading, setIsLoading] = useState(false)

  const progressPercent = Math.min(100, (progress / challenge.target) * 100)
  const timeRemaining = new Date(challenge.endDate).getTime() - Date.now()
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const updated = await updateChallengeProgress(challenge.id)
      if (updated) {
        setProgress(updated.progress)
      }
    } catch (error) {
      console.error("Failed to update challenge:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`${challenge.userProgress?.completed ? "border-primary/50 bg-primary/5" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{challenge.name}</CardTitle>
              <Badge variant={challenge.type === "daily" ? "default" : "secondary"}>
                {challenge.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
          </div>
          {challenge.userProgress?.completed && (
            <Trophy className="w-6 h-6 text-primary flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">
              {progress} / {challenge.target}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{daysRemaining > 0 ? `${daysRemaining} days left` : "Expired"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-semibold">+{challenge.xpReward} XP</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || challenge.userProgress?.completed}
          className="w-full"
        >
          {isLoading ? "Updating..." : challenge.userProgress?.completed ? "Completed!" : "Update Progress"}
        </Button>
      </CardContent>
    </Card>
  )
}

interface ChallengesListProps {
  challenges: ChallengeCardProps["challenge"][]
}

export function ChallengesList({ challenges }: ChallengesListProps) {
  if (challenges.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No active challenges at the moment!</p>
          <p className="text-sm mt-2">Check back later for new daily and weekly challenges.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  )
}

