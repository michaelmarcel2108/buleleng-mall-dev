import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Instansi - PLUT Buleleng",
  description: "Profil, Tupoksi, Maklumat Pelayanan, dan Sambutan Kepala Dinas Perdagangan, Perindustrian dan Koperasi, Usaha Kecil dan Menengah Kabupaten Buleleng.",
};

export default function ProfilPlutPage() {
  const tupoksi = [
    {
      title: "Pemberdayaan Koperasi & UMKM",
      desc: "Merumuskan dan melaksanakan kebijakan teknis di bidang pemberdayaan, pengembangan, dan pengawasan Koperasi serta Usaha Mikro, Kecil, dan Menengah.",
    },
    {
      title: "Pengembangan Perdagangan",
      desc: "Meningkatkan efisiensi perdagangan dalam negeri, pengembangan ekspor, serta fasilitasi sarana distribusi dan stabilisasi harga bahan pokok.",
    },
    {
      title: "Pembinaan Perindustrian",
      desc: "Melaksanakan pembinaan dan pengembangan industri kecil dan menengah (IKM) melalui fasilitasi teknologi, desain, dan sertifikasi produk.",
    },
    {
      title: "Perlindungan Konsumen & Kemetrologian",
      desc: "Melaksanakan pelayanan Tera/Tera Ulang (UPTD Metrologi Legal) serta pengawasan barang beredar untuk menjamin hak-hak konsumen.",
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/plut" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#FF3C00] rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-bold text-lg text-neutral-900 hidden sm:block">PLUT Buleleng</span>
          </Link>
          <Link href="/plut" className="text-sm font-medium text-neutral-500 hover:text-[#FF3C00] transition-colors">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* HERO & SAMBUTAN KEPALA DINAS */}
      <section className="relative bg-neutral-900 text-white overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF3C00]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Foto Kepala Dinas */}
            <div className="order-2 lg:order-1 relative">
              <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-neutral-700">
                {/* Ganti src dengan path foto Kadis yang sebenarnya */}
                <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-neutral-600">
                  <span className="text-sm border border-neutral-600 p-2 rounded">Foto Kadis: /images/kadis.jpg</span>
                </div>
                <Image
                  src="/hero-image.jpeg" // Ubah ini
                  alt="Drs. Dewa Made Sudiarta, M.Si."
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent p-6 pt-20">
                  <h3 className="text-xl font-bold text-white">Drs. Dewa Made Sudiarta, M.Si.</h3>
                  <p className="text-[#FF3C00] font-medium text-sm">Kepala DisdagperinkopUKM Kab. Buleleng</p>
                </div>
              </div>
            </div>

            {/* Teks Sambutan */}
            <div className="order-1 lg:order-2">
              <span className="text-[#FF3C00] font-bold text-sm tracking-widest uppercase mb-4 block">Profil Instansi</span>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                Sambutan <br/>Kepala Dinas
              </h1>
              <div className="prose prose-invert prose-lg text-neutral-300">
                <p>
                  "Om Swastyastu, <br/><br/>
                  Selamat datang di portal resmi Pusat Layanan Usaha Terpadu (PLUT) Kabupaten Buleleng. Kehadiran website ini merupakan wujud nyata komitmen kami dalam memberikan pelayanan publik yang prima, transparan, dan terintegrasi."
                </p>
                <p>
                  "Melalui PLUT, kami berharap seluruh pelaku UMKM, Koperasi, dan pelaku industri di Kabupaten Buleleng dapat memanfaatkan fasilitas pendampingan, akses pembiayaan, hingga digitalisasi pemasaran guna mewujudkan ekonomi Buleleng yang tangguh dan berdaya saing."
                </p>
                <p>
                  "Om Santih, Santih, Santih, Om."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MAKLUMAT & MOTTO PELAYANAN */}
      <section className="py-20 px-4 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Motto */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-neutral-200 text-center flex flex-col justify-center items-center h-full">
            <div className="w-16 h-16 bg-[#FF3C00]/10 text-[#FF3C00] rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900 mb-4">Motto Pelayanan</h2>
            <p className="text-xl font-medium text-neutral-600 italic">
              "Melayani dengan Hati, <br className="hidden md:block"/> Cepat, Tepat, dan Transparan."
            </p>
          </div>

          {/* Maklumat */}
          <div className="bg-gradient-to-br from-[#FF3C00] to-[#cc3000] p-10 rounded-3xl shadow-lg text-white h-full flex flex-col justify-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold mb-4">Maklumat Pelayanan</h2>
            <p className="text-white/90 leading-relaxed font-medium">
              "Dengan ini, kami menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai peraturan perundang-undangan yang berlaku."
            </p>
          </div>

        </div>
      </section>

      {/* TUPOKSI (Tugas Pokok & Fungsi) */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">
              Tugas Pokok & Fungsi (Tupoksi)
            </h2>
            <p className="text-neutral-500">
              DisdagperinkopUKM Kabupaten Buleleng memiliki tugas pokok membantu Bupati dalam melaksanakan urusan pemerintahan yang menjadi kewenangan daerah di bidang perdagangan, perindustrian, koperasi, dan UKM.
            </p>
          </div>

          <div className="space-y-6">
            {tupoksi.map((item, idx) => (
              <div key={idx} className="flex gap-6 p-6 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-[#FF3C00]/30 transition-colors">
                <div className="shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#FF3C00] font-bold text-lg shadow-sm border border-neutral-100">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}