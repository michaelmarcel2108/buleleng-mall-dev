import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bulelengmall.com";

  // Initialize Supabase to fetch your dynamic slugs
  const supabase = await createClient();

  // 1. Define Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0, // Highest priority
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // 2. Fetch Product Routes dynamically
  const { data: products } = await supabase
    .from("products")
    .select("slug, created_at");

  const productRoutes: MetadataRoute.Sitemap = (products || []).map(
    (product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.created_at),
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  // 3. Fetch Article Routes dynamically
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, created_at");

  const articleRoutes: MetadataRoute.Sitemap = (articles || []).map(
    (article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: new Date(article.created_at),
      changeFrequency: "monthly", // Articles change less often than products
      priority: 0.6,
    }),
  );

  // 4. Combine all routes and return them
  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
