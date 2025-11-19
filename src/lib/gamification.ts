export const ACHIEVEMENTS = [
  // Completion Achievements
  {
    code: "first_complete",
    name: "First Steps",
    description: "Complete your first anime or manga",
    icon: "🎯",
    xpReward: 50,
    category: "completion",
    rarity: "common",
  },
  {
    code: "ten_complete",
    name: "Getting Serious",
    description: "Complete 10 anime or manga",
    icon: "📚",
    xpReward: 200,
    category: "completion",
    rarity: "common",
  },
  {
    code: "fifty_complete",
    name: "Dedicated Watcher",
    description: "Complete 50 anime or manga",
    icon: "🌟",
    xpReward: 500,
    category: "completion",
    rarity: "rare",
  },
  {
    code: "hundred_complete",
    name: "Century Club",
    description: "Complete 100 anime or manga",
    icon: "💯",
    xpReward: 1000,
    category: "completion",
    rarity: "epic",
  },
  {
    code: "five_hundred_complete",
    name: "Master Collector",
    description: "Complete 500 anime or manga",
    icon: "👑",
    xpReward: 5000,
    category: "completion",
    rarity: "legendary",
  },
  
  // Genre Achievements
  {
    code: "genre_explorer",
    name: "Genre Explorer",
    description: "Complete anime/manga from 10 different genres",
    icon: "🗺️",
    xpReward: 300,
    category: "genre",
    rarity: "rare",
  },
  {
    code: "genre_master",
    name: "Genre Master",
    description: "Complete anime/manga from 20 different genres",
    icon: "🎭",
    xpReward: 800,
    category: "genre",
    rarity: "epic",
  },
  {
    code: "action_fan",
    name: "Action Enthusiast",
    description: "Complete 20 action anime/manga",
    icon: "⚔️",
    xpReward: 400,
    category: "genre",
    rarity: "rare",
  },
  {
    code: "romance_fan",
    name: "Romance Lover",
    description: "Complete 20 romance anime/manga",
    icon: "💕",
    xpReward: 400,
    category: "genre",
    rarity: "rare",
  },
  {
    code: "comedy_fan",
    name: "Comedy King/Queen",
    description: "Complete 20 comedy anime/manga",
    icon: "😂",
    xpReward: 400,
    category: "genre",
    rarity: "rare",
  },
  
  // Milestone Achievements
  {
    code: "first_review",
    name: "Critic",
    description: "Write your first review",
    icon: "✍️",
    xpReward: 100,
    category: "milestone",
    rarity: "common",
  },
  {
    code: "ten_reviews",
    name: "Reviewer",
    description: "Write 10 reviews",
    icon: "📝",
    xpReward: 300,
    category: "milestone",
    rarity: "common",
  },
  {
    code: "fifty_reviews",
    name: "Professional Critic",
    description: "Write 50 reviews",
    icon: "📖",
    xpReward: 1000,
    category: "milestone",
    rarity: "epic",
  },
  {
    code: "first_favorite",
    name: "Favorite Things",
    description: "Add your first favorite",
    icon: "⭐",
    xpReward: 25,
    category: "milestone",
    rarity: "common",
  },
  {
    code: "ten_favorites",
    name: "Curator",
    description: "Add 10 favorites",
    icon: "🎨",
    xpReward: 200,
    category: "milestone",
    rarity: "common",
  },
  
  // Streak Achievements
  {
    code: "daily_watcher",
    name: "Daily Watcher",
    description: "Update your list 7 days in a row",
    icon: "🔥",
    xpReward: 500,
    category: "streak",
    rarity: "rare",
  },
  
  // Level Achievements
  {
    code: "level_10",
    name: "Level Up!",
    description: "Reach level 10",
    icon: "⬆️",
    xpReward: 0,
    category: "milestone",
    rarity: "common",
  },
  {
    code: "level_25",
    name: "Rising Star",
    description: "Reach level 25",
    icon: "⭐",
    xpReward: 0,
    category: "milestone",
    rarity: "rare",
  },
  {
    code: "level_50",
    name: "Anime Expert",
    description: "Reach level 50",
    icon: "🏆",
    xpReward: 0,
    category: "milestone",
    rarity: "epic",
  },
  {
    code: "level_100",
    name: "Legend",
    description: "Reach level 100",
    icon: "👑",
    xpReward: 0,
    category: "milestone",
    rarity: "legendary",
  },
] as const

export const BADGES = [
  // Genre Badges
  {
    code: "badge_action",
    name: "Action Hero",
    description: "Complete 50 action anime/manga",
    icon: "⚔️",
    category: "genre",
    rarity: "epic",
  },
  {
    code: "badge_romance",
    name: "Romance Expert",
    description: "Complete 50 romance anime/manga",
    icon: "💕",
    category: "genre",
    rarity: "epic",
  },
  {
    code: "badge_comedy",
    name: "Comedy Master",
    description: "Complete 50 comedy anime/manga",
    icon: "😂",
    category: "genre",
    rarity: "epic",
  },
  {
    code: "badge_fantasy",
    name: "Fantasy Explorer",
    description: "Complete 50 fantasy anime/manga",
    icon: "✨",
    category: "genre",
    rarity: "epic",
  },
  {
    code: "badge_sci_fi",
    name: "Sci-Fi Pioneer",
    description: "Complete 50 sci-fi anime/manga",
    icon: "🚀",
    category: "genre",
    rarity: "epic",
  },
  {
    code: "badge_horror",
    name: "Horror Veteran",
    description: "Complete 30 horror anime/manga",
    icon: "👻",
    category: "genre",
    rarity: "rare",
  },
  
  // Special Badges
  {
    code: "badge_early_adopter",
    name: "Early Adopter",
    description: "One of the first 100 users",
    icon: "🌱",
    category: "special",
    rarity: "legendary",
  },
  {
    code: "badge_beta_tester",
    name: "Beta Tester",
    description: "Participated in beta testing",
    icon: "🧪",
    category: "special",
    rarity: "rare",
  },
] as const

// XP required for each level (exponential growth)
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0
  // Formula: 100 * (level - 1)^2
  return Math.floor(100 * Math.pow(level - 1, 1.5))
}

export function getLevelFromXP(xp: number): number {
  let level = 1
  let requiredXP = 0
  
  while (true) {
    const nextRequiredXP = getXPForLevel(level + 1)
    if (xp < nextRequiredXP) {
      break
    }
    level++
  }
  
  return level
}

export function getXPProgress(xp: number, level: number): { current: number; next: number; percent: number } {
  const currentLevelXP = getXPForLevel(level)
  const nextLevelXP = getXPForLevel(level + 1)
  const progress = xp - currentLevelXP
  const needed = nextLevelXP - currentLevelXP
  const percent = needed > 0 ? (progress / needed) * 100 : 100
  
  return {
    current: progress,
    next: needed,
    percent: Math.min(100, Math.max(0, percent)),
  }
}

