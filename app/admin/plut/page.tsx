import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard Admin PLUT - Buleleng",
  description: "Panel kendali admin untuk mengelola data operasional PLUT Kabupaten Buleleng.",
};

// Fungsi format tanggal
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default async function AdminPlutDashboard() {
  const supabase = await createClient();

  // Mengambil total data untuk kartu statistik
  const { count: countPosts } = await supabase.from("plut_posts").select("*", { count: "exact", head: true });
  const { count: countUmkm } = await supabase.from("plut_umkm").select("*", { count: "exact", head: true });
  const { count: countBankData } = await supabase.from("plut_bank_data").select("*", { count: "exact", head: true });
  const { count: countAgenda } = await supabase.from("plut_agendas").select("*", { count: "exact", head: true });

  // Mengambil 5 postingan (artikel/berita/pengumuman) terbaru
  const { data: recentPosts } = await supabase
    .from("plut_posts")
    .select("id, title, post_type, published_date, created_at, slug")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans">

      {/* MAIN KONTEN */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Header Dashboard */}
        <header className="bg-white border-b border-neutral-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900">Dashboard Overview</h1>
            <p className="text-sm text-neutral-500">Selamat datang kembali di panel kendali PLUT Buleleng.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-200 border-2 border-white shadow-sm flex items-center justify-center text-neutral-600 font-bold">A</div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl">
          
          {/* MENU AKSES CEPAT (SHORTCUT) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">Akses Cepat (Tambah Data)</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/plut/edit/new" className="px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg text-sm transition-colors border border-blue-200">
                + Tulis Artikel/Berita
              </Link>
              <Link href="/admin/plut/umkm/new" className="px-5 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg text-sm transition-colors border border-emerald-200">
                + Tambah UMKM Binaan
              </Link>
              <Link href="/admin/plut/bank-data/edit/new" className="px-5 py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold rounded-lg text-sm transition-colors border border-purple-200">
                + Upload Bank Data
              </Link>
              <Link href="/admin/plut/agenda/edit/new" className="px-5 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold rounded-lg text-sm transition-colors border border-amber-200">
                + Buat Agenda Kegiatan
              </Link>
            </div>
          </div>

          {/* KARTU STATISTIK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase">Postingan</p>
                <p className="text-2xl font-extrabold text-neutral-900">{countPosts || 0}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase">UMKM Binaan</p>
                <p className="text-2xl font-extrabold text-neutral-900">{countUmkm || 0}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase">Bank Data</p>
                <p className="text-2xl font-extrabold text-neutral-900">{countBankData || 0}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase">Agenda</p>
                <p className="text-2xl font-extrabold text-neutral-900">{countAgenda || 0}</p>
              </div>
            </div>
          </div>

          {/* TABEL AKTIVITAS TERBARU */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-neutral-900">Aktivitas Postingan Terakhir</h2>
              <Link href="/admin/plut/manage" className="text-sm font-bold text-[#FF3C00] hover:underline">
                Lihat Semua Artikel &rarr;
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-500 text-sm">
                    <th className="px-6 py-4 font-semibold">Judul Postingan</th>
                    <th className="px-6 py-4 font-semibold">Tipe</th>
                    <th className="px-6 py-4 font-semibold">Tanggal Publish</th>
                    <th className="px-6 py-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentPosts && recentPosts.length > 0 ? (
                    recentPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-neutral-900 line-clamp-1">{post.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-neutral-100 text-neutral-700 uppercase tracking-wider border border-neutral-200">
                            {post.post_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {formatDate(post.published_date || post.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link href={`/admin/plut/edit/${post.slug}`} className="text-emerald-600 hover:text-emerald-800 font-semibold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                              Edit Data
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                        Belum ada data postingan terbaru yang ditambahkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}