"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/ui/motion"

export function Hero() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden bg-grainy border-b border-border/50">
      {/* Animated Gradient Blobs */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 opacity-40"
        style={{ backgroundColor: 'var(--accent-color, #a855f7)' }}
        animate={{
          x: ["-50%", "-40%", "-60%", "-50%"],
          y: ["-50%", "-60%", "-40%", "-50%"],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full blur-[100px] -z-10 opacity-30"
        style={{ backgroundColor: 'var(--accent-color, #3b82f6)' }}
        animate={{
          x: ["-30%", "-50%", "-30%"],
          y: ["-30%", "-30%", "-50%"],
          scale: [0.9, 1.2, 0.9],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-[80px] -z-10 opacity-30"
        style={{ backgroundColor: 'var(--accent-color, #ec4899)' }}
        animate={{
          x: ["-70%", "-50%", "-70%"],
          y: ["-40%", "-20%", "-40%"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 -z-10" />

      <div className="container px-4 md:px-6 relative z-10 py-20">
        <FadeIn delay={0.1}>
          <div className="mb-6 flex items-center justify-center gap-2 text-primary/60">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium tracking-wider uppercase">Anime & Manga Tracker</span>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2} direction="up">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-none">
            <span className="text-gradient block mb-2">Hikari</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.3} direction="up">
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-[700px] mx-auto mb-12 leading-relaxed font-light">
            Your personal <span className="text-primary font-medium">anime and manga sanctuary</span>. Track, discover, and immerse yourself in the world of Japanese animation.
          </p>
        </FadeIn>

        <FadeIn delay={0.4} direction="up">
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="rounded-full px-10 py-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                  Get Started Free
                </Button>
              </motion.div>
            </Link>
            <Link href="#anime">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg font-semibold bg-background/50 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 backdrop-blur-sm transition-all duration-300">
                  Explore Anime
                </Button>
              </motion.div>
            </Link>
          </div>
        </FadeIn>
        
        {/* Search Bar */}
        <FadeIn delay={0.5} direction="up" className="max-w-2xl mx-auto w-full px-4">
          <div className="p-1 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
            <SearchBar placeholder="Search anime and manga..." />
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
