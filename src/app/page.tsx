import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const animes = await prisma.anime.findMany({
    include: { genres: true },
  });
  const mangas = await prisma.manga.findMany({
    include: { genres: true },
  });

  return (
    <main className="min-h-screen p-8 bg-background">
      <h1 className="text-4xl font-bold mb-8 text-center">Hikari</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Anime</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animes.map((anime) => (
            <Link href={`/anime/${anime.id}`} key={anime.id} className="block transition-transform hover:scale-[1.02]">
              <Card className="overflow-hidden h-full">
                <div className="relative h-48 w-full">
                  {anime.coverImage ? (
                    <img
                      src={anime.coverImage}
                      alt={anime.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{anime.title}</CardTitle>
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded-full text-primary">
                      {anime.status}
                    </span>
                  </div>
                  <CardDescription>{anime.season} • {anime.episodes} Episodes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {anime.description}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span key={genre.id} className="text-xs bg-secondary px-2 py-1 rounded-md">
                      {genre.name}
                    </span>
                  ))}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Manga</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mangas.map((manga) => (
            <Link href={`/manga/${manga.id}`} key={manga.id} className="block transition-transform hover:scale-[1.02]">
              <Card className="overflow-hidden h-full">
                <div className="relative h-48 w-full">
                  {manga.coverImage ? (
                    <img
                      src={manga.coverImage}
                      alt={manga.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{manga.title}</CardTitle>
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded-full text-primary">
                      {manga.status}
                    </span>
                  </div>
                  <CardDescription>{manga.chapters} Chapters</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {manga.description}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  {manga.genres.map((genre) => (
                    <span key={genre.id} className="text-xs bg-secondary px-2 py-1 rounded-md">
                      {genre.name}
                    </span>
                  ))}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
