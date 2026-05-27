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
      {/* SECTION HERO UTAMA */}
      {/* Tambahan 'overflow-hidden' agar pattern tidak keluar batas */}
      <section className="relative flex flex-col gap-4 bg-primary py-8 md:py-16 overflow-hidden">
        
        {/* Layer Pattern Batik */}
        <div className="absolute inset-0 bg-pattern z-0"></div>

        {/* Bungkus konten dengan relative z-10 agar tetap di depan pattern */}
        <div className="relative z-10">
          {/* Menggunakan komponen slideshow untuk banner */}
          <BannerSlideshow banners={banners || []} />

          {/* Bagian teks informasi dengan font sans-serif dan warna putih */}
          <div className="flex flex-col gap-4 px-8 md:px-16 mt-4 text-white font-sans">
            <h1 className="text-4xl md:text-5xl font-bold">
              Produk lokal Buleleng <br /> dengan kualitas{" "}
              <br className="md:hidden" /> terbaik.
            </h1>
            <p className="text-white/90">
              Produk-produk dari usaha kecil-menengah Buleleng
            </p>

            <Link 
              href="/catalog" 
              className="bg-[#274a6a] px-8 py-2 text-white text-center rounded-full hover:bg-white hover:text-blue-900 transition-all md:self-start inline-block w-fit font-medium"
            >
              Belanja Sekarang
            </Link>

            {/* BAGIAN JELAJAHI KATEGORI */}
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

      {/* SECTION PRODUK TERLARIS, BRAND LOKAL, & INCARAN */}
      <section className="p-8 md:p-16">
        <HomeTabs products={products || []} businesses={businesses || []} />
      </section>
    </main>
  );
}