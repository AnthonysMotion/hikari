import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { WatchingList } from "@/components/watching-list";
import { Hero } from "@/components/hero";
import { Badge } from "@/components/ui/badge";
import { LandingFeatures, LandingCTAs } from "@/components/landing-content";
import { UserDashboard } from "@/components/user-dashboard";
import { NewsSection } from "@/components/news-section";
import { ActivityFeed } from "@/components/activity-feed";

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
    <main className="min-h-screen bg-background text-foreground">
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
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Welcome Back!</h1>
            <p className="text-lg text-muted-foreground">Here's what's happening with your lists</p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {/* Left Side - Activity Feed */}
            <div>
              <ActivityFeed />
            </div>

            {/* Right Side - Stats/Info/Continue Watching */}
            <div className="space-y-6">
              {/* User Dashboard */}
              <UserDashboard userId={userId} />

              {/* Continue Watching */}
              {(watchingAnimeData.length > 0 || readingMangaData.length > 0) && (
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Continue Watching</h2>
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
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Top Anime</h2>
          <Link href="/anime" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {topAnime.map((anime, index) => (
            <Link 
              href={`/anime/${anime.id}`} 
              key={anime.id} 
              className={`group ${
                index >= 6 ? 'hidden xl:block' :
                index >= 4 ? 'hidden lg:block' :
                index >= 3 ? 'hidden md:block' :
                index >= 2 ? 'hidden sm:block' :
                'block'
              }`}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted mb-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {anime.coverImage ? (
                  <img
                    src={anime.coverImage}
                    alt={anime.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {anime.genres.slice(0, 2).map(g => (
                      <span key={g.id} className="text-[10px] bg-primary/90 text-primary-foreground px-2 py-1 rounded-md backdrop-blur-sm font-medium">
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-1">
                {anime.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {anime.seasonYear || 'Unknown Year'} • {anime.format || 'TV'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Manga Section - Always shown */}
      <section id="manga" className="w-[80%] mx-auto px-4 md:px-8 mt-20 py-12 md:py-16 border-t border-border/50">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Top Manga</h2>
          <Link href="/manga" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {topManga.map((manga, index) => (
            <Link 
              href={`/manga/${manga.id}`} 
              key={manga.id} 
              className={`group ${
                index >= 6 ? 'hidden xl:block' :
                index >= 4 ? 'hidden lg:block' :
                index >= 3 ? 'hidden md:block' :
                index >= 2 ? 'hidden sm:block' :
                'block'
              }`}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted mb-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {manga.coverImage ? (
                  <img
                    src={manga.coverImage}
                    alt={manga.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {manga.genres.slice(0, 2).map(g => (
                      <span key={g.id} className="text-[10px] bg-primary/90 text-primary-foreground px-2 py-1 rounded-md backdrop-blur-sm font-medium">
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-1">
                {manga.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {manga.startDate ? new Date(manga.startDate).getFullYear() : 'Unknown'} • {manga.format || 'Manga'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* News Section - Shown for both logged in and logged out */}
      <NewsSection />
    </main>
  );
}
