import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Semua Berita - PLUT Buleleng",
  description: "Daftar seluruh berita dan edukasi dari PLUT Buleleng",
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Menambahkan parameter searchParams untuk menangkap input pencarian dari URL
export default async function SemuaBeritaPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }> | { q?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.q || "";

  const supabase = await createClient();

  // Membangun query Supabase secara dinamis
  let query = supabase
    .from("plut_articles")
    .select("*")
    .order("created_at", { ascending: false });

  // Jika ada kata kunci pencarian, filter berdasarkan judul
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data: daftarBerita, error } = await query;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* HEADER / NAVBAR */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/plut" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#FF3C00] rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-bold text-xl text-neutral-900 hidden sm:block">PLUT Buleleng</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/plut" className="text-sm font-bold text-neutral-500 hover:text-[#FF3C00] flex items-center gap-1 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Beranda
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION UNTUK BERITA */}
      <section className="bg-neutral-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-[#FF3C00] font-bold text-sm tracking-widest uppercase mb-3 block">Pusat Informasi</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Indeks Berita & Edukasi
            </h1>
            <p className="text-lg text-neutral-400">
              Kumpulan seluruh liputan kegiatan, regulasi, dan materi edukasi terbaru untuk mendukung pertumbuhan ekosistem UMKM Buleleng.
            </p>
          </div>

          {/* FORM PENCARIAN */}
          <form className="w-full md:w-96" action="/plut/berita" method="GET">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-neutral-400 group-focus-within:text-[#FF3C00] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                className="block w-full pl-10 pr-24 py-3.5 border-none rounded-xl bg-neutral-800 text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#FF3C00] transition-all"
                placeholder="Cari judul berita..."
              />
              <button
                type="submit"
                className="absolute inset-y-1.5 right-1.5 px-4 bg-[#FF3C00] hover:bg-[#e03500] text-white text-sm font-bold rounded-lg transition-colors"
              >
                Cari
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* DAFTAR BERITA */}
      <main className="py-12 px-6 max-w-7xl mx-auto">
        {searchQuery && (
          <div className="mb-8">
            <p className="text-neutral-600">
              Menampilkan hasil pencarian untuk: <span className="font-bold text-neutral-900">"{searchQuery}"</span>
            </p>
            <Link href="/plut/berita" className="text-sm text-[#FF3C00] hover:underline mt-1 inline-block">
              Hapus pencarian &times;
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {daftarBerita && daftarBerita.length > 0 ? (
            daftarBerita.map((berita) => (
              <article key={berita.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-xl transition-all group flex flex-col">
                <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
                  <Image
                    src={berita.image_url || "/hero-image.jpeg"}
                    alt={berita.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-neutral-800 rounded-md shadow-sm uppercase tracking-wider">
                    {formatDate(berita.published_date || berita.created_at)}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-[#FF3C00] transition-colors line-clamp-2 leading-snug">
                    <Link href={`/plut/berita/${berita.slug}`}>
                      {berita.title}
                    </Link>
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 flex-grow line-clamp-3">
                    {berita.excerpt || "Baca selengkapnya mengenai berita ini di portal resmi PLUT Buleleng."}
                  </p>
                  <Link 
                    href={`/plut/berita/${berita.slug}`}
                    className="text-[#FF3C00] font-semibold text-sm inline-flex items-center gap-1 mt-auto w-fit"
                  >
                    Selengkapnya
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-neutral-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Pencarian Tidak Ditemukan</h3>
              <p className="text-neutral-500 text-base max-w-md mx-auto">
                {searchQuery 
                  ? `Kami tidak dapat menemukan berita dengan kata kunci "${searchQuery}". Coba gunakan kata kunci lain.` 
                  : "Belum ada berita yang diterbitkan saat ini."}
              </p>
              {searchQuery && (
                <Link href="/plut/berita" className="mt-6 inline-block px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors">
                  Kembali ke Daftar Berita
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}