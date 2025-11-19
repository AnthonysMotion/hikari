"use server"

import { prisma } from "@/lib/prisma"
import { ACHIEVEMENTS, BADGES, getLevelFromXP, getXPForLevel } from "@/lib/gamification"

export async function checkAndAwardAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      animeList: {
        include: { anime: { include: { genres: true } } },
      },
      mangaList: {
        include: { manga: { include: { genres: true } } },
      },
      reviews: true,
      favoriteAnime: true,
      favoriteManga: true,
      achievements: {
        include: { achievement: true },
      },
      badges: {
        include: { badge: true },
      },
    },
  })

  if (!user) return

  let xpGained = 0
  const newlyUnlocked: string[] = []

  // Get all existing achievement codes
  const existingCodes = new Set(
    user.achievements.map((ua) => ua.achievement.code)
  )

  // Check completion achievements
  const completed = [
    ...user.animeList.filter((a) => a.status === "COMPLETED"),
    ...user.mangaList.filter((m) => m.status === "COMPLETED"),
  ]
  const completedCount = completed.length

  const completionChecks = [
    { code: "first_complete", threshold: 1 },
    { code: "ten_complete", threshold: 10 },
    { code: "fifty_complete", threshold: 50 },
    { code: "hundred_complete", threshold: 100 },
    { code: "five_hundred_complete", threshold: 500 },
  ]

  for (const check of completionChecks) {
    if (!existingCodes.has(check.code) && completedCount >= check.threshold) {
      const achievement = ACHIEVEMENTS.find((a) => a.code === check.code)
      if (achievement) {
        await unlockAchievement(userId, achievement.code)
        xpGained += achievement.xpReward
        newlyUnlocked.push(achievement.name)
      }
    }
  }

  // Check genre achievements
  const genreCounts: Record<string, number> = {}
  completed.forEach((item) => {
    const genres = "anime" in item ? item.anime.genres : item.manga.genres
    genres.forEach((g) => {
      genreCounts[g.name] = (genreCounts[g.name] || 0) + 1
    })
  })

  const uniqueGenres = Object.keys(genreCounts).length

  if (!existingCodes.has("genre_explorer") && uniqueGenres >= 10) {
    const achievement = ACHIEVEMENTS.find((a) => a.code === "genre_explorer")
    if (achievement) {
      await unlockAchievement(userId, achievement.code)
      xpGained += achievement.xpReward
      newlyUnlocked.push(achievement.name)
    }
  }

  if (!existingCodes.has("genre_master") && uniqueGenres >= 20) {
    const achievement = ACHIEVEMENTS.find((a) => a.code === "genre_master")
    if (achievement) {
      await unlockAchievement(userId, achievement.code)
      xpGained += achievement.xpReward
      newlyUnlocked.push(achievement.name)
    }
  }

  // Genre-specific achievements
  const genreChecks = [
    { code: "action_fan", genre: "Action", threshold: 20 },
    { code: "romance_fan", genre: "Romance", threshold: 20 },
    { code: "comedy_fan", genre: "Comedy", threshold: 20 },
  ]

  for (const check of genreChecks) {
    if (!existingCodes.has(check.code) && (genreCounts[check.genre] || 0) >= check.threshold) {
      const achievement = ACHIEVEMENTS.find((a) => a.code === check.code)
      if (achievement) {
        await unlockAchievement(userId, achievement.code)
        xpGained += achievement.xpReward
        newlyUnlocked.push(achievement.name)
      }
    }
  }

  // Review achievements
  const reviewCount = user.reviews.length

  if (!existingCodes.has("first_review") && reviewCount >= 1) {
    const achievement = ACHIEVEMENTS.find((a) => a.code === "first_review")
    if (achievement) {
      await unlockAchievement(userId, achievement.code)
      xpGained += achievement.xpReward
      newlyUnlocked.push(achievement.name)
    }
  }

  if (!existingCodes.has("ten_reviews") && reviewCount >= 10) {
    const achievement = ACHIEVEMENTS.find((a) => a.code === "ten_reviews")
    if (achievement) {
      await unlockAchievement(userId, achievement.code)
      xpGained += achievement.xpReward
      newlyUnlocked.push(achievement.name)
    }
  }

  if (!existingCodes.has("fifty_reviews") && reviewCount >= 50) {
    const achievement = ACHIEVEMENTS.find((a) => a.code === "fifty_reviews")
    if (achievement) {
      await unlockAchievement(userId, achievement.code)
      xpGained += achievement.xpReward
      newlyUnlocked.push(achievement.name)
    }
  }

  // Favorite achievements
  const favoriteCount = user.favoriteAnime.length + user.favoriteManga.length

  if (!existingCodes.has("first_favorite") && favoriteCount >= 1) {
    const achievement = ACHIEVEMENTS.find((a) => a.code === "first_favorite")
    if (achievement) {
      await unlockAchievement(userId, achievement.code)
      xpGained += achievement.xpReward
      newlyUnlocked.push(achievement.name)
    }
  }

  if (!existingCodes.has("ten_favorites") && favoriteCount >= 10) {
    const achievement = ACHIEVEMENTS.find((a) => a.code === "ten_favorites")
    if (achievement) {
      await unlockAchievement(userId, achievement.code)
      xpGained += achievement.xpReward
      newlyUnlocked.push(achievement.name)
    }
  }

  // Update XP and level first
  let newXP = user.xp + xpGained
  let newLevel = getLevelFromXP(newXP)

  if (xpGained > 0 || newLevel > user.level) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXP,
        level: newLevel,
      },
    })
  }

  // Check level achievements after XP update
  const levelChecks = [10, 25, 50, 100]

  for (const level of levelChecks) {
    const code = `level_${level}` as const
    if (!existingCodes.has(code) && newLevel >= level) {
      const achievement = ACHIEVEMENTS.find((a) => a.code === code)
      if (achievement) {
        await unlockAchievement(userId, achievement.code)
        newlyUnlocked.push(achievement.name)
      }
    }
  }

  // Check badges
  const existingBadgeCodes = new Set(
    user.badges.map((ub) => ub.badge.code)
  )

  // Genre badges
  const badgeChecks = [
    { code: "badge_action", genre: "Action", threshold: 50 },
    { code: "badge_romance", genre: "Romance", threshold: 50 },
    { code: "badge_comedy", genre: "Comedy", threshold: 50 },
    { code: "badge_fantasy", genre: "Fantasy", threshold: 50 },
    { code: "badge_sci_fi", genre: "Sci-Fi", threshold: 50 },
    { code: "badge_horror", genre: "Horror", threshold: 30 },
  ]

  for (const check of badgeChecks) {
    if (!existingBadgeCodes.has(check.code) && (genreCounts[check.genre] || 0) >= check.threshold) {
      await unlockBadge(userId, check.code)
      newlyUnlocked.push(`${check.code.replace("badge_", "").replace("_", " ")} Badge`)
    }
  }

  return { xpGained, newlyUnlocked }
}

