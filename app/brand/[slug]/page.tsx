import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const unwrappedParams = await params;
  const slug = unwrappedParams.slug;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*, products(*, businesses(name))")
    .eq("slug", slug)
    .single();

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold font-display">Brand tidak ditemukan</h1>
        <Link
          href="/"
          className="bg-primary px-6 py-2 rounded-full hover:opacity-90 transition-all font-medium text-foreground"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full flex flex-col min-h-screen">
      <section className="bg-primary px-8 py-12 md:px-16 md:py-20 flex flex-col items-center text-center gap-4">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center overflow-hidden relative shadow-sm">
          {business.logo_url ? (
            <Image
              src={business.logo_url}
              alt={business.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <span className="text-4xl md:text-5xl font-display text-gray-400 uppercase">
              {business.name.charAt(0)}
            </span>
          )}
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">
          {business.name}
        </h1>
        <p className="max-w-2xl text-foreground/80">
          {business.desc || "UMKM Kebanggaan Buleleng"}
        </p>

        <div className="flex flex-row gap-1 items-center text-yellow-500 mt-2 bg-white/50 px-4 py-1 rounded-full">
          <span className="flex flex-row tracking-widest text-lg">★★★★★</span>
          <p className="text-foreground/75 text-sm ml-1 text-black font-semibold">(99+ Ulasan)</p>
        </div>
      </section>

      <section className="p-8 md:p-16 flex flex-col gap-6">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide border-b border-gray-200 pb-4">
          Semua Produk ({business.products?.length || 0})
        </h2>
        
        {business.products && business.products.length > 0 ? (
          <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {business.products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Toko ini belum menambahkan produk.</p>
        )}
      </section>
    </main>
  );
}