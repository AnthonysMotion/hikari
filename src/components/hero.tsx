import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center overflow-hidden bg-grainy">
      {/* Gradient Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px] translate-x-20 translate-y-20 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[60px] -translate-x-20 -translate-y-20 -z-10" />

      <div className="container px-4 md:px-6 relative z-10">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
          <span className="text-gradient">Hikari</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-[600px] mx-auto mb-8">
          Your personal anime and manga sanctuary. Track, discover, and immerse yourself in the world of Japanese animation.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="#anime">
            <Button size="lg" className="rounded-full px-8">
              Explore Anime
            </Button>
          </Link>
          <Link href="#manga">
            <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-white/20 hover:bg-white/10">
              Read Manga
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

