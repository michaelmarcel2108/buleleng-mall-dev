import { createClient } from "@/lib/supabase/server";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

export const metadata = {
  title: "Berita & Kegiatan - PLUT Buleleng",
};

export default async function DaftarBeritaPage() {
  const supabase = await createClient();
  
  // Tarik SEMUA data yang tipenya 'berita', urutkan dari yang paling baru
  const { data: posts } = await supabase
    .from("plut_posts")
    .select("*")
    .eq("post_type", "berita")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-neutral-50 font-sans pb-20">
      {/* Header Halaman */}
      <div className="bg-white border-b border-neutral-200 py-16 px-6 text-center">
        <h1 className="text-4xl font-extrabold text-neutral-900 mb-4">Berita & Kegiatan Terkini</h1>
        <p className="text-neutral-500 max-w-2xl mx-auto">
          Pantau terus informasi terbaru, program pelatihan, dan aktivitas harian kita dalam mendampingi KUMKM di Kabupaten Buleleng.
        </p>
      </div>

      {/* Grid Kartu Berita */}
      <div className="max-w-7xl mx-auto px-6 pt-12">
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-sm">
            <span className="text-4xl mb-4 block">📰</span>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Belum Ada Berita</h2>
            <p className="text-neutral-500">Berita dan kegiatan terbaru akan segera hadir di sini.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/plut" className="text-sm font-bold text-neutral-500 hover:text-[#FF3C00] transition-colors">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}