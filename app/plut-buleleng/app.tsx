import Image from "next/image";
import Link from "next/link";

export default function PlutBulelengPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section memanfaatkan hero-image.jpeg dari file tar */}
      <section className="relative w-full h-[80vh] min-h-[600px]">
        <Image
          src="/hero-image.jpeg"
          alt="Hero Image PLUT Buleleng"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            PLUT Buleleng
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl drop-shadow-md">
            Pusat Layanan Usaha Terpadu untuk mendukung, memajukan, dan
            mengembangkan potensi UMKM lokal menuju pasar digital yang lebih luas.
          </p>
          <div className="flex gap-4">
            <Link
              href="/catalog"
              className="bg-[#FF3C00] hover:bg-[#d63200] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Lihat Katalog Produk
            </Link>
            <Link
              href="/profile-koperasi"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg"
            >
              Profil Kita
            </Link>
          </div>
        </div>
      </section>

      {/* Fitur / Layanan Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Layanan Kita
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
            Berbagai kemudahan dan fasilitas yang kita sediakan untuk membantu
            pertumbuhan dan legalitas usaha Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Fitur 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#FF3C00]/10 text-[#FF3C00] rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Digitalisasi UMKM</h3>
            <p className="text-neutral-600 leading-relaxed">
              Membantu pelaku usaha untuk masuk ke dalam ekosistem digital, dari pemasaran hingga pencatatan transaksi terintegrasi.
            </p>
          </div>

          {/* Card Fitur 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#FF3C00]/10 text-[#FF3C00] rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Pendampingan Legalitas</h3>
            <p className="text-neutral-600 leading-relaxed">
              Fasilitasi dan pendampingan pengurusan izin usaha, NIB, sertifikasi halal, dan hak kekayaan intelektual.
            </p>
          </div>

          {/* Card Fitur 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#FF3C00]/10 text-[#FF3C00] rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Akses Pembiayaan</h3>
            <p className="text-neutral-600 leading-relaxed">
              Menghubungkan koperasi dan UMKM dengan lembaga keuangan untuk mendapatkan akses modal usaha yang mudah.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}