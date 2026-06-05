import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Kelola Produk UMKM - Admin PLUT",
  description: "Manajemen etalase produk UMKM Buleleng.",
};

// Fungsi format Rupiah
const formatRupiah = (angka: number) => {
  if (!angka) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

export default async function ManageProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }> | { q?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.q || "";

  const supabase = await createClient();

  // Query dinamis dengan Relasi ke tabel plut_umkm
  let query = supabase
    .from("plut_products")
    .select(`
      id,
      nama_produk,
      kategori_produk,
      harga,
      plut_umkm (
        nama_usaha
      )
    `)
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.ilike("nama_produk", `%${searchQuery}%`);
  }

  const { data: productsList, error } = await query;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR ADMIN */}
      <aside className="w-full md:w-64 bg-neutral-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-neutral-800">
          <Link href="/admin/plut" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF3C00] rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              P
            </div>
            <span className="font-bold text-lg tracking-wide">Admin PLUT</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/plut" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </Link>
          <Link href="/admin/plut/manage" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            Kelola Postingan
          </Link>
          <Link href="/admin/plut/umkm" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Database UMKM
          </Link>
          <Link href="/admin/plut/products" className="flex items-center gap-3 px-4 py-3 bg-[#FF3C00] text-white rounded-xl font-medium shadow-md">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Katalog Produk
          </Link>
        </nav>
      </aside>

      {/* MAIN KONTEN */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-neutral-200 px-8 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900">Katalog Produk</h1>
            <p className="text-sm text-neutral-500">Kelola etalase produk dari UMKM binaan PLUT.</p>
          </div>
          
          <div className="flex w-full sm:w-auto items-center gap-3">
            <form action="/admin/plut/products" method="GET" className="relative w-full sm:w-64">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Cari nama produk..."
                className="w-full pl-4 pr-10 py-2.5 bg-neutral-100 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3C00]"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#FF3C00]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>
            
            <Link 
              href="/admin/plut/products/edit/new" 
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#FF3C00] hover:bg-[#e03500] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Tambah Produk
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-7xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
              Gagal memuat data dari database: {error.message}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Nama Produk</th>
                    <th className="px-6 py-4 font-semibold">UMKM Pemilik</th>
                    <th className="px-6 py-4 font-semibold">Kategori</th>
                    <th className="px-6 py-4 font-semibold">Harga</th>
                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {productsList && productsList.length > 0 ? (
                    productsList.map((product) => {
                      // Menarik data nama usaha dari relasi Supabase secara aman
                      const namaUmkm = (product.plut_umkm as any)?.nama_usaha || "UMKM Tidak Ditemukan";
                      
                      return (
                        <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-neutral-900 line-clamp-1">{product.nama_produk}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200 line-clamp-1">
                              {namaUmkm}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-neutral-600">{product.kategori_produk || "-"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#FF3C00]">{formatRupiah(product.harga)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {/* Tombol Edit */}
                              <Link 
                                href={`/admin/plut/products/edit/${product.id}`} 
                                className="p-2 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Edit Data"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </Link>

                              {/* Tombol Hapus */}
                              <button 
                                type="button"
                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Data"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 mb-3">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <p className="text-neutral-900 font-bold">Data Produk Kosong</p>
                        <p className="text-neutral-500 text-sm mt-1">
                          {searchQuery ? `Tidak ada produk dengan nama "${searchQuery}"` : "Belum ada produk yang ditambahkan ke etalase kita."}
                        </p>
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