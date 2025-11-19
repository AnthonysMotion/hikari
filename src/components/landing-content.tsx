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
    <section className="container mx-auto px-4 md:px-6 py-20 max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A complete platform for anime and manga enthusiasts
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <feature.icon className="w-8 h-8 text-primary mb-2" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function LandingCTAs() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-20 max-w-4xl">
      <div className="text-center space-y-8">
        <div>
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join Hikari today and start tracking your anime and manga journey. It's free and takes just a minute.
          </p>
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/login">
            <Button size="lg" className="rounded-full px-8 text-lg">
              Get Started Free
            </Button>
          </Link>
          <Link href="/#anime">
            <Button size="lg" variant="outline" className="rounded-full px-8 text-lg bg-transparent border-white/20 hover:bg-white/10">
              Explore Without Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

