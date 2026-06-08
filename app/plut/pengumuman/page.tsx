import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pengumuman Resmi - PLUT Buleleng",
  description: "Informasi, surat edaran, dan pengumuman resmi dari PLUT Kabupaten Buleleng.",
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default async function PengumumanPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }> | { q?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.q || "";

  const supabase = await createClient();

  // KUNCI DINAMIS: Mengambil data dari plut_posts khusus tipe 'pengumuman'
  let query = supabase
    .from("plut_posts")
    .select("id, title, slug, excerpt, published_date, created_at")
    .eq("post_type", "pengumuman")
    .order("published_date", { ascending: false });

  // Filter pencarian jika ada
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data: pengumumanList, error } = await query;

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      
      {/* HERO SECTION PENGUMUMAN (Aksen Biru PLUT) */}
      <section className="bg-neutral-900 text-white py-16 px-6 relative overflow-hidden border-b-4 border-[#407d99]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#407d99]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[#407d99] font-bold text-sm tracking-widest uppercase mb-3 block">Layanan Informasi</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Pengumuman <span className="text-[#407d99]">Resmi</span>
          </h1>
          <p className="text-lg text-neutral-400">
            Pusat informasi surat edaran, harga pokok pasar, jadwal kurasi, dan pemberitahuan penting lainnya dari PLUT Buleleng.
          </p>
        </div>
      </section>

      {/* KONTEN UTAMA */}
      <main className="py-16 px-6 max-w-4xl mx-auto">
        
        {/* PENCARIAN */}
        <div className="mb-10">
          <form action="/plut/pengumuman" method="GET" className="relative max-w-xl mx-auto">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              className="block w-full pl-5 pr-24 py-3.5 border border-neutral-200 rounded-xl bg-white text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-[#407d99] transition-all outline-none shadow-sm"
              placeholder="Cari judul pengumuman..."
            />
            <button
              type="submit"
              className="absolute inset-y-1.5 right-1.5 px-6 bg-[#407d99] hover:bg-[#326278] text-white text-sm font-bold rounded-lg transition-colors"
            >
              Cari
            </button>
          </form>
          {searchQuery && (
             <div className="text-center mt-4">
               <p className="text-neutral-600 text-sm">Hasil pencarian: <strong>"{searchQuery}"</strong></p>
               <Link href="/plut/pengumuman" className="text-xs text-[#407d99] hover:underline mt-1 inline-block">Reset Pencarian</Link>
             </div>
          )}
        </div>

        {/* DAFTAR PENGUMUMAN (LIST VIEW) */}
        <div className="space-y-4">
          {pengumumanList && pengumumanList.length > 0 ? (
            pengumumanList.map((item) => (
              <Link href={`/plut/berita/${item.slug}`} key={item.id} className="block group">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:border-[#407d99]/30 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  
                  {/* Ikon Pengumuman */}
                  <div className="shrink-0 w-12 h-12 bg-[#407d99]/10 text-[#407d99] rounded-full flex items-center justify-center group-hover:bg-[#407d99] group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>

                  {/* Teks Pengumuman */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        {formatDate(item.published_date || item.created_at)}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#407d99] animate-pulse"></span>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[#407d99] transition-colors leading-snug mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {item.excerpt || "Klik untuk membaca rincian pengumuman ini selengkapnya."}
                    </p>
                  </div>

                  {/* Panah */}
                  <div className="shrink-0 text-neutral-300 group-hover:text-[#407d99] transition-colors hidden sm:block">
                    <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                </div>
              </Link>
            ))
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-neutral-100">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-50 text-neutral-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Belum Ada Pengumuman</h3>
              <p className="text-neutral-500">Saat ini tidak ada pengumuman atau surat edaran yang diterbitkan.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}