import Image from "next/image";

export default function ProfileDeveloper() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* 1. BAGIAN FOTO: Menggantikan banner batik latar biru sebelumnya */}
      <section className="max-w-5xl mx-auto px-6 md:px-16 pt-6 md:pt-10">
        {/* Rasio disamakan dengan banner utama agar pas dan konsisten */}
        <div className="w-full relative aspect-430/430 md:aspect-500/500 rounded-xl overflow-hidden shadow-sm bg-gray-200">
          <Image
            src="/profile-developer.jpeg"
            alt="Foto Tim Pengembang Buleleng Mall"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* 2. BAGIAN TEKS: Sekarang dipindah ke bawah foto dengan latar bersih */}
      <section className="max-w-5xl mx-auto px-6 md:px-16 py-6 text-center flex flex-col items-center gap-2">
        <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-[#274a6a]">
          Tim Pengembang Platform
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-xl">
          Arsitek digital di balik platform e-commerce Buleleng
          Mall—menggabungkan keahlian rekayasa perangkat lunak modern.
        </p>
      </section>

      {/* 3. BAGIAN KONTEN UTAMA: Kartu nama anggota dan spesifikasi */}
      <section className="max-w-5xl mx-auto px-6 md:px-16 pb-12 flex flex-col gap-6">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[#274a6a] font-display border-b border-gray-100 pb-2">
            Anggota Tim Pengembang
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="font-bold text-gray-800 text-sm sm:text-base">
                Gede Murdana
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Project Manager</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="font-bold text-gray-800 text-sm sm:text-base">
                Michael Marcel Hartono
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Fullstack Developer
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="font-bold text-gray-800 text-sm sm:text-base">
                Marvello Adwitya Nyahu
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Website & User Optimalisation
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 font-medium tracking-wide mt-2">
            Program Studi Teknologi Rekayasa Perangkat Lunak / Jurusan Teknik
            Informatika — Universitas Pendidikan Ganesha (Undiksha)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <h3 className="font-bold text-[#274a6a] text-sm md:text-base flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Stack Teknologi Proyek
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {[
                "Next.js",
                "React",
                "Tailwind CSS",
                "Supabase",
                "PostgreSQL",
              ].map((tech, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <h3 className="font-bold text-[#274a6a] text-sm md:text-base flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4"
                />
              </svg>
              Metode Pengembangan
            </h3>
            <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
              Arsitektur aplikasi dibangun menggunakan kerangka kerja Next.js
              dengan fokus utama pada performa kecepatan pemuatan halaman lewat
              Server-Side Rendering serta optimasi tata letak responsif.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
