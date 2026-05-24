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
      <div className="p-16 text-center min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold font-display">Produk tidak ditemukan</h1>
        <Link href="/" className="bg-blue-900 px-6 py-2 rounded-full hover:opacity-90 transition-all font-medium text-white">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <main>
      <section className="md:grid grid-cols-2">
        {data.image_url ? (
          <Image
            className="w-full h-auto object-cover"
            src={data.image_url}
            alt={`Gambar ${data.name}`}
            width={1080}
            height={1920}
          />
        ) : (
          <div className="w-full aspect-square bg-gray-300 flex items-center justify-center">
            No Image
          </div>
        )}
        
        <div className="flex flex-col gap-4 items-start bg-primary p-8 md:justify-end">
          <span className="flex flex-col items-start gap-2">
            {data.categories?.name && (
              <h2
                style={{ backgroundColor: data.categories?.color || "#1e3a8a" }}
                className="text-sm px-3 py-1 font-medium rounded-full text-white"
              >
                {data.categories.name}
              </h2>
            )}

            <h1 className="font-display text-2xl md:text-3xl mt-2">
              {data.name}
            </h1>
            
            <p className="text-3xl md:text-4xl font-bold mt-2 text-blue-900">
              Rp{data.price ? data.price.toLocaleString("id-ID") : "0"}
            </p>
          </span>
          
          <Link
            href={data.shopee_url || "#"}
            target={data.shopee_url ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="w-full bg-blue-900 px-8 py-2 text-white text-center rounded-full hover:opacity-90 transition-all md:self-start md:text-lg mt-4"
          >
            Lihat di Shopee
          </Link>
          <Link
            href={"#"}
            className="w-full bg-background outline px-8 py-2 text-foreground text-center rounded-full hover:bg-primary hover:text-foreground hover:outline-1 outline-foreground transition-all md:self-start md:text-lg"
          >
            Hubungi Penjual
          </Link>
        </div>
      </section>
    </main>
  );
}