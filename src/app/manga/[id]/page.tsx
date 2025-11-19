import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default async function MangaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const manga = await prisma.manga.findUnique({
    where: { id: parseInt(id) },
    include: { genres: true },
  });

  if (!manga) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-lg">
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
          
          <div>
            <h1 className="text-4xl font-bold mb-2">{manga.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{manga.status}</Badge>
              {manga.chapters && <Badge variant="outline">{manga.chapters} Chapters</Badge>}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {manga.genres.map((genre) => (
                <Badge key={genre.id} className="bg-primary/10 text-primary hover:bg-primary/20">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {manga.description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
