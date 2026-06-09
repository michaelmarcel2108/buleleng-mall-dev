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
      
      {/* HERO SECTION (Aksen Biru PLUT) */}
      <section className="bg-neutral-900 text-white py-16 px-4 text-center relative overflow-hidden border-b-4 border-[#407d99]">
        {/* Dekorasi Latar */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#407d99]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-[#407d99] font-bold text-sm tracking-widest uppercase mb-4 block">Pusat Bantuan & Komunikasi</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Kontak & <span className="text-[#407d99]">Media Sosial</span>
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
                <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center text-[#407d99] shrink-0 border border-neutral-100">
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
                <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center text-[#407d99] shrink-0 border border-neutral-100">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-1">Telepon & WhatsApp</h3>
                  <p className="text-neutral-600">(0362) 32143 <br/>0881-0377-38189 (Hotline UMKM)</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center text-[#407d99] shrink-0 border border-neutral-100">
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
            <div className="bg-gradient-to-br from-[#407d99] to-[#326278] p-10 rounded-3xl shadow-lg text-white">
              <h3 className="text-2xl font-bold mb-4">Media Sosial Kita</h3>
              <p className="text-white/90 mb-8 leading-relaxed">
                Ikuti perkembangan terbaru dan kegiatan harian PLUT Buleleng melalui kanal media sosial resmi <strong>(Klik Dagperin)</strong>.
              </p>
              
              {/* TOMBOL LINK SOSIAL MEDIA */}
              <div className="flex gap-4">
                
                {/* 1. LINK FACEBOOK */}
                <a 
                  href="https://facebook.com/disdagperinkopukmbuleleng" // GANTI LINK FACEBOOK DI SINI
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors shadow-sm group"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6 text-white group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>

                {/* 2. LINK INSTAGRAM */}
                <a 
                  href="https://instagram.com/disdagperinkopukmbuleleng" // GANTI LINK INSTAGRAM DI SINI
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white hover:text-pink-600 transition-colors shadow-sm group"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6 text-white group-hover:text-pink-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>

                {/* 3. LINK YOUTUBE */}
                <a 
                  href="https://youtube.com/@disdagperinkopukmbuleleng" // GANTI LINK YOUTUBE DI SINI
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white hover:text-red-600 transition-colors shadow-sm group"
                  aria-label="YouTube"
                >
                  <svg className="w-6 h-6 text-white group-hover:text-red-600 transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
                
              </div>
            </div>

            {/* MENGAMBIL DATA GALERI DINAMIS SEBAGAI HIGHLIGHT */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-neutral-900">Aktivitas Terbaru</h3>
                <Link href="/plut/galeri" className="text-xs font-bold text-[#407d99] hover:underline">Lihat Galeri →</Link>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {galeriFoto && galeriFoto.length > 0 ? (
                  galeriFoto.map((foto, idx) => (
                    <div key={idx} className="relative h-28 rounded-xl overflow-hidden bg-neutral-100 group">
                      <Image
                        src={foto.image_url || "/hero-image.jpeg"}
                        alt={foto.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center text-sm text-neutral-500 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                    Belum ada sorotan foto.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* GOOGLE MAPS EMBED */}
        <div className="w-full h-[450px] bg-neutral-200 rounded-3xl overflow-hidden shadow-sm border border-neutral-100">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.069152646271!2d115.0932087!3d-8.1132228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd19b1b79c3dcb9%3A0xc6c7648fcf709774!2sPLUT%20KUMKM%20Buleleng!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" // Gunakan URL embed maps asli dari Google Maps di sini
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi PLUT Buleleng"
          ></iframe>
        </div>
      </main>
    </div>
  );
}