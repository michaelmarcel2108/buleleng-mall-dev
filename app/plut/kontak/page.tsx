import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Kontak & Media Sosial - PLUT Buleleng",
  description: "Hubungi PLUT Buleleng melalui alamat fisik, telepon, email, dan media sosial resmi.",
};

export default async function KontakPage() {
  const supabase = await createClient();
  
  const { data: galeriFoto } = await supabase
    .from("plut_posts")
    .select("title, image_url")
    .eq("post_type", "foto")
    .order("created_at", { ascending: false })
    .limit(4);

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
      <section className="bg-neutral-900 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#FF3C00] font-bold text-sm tracking-widest uppercase mb-4 block">Pusat Bantuan & Komunikasi</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Kontak & <span className="text-[#FF3C00]">Media Sosial</span>
          </h1>
          <p className="text-lg text-neutral-400">
            Kunjungi gedung PLUT untuk pendampingan tatap muka atau hubungi saluran digital kita untuk mendapatkan respons cepat.
          </p>
        </div>
      </section>

      <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          
          {/* INFORMASI KONTAK */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-neutral-100">
            <h2 className="text-2xl font-extrabold text-neutral-900 mb-8">Informasi Kontak</h2>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center text-[#FF3C00] shrink-0 border border-neutral-100">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-1">Alamat Fisik</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Jl. Melur No. 31, Singaraja<br/>Kabupaten Buleleng, Bali
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center text-[#FF3C00] shrink-0 border border-neutral-100">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-1">Telepon & WhatsApp</h3>
                  <p className="text-neutral-600">(0362) 32143 <br/>0881-0377-38189 (Hotline UMKM)</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center text-[#FF3C00] shrink-0 border border-neutral-100">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-1">Alamat Email</h3>
                  <p className="text-neutral-600">disdagperinkopukm@bulelengkab.go.id</p>
                </div>
              </div>
            </div>
          </div>

          {/* MEDIA SOSIAL & GALERI */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#FF3C00] to-[#cc3000] p-10 rounded-3xl shadow-lg text-white">
              <h3 className="text-2xl font-bold mb-4">Media Sosial Kita</h3>
              <p className="text-white/90 mb-8 leading-relaxed">
                Ikuti perkembangan terbaru dan kegiatan harian PLUT Buleleng melalui kanal media sosial resmi <strong>(Klik Dagperin)</strong>.
              </p>
              
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white hover:text-[#FF3C00] transition-colors shadow-sm">
                   {/* Icon FB Sederhana */}
                  <span className="font-bold text-xl">f</span>
                </a>
                <a href="#" className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white hover:text-[#FF3C00] transition-colors shadow-sm">
                   {/* Icon IG Sederhana */}
                   <span className="font-bold text-xl">ig</span>
                </a>
                <a href="#" className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white hover:text-red-600 transition-colors shadow-sm">
                   {/* Icon YT Sederhana */}
                   <span className="font-bold text-xl">yt</span>
                </a>
              </div>
            </div>

            {/* MENGAMBIL DATA GALERI DINAMIS SEBAGAI HIGHLIGHT */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-neutral-900">Aktivitas Terbaru</h3>
                <Link href="/plut/galeri" className="text-xs font-bold text-[#FF3C00] hover:underline">Lihat Galeri &rarr;</Link>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {galeriFoto && galeriFoto.length > 0 ? (
                  galeriFoto.map((foto, idx) => (
                    <div key={idx} className="relative h-28 rounded-xl overflow-hidden bg-neutral-100">
                      <Image
                        src={foto.image_url || "/hero-image.jpeg"}
                        alt={foto.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center text-sm text-neutral-500 bg-neutral-50 rounded-xl">
                    Belum ada sorotan foto.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* GOOGLE MAPS EMBED */}
        <div className="w-full h-[400px] bg-neutral-200 rounded-3xl overflow-hidden shadow-sm border border-neutral-100">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d1976!2d115.088!3d-8.112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMDYnNDMuMiJTIDExNcKwMDUnMTYuOCJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy"
            title="Lokasi PLUT Buleleng"
          ></iframe>
        </div>
      </main>
    </div>
  );
}