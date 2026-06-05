import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

  const { data: latestNews } = await supabase
    .from("plut_posts")
    .select("*")
    .eq("post_type", "berita")
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: latestAnnouncements } = await supabase
    .from("plut_posts")
    .select("*")
    .eq("post_type", "pengumuman")
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: latestInfographics } = await supabase
    .from("plut_posts")
    .select("*")
    .eq("post_type", "infografis")
    .order("created_at", { ascending: false })
    .limit(2);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans flex flex-col">
      
      <section className="relative h-[450px] md:h-[550px] bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/80 to-transparent z-10" />
        <Image 
          src="/hero-image.jpeg" 
          alt="Gedung PLUT Buleleng" 
          fill 
          priority
          className="object-cover object-center opacity-40 animate-fade-in"
        />
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-center relative z-20">
          <span className="inline-block px-4 py-1 rounded-full bg-[#FF3C00]/20 text-[#FF3C00] font-bold text-xs uppercase tracking-wider mb-4 border border-[#FF3C00]/30 w-fit">
            Pusat Layanan Usaha Terpadu
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight mb-4">
            Akselerasi Kemajuan <span className="text-[#FF3C00]">KUMKM</span> Kabupaten Buleleng
          </h1>
          <p className="text-base md:text-lg text-neutral-300 max-w-xl mb-8 leading-relaxed">
            Membangun ekosistem usaha daerah yang tangguh, mandiri, dan berdaya saing tinggi melalui pendampingan konsultasi terpadu.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/plut/layanan" className="px-6 py-3 bg-[#FF3C00] hover:bg-[#e03500] text-white font-bold rounded-xl shadow-md transition-all">
              Daftar Klinik KUMKM
            </Link>
            <Link href="/plut/profil" className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl border border-neutral-700 transition-all">
              Pelajari Profil Kita
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-8 space-y-12">
          <div>
            <div className="flex justify-between items-end mb-6 border-b border-neutral-200 pb-4">
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#FF3C00] rounded-full"></span>
                Berita & Kegiatan Terbaru
              </h2>
              <Link href="/plut/berita" className="text-sm font-bold text-[#FF3C00] hover:underline">
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews && latestNews.length > 0 ? (
                latestNews.map((news) => (
                  <article key={news.id} className="bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-lg transition-all group flex flex-col">
                    <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                      <Image 
                        src={news.image_url || "/hero-image.jpeg"} 
                        alt={news.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        {formatDate(news.published_date || news.created_at)}
                      </span>
                      <h3 className="font-bold text-neutral-900 text-sm line-clamp-2 leading-snug mb-2 group-hover:text-[#FF3C00] transition-colors">
                        <Link href={`/plut/berita/${news.slug}`}>{news.title}</Link>
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-2 mt-auto">
                        {news.excerpt || "Klik untuk membaca selengkapnya mengenai agenda kegiatan kita."}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-sm text-neutral-500 col-span-full">Belum ada berita terbaru.</p>
              )}
            </div>
          </div>

          {/* BANNER INFOGRAFIS */}
          <div>
            <div className="flex justify-between items-end mb-6 border-b border-neutral-200 pb-4">
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#FF3C00] rounded-full"></span>
                Banner Infografis Kebijakan
              </h2>
              <Link href="/plut/infografis" className="text-sm font-bold text-[#FF3C00] hover:underline">
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestInfographics && latestInfographics.length > 0 ? (
                latestInfographics.map((info) => (
                  <Link href={`/plut/berita/${info.slug}`} key={info.id} className="block group relative rounded-2xl overflow-hidden border border-neutral-200 aspect-[16/10] shadow-sm bg-neutral-900">
                    <Image 
                      src={info.image_url || "/hero-image.jpeg"} 
                      alt={info.title} 
                      fill 
                      className="object-cover opacity-90 group-hover:scale-102 group-hover:opacity-70 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent p-5 flex flex-col justify-end">
                      <h3 className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-[#FF3C00] transition-colors">
                        {info.title}
                      </h3>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-neutral-500 col-span-full">Belum ada banner infografis.</p>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: COMPONENTS PENGUMUMAN (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-3">
              <h2 className="font-extrabold text-lg text-neutral-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#FF3C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                Papan Pengumuman
              </h2>
              <Link href="/plut/pengumuman" className="text-xs font-bold text-[#FF3C00] hover:underline">Semua</Link>
            </div>

            <div className="space-y-4">
              {latestAnnouncements && latestAnnouncements.length > 0 ? (
                latestAnnouncements.map((ann) => (
                  <Link href={`/plut/berita/${ann.slug}`} key={ann.id} className="block group p-3.5 rounded-xl border border-neutral-100 bg-neutral-50 hover:bg-[#FF3C00]/5 hover:border-[#FF3C00]/20 transition-all">
                    <span className="text-[10px] font-bold text-neutral-400 block mb-1">
                      {formatDate(ann.published_date || ann.created_at)}
                    </span>
                    <h3 className="font-bold text-neutral-800 text-sm leading-snug line-clamp-2 group-hover:text-[#FF3C00] transition-colors">
                      {ann.title}
                    </h3>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-neutral-500">Tidak ada pengumuman baru.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION EMBED SOSIAL MEDIA & LINK TAUTAN CEPAT */}
      <section className="bg-neutral-100 border-t border-b border-neutral-200 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Sisi Kiri: Embed Media Sosial */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm h-[380px] flex flex-col">
            <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#FF3C00] rounded-full"></span>
              Aktivitas Kanal YouTube Resmi
            </h3>
            <div className="flex-grow bg-neutral-900 rounded-2xl overflow-hidden relative">
              {/* Tempat Embed Player YouTube Instansi */}
              <iframe 
                src="http://googleusercontent.com/youtube.com/0" 
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                title="YouTube Instansi"
              />
            </div>
          </div>

          {/* Sisi Kanan: Tautan Link-Link Penting Dinas */}
          <div className="space-y-6">
            <h3 className="font-extrabold text-xl text-neutral-900 tracking-tight">
              Akses Layanan Terintegrasi
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Guna mendukung transparansi data dan mempermudah regulasi, kita mengintegrasikan beberapa pranala luar resmi yang dapat diakses langsung oleh masyarakat.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="/plut/agenda-regulasi" className="p-4 bg-white rounded-2xl border border-neutral-200 hover:border-[#FF3C00]/30 shadow-sm transition-all flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 text-[#FF3C00] flex items-center justify-center shrink-0 group-hover:bg-[#FF3C00] group-hover:text-white transition-colors">📄</div>
                <span className="font-bold text-sm text-neutral-800 group-hover:text-[#FF3C00]">Portal JDIH Daerah</span>
              </a>
              <a href="/plut/agenda-regulasi" className="p-4 bg-white rounded-2xl border border-neutral-200 hover:border-[#FF3C00]/30 shadow-sm transition-all flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 text-[#FF3C00] flex items-center justify-center shrink-0 group-hover:bg-[#FF3C00] group-hover:text-white transition-colors">📊</div>
                <span className="font-bold text-sm text-neutral-800 group-hover:text-[#FF3C00]">Transparansi PPID</span>
              </a>
              <a href="https://bulelengkab.go.id" target="_blank" rel="noopener noreferrer" className="p-4 bg-white rounded-2xl border border-neutral-200 hover:border-[#FF3C00]/30 shadow-sm transition-all flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 text-[#FF3C00] flex items-center justify-center shrink-0 group-hover:bg-[#FF3C00] group-hover:text-white transition-colors">🌐</div>
                <span className="font-bold text-sm text-neutral-800 group-hover:text-[#FF3C00]">Web Pemkab Buleleng</span>
              </a>
              <a href="/plut/bank-data" className="p-4 bg-white rounded-2xl border border-neutral-200 hover:border-[#FF3C00]/30 shadow-sm transition-all flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 text-[#FF3C00] flex items-center justify-center shrink-0 group-hover:bg-[#FF3C00] group-hover:text-white transition-colors">📁</div>
                <span className="font-bold text-sm text-neutral-800 group-hover:text-[#FF3C00]">Bank Data Drive</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 4. VIDEO INSTANSI (Profil Dinas Terbuka) */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center w-full">
        <span className="text-[#FF3C00] font-bold text-xs uppercase tracking-widest block mb-3">Multimedia</span>
        <h2 className="text-3xl font-extrabold text-neutral-900 mb-4">Video Profil Instansi</h2>
        <p className="text-neutral-500 max-w-xl mx-auto mb-10 text-sm">
          Kenali lebih dekat visi, misi, dan aktivitas harian konsultan pendamping kita dalam membangun usaha rakyat.
        </p>
        <div className="w-full aspect-video bg-neutral-900 rounded-3xl shadow-xl overflow-hidden relative border border-neutral-200">
          <iframe 
            src="http://googleusercontent.com/youtube.com/0" 
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            title="Video Profil Instansi PLUT"
          />
        </div>
      </section>

    </div>
  );
}