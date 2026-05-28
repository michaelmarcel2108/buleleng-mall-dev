import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug;

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
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <section className="relative w-full min-h-[300px] md:min-h-[400px] bg-[#274a6a] flex flex-col items-center justify-center text-center px-4 py-12 overflow-hidden">
        {business.image_url && (
          <img 
            src={business.image_url} 
            alt={`Foto ${business.name}`} 
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}

        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center mt-8">
          {business.logo_url ? (
            <img 
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
          
          <p className="text-white/90 text-sm md:text-base max-w-2xl drop-shadow-md mb-6 leading-relaxed">
            {business.description || "Mitra resmi UMKM Buleleng Mall. Menghadirkan produk-produk lokal berkualitas terbaik langsung untuk Anda."}
          </p>

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
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-700">Belum Ada Produk</h3>
            <p className="text-sm text-gray-500 mt-2">Toko ini belum menambahkan produk ke dalam katalog.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link 
                href={`/product/${product.slug}`} 
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2 group-hover:text-[#274a6a] transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-auto pt-3">
                    <p className="font-bold text-[#274a6a]">
                      Rp {product.price?.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}