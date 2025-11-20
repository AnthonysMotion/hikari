import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { WatchingList } from "@/components/watching-list";
import { Hero } from "@/components/hero";
import { LandingFeatures, LandingCTAs } from "@/components/landing-content";
import { UserDashboard } from "@/components/user-dashboard";
import { NewsSection } from "@/components/news-section";
import { ActivityFeedTabs } from "@/components/activity-feed-tabs";
import { SuggestedUsers } from "@/components/suggested-users";
import { getActivityFeed, getFollowingActivityFeed } from "@/actions/activity";
import { SearchBar } from "@/components/search-bar";
import { MediaGrid } from "@/components/media-grid";
import { FadeIn } from "@/components/ui/motion";

async function ActivityFeedWithData({ userId }: { userId: string }) {
  const [globalActivities, followingActivities] = await Promise.all([
    getActivityFeed(30),
    getFollowingActivityFeed(userId, 30),
  ])

  return <ActivityFeedTabs globalActivities={globalActivities} followingActivities={followingActivities} />
}

export default async function Home() {
  const session = await auth();
  const userId = (session?.user as any)?.id || session?.user?.id;
  const isLoggedIn = !!userId;
  
  // Fetch top 8 anime sorted by popularity (max 8 for xl breakpoint)
  const topAnime = await prisma.anime.findMany({
    take: 8,
    orderBy: {
      popularity: 'desc',
    },
    include: { genres: true },
  });

  // Fetch top 8 manga sorted by popularity (max 8 for xl breakpoint)
  const topManga = await prisma.manga.findMany({
    take: 8,
    orderBy: {
      popularity: 'desc',
    },
    include: { genres: true },
  });

  // Get user's watching anime and reading manga (only if logged in)
  const watchingAnime = userId
    ? await prisma.userAnimeList.findMany({
        where: {
          userId: userId,
          status: "WATCHING",
        },
        include: {
          anime: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              episodes: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      })
    : [];

  const readingManga = userId
    ? await prisma.userMangaList.findMany({
        where: {
          userId: userId,
          status: "READING",
        },
        include: {
          manga: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              chapters: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      })
    : [];

  const watchingAnimeData = watchingAnime.map((entry) => ({
    id: entry.anime.id,
    title: entry.anime.title,
    coverImage: entry.anime.coverImage,
    episodes: entry.anime.episodes,
    currentEpisode: entry.currentEpisode,
  }));

  const readingMangaData = readingManga.map((entry) => ({
    id: entry.manga.id,
    title: entry.manga.title,
    coverImage: entry.manga.coverImage,
    chapters: entry.manga.chapters,
    currentChapter: entry.currentChapter,
  }));

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Landing Page Content for Non-Logged In Users */}
      {!isLoggedIn && (
        <>
          <Hero />
          <LandingFeatures />
          <LandingCTAs />
        </>
      )}

      {/* Dashboard Content for Logged In Users */}
      {isLoggedIn && (
        <div className="container mx-auto px-4 md:px-6 py-16 max-w-[90rem]">
          <FadeIn className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Welcome Back!</h1>
            <p className="text-lg text-muted-foreground mb-6">Here's what's happening with your lists</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl">
              <SearchBar placeholder="Search anime and manga..." />
            </div>
          </FadeIn>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {/* Left Side - Activity Feed */}
            <div className="space-y-6">
              <ActivityFeedWithData userId={userId} />
              
              {/* Suggested Users */}
              <SuggestedUsers currentUserId={userId} limit={5} />
            </div>

            {/* Right Side - Stats/Info/Continue Watching */}
            <div className="space-y-6">
              {/* User Dashboard */}
              <UserDashboard userId={userId} />

              {/* Continue Watching */}
              {(watchingAnimeData.length > 0 || readingMangaData.length > 0) && (
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Continue!</h2>
                  </div>
                  <WatchingList watchingAnime={watchingAnimeData} readingManga={readingMangaData} />
                </section>
              )}
            </div>
          </div>
        </div>
      )}
        
      {/* Top Anime Section - Always shown */}
      <section id="anime" className="w-[80%] mx-auto px-4 md:px-8 py-12 md:py-16">
        <FadeIn className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Top Anime</h2>
          <Link href="/anime" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </FadeIn>
        
        <MediaGrid items={topAnime} type="anime" />
      </section>

      {/* Top Manga Section - Always shown */}
      <section id="manga" className="w-[80%] mx-auto px-4 md:px-8 mt-20 py-12 md:py-16 border-t border-border/50">
        <FadeIn className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Top Manga</h2>
          <Link href="/manga" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </FadeIn>

        <MediaGrid items={topManga} type="manga" />
      </section>

      {/* News Section - Shown for both logged in and logged out */}
      <NewsSection />
    </main>
  );
}
