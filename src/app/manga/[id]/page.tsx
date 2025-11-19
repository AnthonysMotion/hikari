import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { MangaListStatusSelector } from "@/components/manga-list-status-selector";
import { ChapterCounter } from "@/components/chapter-counter";
import { ReviewForm } from "@/components/review-form";
import { ReviewsSection } from "@/components/reviews-section";

function parseJSON(str: string | null) {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default async function MangaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const mangaId = parseInt(id);
  const userId = (session?.user as any)?.id || session?.user?.id;

  const manga = await prisma.manga.findUnique({
    where: { id: mangaId },
    include: { genres: true },
  });

  if (!manga) {
    notFound();
  }

  // Get user's list entry
  const userListEntry = userId
    ? await prisma.userMangaList.findUnique({
        where: {
          userId_mangaId: {
            userId: userId,
            mangaId,
          },
        },
      })
    : null;

  // Get user's review
  const userReview = userId
    ? await prisma.review.findUnique({
        where: {
          userId_mangaId: {
            userId: userId,
            mangaId,
          },
        },
      })
    : null;

  const tags = parseJSON(manga.tags) as Array<{ name: string; category?: string; description?: string }> | null;
  const synonyms = parseJSON(manga.synonyms) as string[] | null;

  return (
    <main className="min-h-screen bg-background">
      {/* Banner Image - Full Width */}
      {manga.bannerImage && (
        <div className="relative w-full h-64 md:h-96 lg:h-[32rem] overflow-hidden bg-muted">
          <img
            src={manga.bannerImage}
            alt={`${manga.title} banner`}
            className="object-cover w-full h-full"
            style={{ objectPosition: 'center top' }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Cover Image Sidebar */}
          <div className="space-y-4">
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

            {/* Sidebar Info */}
            <div className="space-y-3 p-4 rounded-lg border bg-card">
              {/* AniList Link */}
              {manga.anilistId && (
                <div className="text-sm">
                  <Link 
                    href={`https://anilist.co/manga/${manga.anilistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    View on AniList →
                  </Link>
                </div>
              )}

              {/* Adult Content Warning */}
              {manga.isAdult && (
                <div className="text-sm">
                  <Badge variant="destructive">18+ Content</Badge>
                </div>
              )}

              {/* List Status Selector */}
              {session?.user && (
                <div className="space-y-3 pt-3 border-t">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">My List</label>
                    <MangaListStatusSelector
                      mangaId={mangaId}
                      currentStatus={userListEntry?.status as any || null}
                    />
                  </div>

                  {/* Chapter Counter for Reading/Paused/Dropped */}
                  {userListEntry &&
                    ["READING", "PAUSED", "DROPPED"].includes(userListEntry.status) && (
                      <ChapterCounter
                        mangaId={mangaId}
                        currentChapter={userListEntry.currentChapter}
                        maxChapters={manga.chapters}
                      />
                    )}
                </div>
              )}

              {/* Database Info */}
              <div className="text-xs text-muted-foreground space-y-1 pt-3 border-t">
                <div>
                  <span className="font-medium">Database ID:</span> {manga.id}
                </div>
                {manga.createdAt && (
                  <div>
                    <span className="font-medium">Added:</span> {new Date(manga.createdAt).toLocaleDateString()}
                  </div>
                )}
                {manga.updatedAt && (
                  <div>
                    <span className="font-medium">Updated:</span> {new Date(manga.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Title Section */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{manga.title}</h1>
              {manga.titleEnglish && manga.titleEnglish !== manga.title && (
                <p className="text-xl text-muted-foreground mb-1">{manga.titleEnglish}</p>
              )}
              {manga.titleRomaji && (
                <p className="text-lg text-muted-foreground italic">{manga.titleRomaji}</p>
              )}
              {manga.titleNative && manga.titleNative !== manga.title && (
                <p className="text-base text-muted-foreground">{manga.titleNative}</p>
              )}
            </div>

            {/* Status and Basic Info Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">{manga.status}</Badge>
              {manga.format && <Badge variant="outline">{manga.format}</Badge>}
              {manga.chapters && <Badge variant="outline">{manga.chapters} Chapters</Badge>}
              {manga.volumes && <Badge variant="outline">{manga.volumes} Volumes</Badge>}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg border bg-card">
              {manga.averageScore !== null && (
                <div>
                  <div className="text-2xl font-bold">{manga.averageScore}</div>
                  <div className="text-xs text-muted-foreground">Average Score</div>
                </div>
              )}
              {manga.popularity !== null && (
                <div>
                  <div className="text-2xl font-bold">#{manga.popularity}</div>
                  <div className="text-xs text-muted-foreground">Popularity</div>
                </div>
              )}
              {manga.chapters !== null && (
                <div>
                  <div className="text-2xl font-bold">{manga.chapters}</div>
                  <div className="text-xs text-muted-foreground">Chapters</div>
                </div>
              )}
              {manga.volumes !== null && (
                <div>
                  <div className="text-2xl font-bold">{manga.volumes}</div>
                  <div className="text-xs text-muted-foreground">Volumes</div>
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Publication Dates */}
              {(manga.startDate || manga.endDate) && (
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="text-sm font-semibold mb-2">Publication Dates</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {manga.startDate && (
                      <div>
                        <span className="font-medium">Start: </span>
                        {formatDate(manga.startDate)} ({manga.startDate})
                      </div>
                    )}
                    {manga.endDate && (
                      <div>
                        <span className="font-medium">End: </span>
                        {formatDate(manga.endDate)} ({manga.endDate})
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Source */}
              {manga.source && (
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="text-sm font-semibold mb-2">Source</h3>
                  <div className="text-sm text-muted-foreground">{manga.source}</div>
                </div>
              )}

              {/* Country of Origin */}
              {manga.countryOfOrigin && (
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="text-sm font-semibold mb-2">Country of Origin</h3>
                  <div className="text-sm text-muted-foreground">{manga.countryOfOrigin}</div>
                </div>
              )}
            </div>

            {/* Genres */}
            {manga.genres.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {manga.genres.map((genre) => (
                    <Badge key={genre.id} className="bg-primary/10 text-primary hover:bg-primary/20 text-sm px-3 py-1">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <div key={idx} className="group relative">
                      <Badge variant="outline" className="text-xs cursor-help">
                        {tag.name}
                        {tag.category && ` (${tag.category})`}
                      </Badge>
                      {tag.description && (
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-2 text-xs bg-popover border rounded shadow-lg z-10">
                          {tag.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {manga.description && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {manga.description}
                </p>
              </div>
            )}

            {/* Synonyms */}
            {synonyms && synonyms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Alternative Titles</h3>
                <div className="flex flex-wrap gap-2">
                  {synonyms.map((synonym, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {synonym}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Review Form (for completed items) */}
            {session?.user && userListEntry?.status === "COMPLETED" && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Write a Review</h3>
                <ReviewForm
                  animeId={null}
                  mangaId={mangaId}
                  existingReview={userReview || null}
                />
              </div>
            )}

            {/* Reviews Section */}
            <ReviewsSection animeId={null} mangaId={mangaId} />
          </div>
        </div>
      </div>
    </main>
  );
}
