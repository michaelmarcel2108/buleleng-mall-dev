import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Portal PLUT Buleleng",
  description: "Profil dan Berita Terkini Pusat Layanan Usaha Terpadu Buleleng",
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

export default async function PlutPortalPage() {
  const supabase = await createClient();

  // 1. Ambil 3 artikel terbaru
  const { data: daftarBerita } = await supabase
    .from("plut_articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  // 2. Ambil pengaturan gambar halaman
  const { data: settings } = await supabase
    .from("plut_settings")
    .select("*")
    .eq("id", 1)
    .single();

  // Tentukan gambar default jika admin belum upload
  const heroImage = settings?.hero_image_url || "/hero-image.jpeg";
  const profileImage = settings?.profile_image_url || "/hero-image.jpeg";

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF3C00] rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              P
            </div>
            <span className="font-bold text-xl text-neutral-900">PLUT Buleleng</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-[#FF3C00] transition-colors">
              Kembali ke Mall
            </Link>
            <Link href="#profil" className="text-sm font-medium text-neutral-900 hover:text-[#FF3C00] transition-colors">
              Profil Kita
            </Link>
            <Link href="#berita" className="text-sm font-medium text-neutral-900 hover:text-[#FF3C00] transition-colors">
              Berita
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION (MENGGUNAKAN GAMBAR DINAMIS) */}
      <section className="relative w-full h-[60vh] min-h-[500px]">
        <Image
          src={heroImage}
          alt="Gedung PLUT Buleleng"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-10">
          <span className="bg-[#FF3C00] px-4 py-1 text-sm font-bold tracking-widest rounded-full mb-4 uppercase shadow-lg">
            Portal Edukasi & Profil
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg max-w-4xl">
            Pusat Layanan Usaha Terpadu Buleleng
          </h1>
          <p className="text-lg md:text-xl max-w-2xl drop-shadow-md text-gray-200">
            Wadah kolaborasi untuk memberdayakan UMKM lokal melalui edukasi, digitalisasi, dan pendampingan terpadu.
          </p>
        </div>
      </section>

      {/* PROFIL SECTION (MENGGUNAKAN GAMBAR DINAMIS) */}
      <section id="profil" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 tracking-tight">
              Tentang Kita
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4 text-lg">
              PLUT Buleleng hadir sebagai rumah bagi para pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) serta Koperasi di Kabupaten Buleleng. Di sini, kita berkomitmen penuh untuk mendampingi setiap langkah pengusaha lokal mulai dari inkubasi bisnis, pengurusan legalitas, hingga strategi pemasaran digital.
            </p>
            <p className="text-neutral-600 leading-relaxed text-lg">
              Bersama-sama, kita membangun ekosistem ekonomi yang mandiri, adaptif terhadap teknologi, dan siap bersaing di kancah nasional maupun internasional.
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-neutral-100">
            <Image
              src={profileImage}
              alt="Aktivitas PLUT Buleleng"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* BERITA SECTION */}
      <section id="berita" className="py-20 px-6 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3 tracking-tight">
                Berita & Edukasi
              </h2>
              <p className="text-neutral-500 text-lg">Informasi terbaru seputar kegiatan dan program unggulan kita.</p>
            </div>
            <Link 
              href="/plut/berita" 
              className="hidden md:flex items-center gap-2 text-[#FF3C00] font-semibold hover:underline"
            >
              Lihat Semua Berita &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {daftarBerita && daftarBerita.length > 0 ? (
              daftarBerita.map((berita) => (
                <article key={berita.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-200 hover:shadow-xl transition-all group flex flex-col">
                  <div className="relative h-56 w-full overflow-hidden bg-neutral-200">
                    <Image
                      src={berita.image_url || "/hero-image.jpeg"}
                      alt={berita.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-neutral-800 rounded-full shadow-sm">
                      {formatDate(berita.published_date || berita.created_at)}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-[#FF3C00] transition-colors line-clamp-2 leading-snug">
                      <Link href={`/plut/berita/${berita.slug}`}>
                        {berita.title}
                      </Link>
                    </h3>
                    <p className="text-neutral-600 mb-6 flex-grow line-clamp-3">
                      {berita.excerpt}
                    </p>
                    <Link 
                      href={`/plut/berita/${berita.slug}`}
                      className="text-[#FF3C00] font-semibold text-sm inline-flex items-center gap-1 mt-auto"
                    >
                      Baca Selengkapnya
                      <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-neutral-500 italic text-lg">Belum ada berita yang diterbitkan saat ini.</p>
              </div>
            )}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link 
              href="/plut/berita" 
              className="inline-block bg-white border border-neutral-300 text-neutral-800 px-6 py-3 rounded-xl font-semibold hover:bg-neutral-50 shadow-sm"
            >
              Lihat Semua Berita
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}