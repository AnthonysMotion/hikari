import { getLatestNews } from "@/actions/news"
import { NewsGrid } from "@/components/news-grid"
import { FadeIn } from "@/components/ui/motion"

export async function NewsSection() {
  const news = await getLatestNews(6)

  if (news.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
      <FadeIn className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Latest News</h2>
          <p className="text-muted-foreground">Stay updated with the latest anime and manga news</p>
        </div>
      </FadeIn>

      <NewsGrid news={news} />
    </section>
  )
}
