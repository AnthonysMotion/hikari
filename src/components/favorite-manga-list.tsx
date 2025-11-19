"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface FavoriteMangaListProps {
  favorites: Array<{
    id: number
    title: string
    coverImage: string | null
  }>
}

export function FavoriteMangaList({ favorites }: FavoriteMangaListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {favorites.map((manga) => (
        <Link href={`/manga/${manga.id}`} key={manga.id} className="group">
          <Card className="overflow-hidden h-full">
            <div className="relative aspect-[2/3] overflow-hidden bg-muted">
              {manga.coverImage ? (
                <img
                  src={manga.coverImage}
                  alt={manga.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  No Image
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {manga.title}
              </h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