async function unlockAchievement(userId: string, achievementCode: string) {
  // Find or create achievement
  const achievementData = ACHIEVEMENTS.find((a) => a.code === achievementCode)
  if (!achievementData) return

  let achievement = await prisma.achievement.findUnique({
    where: { code: achievementCode },
  })

  if (!achievement) {
    achievement = await prisma.achievement.create({
      data: {
        code: achievementData.code,
        name: achievementData.name,
        description: achievementData.description,
        icon: achievementData.icon || null,
        xpReward: achievementData.xpReward,
        category: achievementData.category,
        rarity: achievementData.rarity,
      },
    })
  }

  // Check if user already has it
  const existing = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id,
      },
    },
  })

  if (!existing) {
    await prisma.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
      },
    })
  }
}

async function unlockBadge(userId: string, badgeCode: string) {
  const badgeData = BADGES.find((b) => b.code === badgeCode)
  if (!badgeData) return

  let badge = await prisma.badge.findUnique({
    where: { code: badgeCode },
  })

  if (!badge) {
    badge = await prisma.badge.create({
      data: {
        code: badgeData.code,
        name: badgeData.name,
        description: badgeData.description,
        icon: badgeData.icon || null,
        category: badgeData.category,
        rarity: badgeData.rarity,
      },
    })
  }

  const existing = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId: badge.id,
      },
    },
  })

  if (!existing) {
    await prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
    })
  }
}

export async function addXP(userId: string, amount: number, reason?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) return

  const newXP = user.xp + amount
  const newLevel = getLevelFromXP(newXP)
  const levelUp = newLevel > user.level

  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXP,
      level: newLevel,
    },
  })

  // Check achievements after XP gain
  await checkAndAwardAchievements(userId)

  return { newXP, newLevel, levelUp }
}

