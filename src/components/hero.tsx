"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, PlayCircle } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { motion, useScroll, useTransform } from "framer-motion"
import { FadeIn } from "@/components/ui/motion"

interface HeroProps {
  stats?: { label: string; value: string }[]
}

export function Hero({ stats }: HeroProps) {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-background border-b border-white/5 selection:bg-primary/30 -mt-24">
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: y1, opacity }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full blur-[120px] bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 mix-blend-screen animate-pulse duration-[10s]"
        />
        <motion.div 
          style={{ y: y2, opacity }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] bg-gradient-to-tr from-indigo-500/20 via-pink-500/20 to-primary/20 mix-blend-screen animate-pulse duration-[15s]"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Content */}
      <div className="container px-4 md:px-6 relative z-10 pt-32 pb-20">
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide uppercase">Next Gen Tracking</span>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2} direction="up">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-[0.9] md:leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 drop-shadow-2xl">
            Track Anime<br />Like Magic
          </h1>
        </FadeIn>

        <FadeIn delay={0.3} direction="up">
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground/80 max-w-[600px] mx-auto mb-12 leading-relaxed font-light">
            Experience the future of anime discovery. 
            <span className="text-white/90 font-medium"> Beautiful analytics</span>, 
            <span className="text-white/90 font-medium"> smart recommendations</span>, and a 
            <span className="text-white/90 font-medium"> community</span> built for enthusiasts.
          </p>
        </FadeIn>

        <FadeIn delay={0.4} direction="up">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-8 text-lg font-medium bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300">
                Start Tracking Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#anime" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-14 px-8 text-lg font-medium bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </FadeIn>
        
        {/* Stats / Social Proof */}
        {stats && (
          <FadeIn delay={0.6} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto border-t border-white/10 pt-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </FadeIn>
        )}
      </div>
      
      {/* Gradient Fade Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </div>
  )
}
