"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, CheckCircle2, Star } from "lucide-react"
import { StaggerContainer, HoverCard } from "@/components/ui/motion"
import { motion } from "framer-motion"
import React from "react"

interface DashboardStatsProps {
  stats: {
    watching: number
    reading: number
    completed: number
    favorites: number
    reviews: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <HoverCard className="h-full">
          <Card className="h-full border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors duration-300 hover:shadow-lg group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stats.watching + stats.reading}</div>
            </CardContent>
          </Card>
        </HoverCard>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <HoverCard className="h-full">
          <Card className="h-full border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors duration-300 hover:shadow-lg group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stats.completed}</div>
            </CardContent>
          </Card>
        </HoverCard>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <HoverCard className="h-full">
          <Card className="h-full border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors duration-300 hover:shadow-lg group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stats.favorites}</div>
            </CardContent>
          </Card>
        </HoverCard>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <HoverCard className="h-full">
          <Card className="h-full border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors duration-300 hover:shadow-lg group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stats.reviews}</div>
            </CardContent>
          </Card>
        </HoverCard>
      </motion.div>
    </StaggerContainer>
  )
}

