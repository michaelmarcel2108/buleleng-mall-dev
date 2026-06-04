import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", currentSlug)
    .single();

  if (!business) {
    notFound();
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, businesses(id, name, slug), categories(id, name, color)")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <section className="relative w-full min-h-75 md:min-h-100 bg-[#274a6a] flex flex-col items-center justify-center text-center px-4 py-12 overflow-hidden">
        {business.image_url && (
          <Image
            width={500}
            height={500}
            src={business.image_url}
            alt={`Foto ${business.name}`}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}

        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center mt-8">
          {business.logo_url ? (
            <Image
              width={500}
              height={500}
              src={business.logo_url}
              alt={`Logo ${business.name}`}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover mb-4 shadow-lg bg-white"
            />
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white text-[#274a6a] flex items-center justify-center text-xl md:text-2xl font-bold mb-4 shadow-lg border-4 border-white">
              {business.name.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 drop-shadow-md">
            {business.name}
          </h1>

          <p className="text-white/90 text-sm md:text-base max-w-2xl drop-shadow-md mb-4 leading-relaxed">
            {business.desc ||
              "Mitra resmi UMKM Buleleng Mall. Menghadirkan produk-produk lokal berkualitas terbaik langsung untuk Anda."}
          </p>

          {(business.shopee_url ||
            business.instagram_url ||
            business.tiktok_url) && (
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {business.shopee_url && (
                <a
                  href={business.shopee_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all"
                  title="Shopee"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </a>
              )}

              {business.instagram_url && (
                <a
                  href={business.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all"
                  title="Instagram"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}

              {business.tiktok_url && (
                <a
                  href={business.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all"
                  title="TikTok"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.63-.39 3.26-1.16 4.69-1.55 2.86-4.7 4.54-7.94 4.2-3.17-.33-5.91-2.43-6.95-5.4-.82-2.33-.49-5.01.89-7.05 1.34-1.99 3.65-3.35 6.04-3.52 1.05-.07 2.1.04 3.12.31v4.1c-1.3-.35-2.73-.25-3.95.34-1.25.6-2.18 1.76-2.48 3.12-.31 1.39.11 2.89 1.1 3.89 1.25 1.26 3.26 1.48 4.79.52.92-.57 1.52-1.57 1.64-2.65.17-1.57.06-3.17.06-4.76V.02z" />
                  </svg>
                </a>
              )}
            </div>
          )}

          <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-2 rounded-full text-xs md:text-sm flex items-center gap-2 shadow-sm font-medium">
            <span>Terverifikasi</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            <span>UMKM Buleleng</span>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 md:px-16 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 border-l-4 border-[#274a6a] pl-3">
            Semua Produk
          </h2>
          <span className="text-sm text-gray-500 font-medium">
            {products?.length || 0} Produk
          </span>
        </div>

        {!products || products.length === 0 ? (
          <div className="w-full bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-700">
              Belum Ada Produk
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Toko ini belum menambahkan produk ke dalam katalog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}