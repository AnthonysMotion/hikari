import Parser from 'rss-parser'

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: ['media:thumbnail', 'enclosure', 'content:encoded'],
  },
})

export interface NewsItem {
  title: string
  description?: string
  content?: string
  link: string
  imageUrl?: string
  source: string
  category?: string
  publishedAt: Date
}

// News sources with their RSS feeds
const NEWS_SOURCES = [
  {
    name: 'Anime News Network',
    url: 'https://www.animenewsnetwork.com/news/rss.xml',
    category: 'general',
  },
  {
    name: 'Anime Corner',
    url: 'https://animecorner.me/feed/',
    category: 'general',
  },
  {
    name: 'Crunchyroll News',
    url: 'https://www.crunchyroll.com/news/rss.xml',
    category: 'general',
  },
]

// Keywords to categorize news
const CATEGORY_KEYWORDS = {
  trailer: ['trailer', 'pv', 'promotional video', 'teaser', 'opening', 'ending', 'op', 'ed'],
  announcement: ['announcement', 'announced', 'reveal', 'revealed', 'confirm', 'confirmed', 'announce'],
  adaptation: ['manga adaptation', 'light novel adaptation', 'novel adaptation', 'game adaptation', 'adaptation'],
  staff: ['staff', 'director', 'animator', 'voice actor', 'seiyuu', 'cast', 'casting'],
  delay: ['delay', 'delayed', 'postpone', 'postponed', 'pushed back', 'defer'],
  production: ['production', 'studio', 'animation', 'budget', 'cancel', 'cancelled', 'hiatus'],
}

function categorizeNews(title: string, description?: string): string | null {
  const text = `${title} ${description || ''}`.toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category
    }
  }
  
  return null
}

function extractImageUrl(item: any): string | undefined {
  // Try various fields for images
  if (item['media:thumbnail']?.['$']?.url) {
    return item['media:thumbnail']['$'].url
  }
  if (item['media:content']?.['$']?.url) {
    return item['media:content']['$'].url
  }
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) {
    return item.enclosure.url
  }
  if (item.image?.url) {
    return item.image.url
  }
  
  // Try to extract from content/description HTML
  const html = item['content:encoded'] || item.content || item.contentSnippet || item.description || ''
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (imgMatch?.[1]) {
    return imgMatch[1]
  }
  
  return undefined
}

export async function fetchNewsFromSources(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = []

  for (const source of NEWS_SOURCES) {
    try {
      console.log(`Fetching news from ${source.name}...`)
      const feed = await parser.parseURL(source.url)
      
      if (!feed.items || feed.items.length === 0) {
        console.warn(`No items found in ${source.name} feed`)
        continue
      }

      const items = feed.items
        .filter(item => item.title && item.link)
        .slice(0, 20) // Limit to 20 most recent per source
        .map((item): NewsItem => {
          const category = categorizeNews(item.title || '', item.contentSnippet || item.description)
          const imageUrl = extractImageUrl(item)
          
          return {
            title: item.title || 'Untitled',
            description: item.contentSnippet || item.description || undefined,
            content: item['content:encoded'] || item.content || undefined,
            link: item.link || '',
            imageUrl,
            source: source.name,
            category: category || undefined,
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          }
        })

      allNews.push(...items)
    } catch (error) {
      console.error(`Error fetching news from ${source.name}:`, error)
      // Continue with other sources even if one fails
    }
  }

  // Sort by published date (newest first)
  allNews.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  return allNews.slice(0, 50) // Return top 50 most recent
}

