import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { SearchBar } from "@/components/search-bar"

export function Hero() {
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden bg-grainy border-b border-border/50">
      {/* Animated Gradient Blobs */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 opacity-40 animate-pulse" 
        style={{ backgroundColor: 'var(--accent-color, #a855f7)' }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] translate-x-20 translate-y-20 -z-10 opacity-25 animate-pulse delay-75" 
        style={{ backgroundColor: 'var(--accent-color, #3b82f6)' }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[80px] -translate-x-20 -translate-y-20 -z-10 opacity-25 animate-pulse delay-150" 
        style={{ backgroundColor: 'var(--accent-color, #ec4899)' }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 -z-10" />

      <div className="container px-4 md:px-6 relative z-10 py-20">
        <div className="mb-6 flex items-center justify-center gap-2 text-primary/60">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium tracking-wider uppercase">Anime & Manga Tracker</span>
        </div>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-none">
          <span className="text-gradient block mb-2">Hikari</span>
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-[700px] mx-auto mb-12 leading-relaxed font-light">
          Your personal <span className="text-primary font-medium">anime and manga sanctuary</span>. Track, discover, and immerse yourself in the world of Japanese animation.
        </p>
        <div className="flex gap-4 justify-center flex-wrap mb-12">
          <Link href="/login">
            <Button size="lg" className="rounded-full px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Get Started Free
            </Button>
          </Link>
          <Link href="#anime">
            <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg font-semibold bg-transparent border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
              Explore Anime
            </Button>
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto w-full px-4">
          <SearchBar placeholder="Search anime and manga..." />
        </div>
      </div>
    </div>
  )
}

