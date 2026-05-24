import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const unwrappedParams = await params;
  const slug = unwrappedParams.slug;
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select(
      `
      id,
      slug,
      name,
      price,
      image_url,
      shopee_url,
      categories:category_id (id, name, color)
      `
    )
    .eq("slug", slug)
    .single();

  if (!data) {
    return (
      <div className="p-16 text-center min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-gray-50/50">
        <h1 className="text-2xl font-bold font-display">Produk tidak ditemukan</h1>
        <Link href="/" className="bg-blue-900 px-6 py-2 rounded-full hover:opacity-90 transition-all font-medium text-white">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Trik untuk mengakali TypeScript yang bingung dengan tipe data relasi Supabase
  const categoryData = data.categories as any;

  return (
    <main className="w-full min-h-screen bg-gray-50/50 py-8 md:py-16 px-4 md:px-8">
      <section className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        
        <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-gray-100">
          {data.image_url ? (
            <Image
              src={data.image_url}
              alt={`Gambar ${data.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-4 items-start justify-center">
          <div className="flex flex-col items-start gap-3 w-full">
            {/* Ubah pemanggilan data.categories menjadi categoryData */}
            {categoryData?.name && (
              <h2
                style={{ backgroundColor: categoryData?.color || "#1e3a8a" }}
                className="text-xs md:text-sm px-4 py-1.5 font-medium rounded-full text-white shadow-sm"
              >
                {categoryData.name}
              </h2>
            )}

            <h1 className="font-display text-3xl md:text-4xl mt-2 text-gray-900">
              {data.name}
            </h1>
            
            <p className="text-3xl md:text-4xl font-bold mt-2 text-blue-900 border-b border-gray-100 pb-6 w-full">
              Rp{data.price ? data.price.toLocaleString("id-ID") : "0"}
            </p>
          </div>
          
          <div className="flex flex-col gap-3 w-full mt-4">
            <Link
              href={data.shopee_url || "#"}
              target={data.shopee_url ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="w-full bg-blue-900 px-8 py-3 text-white text-center rounded-xl font-medium hover:opacity-90 transition-all md:text-lg shadow-sm"
            >
              Beli di Shopee
            </Link>
            <Link
              href={"#"}
              className="w-full bg-white border-2 border-blue-900 text-blue-900 px-8 py-3 text-center rounded-xl font-medium hover:bg-blue-50 transition-all md:text-lg"
            >
              Hubungi Penjual (WhatsApp)
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}