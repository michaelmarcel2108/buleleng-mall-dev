import { supabase } from "@/lib/supabase";
import HomeTabs from "@/components/HomeTabs";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  // Mengambil data banner
  const { data: banners } = await supabase
    .from("banners")
    .select("*");

  // Mengambil data kategori
  const { data: categories } = await supabase
    .from("categories")
    .select("*");

  // Mengambil data toko
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*, products(image_url)")
    .limit(4);

  // Mengambil data produk
  const { data: products } = await supabase
    .from("products")
    .select("*, businesses(name)")
    .limit(8);

  return (
    <main>
      <section className="flex flex-col gap-4 bg-primary py-8 md:py-16">
        <div className="flex flex-row gap-4 overflow-x-scroll scrollbar-none pl-8 md:pl-16">
          {banners?.map((banner) => (
            <div
              key={banner.id}
              className="h-72 aspect-[1920/1350] bg-gray-200 rounded-lg md:h-96 flex-shrink-0 relative overflow-hidden outline-none border-none shadow-sm"
            >
              <Image
                src={banner.image_url}
                alt={banner.alt_text || "Promo Banner"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 px-8 md:px-16 mt-4">
          <h1 className="font-display text-4xl md:text-5xl">
            Produk lokal Buleleng <br /> dengan kualitas{" "}
            <br className="md:hidden" /> terbaik.
          </h1>
          <p>Produk-produk dari usaha kecil-menengah Buleleng</p>

          <Link href="/catalog" className="bg-blue-900 px-8 py-2 text-background text-center rounded-full hover:bg-background hover:text-foreground hover:outline-1 outline-foreground transition-all md:self-start inline-block w-fit">
            Belanja Sekarang
          </Link>

          {/* BAGIAN KATEGORI */}
          <div className="mt-6 flex flex-col gap-3">
            <p className="font-medium text-sm text-foreground/70 uppercase tracking-wider">
              Jelajahi Kategori
            </p>
            <div className="flex flex-row flex-wrap gap-2">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalog?category=${category.slug || category.name.toLowerCase()}`}
                  className="bg-white px-4 py-2 rounded-md shadow-sm border border-gray-100 text-sm font-medium hover:bg-blue-900 hover:text-white transition-colors cursor-pointer"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="p-8 md:p-16">
        <HomeTabs products={products || []} businesses={businesses || []} />
      </section>
    </main>
  );
}