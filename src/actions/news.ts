"use server"

import { prisma } from "@/lib/prisma"
import { fetchNewsFromSources } from "@/lib/news"

export async function updateNews() {
  try {
    const newsItems = await fetchNewsFromSources()
    let added = 0
    let skipped = 0

    for (const item of newsItems) {
      try {
        await prisma.news.upsert({
          where: { link: item.link },
          update: {
            title: item.title,
            description: item.description,
            content: item.content,
            imageUrl: item.imageUrl,
            source: item.source,
            category: item.category,
            publishedAt: item.publishedAt,
            updatedAt: new Date(),
          },
          create: {
            title: item.title,
            description: item.description,
            content: item.content,
            link: item.link,
            imageUrl: item.imageUrl,
            source: item.source,
            category: item.category,
            publishedAt: item.publishedAt,
          },
        })
        added++
      } catch (error) {
        // Skip duplicates or invalid entries
        skipped++
      }
    }

    // Clean up old news (older than 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    await prisma.news.deleteMany({
      where: {
        publishedAt: {
          lt: thirtyDaysAgo,
        },
      },
    })

    return { success: true, added, skipped }
  } catch (error) {
    console.error("Error updating news:", error)
    return { success: false, error: String(error) }
  }
}

export async function getLatestNews(limit: number = 10) {
  try {
    const news = await prisma.news.findMany({
      take: limit,
      orderBy: {
        publishedAt: 'desc',
      },
    })

    return news
  } catch (error) {
    console.error("Error fetching news:", error)
    return []
  }
}

export async function getNewsByCategory(category: string, limit: number = 10) {
  try {
    const news = await prisma.news.findMany({
      where: {
        category,
      },
      take: limit,
      orderBy: {
        publishedAt: 'desc',
      },
    })

    return news
  } catch (error) {
    console.error("Error fetching news by category:", error)
    return []
  }
}

