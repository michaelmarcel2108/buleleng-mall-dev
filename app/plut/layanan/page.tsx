import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Klinik KUMKM & Layanan - PLUT Buleleng",
  description: "Layanan konsultasi dan pendampingan bisnis terpadu untuk UMKM Kabupaten Buleleng.",
};

export default function LayananPlutPage() {
  const klinikLayanan = [
    {
      title: "Klinik Kelembagaan",
      desc: "Konsultasi pembentukan badan usaha, pendaftaran NIB, perizinan dasar, hingga pembentukan dan legalitas Koperasi.",
      icon: "🏢",
    },
    {
      title: "Klinik SDM",
      desc: "Pendampingan manajemen karyawan, penyusunan SOP kerja, hingga pelatihan mindset kewirausahaan bagi owner.",
      icon: "👥",
    },
    {
      title: "Klinik Produksi",
      desc: "Asistensi standardisasi mutu, kemasan produk (packaging), desain logo, hingga pengurusan sertifikasi Halal & PIRT.",
      icon: "📦",
    },
    {
      title: "Klinik Pembiayaan",
      desc: "Fasilitasi penyusunan laporan keuangan (pembukuan), manajemen arus kas, dan akses ke permodalan (KUR/Perbankan).",
      icon: "💰",
    },
    {
      title: "Klinik Pemasaran",
      desc: "Strategi digital marketing, onboarding ke marketplace, optimalisasi media sosial, dan akses ke Buleleng Mall.",
      icon: "📈",
    },
    {
      title: "Klinik IT & Jaringan",
      desc: "Penerapan teknologi tepat guna untuk operasional bisnis, aplikasi kasir (POS), dan manajemen stok barang.",
      icon: "💻",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR SIMPLE */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
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
      <section className="bg-neutral-50 py-20 px-4 border-b border-neutral-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#FF3C00] font-bold text-sm tracking-widest uppercase mb-4 block">Layanan & Program Khusus</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-6 leading-tight">
            Klinik <span className="text-[#FF3C00]">KUMKM</span>
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Pusat konsultasi dan pendampingan terpadu untuk memecahkan berbagai permasalahan bisnis Anda. Didampingi langsung oleh konsultan ahli yang tersertifikasi.
          </p>
        </div>
      </section>

      {/* GRID KLINIK LAYANAN */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {klinikLayanan.map((klinik, idx) => (
            <div 
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-neutral-100 hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(255,60,0,0.1)] transition-all duration-300 group"
            >
              <div className="text-4xl mb-6 bg-neutral-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-[#FF3C00]/10 transition-colors">
                {klinik.icon}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-[#FF3C00] transition-colors">
                {klinik.title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {klinik.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ALUR PELAYANAN (SOP) */}
      <section className="bg-neutral-900 text-white py-24 px-4 relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3C00]/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Alur Pendaftaran Konsultasi</h2>
            <p className="text-neutral-400">Prosedur permintaan pendampingan di PLUT Kabupaten Buleleng.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Garis Penghubung (Hanya terlihat di Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-neutral-800 -translate-y-1/2 z-0"></div>

            {[
              { step: "01", title: "Pendaftaran", desc: "Datang langsung ke resepsionis PLUT atau daftar melalui WhatsApp." },
              { step: "02", title: "Diagnosa Awal", desc: "Konsultan akan mendiagnosa permasalahan utama usaha Anda." },
              { step: "03", title: "Pendampingan", desc: "Proses konsultasi intensif pada Klinik KUMKM yang sesuai." },
              { step: "04", title: "Tindak Lanjut", desc: "Evaluasi, monitoring, dan pengeluaran rekomendasi/sertifikasi." }
            ].map((alur, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-800 border-4 border-neutral-900 text-[#FF3C00] font-extrabold text-xl flex items-center justify-center mb-6 shadow-xl">
                  {alur.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{alur.title}</h3>
                <p className="text-neutral-400 text-sm">{alur.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto bg-[#FF3C00]/5 border border-[#FF3C00]/10 rounded-3xl p-10 md:p-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-4">
            Butuh Pendampingan Usaha Sekarang?
          </h2>
          <p className="text-neutral-600 mb-8 max-w-xl mx-auto">
            Semua layanan konsultasi dan pendampingan di PLUT Buleleng <strong>100% Gratis</strong>. Hubungi kami untuk menjadwalkan sesi Anda.
          </p>
          <a 
            href="https://wa.me/6282341657788"
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF3C00] hover:bg-[#e03500] text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1"
          >
            Reservasi Jadwal Konsultasi
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>

    </div>
  );
}