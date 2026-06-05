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

export default async function SemuaBeritaPage() {
  const supabase = await createClient();

  // Mengambil SEMUA artikel dari database
  const { data: daftarBerita, error } = await supabase
    .from("plut_articles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-12 border-b border-neutral-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4 tracking-tight">
            Indeks Berita & Edukasi
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Kumpulan seluruh informasi, liputan kegiatan, dan materi edukasi terbaru untuk mendukung pertumbuhan ekosistem UMKM Buleleng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold text-neutral-800 rounded-full shadow-sm uppercase tracking-wider">
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
                    {berita.excerpt}
                  </p>
                  <Link 
                    href={`/plut/berita/${berita.slug}`}
                    className="text-[#FF3C00] font-semibold text-sm inline-flex items-center gap-1 mt-auto"
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
            <div className="col-span-full py-20 text-center">
              <p className="text-neutral-500 text-lg">Belum ada berita yang diterbitkan.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}