import Link from "next/link";
import { ReactNode } from "react";

export default function PlutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-neutral-900 text-neutral-300 py-2 px-4 text-xs font-medium hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              (0362) 32143
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              disdagperinkopukm@bulelengkab.go.id
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-white transition-colors">Buleleng Mall</Link>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR DENGAN DROPDOWN */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/plut" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-[#FF3C00] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
              P
            </div>
            <div>
              <span className="font-extrabold text-xl text-neutral-900 block leading-none mb-1">PLUT</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block leading-none">Kab. Buleleng</span>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/plut" className="text-sm font-bold text-neutral-600 hover:text-[#FF3C00] transition-colors">Beranda</Link>
            
            <div className="relative group">
              <Link href="/plut/profil" className="text-sm font-bold text-neutral-600 hover:text-[#FF3C00] transition-colors flex items-center gap-1">
                Profil
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-2 w-48 bg-white border border-neutral-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2 flex flex-col">
                  <Link href="/plut/profil" className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#FF3C00]">Tupoksi & Maklumat</Link>
                  <Link href="/plut/kontak" className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#FF3C00]">Kontak & Sosial Media</Link>
                </div>
              </div>
            </div>

            <Link href="/plut/layanan" className="text-sm font-bold text-neutral-600 hover:text-[#FF3C00] transition-colors">Layanan KUMKM</Link>
            <Link href="/plut/katalog" className="text-sm font-bold text-neutral-600 hover:text-[#FF3C00] transition-colors">Katalog Produk</Link>
            
            <div className="relative group">
              <Link href="/plut/berita" className="text-sm font-bold text-neutral-600 hover:text-[#FF3C00] transition-colors flex items-center gap-1">
                Informasi
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-neutral-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2 flex flex-col">
                  <Link href="/plut/berita" className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#FF3C00]">Berita & Pengumuman</Link>
                  <Link href="/plut/agenda-regulasi" className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#FF3C00]">Agenda & Regulasi</Link>
                  <Link href="/plut/galeri" className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#FF3C00]">Galeri Media</Link>
                </div>
              </div>
            </div>

            <Link href="/plut/pengaduan" className="text-sm font-bold text-neutral-600 hover:text-[#FF3C00] transition-colors">Pengaduan</Link>
          </nav>
        </div>
      </header>

      {/* KONTEN HALAMAN (Beranda, Profil, Berita, dll akan masuk ke sini) */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER GLOBAL PLUT */}
      <footer className="bg-neutral-900 text-white pt-16 pb-8 border-t-4 border-[#FF3C00]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-extrabold mb-4">PLUT Buleleng</h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Pusat Layanan Usaha Terpadu Koperasi dan Usaha Mikro, Kecil, dan Menengah (PLUT-KUMKM) Kabupaten Buleleng.
            </p>
            <p className="text-sm text-neutral-400">Jl. Melur No. 31, Singaraja, Bali</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#FF3C00]">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link href="/plut/katalog" className="hover:text-white transition-colors">Katalog Produk UMKM</Link></li>
              <li><Link href="/plut/layanan" className="hover:text-white transition-colors">Pendaftaran Klinik KUMKM</Link></li>
              <li><Link href="/plut/agenda-regulasi" className="hover:text-white transition-colors">JDIH & Transparansi Data</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#FF3C00]">Jam Operasional</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li className="flex justify-between border-b border-neutral-800 pb-2"><span>Senin - Kamis</span> <span>08.00 - 16.00</span></li>
              <li className="flex justify-between border-b border-neutral-800 pb-2"><span>Jumat</span> <span>08.00 - 15.00</span></li>
              <li className="flex justify-between text-red-400 pt-2"><span>Sabtu - Minggu</span> <span>Tutup</span></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-neutral-600 border-t border-neutral-800 pt-8">
          &copy; {new Date().getFullYear()} Dinas DagperinkopUKM Kabupaten Buleleng. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
}