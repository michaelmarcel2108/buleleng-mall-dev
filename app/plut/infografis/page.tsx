import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Infografis - PLUT Buleleng",
  description: "Kumpulan data, statistik, dan informasi kebijakan dalam bentuk infografis dari PLUT Kabupaten Buleleng.",
};

export default async function InfografisPage() {
  const supabase = await createClient();

  // KUNCI DINAMIS: Mengambil data khusus tipe 'infografis'
  const { data: infografisList, error } = await supabase
    .from("plut_posts")
    .select("id, title, slug, image_url, published_date, created_at")
    .eq("post_type", "infografis")
    .order("published_date", { ascending: false });

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* HERO SECTION (Aksen Biru PLUT) */}
      <section className="bg-neutral-900 text-white py-16 px-6 relative overflow-hidden border-b-4 border-[#407d99]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#407d99]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[#407d99] font-bold text-sm tracking-widest uppercase mb-3 block">Layanan Informasi</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Galeri <span className="text-[#407d99]">Infografis</span>
          </h1>
          <p className="text-lg text-neutral-400">
            Edukasi, statistik, dan panduan kebijakan pemerintah yang disajikan dalam ringkasan visual yang mudah dipahami.
          </p>
        </div>
      </section>

      {/* KONTEN UTAMA */}
      <main className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {infografisList && infografisList.length > 0 ? (
            infografisList.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-xl transition-all group flex flex-col">
                {/* Area Gambar Infografis */}
                <div className="relative w-full aspect-[4/5] bg-neutral-200 overflow-hidden">
                  <Image
                    src={item.image_url || "/hero-image.jpeg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay Hitam saat di-hover untuk tombol lihat detail */}
                  <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <Link 
                      href={`/plut/berita/${item.slug}`} 
                      className="px-6 py-3 bg-[#407d99] hover:bg-[#326278] text-white font-bold rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Lihat Detail
                    </Link>
                  </div>
                </div>
                {/* Judul Infografis */}
                <div className="p-5 text-center flex-grow flex items-center justify-center border-t border-neutral-100">
                  <h3 className="text-lg font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-[#407d99] transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-neutral-100">
              <p className="text-neutral-500">Belum ada infografis yang dipublikasikan.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}