import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function ProfileKoperasi() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: profile, error } = await supabase
    .from("koperasi_profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil data:", error.message);
  }

  const defaultAbout =
    "Koperasi Pemasaran Bersama Buleleng didirikan sebagai wadah kolaborasi strategis bagi para pelaku usaha kecil, mikro, dan menengah (UMKM) di wilayah Kabupaten Buleleng. Kami berkomitmen untuk memperkuat ekosistem usaha lokal, mengelola standarisasi kualitas, serta membuka akses pasar yang lebih luas demi kemajuan perajin dan produsen lokal Bali.";
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
          <div className="absolute inset-0 bg-[#274a6a]/50 z-0"></div>
        ) : (
          <div className="absolute inset-0 bg-pattern opacity-10 z-0"></div>
        )}

        <div className="relative z-15 max-w-7xl mx-auto px-10 md:px-16 w-full flex flex-col items-center text-center gap-4">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-md mb-2 overflow-hidden border-4 border-white/20">
            {profile?.logo_url ? (
              <img
                src={profile.logo_url}
                alt="Logo Koperasi"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-12 h-12 md:w-16 md:h-16 text-[#274a6a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mt-2">
            Koperasi Pemasaran Wirausaha Singaraja
          </h1>

          <p className="text-sm md:text-lg text-white/90 max-w-2xl font-sans">
            Mendorong pertumbuhan ekonomi daerah dengan menghubungkan produk UMKM
            unggulan Buleleng ke ekosistem pasar digital.
          </p>

          {/* Deretan Ikon Sosial Media */}
          <div className="flex items-center gap-4 mt-2">
            {profile?.instagram_url && (
              <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all" title="Instagram">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            )}
            
            {profile?.tiktok_url && (
              <a href={profile.tiktok_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all" title="TikTok">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.63-.39 3.26-1.16 4.69-1.55 2.86-4.7 4.54-7.94 4.2-3.17-.33-5.91-2.43-6.95-5.4-.82-2.33-.49-5.01.89-7.05 1.34-1.99 3.65-3.35 6.04-3.52 1.05-.07 2.1.04 3.12.31v4.1c-1.3-.35-2.73-.25-3.95.34-1.25.6-2.18 1.76-2.48 3.12-.31 1.39.11 2.89 1.1 3.89 1.25 1.26 3.26 1.48 4.79.52.92-.57 1.52-1.57 1.64-2.65.17-1.57.06-3.17.06-4.76V.02z"/>
                </svg>
              </a>
            )}
            
            {profile?.youtube_url && (
              <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all" title="YouTube">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Detail Konten */}
      <section className="max-w-5xl mx-auto px-8 md:px-16 py-12 flex flex-col gap-6 md:gap-8">
        
        {/* Tentang Koperasi - Sekarang mengambil dari database */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#274a6a] font-display border-b-2 border-[#274a6a]/10 pb-2">
            Tentang Koperasi
          </h2>
          <p className="text-gray-600 leading-relaxed font-sans text-sm md:text-base whitespace-pre-line">
            {profile?.about || defaultAbout}
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

        {/* Box Tambahan Dinamis - Dibuat full width (grid-cols-1) */}
        {profile?.extra_boxes && profile.extra_boxes.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {profile.extra_boxes.map(
              (box: { title: string; description: string }, index: number) => (
                <div
                  key={index}
                  className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3"
                >
                  <h3 className="text-lg md:text-xl font-bold text-[#274a6a] font-display flex items-center gap-2 border-b-2 border-[#274a6a]/10 pb-2">
                    <span className="w-2 h-5 md:h-6 bg-[#274a6a] rounded-full inline-block"></span>
                    {box.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base font-sans leading-relaxed whitespace-pre-line mt-1">
                    {box.description}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </section>
    </main>
  );
}