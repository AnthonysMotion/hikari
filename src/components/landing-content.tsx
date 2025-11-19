import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tv, BookOpen, Star, Users, BarChart3, Heart, ListChecks } from "lucide-react"

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

  return (
    <section className="container mx-auto px-4 md:px-6 py-24 max-w-6xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Everything You Need</h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A complete platform for anime and manga enthusiasts
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/20 group"
          >
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function LandingCTAs() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-24 max-w-4xl border-t border-border/50">
      <div className="text-center space-y-12">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Ready to Get Started?</h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join Hikari today and start tracking your anime and manga journey. It's free and takes just a minute.
          </p>
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/login">
            <Button size="lg" className="rounded-full px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Get Started Free
            </Button>
          </Link>
          <Link href="/#anime">
            <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg font-semibold bg-transparent border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
              Explore Without Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

