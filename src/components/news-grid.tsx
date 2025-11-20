"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, Video, Bell, BookOpen, Users, AlertTriangle } from "lucide-react"
import { StaggerContainer, HoverCard } from "@/components/ui/motion"
import { motion } from "framer-motion"

interface NewsItem {
  id: string
  title: string
  link: string
  imageUrl: string | null
  category: string | null
  description: string | null
  source: string
  publishedAt: Date
}

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
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: new Date(date).getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  })
}

export function NewsGrid({ news }: { news: NewsItem[] }) {
  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <motion.div
          key={item.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <Link
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block h-full"
          >
            <HoverCard className="h-full">
              <Card className="h-full border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors duration-300 hover:border-primary/20 overflow-hidden">
                {item.imageUrl && (
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <motion.img
                      src={item.imageUrl}
                      alt={item.title}
                      className="object-cover w-full h-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      onError={(e) => {
                        // Hide image on error
                        e.currentTarget.parentElement!.style.display = 'none'
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant="outline"
                        className={`${getCategoryColor(item.category)} backdrop-blur-sm border text-xs font-medium flex items-center gap-1`}
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
            </HoverCard>
          </Link>
        </motion.div>
      ))}
    </StaggerContainer>
  )
}

