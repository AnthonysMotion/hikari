import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, Video, Bell, BookOpen, Users, AlertTriangle, Settings } from "lucide-react"
import { getLatestNews } from "@/actions/news"

function getCategoryIcon(category: string | null | undefined) {
  switch (category) {
    case 'trailer':
      return <Video className="w-4 h-4" />
    case 'announcement':
      return <Bell className="w-4 h-4" />
    case 'adaptation':
      return <BookOpen className="w-4 h-4" />
    case 'staff':
      return <Users className="w-4 h-4" />
    case 'delay':
    case 'production':
      return <AlertTriangle className="w-4 h-4" />
    default:
      return <Calendar className="w-4 h-4" />
  }
}

function getCategoryColor(category: string | null | undefined) {
  switch (category) {
    case 'trailer':
      return 'bg-blue-500/20 border-blue-500/50 text-blue-300'
    case 'announcement':
      return 'bg-green-500/20 border-green-500/50 text-green-300'
    case 'adaptation':
      return 'bg-purple-500/20 border-purple-500/50 text-purple-300'
    case 'staff':
      return 'bg-orange-500/20 border-orange-500/50 text-orange-300'
    case 'delay':
    case 'production':
      return 'bg-red-500/20 border-red-500/50 text-red-300'
    default:
      return 'bg-gray-500/20 border-gray-500/50 text-gray-300'
  }
}

function formatCategoryName(category: string | null | undefined): string {
  if (!category) return 'General'
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function formatDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  })
}

export async function NewsSection() {
  const news = await getLatestNews(6)

  if (news.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Latest News</h2>
          <p className="text-muted-foreground">Stay updated with the latest anime and manga news</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="h-full border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/20 overflow-hidden">
              {item.imageUrl && (
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Hide image on error
                      e.currentTarget.parentElement!.style.display = 'none'
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="outline"
                      className={`${getCategoryColor(item.category)}} backdrop-blur-sm border text-xs font-medium flex items-center gap-1`}
                    >
                      {getCategoryIcon(item.category)}
                      {formatCategoryName(item.category)}
                    </Badge>
                  </div>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors flex-1">
                    {item.title}
                  </CardTitle>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.source}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

