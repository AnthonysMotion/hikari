"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { addXP } from "@/lib/achievements"

function getUserId(session: any): string | null {
  return (session?.user as any)?.id || session?.user?.id || null
}

export async function getActiveChallenges() {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!userId) return []

  const now = new Date()
  
  // Get active challenges
  const challenges = await prisma.challenge.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: {
      users: {
        where: { userId },
        take: 1,
      },
    },
    orderBy: {
      startDate: 'desc',
    },
  })

  return challenges.map((challenge) => ({
    ...challenge,
    userProgress: challenge.users[0] || null,
  }))
}

export async function getUserChallenges() {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!userId) return []

  const userChallenges = await prisma.userChallenge.findMany({
    where: { userId },
    include: {
      challenge: true,
    },
    orderBy: {
      startedAt: 'desc',
    },
  })

  return userChallenges
}

export async function updateChallengeProgress(challengeId: string) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      animeList: {
        include: { anime: { include: { genres: true } } },
      },
      mangaList: {
        include: { manga: { include: { genres: true } } },
      },
    },
  })

  if (!user) throw new Error("User not found")

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
  })

  if (!challenge || !challenge.isActive) return

  let progress = 0

  // Calculate progress based on challenge type
  if (challenge.category === "genre" && challenge.targetGenre) {
    const completed = [
      ...user.animeList.filter((a) => a.status === "COMPLETED"),
      ...user.mangaList.filter((m) => m.status === "COMPLETED"),
    ]
    
    const genreCounts: Record<string, number> = {}
    completed.forEach((item) => {
      const genres = "anime" in item ? item.anime.genres : item.manga.genres
      genres.forEach((g) => {
        genreCounts[g.name] = (genreCounts[g.name] || 0) + 1
      })
    })
    
    progress = genreCounts[challenge.targetGenre] || 0
  } else if (challenge.category === "completion") {
    const completed = [
      ...user.animeList.filter((a) => a.status === "COMPLETED"),
      ...user.mangaList.filter((m) => m.status === "COMPLETED"),
    ]
    progress = completed.length
  } else if (challenge.category === "episode_count") {
    const watching = user.animeList.filter((a) => a.status === "WATCHING")
    progress = watching.reduce((sum, item) => sum + (item.currentEpisode || 0), 0)
  }

  // Check if user challenge exists
  const existingUserChallenge = await prisma.userChallenge.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
  })

  const wasCompleted = existingUserChallenge?.completed || false
  const isCompleted = progress >= challenge.target

  // Create or update user challenge
  const userChallenge = await prisma.userChallenge.upsert({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
    update: {
      progress,
      completed: isCompleted,
      completedAt: isCompleted && !wasCompleted ? new Date() : existingUserChallenge?.completedAt || null,
    },
    create: {
      userId,
      challengeId,
      progress,
      completed: isCompleted,
      completedAt: isCompleted ? new Date() : null,
    },
  })

  // Award XP if just completed
  if (isCompleted && !wasCompleted) {
    await addXP(userId, challenge.xpReward, `Completed challenge: ${challenge.name}`)
  }

  return userChallenge
}

export async function getActiveBingoCards() {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!userId) return []

  const now = new Date()
  
  const bingoCards = await prisma.bingoCard.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: {
      users: {
        where: { userId },
        take: 1,
      },
    },
    orderBy: {
      startDate: 'desc',
    },
  })

  return bingoCards.map((card) => ({
    ...card,
    userCard: card.users[0] || null,
  }))
}

export async function markBingoSquare(bingoCardId: string, squareIndex: number) {
  const session = await auth()
  const userId = getUserId(session)
  
  if (!userId) throw new Error("Unauthorized")

  const bingoCard = await prisma.bingoCard.findUnique({
    where: { id: bingoCardId },
  })

  if (!bingoCard) throw new Error("Bingo card not found")

  // Get or create user bingo card
  let userBingoCard = await prisma.userBingoCard.findUnique({
    where: {
      userId_bingoCardId: {
        userId,
        bingoCardId,
      },
    },
  })

  if (!userBingoCard) {
    userBingoCard = await prisma.userBingoCard.create({
      data: {
        userId,
        bingoCardId,
        markedSquares: "[]",
      },
    })
  }

  // Parse marked squares
  const markedSquares: number[] = JSON.parse(userBingoCard.markedSquares || "[]")
  
  // Toggle square
  const index = markedSquares.indexOf(squareIndex)
  if (index >= 0) {
    markedSquares.splice(index, 1)
  } else {
    markedSquares.push(squareIndex)
  }

  // Check for bingo (5 in a row, column, or diagonal)
  const squares = JSON.parse(bingoCard.squares || "[]")
  const hasBingo = checkBingo(markedSquares, squares.length)

  await prisma.userBingoCard.update({
    where: { id: userBingoCard.id },
    data: {
      markedSquares: JSON.stringify(markedSquares),
      completedAt: hasBingo ? new Date() : null,
    },
  })

  // Award XP if bingo achieved
  if (hasBingo && !userBingoCard.completedAt) {
    await addXP(userId, 500, `Completed bingo: ${bingoCard.name}`)
  }

  return { markedSquares, hasBingo }
}

function checkBingo(markedSquares: number[], gridSize: number): boolean {
  const grid = Math.sqrt(gridSize)
  const gridArray: boolean[][] = []
  
  for (let i = 0; i < grid; i++) {
    gridArray[i] = []
    for (let j = 0; j < grid; j++) {
      gridArray[i][j] = markedSquares.includes(i * grid + j)
    }
  }

  // Check rows
  for (let i = 0; i < grid; i++) {
    if (gridArray[i].every((cell) => cell)) return true
  }

  // Check columns
  for (let j = 0; j < grid; j++) {
    if (gridArray.every((row) => row[j])) return true
  }

  // Check diagonals
  if (gridArray.every((row, i) => row[i])) return true
  if (gridArray.every((row, i) => row[grid - 1 - i])) return true

  return false
}

