import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Award, Star, Target, Zap } from "lucide-react"
import { getXPProgress } from "@/lib/gamification"

interface LevelProgressProps {
  level: number
  xp: number
}

export function LevelProgress({ level, xp }: LevelProgressProps) {
  const progress = getXPProgress(xp, level)

  return (
    <Card className="border-primary/20 dark:border-primary/10 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          Level {level}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">XP Progress</span>
            <span className="font-bold">
              {progress.current} / {progress.next} XP
            </span>
          </div>
          <Progress value={progress.percent} className="h-3 bg-primary/20" />
        </div>
        <div className="flex items-center gap-4 text-sm p-3 rounded-lg bg-primary/5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-bold text-lg">{xp.toLocaleString()}</span>
            <span className="text-muted-foreground">Total XP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AchievementsListProps {
  achievements: Array<{
    id: string
    unlockedAt: Date
    achievement: {
      id: string
      name: string
      description: string
      icon: string | null
      rarity: string
      category: string
      xpReward: number
    }
  }>
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const rarityColors = {
    common: "bg-gray-500/20 border-gray-500/50 text-gray-300",
    rare: "bg-blue-500/20 border-blue-500/50 text-blue-300",
    epic: "bg-purple-500/20 border-purple-500/50 text-purple-300",
    legendary: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
  }

  if (achievements.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No achievements unlocked yet!</p>
          <p className="text-sm mt-2">Keep watching and completing anime/manga to unlock achievements.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((userAchievement) => {
        const { achievement } = userAchievement
        return (
          <Card
            key={userAchievement.id}
            className={`border-2 overflow-hidden transition-all hover:scale-105 hover:shadow-lg duration-300 ${
              rarityColors[achievement.rarity as keyof typeof rarityColors] || rarityColors.common
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="text-4xl">{achievement.icon || "🏆"}</div>
                <Badge variant="outline" className="text-xs">
                  {achievement.rarity}
                </Badge>
              </div>
              <CardTitle className="text-lg">{achievement.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              {achievement.xpReward > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span>+{achievement.xpReward} XP</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground/70">
                Unlocked {new Date(userAchievement.unlockedAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

interface BadgesListProps {
  badges: Array<{
    id: string
    earnedAt: Date
    badge: {
      id: string
      name: string
      description: string
      icon: string | null
      rarity: string
      category: string
    }
  }>
}

export function BadgesList({ badges }: BadgesListProps) {
  const rarityColors = {
    common: "bg-gray-500/20 border-gray-500/50",
    rare: "bg-blue-500/20 border-blue-500/50",
    epic: "bg-purple-500/20 border-purple-500/50",
    legendary: "bg-yellow-500/20 border-yellow-500/50",
  }

  if (badges.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No badges earned yet!</p>
          <p className="text-sm mt-2">Complete genre-specific goals to earn badges.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {badges.map((userBadge) => {
        const { badge } = userBadge
        return (
          <Card
            key={userBadge.id}
            className={`border-2 overflow-hidden transition-all hover:scale-110 hover:shadow-lg duration-300 ${
              rarityColors[badge.rarity as keyof typeof rarityColors] || rarityColors.common
            }`}
          >
            <CardContent className="p-4 text-center space-y-2">
              <div className="text-5xl mb-2">{badge.icon || "🏅"}</div>
              <h4 className="font-semibold text-sm">{badge.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{badge.description}</p>
              <Badge variant="outline" className="text-xs">
                {badge.rarity}
              </Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

