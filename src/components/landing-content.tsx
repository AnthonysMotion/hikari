"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tv, BookOpen, Star, Users, BarChart3, Heart, ListChecks, Zap, Shield, Smartphone, Sparkles } from "lucide-react"
import { FadeIn, StaggerContainer, HoverCard } from "@/components/ui/motion"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const BentoCard = ({ 
  className, 
  title, 
  description, 
  icon: Icon, 
  bgClass 
}: { 
  className?: string
  title: string
  description: string
  icon: any
  bgClass?: string 
}) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 }
    }}
    className={cn(
      "relative overflow-hidden rounded-3xl border border-white/10 bg-card/30 backdrop-blur-md p-6 md:p-8 flex flex-col justify-between group hover:border-white/20 transition-all duration-500",
      className
    )}
  >
    <div className={cn("absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500", bgClass)} />
    
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-white/10">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </motion.div>
)

export function LandingFeatures() {
  return (
    <section id="features" className="container mx-auto px-4 md:px-6 py-32 relative z-10">
      <FadeIn className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Everything you need.<br /><span className="text-muted-foreground">Nothing you don't.</span></h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Built for power users who want more from their tracking experience.
        </p>
      </FadeIn>
      
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto auto-rows-[300px]">
        {/* Large Item */}
        <BentoCard 
          className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-purple-500/10 to-blue-500/10"
          bgClass="bg-gradient-to-br from-purple-500 to-blue-500 blur-3xl"
          title="Smart Analytics"
          description="Visualize your watching habits with beautiful, interactive charts. Understand your genre preferences, tracking speed, and seasonal trends at a glance."
          icon={BarChart3}
        />
        
        <BentoCard 
          className="bg-gradient-to-br from-pink-500/10 to-rose-500/10"
          bgClass="bg-gradient-to-br from-pink-500 to-rose-500 blur-3xl"
          title="Manga Tracking"
          description="Seamlessly track chapters and volumes. Never lose your page again."
          icon={BookOpen}
        />

        <BentoCard 
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10"
          bgClass="bg-gradient-to-br from-green-500 to-emerald-500 blur-3xl"
          title="Social"
          description="Follow friends, compare lists, and discover new favorites together."
          icon={Users}
        />

        <BentoCard 
          className="md:col-span-2 bg-gradient-to-br from-orange-500/10 to-amber-500/10"
          bgClass="bg-gradient-to-br from-orange-500 to-amber-500 blur-3xl"
          title="Personalized Discovery"
          description="Get recommendations based on what you actually watch, not just what's popular."
          icon={Sparkles}
        />
      </StaggerContainer>
    </section>
  )
}

export function LandingCTAs() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-32 max-w-5xl relative z-10">
      <FadeIn direction="up" className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-white/10 to-black/40 border border-white/10 p-12 md:p-24 text-center">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
          Ready to start your journey?
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          Join thousands of anime and manga enthusiasts today. Free forever for personal use.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-10 text-lg font-bold bg-white text-black hover:bg-white/90 hover:scale-105 shadow-xl shadow-primary/20 transition-all duration-300">
              Get Started Now
            </Button>
          </Link>
          <Link href="/#anime" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-14 px-10 text-lg font-medium bg-transparent border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
              Explore Library
            </Button>
          </Link>
        </div>
      </FadeIn>
    </section>
  )
}
