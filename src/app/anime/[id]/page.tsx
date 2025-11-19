import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { AnimeListStatusSelector } from "@/components/anime-list-status-selector";
import { EpisodeCounter } from "@/components/episode-counter";
import { ReviewForm } from "@/components/review-form";
import { ReviewsSection } from "@/components/reviews-section";
import { FavoriteAnimeButton } from "@/components/favorite-anime-button";
import { isFavoriteAnime } from "@/actions/profile";

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

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const animeId = parseInt(id);
  const userId = (session?.user as any)?.id || session?.user?.id;

  const anime = await prisma.anime.findUnique({
    where: { id: animeId },
    include: { genres: true },
  });

  if (!anime) {
    notFound();
  }

  // Get user's list entry
  const userListEntry = userId
    ? await prisma.userAnimeList.findUnique({
        where: {
          userId_animeId: {
            userId: userId,
            animeId,
          },
        },
      })
    : null;

  // Get user's review
  const userReview = userId
    ? await prisma.review.findUnique({
        where: {
          userId_animeId: {
            userId: userId,
            animeId,
          },
        },
      })
    : null;

  // Check if anime is favorited
  const isFavorited = userId ? await isFavoriteAnime(animeId, userId) : false;

  const studios = parseJSON(anime.studios) as string[] | null;
  const tags = parseJSON(anime.tags) as Array<{ name: string; category?: string; description?: string }> | null;
  const synonyms = parseJSON(anime.synonyms) as string[] | null;

  return (
    <main className="min-h-screen bg-background">
      {/* Banner Image - Full Width */}
      {anime.bannerImage && (
        <div className="relative w-full h-64 md:h-96 lg:h-[32rem] overflow-hidden bg-muted border-b border-border/50">
          <img
            src={anime.bannerImage}
            alt={`${anime.title} banner`}
            className="object-cover w-full h-full"
            style={{ objectPosition: 'center center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Cover Image Sidebar */}
          <div className="space-y-4">
            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              {anime.coverImage ? (
                <img
                  src={anime.coverImage}
                  alt={anime.title}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-3 p-4 rounded-xl border border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
              {/* AniList Link */}
              {anime.anilistId && (
                <div className="text-sm">
                  <Link 
                    href={`https://anilist.co/anime/${anime.anilistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    View on AniList →
                  </Link>
                </div>
              )}

              {/* Adult Content Warning */}
              {anime.isAdult && (
                <div className="text-sm">
                  <Badge variant="destructive">18+ Content</Badge>
                </div>
              )}

              {/* List Status Selector */}
              {session?.user && (
                <div className="space-y-3 pt-3 border-t">
                  {/* Favorite Button */}
                  <div>
                    <FavoriteAnimeButton
                      animeId={animeId}
                      isFavorite={isFavorited}
                      userId={userId || ""}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">My List</label>
                    <AnimeListStatusSelector
                      animeId={animeId}
                      currentStatus={userListEntry?.status as any || null}
                    />
                  </div>

                  {/* Episode Counter for Watching/Paused/Dropped */}
                  {userListEntry &&
                    ["WATCHING", "PAUSED", "DROPPED"].includes(userListEntry.status) && (
                      <EpisodeCounter
                        animeId={animeId}
                        currentEpisode={userListEntry.currentEpisode}
                        maxEpisodes={anime.episodes}
                      />
                    )}
                </div>
              )}

              {/* Database Info */}
              <div className="text-xs text-muted-foreground space-y-1 pt-3 border-t">
                <div>
                  <span className="font-medium">Database ID:</span> {anime.id}
                </div>
                {anime.createdAt && (
                  <div>
                    <span className="font-medium">Added:</span> {new Date(anime.createdAt).toLocaleDateString()}
                  </div>
                )}
                {anime.updatedAt && (
                  <div>
                    <span className="font-medium">Updated:</span> {new Date(anime.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Title Section */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{anime.title}</h1>
              {anime.titleEnglish && anime.titleEnglish !== anime.title && (
                <p className="text-xl text-muted-foreground mb-1">{anime.titleEnglish}</p>
              )}
              {anime.titleRomaji && (
                <p className="text-lg text-muted-foreground italic">{anime.titleRomaji}</p>
              )}
              {anime.titleNative && anime.titleNative !== anime.title && (
                <p className="text-base text-muted-foreground">{anime.titleNative}</p>
              )}
            </div>

            {/* Status and Basic Info Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">{anime.status}</Badge>
              {anime.format && <Badge variant="outline">{anime.format}</Badge>}
              {anime.season && <Badge variant="outline">{anime.season}</Badge>}
              {anime.seasonYear && <Badge variant="outline">{anime.seasonYear}</Badge>}
              {anime.episodes && <Badge variant="outline">{anime.episodes} Episodes</Badge>}
              {anime.duration && <Badge variant="outline">{anime.duration} min/ep</Badge>}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl border border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
              {anime.averageScore !== null && (
                <div className="text-center p-3 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="text-3xl font-bold text-primary">{anime.averageScore}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Average Score</div>
                </div>
              )}
              {anime.popularity !== null && (
                <div className="text-center p-3 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="text-3xl font-bold">#{anime.popularity}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Popularity</div>
                </div>
              )}
              {anime.episodes !== null && (
                <div className="text-center p-3 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="text-3xl font-bold">{anime.episodes}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Episodes</div>
                </div>
              )}
              {anime.duration !== null && (
                <div className="text-center p-3 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="text-3xl font-bold">{anime.duration}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Minutes/Ep</div>
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Airing Dates */}
              {(anime.startDate || anime.endDate) && (
                <div className="p-4 rounded-xl border border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    Airing Dates
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    {anime.startDate && (
                      <div className="p-2 rounded-lg hover:bg-primary/5 transition-colors">
                        <span className="font-semibold text-foreground">Start: </span>
                        {formatDate(anime.startDate)} ({anime.startDate})
                      </div>
                    )}
                    {anime.endDate && (
                      <div className="p-2 rounded-lg hover:bg-primary/5 transition-colors">
                        <span className="font-semibold text-foreground">End: </span>
                        {formatDate(anime.endDate)} ({anime.endDate})
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Studios */}
              {studios && Array.isArray(studios) && studios.length > 0 && (
                <div className="p-4 rounded-xl border border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    Studios
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {studios.map((studio, idx) => (
                      <span key={idx} className="p-2 rounded-lg hover:bg-primary/5 transition-colors inline-block mr-1">
                        {studio}
                        {idx < studios.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Source */}
              {anime.source && (
                <div className="p-4 rounded-xl border border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    Source
                  </h3>
                  <div className="text-sm text-muted-foreground p-2 rounded-lg hover:bg-primary/5 transition-colors inline-block">{anime.source}</div>
                </div>
              )}

              {/* Country of Origin */}
              {anime.countryOfOrigin && (
                <div className="p-4 rounded-xl border border-white/10 dark:border-white/5 bg-card/50 backdrop-blur-sm">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    Country of Origin
                  </h3>
                  <div className="text-sm text-muted-foreground p-2 rounded-lg hover:bg-primary/5 transition-colors inline-block">{anime.countryOfOrigin}</div>
                </div>
              )}
            </div>

            {/* Genres */}
            {anime.genres.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <Badge key={genre.id} className="bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 text-sm px-4 py-1.5 font-semibold transition-all duration-200 cursor-default">
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
            {anime.description && (
              <div>
                <h2 className="text-2xl font-bold mb-4 tracking-tight flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full" />
                  Description
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
                  {anime.description}
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
                  animeId={animeId}
                  mangaId={null}
                  existingReview={userReview || null}
                />
              </div>
            )}

            {/* Reviews Section */}
            <ReviewsSection animeId={animeId} mangaId={null} />
          </div>
        </div>
      </div>
    </main>
  );
}
