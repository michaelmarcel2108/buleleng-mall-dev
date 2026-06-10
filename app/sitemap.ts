import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  
  //ganti url deploy
  const baseUrl = 'http://localhost:3000'; 

  const { data: products } = await supabase.from('products').select('slug, created_at');
  const productUrls = products?.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  const { data: brands } = await supabase.from('businesses').select('slug, created_at');
  const brandUrls = brands?.map((brand) => ({
    url: `${baseUrl}/brand/${brand.slug}`,
    lastModified: brand.created_at ? new Date(brand.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })) || [];

  const { data: plutPosts } = await supabase.from('plut_posts').select('slug, created_at');
  const plutUrls = plutPosts?.map((post) => ({
    url: `${baseUrl}/plut/berita/${post.slug}`, 
    lastModified: post.created_at ? new Date(post.created_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) || [];

  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/catalog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/plut`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/plut/berita`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/plut/pengumuman`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/plut/galeri`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/plut/kontak`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/plut/bank-data`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/plut/agenda-regulasi`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  ];

  return [...staticRoutes, ...productUrls, ...brandUrls, ...plutUrls];
}