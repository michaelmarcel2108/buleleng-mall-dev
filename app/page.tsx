import { supabase } from "@/lib/supabase";
import HomeTabs from "@/components/HomeTabs";
import Link from "next/link";
import BannerSlideshow from "@/components/BannerSlideshow";

export default async function Home() {
  // Mengambil data banner dari Supabase
  const { data: banners } = await supabase
    .from("banners")
    .select("*");

  // Mengambil data kategori dari Supabase
  const { data: categories } = await supabase
    .from("categories")
    .select("*");

  // Mengambil data toko/UMKM dari Supabase
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*, products(image_url)")
    .limit(4);

  // Mengambil data produk dari Supabase
  const { data: products } = await supabase
    .from("products")
    .select("*, businesses(name)")
    .limit(8);

  return (
    <main>
      <section className="relative flex flex-col gap-4 bg-primary py-8 md:py-16 overflow-hidden">
      
        <div className="absolute inset-0 bg-pattern z-0"></div>

        <div className="relative z-10">
          
          {/* PERBAIKAN: Menghapus aspect ratio ganda. Pengaturan rasio sekarang ditangani murni oleh BannerSlideshow */}
          <div className="w-full px-8 md:px-16 max-w-7xl mx-auto overflow-hidden">
            <BannerSlideshow banners={banners || []} />
          </div>

          <div className="flex flex-col gap-4 px-8 md:px-16 mt-4 text-white font-sans">
            {/* PERBAIKAN: Memastikan text-white diterapkan penuh, mengubah text-white-100 */}
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Produk lokal Buleleng dengan kualitas terbaik.
            </h1>
            <p className="text-lg md:text-xl text-white mt-4 max-w-l">
              Produk-produk dari usaha kecil-menengah Buleleng
            </p>

            <Link 
              href="/catalog" 
              className="bg-[#274a6a] px-8 py-2 text-white text-center rounded-full hover:bg-white hover:text-blue-900 transition-all md:self-start inline-block w-fit font-medium"
            >
              Belanja Sekarang
            </Link>

            <div className="mt-6 flex flex-col gap-3">
              <p className="font-medium text-sm text-white/80 uppercase tracking-wider">
                Jelajahi Kategori
              </p>
              <div className="flex flex-row flex-wrap gap-2">
                {categories?.map((category) => (
                  <Link
                    key={category.id}
                    href={`/catalog?category=${category.slug || category.name.toLowerCase()}`}
                    className="bg-white text-[#274a6a] px-4 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-[#274a6a] hover:text-white transition-colors cursor-pointer"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
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