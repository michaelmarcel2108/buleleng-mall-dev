import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Galeri Media - PLUT Buleleng",
  description: "Dokumentasi visual foto dan video kegiatan, edukasi, dan sosialisasi PLUT Kabupaten Buleleng.",
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default async function GaleriMediaPage() {
  const supabase = await createClient();

  const { data: galeriFoto } = await supabase
    .from("plut_posts")
    .select("*")
    .eq("post_type", "foto")
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: galeriVideo } = await supabase
    .from("plut_posts")
    .select("*")
    .eq("post_type", "video")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* NAVBAR */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/plut" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#FF3C00] rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-bold text-lg text-neutral-900">PLUT Buleleng</span>
          </Link>
          <Link href="/plut" className="text-sm font-medium text-neutral-500 hover:text-[#FF3C00] transition-colors">
            &larr; Kembali
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-neutral-900 text-white py-16 px-4 text-center relative overflow-hidden">
        {/* Dekorasi Latar */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF3C00]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-[#FF3C00] font-bold text-sm tracking-widest uppercase mb-4 block">Dokumentasi Visual</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Galeri <span className="text-[#FF3C00]">Media</span>
          </h1>
          <p className="text-lg text-neutral-400">
            Kumpulan momen kegiatan, pelatihan, serta video edukasi yang kita dedikasikan untuk kemajuan UMKM di Kabupaten Buleleng.
          </p>
        </div>
      </section>

      <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
        
        {/* SECTION FOTO */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">Dokumentasi Kegiatan</h2>
              <p className="text-neutral-500">Momen pendampingan dan aktivitas harian PLUT.</p>
            </div>
          </div>

          {galeriFoto && galeriFoto.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galeriFoto.map((foto) => (
                <Link href={`/plut/berita/${foto.slug}`} key={foto.id}>
                  <div className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer bg-white border border-neutral-100 p-2 h-full flex flex-col">
                    <div className="relative h-60 w-full rounded-xl overflow-hidden">
                      <Image
                        src={foto.image_url || "/hero-image.jpeg"}
                        alt={foto.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Overlay Gradient on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="pt-4 pb-2 px-2 flex-grow flex flex-col">
                      <p className="text-xs font-bold text-[#FF3C00] mb-1">
                        {formatDate(foto.published_date || foto.created_at)}
                      </p>
                      <h3 className="text-base font-bold text-neutral-900 leading-snug line-clamp-2">
                        {foto.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-neutral-100">
              <p className="text-neutral-500">Belum ada dokumentasi foto yang dipublikasikan.</p>
            </div>
          )}
        </section>

        {/* SECTION VIDEO */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">Video Edukasi & Profil</h2>
              <p className="text-neutral-500">Pelajari berbagai panduan bisnis dan kenali program kita lebih dekat.</p>
            </div>
          </div>

          {galeriVideo && galeriVideo.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galeriVideo.map((video) => (
                <Link href={`/plut/berita/${video.slug}`} key={video.id} className="group cursor-pointer">
                  <div className="relative h-56 w-full rounded-2xl overflow-hidden shadow-md mb-4 bg-neutral-900">
                    <Image
                      src={video.image_url || "/hero-image.jpeg"}
                      alt={video.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FF3C00]/90 transition-all duration-300">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Badge Penanda Video */}
                    <div className="absolute bottom-3 right-3 bg-[#FF3C00] backdrop-blur px-2.5 py-1 text-[10px] font-bold text-white rounded shadow-sm uppercase tracking-wider">
                      VIDEO
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[#FF3C00] transition-colors leading-snug line-clamp-2">
                    {video.title}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-neutral-100">
              <p className="text-neutral-500">Belum ada video yang dipublikasikan.</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}