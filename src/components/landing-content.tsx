"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tv, BookOpen, Star, Users, BarChart3, Heart, ListChecks } from "lucide-react"
import { FadeIn, StaggerContainer, HoverCard } from "@/components/ui/motion"
import { motion } from "framer-motion"

export function LandingFeatures() {
  const features = [
    {
      icon: ListChecks,
      title: "Track Your Progress",
      description: "Keep track of all the anime and manga you're watching and reading. Never lose your place again.",
    },
    {
      icon: Star,
      title: "Rate & Review",
      description: "Share your thoughts and rate your favorite titles. Build a comprehensive collection of reviews.",
    },
    {
      icon: Heart,
      title: "Favorites",
      description: "Mark your absolute favorites and showcase them on your profile for others to discover.",
    },
    {
      icon: BarChart3,
      title: "Statistics",
      description: "View detailed statistics about your viewing habits, favorite genres, and completion rates.",
    },
    {
      icon: Users,
      title: "Profiles",
      description: "Customize your profile with banners, bios, and see what others are watching.",
    },
    {
      icon: Tv,
      title: "Discover",
      description: "Browse through hundreds of titles, discover new favorites, and explore top-rated content.",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section className="container mx-auto px-4 md:px-6 py-24 max-w-6xl">
      <FadeIn className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Everything You Need</h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A complete platform for anime and manga enthusiasts
        </p>
      </FadeIn>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={item}>
            <HoverCard className="h-full">
              <Card 
                className="h-full border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors duration-300 hover:border-primary/20 group"
              >
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </HoverCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export function LandingCTAs() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-24 max-w-4xl border-t border-border/50">
      <FadeIn direction="up" className="text-center space-y-12">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Ready to Get Started?</h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join Hikari today and start tracking your anime and manga journey. It's free and takes just a minute.
          </p>
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/login">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="rounded-full px-10 py-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                Get Started Free
              </Button>
            </motion.div>
          </Link>
          <Link href="/#anime">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg font-semibold bg-transparent border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 backdrop-blur-sm transition-all duration-300">
                Explore Without Account
              </Button>
            </motion.div>
          </Link>
        </div>
      </FadeIn>
    </section>
  )
}
