import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Katalog Produk UMKM - PLUT Buleleng",
  description: "Etalase digital produk-produk unggulan UMKM binaan PLUT Kabupaten Buleleng.",
};

const formatRupiah = (angka: number) => {
  if (!angka) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

export default async function KatalogProdukPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; kategori?: string }> | { q?: string; kategori?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.q || "";
  const selectedKategori = resolvedSearchParams?.kategori || "Semua";

  const supabase = await createClient();

  // Query database: Relasi antara plut_products dan plut_umkm
  let query = supabase
    .from("plut_products")
    .select(`
      id,
      nama_produk,
      deskripsi,
      harga,
      kategori_produk,
      gambar_url,
      link_pembelian,
      plut_umkm (
        nama_usaha
      )
    `)
    .order("created_at", { ascending: false });

  // Filter Dinamis Pencarian
  if (searchQuery) {
    query = query.ilike("nama_produk", `%${searchQuery}%`);
  }
  
  // Filter Dinamis Kategori
  if (selectedKategori !== "Semua") {
    query = query.eq("kategori_produk", selectedKategori);
  }

  const { data: produkUMKM, error } = await query;

  const kategoriList = ["Semua", "Makanan", "Minuman", "Fashion", "Kerajinan", "Kesehatan"];

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* NAVBAR */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/plut" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#FF3C00] rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-bold text-lg text-neutral-900">PLUT Buleleng</span>
          </Link>
          <Link href="/plut" className="text-sm font-medium text-neutral-500 hover:text-[#FF3C00] transition-colors">
            &larr; Kembali
          </Link>
        </div>
      </header>

      {/* HERO KATALOG */}
      <section className="bg-neutral-900 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#FF3C00] font-bold text-sm tracking-widest uppercase mb-4 block">Buleleng Mall x PLUT</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Etalase Produk <span className="text-[#FF3C00]">Lokal</span>
          </h1>
          <p className="text-lg text-neutral-400">
            Dukung kebangkitan ekonomi daerah dengan membeli produk-produk berkualitas tinggi karya UMKM Binaan PLUT Kabupaten Buleleng.
          </p>
        </div>
      </section>

      <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* FORM PENCARIAN DINAMIS */}
        <form className="max-w-2xl mx-auto mb-10" action="/plut/katalog" method="GET">
          <div className="relative group">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              className="block w-full pl-5 pr-24 py-3.5 border border-neutral-200 rounded-xl bg-white text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-[#FF3C00] transition-all outline-none shadow-sm"
              placeholder="Cari produk UMKM..."
            />
            {/* Mempertahankan kategori saat melakukan pencarian */}
            {selectedKategori !== "Semua" && (
              <input type="hidden" name="kategori" value={selectedKategori} />
            )}
            <button
              type="submit"
              className="absolute inset-y-1.5 right-1.5 px-6 bg-[#FF3C00] hover:bg-[#e03500] text-white text-sm font-bold rounded-lg transition-colors"
            >
              Cari
            </button>
          </div>
        </form>

        {/* KATEGORI FILTER DINAMIS */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {kategoriList.map((kat, idx) => {
            const isActive = selectedKategori === kat;
            const href = kat === "Semua" 
              ? (searchQuery ? `/plut/katalog?q=${searchQuery}` : "/plut/katalog") 
              : `/plut/katalog?kategori=${kat}${searchQuery ? `&q=${searchQuery}` : ""}`;
            
            return (
              <Link 
                key={idx}
                href={href}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-[#FF3C00] text-white shadow-md" 
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-[#FF3C00] hover:text-[#FF3C00]"
                }`}
              >
                {kat}
              </Link>
            );
          })}
        </div>

        {/* GRID PRODUK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produkUMKM && produkUMKM.length > 0 ? (
            produkUMKM.map((produk) => {
              // Menarik data relasi dengan aman
              const umkmName = (produk.plut_umkm as any)?.nama_usaha || "UMKM Binaan PLUT";

              return (
                <div key={produk.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-xl transition-all group flex flex-col">
                  {/* Gambar Produk */}
                  <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={produk.gambar_url || "/hero-image.jpeg"}
                      alt={produk.nama_produk}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-neutral-800 rounded-md shadow-sm uppercase tracking-wider">
                      {produk.kategori_produk || "Umum"}
                    </div>
                  </div>

                  {/* Info Produk */}
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-xs font-semibold text-neutral-500 mb-1 flex items-center gap-1 line-clamp-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {umkmName}
                    </p>
                    <h3 className="text-lg font-bold text-neutral-900 mb-3 line-clamp-2 leading-snug group-hover:text-[#FF3C00] transition-colors">
                      {produk.nama_produk}
                    </h3>
                    
                    {/* Harga & Tombol Beli */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100">
                      <span className="font-extrabold text-[#FF3C00]">
                        {formatRupiah(produk.harga)}
                      </span>
                      {produk.link_pembelian ? (
                        <a href={produk.link_pembelian} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors" title="Beli via WhatsApp/Marketplace">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </a>
                      ) : (
                        <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 cursor-not-allowed">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-neutral-100">
              <p className="text-neutral-500">Tidak ada produk ditemukan untuk kategori/pencarian ini.</p>
            </div>
          )}
        </div>

        {/* BANNER AJAKAN BERGABUNG */}
        <div className="mt-20 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Produk Anda Belum Masuk Etalase?</h2>
            <p className="text-neutral-400 max-w-xl">
              Daftarkan usaha Anda menjadi UMKM Binaan PLUT Buleleng untuk mendapatkan pendampingan foto produk, desain kemasan, dan akses pemasaran gratis bersama kita.
            </p>
          </div>
          <a 
            href="https://wa.me/6281234567890" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="shrink-0 px-8 py-4 bg-[#FF3C00] hover:bg-[#e03500] text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1"
          >
            Daftar Sekarang
          </a>
        </div>
      </main>
    </div>
  );
}