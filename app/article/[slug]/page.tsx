import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Metadata, ResolvingMetadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Helper function to create a plain text snippet from the article content
function getExcerpt(text: string, length: number = 150) {
  if (!text) return "";
  // Remove potential markdown/HTML tags if present, and truncate
  return text.replace(/(<([^>]+)>)/gi, "").substring(0, length) + "...";
}

export async function generateMetadata(
  { params }: ArticlePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  const supabase = await createClient();

  // Fetch only what's needed for SEO
  const { data: article } = await supabase
    .from("articles")
    .select("title, content, image_url, author, created_at, slug")
    .eq("slug", slug)
    .maybeSingle();

  const siteName = "Buleleng Mall";

  if (!article) {
    return {
      title: `Artikel Tidak Ditemukan | ${siteName}`,
    };
  }

  const excerpt = getExcerpt(article.content);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${article.title} | ${siteName}`,
    description: excerpt,
    alternates: {
      canonical: `/article/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: excerpt,
      url: `/article/${article.slug}`,
      siteName: siteName,
      type: "article", // Crucial for blog posts
      publishedTime: article.created_at,
      authors: article.author ? [article.author] : [],
      images: article.image_url
        ? [
            {
              url: article.image_url,
              width: 1200,
              height: 630, // Standard article image ratio
              alt: article.title,
            },
            ...previousImages,
          ]
        : previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: excerpt,
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!article) {
    notFound();
  }

  const { data: recommendations } = await supabase
    .from("articles")
    .select("*")
    .neq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <main className="min-h-screen bg-gray-50 py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#274a6a] hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
                {article.title}
              </h1>

              <div className="flex items-center gap-3 text-xs md:text-sm text-gray-500 pb-4 border-b border-gray-100">
                <span className="font-semibold text-[#274a6a]">
                  {article.author}
                </span>
                <span className="text-gray-300">•</span>
                <span>
                  {new Date(article.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {article.image_url && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line font-sans">
              {article.content}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-4">
            <h2 className="text-base font-bold text-gray-800 font-display border-b border-gray-200 pb-2 uppercase tracking-wider">
              Artikel Lainnya
            </h2>

            <div className="flex flex-col gap-3">
              {recommendations && recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <Link
                    key={rec.id}
                    href={`/article/${rec.slug}`}
                    className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    {rec.image_url ? (
                      <img
                        src={rec.image_url}
                        alt={rec.title}
                        className="w-20 h-20 object-cover rounded-lg bg-gray-50 flex-shrink-0 border"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 flex-shrink-0 border border-dashed">
                        No Img
                      </div>
                    )}
                    <div className="flex flex-col justify-between py-0.5 overflow-hidden">
                      <h3 className="font-bold text-gray-800 text-xs md:text-sm line-clamp-2 group-hover:text-[#274a6a] transition-colors leading-snug">
                        {rec.title}
                      </h3>
                      <span className="text-[10px] text-gray-400">
                        {new Date(rec.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Tidak ada rekomendasi artikel lainnya.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
