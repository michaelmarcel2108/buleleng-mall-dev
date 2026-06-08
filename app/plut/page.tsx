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

  // Mengambil Settings (Banner)
  const { data: settings } = await supabase
    .from("plut_settings")
    .select("hero_image_url")
    .eq("id", 1)
    .single();

  // Mengambil array gambar banner (default jika tidak ada)
  const heroImages = settings?.hero_image_url ? [settings.hero_image_url] : ["/hero-image.jpeg"];

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
      
      {/* 1. BANNER SLIDE SHOW (Menggunakan Komponen Client) */}
      <PlutBannerSlideshow images={heroImages} />

      {/* KONTEN UTAMA: BERITA, PENGUMUMAN, INFOGRAFIS */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* KOLOM KIRI (col-span-8) */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* SECTION BERITA */}
          <div>
            <div className="flex justify-between items-end mb-8 border-b border-neutral-200 pb-4">
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#407d99] rounded-full"></span>
                Berita & Kegiatan Terbaru
              </h2>
              <Link href="/plut/berita" className="text-sm font-bold text-[#407d99] hover:underline">
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews && latestNews.length > 0 ? (
                latestNews.map((news) => (
                  <ArticleCard key={news.id} post={news} />
                ))
              ) : (
                <p className="text-sm text-neutral-500 col-span-full bg-white p-6 rounded-2xl border border-neutral-200 text-center">Belum ada berita terbaru.</p>
              )}
            </div>
          </div>

          {/* SECTION INFOGRAFIS */}
          <div>
            <div className="flex justify-between items-end mb-8 border-b border-neutral-200 pb-4">
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#407d99] rounded-full"></span>
                Infografis Kebijakan
              </h2>
              <Link href="/plut/infografis" className="text-sm font-bold text-[#407d99] hover:underline">
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestInfographics && latestInfographics.length > 0 ? (
                latestInfographics.map((info) => (
                  <Link href={`/plut/berita/${info.slug}`} key={info.id} className="block group relative rounded-2xl overflow-hidden border border-neutral-200 aspect-[16/10] shadow-sm bg-neutral-100">
                    <Image 
                      src={info.image_url || "/hero-image.jpeg"} 
                      alt={info.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                ))
              ) : (
                <p className="text-sm text-neutral-500 col-span-full bg-white p-6 rounded-2xl border border-neutral-200 text-center">Belum ada banner infografis.</p>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: PENGUMUMAN (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sticky top-28">
            <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-3">
              <h2 className="font-extrabold text-lg text-neutral-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#407d99]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                Papan Pengumuman
              </h2>
              <Link href="/plut/pengumuman" className="text-xs font-bold text-[#407d99] hover:underline">Semua</Link>
            </div>

            <div className="space-y-4">
              {latestAnnouncements && latestAnnouncements.length > 0 ? (
                latestAnnouncements.map((ann) => (
                  <Link href={`/plut/berita/${ann.slug}`} key={ann.id} className="block group p-4 rounded-xl border border-neutral-100 bg-neutral-50 hover:bg-[#407d99]/5 hover:border-[#407d99]/30 transition-all">
                    <span className="text-[10px] font-extrabold text-[#407d99] uppercase block mb-1">
                      {formatDate(ann.published_date || ann.created_at)}
                    </span>
                    <h3 className="font-bold text-neutral-800 text-sm leading-snug line-clamp-2 group-hover:text-[#407d99] transition-colors">
                      {ann.title}
                    </h3>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-neutral-500 text-center py-4">Tidak ada pengumuman baru.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION EMBED SOSIAL MEDIA & LINK TAUTAN CEPAT */}
      <section className="bg-neutral-100 border-t border-b border-neutral-200 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-sm h-[400px] flex flex-col">
            <h3 className="font-extrabold text-xl mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#407d99] rounded-full"></span>
              Aktivitas Kanal YouTube
            </h3>
            <div className="flex-grow bg-neutral-900 rounded-2xl overflow-hidden relative shadow-inner">
              <iframe 
                src="https://www.youtube.com/embed/hNMCeHhMFu0?si=CkMq_izOdOrvXiC5&amp;start=6"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                title="YouTube Instansi"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-extrabold text-2xl text-neutral-900 tracking-tight mb-3">
                Akses Layanan Terintegrasi
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Guna mendukung transparansi data dan mempermudah regulasi, kita mengintegrasikan beberapa pranala luar resmi yang dapat diakses langsung oleh masyarakat.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="/plut/agenda-regulasi" className="p-5 bg-white rounded-2xl border border-neutral-200 hover:border-[#407d99]/50 hover:bg-[#407d99]/5 shadow-sm transition-all flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-neutral-50 text-[#407d99] flex items-center justify-center shrink-0 group-hover:bg-[#407d99] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <span className="font-bold text-sm text-neutral-800 group-hover:text-[#407d99]">Portal JDIH Daerah</span>
              </a>
              <a href="/plut/agenda-regulasi" className="p-5 bg-white rounded-2xl border border-neutral-200 hover:border-[#407d99]/50 hover:bg-[#407d99]/5 shadow-sm transition-all flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-neutral-50 text-[#407d99] flex items-center justify-center shrink-0 group-hover:bg-[#407d99] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <span className="font-bold text-sm text-neutral-800 group-hover:text-[#407d99]">Transparansi PPID</span>
              </a>
              <a href="https://bulelengkab.go.id" target="_blank" rel="noopener noreferrer" className="p-5 bg-white rounded-2xl border border-neutral-200 hover:border-[#407d99]/50 hover:bg-[#407d99]/5 shadow-sm transition-all flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-neutral-50 text-[#407d99] flex items-center justify-center shrink-0 group-hover:bg-[#407d99] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                </div>
                <span className="font-bold text-sm text-neutral-800 group-hover:text-[#407d99]">Web Pemkab Buleleng</span>
              </a>
              <a href="/plut/bank-data" className="p-5 bg-white rounded-2xl border border-neutral-200 hover:border-[#407d99]/50 hover:bg-[#407d99]/5 shadow-sm transition-all flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-neutral-50 text-[#407d99] flex items-center justify-center shrink-0 group-hover:bg-[#407d99] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                </div>
                <span className="font-bold text-sm text-neutral-800 group-hover:text-[#407d99]">Bank Data Drive</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO PROFIL */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center w-full">
        <span className="text-[#407d99] font-extrabold text-xs uppercase tracking-widest block mb-3">Multimedia</span>
        <h2 className="text-3xl font-extrabold text-neutral-900 mb-4">Video Profil Instansi</h2>
        <div className="w-full aspect-video bg-neutral-900 rounded-3xl shadow-xl overflow-hidden relative border border-neutral-200">
          <iframe 
            src="https://www.youtube.com/embed/yzLUprmgtG4?si=sKYF-wgTCM3NbRcE&start=6" 
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            title="Video Profil Instansi PLUT"
          />
        </div>
      </section>
    </div>
  );
}