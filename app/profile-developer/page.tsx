import { createClient } from "@/lib/supabase/server";

// Memaksa halaman untuk selalu mengambil data terbaru dari database setiap kali di-load
export const dynamic = "force-dynamic";

export default async function ProfileKoperasi() {
  const supabase = await createClient();

  // Ambil data dari tabel koperasi_profile
  const { data: profile, error } = await supabase
    .from("koperasi_profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  // Cek log di terminal/cmd Anda untuk memastikan apakah data berhasil ditarik atau null
  if (error) {
    console.error("Gagal mengambil data koperasi:", error.message);
  } else {
    console.log("Data Koperasi dari Database:", profile);
  }

  // Data default (fallback) jika database kosong atau ID tidak cocok
  const defaultVision =
    "Menjadi pusat penggerak utama digitalisasi UMKM di Buleleng yang unggul, berdaya saing tinggi, berkelanjutan, dan tetap berakar pada nilai kearifan lokal Bali.";
  const defaultMission =
    "Membangun platform digital terintegrasi untuk memperluas pemasaran produk.\nMendorong standarisasi produk lokal agar memiliki daya saing yang tinggi.\nMenjalin kemitraan inklusif dengan berbagai pemangku kepentingan daerah.";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <section
        className="relative flex flex-col gap-4 py-12 md:py-20 overflow-hidden text-white bg-[#274a6a]"
        style={{
          backgroundImage: profile?.hero_bg_url
            ? `url(${profile.hero_bg_url})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {profile?.hero_bg_url ? (
          <div className="absolute inset-0 bg-[#274a6a]/85 z-0"></div>
        ) : (
          <div className="absolute inset-0 bg-pattern opacity-10 z-0"></div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 w-full flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 overflow-hidden">
            {profile?.logo_url ? (
              <img
                src={profile.logo_url}
                alt="Logo Koperasi"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-10 h-10 text-[#274a6a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">
            Koperasi Pemasaran Bersama Buleleng
          </h1>
          <p className="text-sm md:text-lg text-white/90 max-w-2xl font-sans">
            Mendorong pertumbuhan ekonomi daerah dengan menghubungkan produk UMKM
            unggulan Buleleng ke ekosistem pasar digital.
          </p>
        </div>
      </section>

      {/* Detail Konten */}
      <section className="max-w-5xl mx-auto px-8 md:px-16 py-12 flex flex-col gap-8">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#274a6a] font-display border-b-2 border-[#274a6a]/10 pb-2">
            Tentang Koperasi
          </h2>
          <p className="text-gray-600 leading-relaxed font-sans text-sm md:text-base">
            Koperasi Pemasaran Bersama Buleleng didirikan sebagai wadah
            kolaborasi strategis bagi para pelaku usaha kecil, mikro, dan
            menengah (UMKM) di wilayah Kabupaten Buleleng. Kami berkomitmen
            untuk memperkuat ekosistem usaha lokal, mengelola standarisasi
            kualitas, serta membuka akses pasar yang lebih luas demi kemajuan
            perajin dan produsen lokal Bali.
          </p>
        </div>

        {/* Visi Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-[#274a6a] font-display flex items-center gap-2">
              <span className="w-2 h-5 bg-[#274a6a] rounded-full inline-block"></span>
              Visi
            </h3>
            <p className="text-gray-600 text-sm md:text-base font-sans leading-relaxed whitespace-pre-line">
              {profile?.vision || defaultVision}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-[#274a6a] font-display flex items-center gap-2">
              <span className="w-2 h-5 bg-[#274a6a] rounded-full inline-block"></span>
              Misi
            </h3>
            <p className="text-gray-600 text-sm md:text-base font-sans leading-relaxed whitespace-pre-line">
              {profile?.mission || defaultMission}
            </p>
          </div>
        </div>

        {/* Box Tambahan Dinamis */}
        {profile?.extra_boxes && profile.extra_boxes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.extra_boxes.map((box: { title: string; description: string }, index: number) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3"
              >
                <h3 className="text-lg font-bold text-[#274a6a] font-display flex items-center gap-2">
                  <span className="w-2 h-5 bg-[#274a6a] rounded-full inline-block"></span>
                  {box.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base font-sans leading-relaxed whitespace-pre-line">
                  {box.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}