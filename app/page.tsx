import HomeTabs from "@/components/HomeTabs";
import Link from "next/link";
import BannerSlideshow from "@/components/BannerSlideshow";
import ScrollHint from "@/components/ScrollHint";
import ArticleCard from "@/components/ArticleCard";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: categories } = await supabase.from("categories").select("*");

  const { data: businesses } = await supabase
    .from("businesses")
    .select("*, products(image_url)")
    .limit(4);

  const { data: products } = await supabase
    .from("products")
    .select("*, businesses(name)")
    .limit(8);

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <main className="pb-10">
      <section className="relative flex flex-col gap-6 md:gap-8 bg-[#274a6a] py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-pattern z-0 opacity-20 pointer-events-none"></div>
        <div className="relative z-10 w-full flex flex-col gap-6 md:gap-8">
          <div className="w-full px-4 md:px-16 mx-auto overflow-hidden">
            <div className="max-w-6xl mx-auto shadow-lg rounded-xl overflow-hidden">
              <BannerSlideshow />
            </div>
          </div>

          <div className="flex flex-col gap-4 px-4 md:px-16 text-white font-sans max-w-4xl mx-auto text-center items-center">
            <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm">
              Bangga Karya Buleleng <br className="hidden md:block" /> Kualitas
              Global, Pesona Lokal
            </h1>
            <p className="text-sm md:text-base text-white/90 max-w-2xl leading-relaxed">
              Temukan koleksi eksklusif dari UMKM terbaik Buleleng. Dari
              tangan-tangan kreatif lokal, kini hadir lebih dekat untuk kita
              semua. Mari dukung dan majukan ekonomi kreatif daerah!
            </p>
            <Link
              href="/catalog"
              className="mt-3 bg-white px-8 py-3 text-[#274a6a] text-center rounded-full hover:bg-gray-100 hover:scale-105 transition-all inline-block w-fit font-bold shadow-lg"
            >
              Belanja Sekarang
            </Link>

            <div className="mt-5 md:mt-6 flex flex-col items-center gap-3 w-full">
              <p className="font-medium text-xs md:text-sm text-white/70 uppercase tracking-wider">
                Jelajahi Kategori
              </p>
              <div className="flex flex-row flex-wrap justify-center gap-2 max-w-3xl">
                {categories?.map((category) => (
                  <Link
                    key={category.id}
                    href={`/catalog?category=${category.slug || category.name.toLowerCase()}`}
                    className="bg-white/10 border border-white/20 backdrop-blur-sm text-white px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-white hover:text-[#274a6a] transition-colors cursor-pointer"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <ScrollHint />
          </div>
        </div>
      </section>

      <section className="p-4 md:p-16 max-w-7xl mx-auto">
        <HomeTabs products={products || []} businesses={businesses || []} />
      </section>

      {articles && articles.length > 0 && (
        <section className="px-4 md:px-16 pt-8 pb-12 bg-gray-50 border-t border-gray-100 mt-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#274a6a] font-display">
                  Berita & Artikel
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Ikuti kabar terbaru dan cerita menarik seputar UMKM lokal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} post={article} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
