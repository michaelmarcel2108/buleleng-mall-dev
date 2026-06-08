import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Klinik KUMKM & Layanan - PLUT Buleleng",
  description: "Layanan konsultasi dan pendampingan bisnis terpadu untuk UMKM Kabupaten Buleleng.",
};

export default function LayananPlutPage() {
  // Array data menggunakan SVG polos dengan satu warna aksen (#0c353e)
  const klinikLayanan = [
    {
      title: "Klinik Kelembagaan",
      desc: "Konsultasi pembentukan badan usaha, pendaftaran NIB, perizinan dasar, hingga pembentukan dan legalitas Koperasi.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V11m0 0h4m-4 0H7m4 0v10m1-10h4" />
        </svg>
      ),
    },
    {
      title: "Klinik SDM",
      desc: "Pendampingan manajemen karyawan, penyusunan SOP kerja, hingga pelatihan mindset kewirausahaan bagi owner.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Klinik Produksi",
      desc: "Asistensi standardisasi mutu, kemasan produk (packaging), desain logo, hingga pengurusan sertifikasi Halal & PIRT.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: "Klinik Pembiayaan",
      desc: "Fasilitasi penyusunan laporan keuangan (pembukuan), manajemen arus kas, dan akses ke permodalan (KUR/Perbankan).",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Klinik Pemasaran",
      desc: "Strategi digital marketing, onboarding ke marketplace, optimalisasi media sosial, dan akses ke Buleleng Mall.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: "Klinik IT & Jaringan",
      desc: "Penerapan teknologi tepat guna untuk operasional bisnis, aplikasi kasir (POS), dan manajemen stok barang.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      <section className="relative bg-[#0c353e] py-28 px-4 overflow-hidden text-center">
        <Image
          src="/batik-pattern.png"
          alt="Background PLUT"
          fill
          priority
          className="object-cover opacity-15 pointer-events-none mix-blend-overlay"
        />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-white/60 font-bold text-xs tracking-widest uppercase mb-3 block">
            Layanan & Program Khusus
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Klinik <span className="text-white/80 border-b-4 border-white/20 pb-1">KUMKM</span>
          </h1>
          <p className="text-base md:text-lg text-neutral-200 leading-relaxed max-w-2xl mx-auto font-medium">
            Pusat konsultasi dan pendampingan terpadu untuk memecahkan berbagai permasalahan bisnis Anda. Didampingi langsung oleh konsultan ahli yang tersertifikasi.
          </p>
        </div>
      </section>

      {/* GRID KLINIK LAYANAN (POLOS SATU WARNA AKSEN) */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {klinikLayanan.map((klinik, idx) => (
            <div 
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-neutral-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Box Icon Polos Menggunakan Warna #0c353e */}
              <div className="mb-6 bg-[#0c353e]/5 text-[#0c353e] w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-[#0c353e] group-hover:text-white transition-all duration-300">
                {klinik.icon}
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-[#0c353e] transition-colors">
                {klinik.title}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed font-medium">
                {klinik.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ALUR PELAYANAN (SOP) */}
      <section className="bg-neutral-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-3">Alur Pendaftaran Konsultasi</h2>
            <p className="text-neutral-400 text-sm">Prosedur permintaan pendampingan di PLUT Kabupaten Buleleng.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-neutral-800 z-0"></div>

            {[
              { step: "01", title: "Pendaftaran", desc: "Datang langsung ke resepsionis PLUT atau daftar melalui WhatsApp." },
              { step: "02", title: "Diagnosa Awal", desc: "Konsultan akan mendiagnosa permasalahan utama usaha Anda." },
              { step: "03", title: "Pendampingan", desc: "Proses konsultasi intensif pada Klinik KUMKM yang sesuai." },
              { step: "04", title: "Tindak Lanjut", desc: "Evaluasi, monitoring, dan pengeluaran rekomendasi/sertifikasi." }
            ].map((alur, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-800 border-4 border-neutral-900 text-neutral-300 font-black text-lg flex items-center justify-center mb-6 shadow-xl group-hover:border-[#0c353e]">
                  {alur.step}
                </div>
                <h3 className="text-base font-bold mb-2">{alur.title}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">{alur.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION CTA CALL TO ACTION (WARNA TEMA PLUT) */}
      <section className="py-24 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto bg-[#0c353e]/5 border border-[#0c353e]/10 rounded-3xl p-10 md:p-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-4">
            Butuh Pendampingan Usaha Sekarang?
          </h2>
          <p className="text-neutral-500 mb-8 max-w-xl mx-auto text-sm font-medium">
            Semua layanan konsultasi dan pendampingan di PLUT Buleleng <strong>100% Gratis</strong>. Hubungi kami untuk menjadwalkan sesi Anda.
          </p>
          <a 
            href="https://wa.me/6282341657788"
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0c353e] hover:bg-[#08252c] text-white font-bold text-sm rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5"
          >
            Reservasi Jadwal Konsultasi
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>

    </div>
  );
}