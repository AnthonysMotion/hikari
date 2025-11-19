import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { WatchingList } from "@/components/watching-list";
import { Hero } from "@/components/hero";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const session = await auth();
  const userId = (session?.user as any)?.id || session?.user?.id;
  
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

  // Get user's watching anime and reading manga
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
      <Hero />

      <div className="py-12 space-y-20">
        {/* Watching List - Only shown if logged in */}
        {session?.user && (watchingAnimeData.length > 0 || readingMangaData.length > 0) && (
          <section className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold mb-8 tracking-tight">Your List</h2>
            <WatchingList watchingAnime={watchingAnimeData} readingManga={readingMangaData} />
          </section>
        )}
        
        <section id="anime" className="px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Top Anime</h2>
            <Link href="/anime" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              View All
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
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted mb-3">
                  {anime.coverImage ? (
                    <img
                      src={anime.coverImage}
                      alt={anime.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {anime.genres.slice(0, 2).map(g => (
                        <span key={g.id} className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded backdrop-blur-sm">
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <h3 className="font-medium leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {anime.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {anime.seasonYear || 'Unknown Year'} • {anime.format || 'TV'}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section id="manga" className="px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Top Manga</h2>
            <Link href="/manga" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              View All
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
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted mb-3">
                  {manga.coverImage ? (
                    <img
                      src={manga.coverImage}
                      alt={manga.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {manga.genres.slice(0, 2).map(g => (
                        <span key={g.id} className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded backdrop-blur-sm">
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <h3 className="font-medium leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {manga.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {manga.startDate ? new Date(manga.startDate).getFullYear() : 'Unknown'} • {manga.format || 'Manga'}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
