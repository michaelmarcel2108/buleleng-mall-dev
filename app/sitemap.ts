import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bulelengmall.com'; //fallback enviro

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

  const staticRoutes = [
    { 
      url: `${baseUrl}`, 
      lastModified: new Date(), 
      changeFrequency: 'daily' as const, 
      priority: 1.0 
    },
    { 
      url: `${baseUrl}/catalog`, 
      lastModified: new Date(), 
      changeFrequency: 'daily' as const, 
      priority: 0.9 
    },
  ];

  return [...staticRoutes, ...productUrls, ...brandUrls];
}