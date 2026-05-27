import Link from "next/link";

export default function ProfileDeveloper() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <section className="relative flex flex-col gap-4 bg-[#274a6a] py-12 md:py-20 overflow-hidden text-white">
        <div className="absolute inset-0 bg-pattern opacity-10 z-0"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 w-full flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
            <svg className="w-10 h-10 text-[#274a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">
            Profil Tim Developer
          </h1>
          <p className="text-sm md:text-lg text-white/90 max-w-2xl font-sans">
            Arsitek digital di balik platform Buleleng Mall—menggabungkan keahlian rekayasa perangkat lunak modern dengan fungsionalitas interaktif yang inklusif.
          </p>
        </div>
      </section>

      {/* Detail Konten */}
      <section className="max-w-5xl mx-auto px-8 md:px-16 py-12 flex flex-col gap-8">
        {/* Filosofi Pengembangan */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#274a6a] font-display border-b-2 border-[#274a6a]/10 pb-2">
            Filosofi Pengembangan Platform
          </h2>
          <p className="text-gray-600 leading-relaxed font-sans text-sm md:text-base">
            Kami percaya bahwa sistem perangkat lunak yang andal tidak hanya harus responsif dan cepat, melainkan juga harus mampu memberikan pengalaman pengguna (UI/UX) yang intuitif. Melalui integrasi teknologi tumpukan web modern serta pengelolaan data relasional yang efisien, platform ini dikembangkan secara optimal untuk memfasilitasi kemudahan operasional UMKM digital.
          </p>
        </div>

        {/* Stack Teknologi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-[#274a6a] font-display flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Spesifikasi Teknologi
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"].map((tech, idx) => (
                <span key={idx} className="bg-[#274a6a]/5 text-[#274a6a] text-xs md:text-sm px-3 py-1.5 rounded-md font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-[#274a6a] font-display flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Fokus Utama Desain
            </h3>
            <ul className="text-gray-600 space-y-1.5 text-sm md:text-base list-disc pl-5 font-sans">
              <li>Optimasi performa rendering antarmuka di sisi server.</li>
              <li>Adaptibilitas tata letak yang responsif di perangkat seluler dan desktop.</li>
              <li>Struktur basis data yang aman serta manajemen state yang efisien.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link 
            href="/" 
            className="inline-block bg-[#274a6a] px-8 py-2.5 text-white text-sm rounded-full hover:bg-opacity-90 transition-all font-medium shadow-sm"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}