"use client"

import Link from "next/link"
import { FadeIn, StaggerContainer, HoverCard } from "@/components/ui/motion"
import { motion } from "framer-motion"

interface MediaItem {
  id: number
  title: string
  coverImage: string | null
  seasonYear?: number | null
  startDate?: Date | string | null
  format?: string | null
  genres: { id: number; name: string }[]
}

interface MediaGridProps {
  items: MediaItem[]
  type: "anime" | "manga"
}

export function MediaGrid({ items, type }: MediaGridProps) {
  return (
    <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className={
            index >= 6 ? 'hidden xl:block' :
            index >= 4 ? 'hidden lg:block' :
            index >= 3 ? 'hidden md:block' :
            index >= 2 ? 'hidden sm:block' :
            'block'
          }
        >
          <Link href={`/${type}/${item.id}`} className="group block h-full">
            <HoverCard className="h-full">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted mb-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {item.coverImage ? (
                  <motion.img
                    src={item.coverImage}
                    alt={item.title}
                    className="object-cover w-full h-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.genres.slice(0, 2).map(g => (
                      <span key={g.id} className="text-[10px] bg-primary/90 text-primary-foreground px-2 py-1 rounded-md backdrop-blur-sm font-medium">
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {type === 'anime' 
                  ? `${item.seasonYear || 'Unknown Year'} • ${item.format || 'TV'}`
                  : `${item.startDate ? new Date(item.startDate).getFullYear() : 'Unknown'} • ${item.format || 'Manga'}`
                }
              </p>
            </HoverCard>
          </Link>
        </motion.div>
      ))}
    </StaggerContainer>
  )
}

