import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default async function DetailBeritaPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params; 
  const slug = decodeURIComponent(resolvedParams.slug);

  const supabase = await createClient();

  const { data: artikel, error } = await supabase
    .from("plut_articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !artikel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-lg w-full border border-red-100">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Gagal Memuat Data</h1>
          <div className="space-y-2 text-neutral-700 bg-neutral-100 p-4 rounded-lg font-mono text-sm">
            <p><strong>Slug yang dicari:</strong> {slug}</p>
            <p><strong>Pesan Error Supabase:</strong> {error?.message || "Tidak ditemukan."}</p>
          </div>
          <Link href="/plut/berita" className="mt-6 inline-block text-blue-600 hover:underline">
            &larr; Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    );
  }

  const { data: rekomendasi } = await supabase
    .from("plut_articles")
    .select("*")
    .neq("slug", slug) // neq = Not Equal (Jangan tampilkan artikel yang sama)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/plut/berita" className="text-sm font-medium text-neutral-500 hover:text-[#FF3C00] flex items-center gap-2 transition-colors w-fit">
            &larr; Kembali ke Daftar Berita
          </Link>
        </div>
      </header>

      {/* ARTIKEL UTAMA */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <span className="text-[#FF3C00] font-bold text-sm tracking-widest uppercase mb-4 block">Berita Terkini</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-6 leading-tight">
            {artikel.title}
          </h1>
          <p className="text-neutral-500 font-medium">
            Diterbitkan pada: {formatDate(artikel.published_date || artikel.created_at)}
          </p>
        </div>

        {artikel.image_url && (
          <div className="relative w-full h-[400px] md:h-[550px] rounded-2xl overflow-hidden mb-12 shadow-lg bg-neutral-100">
            <Image
              src={artikel.image_url}
              alt={artikel.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-neutral-700 whitespace-pre-wrap mb-16">
          <p className="lead text-xl text-neutral-600 mb-8 font-medium">
            {artikel.excerpt}
          </p>
          <div>
            {artikel.content}
          </div>
        </div>
      </article>

      {/* REKOMENDASI BERITA */}
      {rekomendasi && rekomendasi.length > 0 && (
        <section className="bg-neutral-50 border-t border-neutral-200 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">Baca Juga</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rekomendasi.map((berita) => (
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
                    <p className="text-neutral-600 text-sm mb-4 flex-grow line-clamp-2">
                      {berita.excerpt}
                    </p>
                    <Link 
                      href={`/plut/berita/${berita.slug}`}
                      className="text-[#FF3C00] font-semibold text-sm inline-flex items-center gap-1 mt-auto"
                    >
                      Baca Artikel
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}