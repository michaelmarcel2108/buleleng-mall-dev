import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ArticleCard from "@/components/ArticleCard";
import PlutBannerSlideshow from "@/components/PlutBannerSlideshow";

// Fungsi pembantu untuk format tanggal
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default async function PlutBerandaPage() {
  const supabase = await createClient();

  // Data Berita
  const { data: latestNews } = await supabase
    .from("plut_posts")
    .select("*")
    .eq("post_type", "berita")
    .order("created_at", { ascending: false })
    .limit(3);

  // Data Pengumuman
  const { data: latestAnnouncements } = await supabase
    .from("plut_posts")
    .select("*")
    .eq("post_type", "pengumuman")
    .order("created_at", { ascending: false })
    .limit(3);

  // Data Infografis
  const { data: latestInfographics } = await supabase
    .from("plut_posts")
    .select("*")
    .eq("post_type", "infografis")
    .order("created_at", { ascending: false })
    .limit(2);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans flex flex-col">
      
      {/* 1. BANNER SLIDE SHOW - Memanggil Komponen B */}
      <PlutBannerSlideshow />

      {/* KONTEN UTAMA */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* KOLOM KIRI */}
        <div className="lg:col-span-8 space-y-16">
          {/* BERITA */}
          <div>
            <div className="flex justify-between items-end mb-8 border-b border-neutral-200 pb-4">
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#407d99] rounded-full"></span>
                Berita & Kegiatan Terbaru
              </h2>
              <Link href="/plut/berita" className="text-sm font-bold text-[#407d99] hover:underline">Lihat Semua &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews?.map((news) => <ArticleCard key={news.id} post={news} />) || <p>Belum ada berita.</p>}
            </div>
          </div>

          {/* INFOGRAFIS */}
          <div>
            <div className="flex justify-between items-end mb-8 border-b border-neutral-200 pb-4">
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#407d99] rounded-full"></span>
                Infografis Kebijakan
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestInfographics?.map((info) => (
                <Link href={`/plut/berita/${info.slug}`} key={info.id} className="block group relative rounded-2xl overflow-hidden border border-neutral-200 aspect-[16/10] shadow-sm bg-neutral-100">
                  <Image src={info.image_url || "/hero-image.jpeg"} alt={info.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </Link>
              )) || <p>Belum ada infografis.</p>}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: PENGUMUMAN */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm sticky top-28">
            <h2 className="font-extrabold text-lg text-neutral-900 mb-6 flex items-center gap-2">Papan Pengumuman</h2>
            <div className="space-y-4">
              {latestAnnouncements?.map((ann) => (
                <Link href={`/plut/berita/${ann.slug}`} key={ann.id} className="block p-4 rounded-xl border bg-neutral-50 hover:bg-[#407d99]/5 transition-all">
                  <span className="text-[10px] font-extrabold text-[#407d99] uppercase">{formatDate(ann.created_at)}</span>
                  <h3 className="font-bold text-neutral-800 text-sm">{ann.title}</h3>
                </Link>
              )) || <p className="text-sm text-center">Tidak ada pengumuman.</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}