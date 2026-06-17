import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductDescription from "@/components/ProductDescription";
import { Product } from "@/types";

interface ProductDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailProps) {
  const { slug } = await params;

  const supabase = await createClient();

  // Query disesuaikan menjadi categories (id, name, color) untuk Many-to-Many
  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      id,
      slug,
      name,
      price,
      description,
      image_url,
      shopee_url,
      tokopedia_url, 
      categories (id, name, color),
      businesses (id, name, slug)
      `
    )
    .eq("slug", slug)
    .limit(1);

  const { data: catalogProducts } = await supabase
    .from("products")
    .select("*, businesses(name)")
    .neq("slug", slug)
    .limit(4);

  if (error || !products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between pt-16">
        
        {/* WADAH ERROR */}
        <div className="max-w-md mx-auto text-center py-12 px-4">
          <div className="inline-flex p-4 bg-red-50 rounded-full text-red-500 mb-4 animate-bounce">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900 tracking-tight">
            Produk Tidak Ditemukan
          </h2>
          <p className="mt-3 text-gray-500 text-sm md:text-base leading-relaxed">
            Waduh, produk UMKM yang kamu cari sepertinya tidak ada, sudah dihapus. Mari kita cari produk menarik lainnya di bawah ini!
          </p>
          <div className="mt-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        <hr className="border-gray-200 max-w-5xl mx-auto w-full my-4" />

        {/* REKOMENDASI KATALOG PRODUK */}
        <section className="max-w-5xl mx-auto w-full relative z-10 px-4 md:px-8 pb-16">
          <h3 className="text-2xl font-display font-bold text-foreground mb-6 text-center md:text-left">
            Coba Lihat Katalog Kita yang Lainnya
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {catalogProducts && catalogProducts.length > 0 ? (
              catalogProducts.map((product) => (
                <ProductCard key={product.id} product={product as Product} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full py-12 text-center bg-white border border-gray-200 rounded-2xl">
                Produk Tidak Tersedia
              </p>
            )}
          </div>
          <div className="mt-8 text-center">
            <Link 
              href="/catalog" 
              className="inline-block px-6 py-2 border border-foreground text-foreground rounded-full hover:bg-foreground hover:text-white transition-all font-medium text-sm md:text-base shadow-sm"
            >
              Lihat Semua Katalog
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mainProduct = products[0] as any;
  const productData = mainProduct;
  
  // Ambil semua kategori sebagai list
  const categoriesList = Array.isArray(mainProduct.categories) 
    ? mainProduct.categories 
    : (mainProduct.categories ? [mainProduct.categories] : []);
    
  const businessData = Array.isArray(mainProduct.businesses) ? mainProduct.businesses[0] : mainProduct.businesses;

  const waNumber = "6282341657788";
  const waMessage = `Halo ${businessData?.name || "Admin"}, saya tertarik untuk membeli produk *${mainProduct.name}* seharga Rp${mainProduct.price ? mainProduct.price.toLocaleString("id-ID") : "0"} yang saya temukan di Buleleng Mall. Apakah stoknya masih tersedia?`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="w-full min-h-screen bg-gray-50/50 py-8 md:py-16 px-4 md:px-8 relative overflow-hidden">
      <section className="max-w-5xl mx-auto p-4 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10 items-start">
        
        {/* BAGIAN KIRI: GAMBAR */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* TAMPILKAN SEMUA KATEGORI */}
            {categoriesList.map((cat: any) => (
              <div 
                key={cat.id} 
                className="inline-block px-3 py-1.5 rounded-md text-white font-medium text-xs shadow-sm" 
                style={{ backgroundColor: cat.color || "#274a6a" }}
              >
                {cat.name}
              </div>
            ))}

            {businessData?.name && (
              <Link href={`/brand/${businessData.slug}`} className="text-xs px-4 py-1.5 font-medium rounded-full bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm">
                Toko: {businessData.name}
              </Link>
            )}
          </div>
          <div className="w-full aspect-square relative shadow-sm border border-gray-100 rounded-xl overflow-hidden bg-gray-100">
            {mainProduct.image_url ? (
              <Image src={mainProduct.image_url} alt={`Gambar ${mainProduct.name}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
        </div>

        {/* BAGIAN KANAN: DETAIL PRODUK */}
        <div className="flex flex-col w-full">
          
          <div className="flex flex-col items-start gap-3 w-full">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">{mainProduct.name}</h1>
            <div className="text-3xl md:text-4xl font-bold text-foreground border-b border-gray-100 pb-4 w-full" suppressHydrationWarning>
              Rp{mainProduct.price ? mainProduct.price.toLocaleString("id-ID") : "0"}
            </div>
          </div>

          <div className="w-full flex flex-col mt-4">
            <div className="font-sans font-bold text-gray-900 text-sm md:text-base uppercase tracking-wider mb-2">
              Deskripsi Produk
            </div>
            <ProductDescription text={mainProduct.description || ""} />
          </div>

          {/* TOMBOL */}
          <div className="flex flex-col gap-2 w-full mt-6">
            {mainProduct.shopee_url && (
              <Link href={mainProduct.shopee_url} target="_blank" rel="noopener noreferrer" className="w-full bg-[#EE4D2D] py-2 px-4 text-white text-center rounded-lg font-medium hover:opacity-90 transition-all text-sm shadow-sm">
                Beli di Shopee
              </Link>
            )}
            {productData.tokopedia_url && (
              <Link href={productData.tokopedia_url} target="_blank" rel="noopener noreferrer" className="w-full bg-[#00AA5B] py-2 px-4 text-white text-center rounded-lg font-medium hover:opacity-90 transition-all text-sm shadow-sm">
                Beli di Tokopedia
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* KATALOG PRODUK NORMAL */}
      <section className="max-w-5xl mx-auto mt-12 md:mt-20 w-full relative z-10">
        <h3 className="text-2xl font-display font-bold text-foreground mb-6">Katalog Produk Lainnya</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {catalogProducts && catalogProducts.length > 0 ? (
            catalogProducts.map((product) => <ProductCard key={product.id} product={product as Product} />)
          ) : (
            <p className="text-gray-500 col-span-full py-4 text-center">Produk Tidak Tersedia</p>
          )}
        </div>
        <div className="mt-8 text-center">
          <Link href="/catalog" className="inline-block px-6 py-2 border border-foreground text-foreground rounded-full hover:bg-foreground hover:text-white transition-all font-medium text-sm md:text-base shadow-sm">
            Lihat Semua Katalog
          </Link>
        </div>
      </section>

      {/* TOMBOL WHATSAPP */}
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 bg-green-600 text-white p-4 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:bg-green-400 hover:-translate-y-1 hover:scale-110 transition-all duration-300 flex items-center justify-center">
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.955c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.549 4.142 1.594 5.945L.057 24l6.398-1.679a11.87 11.87 0 005.593 1.424h.005c6.556 0 11.892-5.335 11.892-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
    </main>
  );
}