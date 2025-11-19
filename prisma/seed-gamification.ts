import "dotenv/config"
import { PrismaClient } from "../src/generated/client/client"

const prisma = new PrismaClient()

const CHALLENGES = [
  // Daily Challenges
  {
    code: "daily_fantasy_3",
    name: "Fantasy Friday",
    description: "Complete 3 fantasy anime or manga this week",
    type: "weekly",
    category: "genre",
    target: 3,
    targetGenre: "Fantasy",
    xpReward: 150,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    isActive: true,
  },
  {
    code: "daily_action_5",
    name: "Action Week",
    description: "Complete 5 action anime or manga this week",
    type: "weekly",
    category: "genre",
    target: 5,
    targetGenre: "Action",
    xpReward: 250,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    code: "daily_episodes_10",
    name: "Binge Watcher",
    description: "Watch 10 episodes this week",
    type: "weekly",
    category: "episode_count",
    target: 10,
    targetGenre: null,
    xpReward: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    code: "daily_complete_2",
    name: "Double Combo",
    description: "Complete 2 new anime or manga this week",
    type: "weekly",
    category: "completion",
    target: 2,
    targetGenre: null,
    xpReward: 200,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
]

async function seedChallenges() {
  console.log("Seeding challenges...")
  
  for (const challenge of CHALLENGES) {
    await prisma.challenge.upsert({
      where: { code: challenge.code },
      update: {
        ...challenge,
      },
      create: challenge,
    })
  }
  
  console.log(`Seeded ${CHALLENGES.length} challenges`)
}

const BINGO_CARDS = [
  {
    name: "Winter 2025 Anime Bingo",
    season: "WINTER",
    year: 2025,
    squares: JSON.stringify([
      "Watch a new winter 2025 anime",
      "Complete a romance anime",
      "Watch 5 episodes in one day",
      "Add 3 anime to favorites",
      "Review an anime (FREE)",
      "Complete an action anime",
      "Watch a fantasy anime",
      "Complete 2 different genres",
      "Watch an isekai anime",
      "Complete a comedy anime",
      "Watch a slice of life anime",
      "Add anime to planning list",
      "Watch a drama anime",
      "Complete an adventure anime",
      "Watch an original anime",
      "Complete a mystery anime",
      "Watch a sci-fi anime",
      "Write 2 reviews",
      "Complete a horror anime",
      "Watch a sports anime",
      "Complete 5 total anime/manga",
      "Watch a music anime",
      "Complete an anime movie",
      "Watch an OVA",
      "Complete a seinen anime",
    ]),
    isActive: true,
    startDate: new Date(2025, 0, 1), // January 1, 2025
    endDate: new Date(2025, 2, 31), // March 31, 2025
  },
]

async function seedBingoCards() {
  console.log("Seeding bingo cards...")
  
  for (const card of BINGO_CARDS) {
    const existing = await prisma.bingoCard.findFirst({
      where: {
        season: card.season,
        year: card.year,
      },
    })

    if (existing) {
      await prisma.bingoCard.update({
        where: { id: existing.id },
        data: card,
      })
    } else {
      await prisma.bingoCard.create({
        data: card,
      })
    }
  }
  
  console.log(`Seeded ${BINGO_CARDS.length} bingo cards`)
}

async function main() {
  try {
    await seedChallenges()
    await seedBingoCards()
    console.log("Gamification seeding completed!")
  } catch (error) {
    console.error("Error seeding gamification:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()

