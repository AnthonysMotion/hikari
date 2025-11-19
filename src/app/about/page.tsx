import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Trophy, Users, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">About Hikari</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your personal anime and manga sanctuary
          </p>
        </div>

        <Card className="border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50 mb-6">
          <CardHeader>
            <CardTitle>What is Hikari?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Hikari (光), meaning "light" in Japanese, is a modern platform designed for anime and manga enthusiasts to track, discover, and engage with their favorite titles. Built with passion for the anime community, Hikari offers a comprehensive experience for managing your watchlists, connecting with other fans, and staying up-to-date with the latest news and releases.
            </p>
            <p>
              Whether you're a seasoned otaku or just starting your anime journey, Hikari provides the tools and features you need to organize your collection and discover new favorites.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-primary" />
                <CardTitle>Gamification</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Level up as you watch more anime and read more manga. Unlock achievements, earn badges, and complete challenges to showcase your dedication to the medium.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <CardTitle>Social Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Connect with fellow fans, follow friends, and share your activity. See what others are watching, read reviews, and discover recommendations from the community.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                <CardTitle>Comprehensive Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Track your progress with detailed episode and chapter counters. Organize your lists by status, rate titles, write reviews, and keep track of your favorites.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                <CardTitle>Personalization</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Customize your experience with custom accent colors, dark/light themes, and personalized profiles. Make Hikari truly yours with extensive customization options.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50 mb-6">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Hikari was created to provide anime and manga fans with a beautiful, intuitive, and feature-rich platform for managing their collections and engaging with the community. We believe that tracking your favorite shows and manga should be enjoyable, not tedious.
            </p>
            <p>
              Our goal is to continuously improve and expand Hikari based on community feedback, ensuring it remains a valuable tool for anime enthusiasts around the world.
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50 mb-6">
          <CardHeader>
            <CardTitle>Technology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Hikari is built with modern web technologies to ensure a fast, responsive, and reliable experience:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 font-mono text-sm">
              <li>Next.js - React framework for production</li>
              <li>TypeScript - Type-safe development</li>
              <li>Prisma - Modern database ORM</li>
              <li>Tailwind CSS - Utility-first styling</li>
              <li>shadcn/ui - Beautiful UI components</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50 mb-6">
          <CardHeader>
            <CardTitle>Contact & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </p>
            <p>
              Visit our developer's website:
            </p>
            <p className="font-mono text-primary">
              <Link href="https://anthonythach.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                anthonythach.com
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Thank You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Thank you for being part of the Hikari community. Your passion for anime and manga is what makes this platform special. We hope you enjoy using Hikari as much as we enjoyed building it.
            </p>
            <p className="text-foreground font-medium">
              Happy tracking! 🎌
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

