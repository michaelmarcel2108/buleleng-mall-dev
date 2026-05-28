import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#274a6a] text-white font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Kolom 1: Brand & Deskripsi */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-lg md:text-xl font-bold text-white">
            Buleleng Mall
          </h3>
          <p className="text-xs md:text-sm leading-relaxed text-white/90">
            Platform e-commerce resmi untuk mendukung, mengenalkan, dan memasarkan berbagai macam produk unggulan dari UMKM lokal Kabupaten Buleleng, Bali. Mari kita bersama-sama memperkuat dan memajukan potensi ekonomi kreatif daerah.
          </p>
        </div>

        {/* Kolom 2: Daftar Kategori */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Kategori
          </h4>
          <ul className="flex flex-col gap-2 text-xs md:text-sm font-medium">
            <li>
              <Link href="/catalog?category=makanan" className="text-white/80 hover:text-white transition-colors">
                Makanan & Minuman
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=kerajinan" className="text-white/80 hover:text-white transition-colors">
                Kerajinan Tangan
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=fashion" className="text-white/80 hover:text-white transition-colors">
                Fashion & Pakaian
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=pertanian" className="text-white/80 hover:text-white transition-colors">
                Pertanian & Agro
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Site Map Navigasi */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Site Map
          </h4>
          <ul className="flex flex-col gap-2 text-xs md:text-sm font-medium">
            <li>
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/catalog" className="text-white/80 hover:text-white transition-colors">
                Katalog Produk
              </Link>
            </li>
            <li>
              <Link href="/profile-koperasi" className="text-white/80 hover:text-white transition-colors">
                Profil Koperasi
              </Link>
            </li>
            <li>
              <Link href="/profile-developer" className="text-white/80 hover:text-white transition-colors">
                Profil Developer
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 4: Kontak & Lokasi */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Kontak & Lokasi
          </h4>
          <p className="text-xs md:text-sm text-white/80 leading-relaxed">
            Jl. A. Yani, Singaraja, Kec. Buleleng, Kabupaten Buleleng, Bali<br />
            +62 8987-654-321
          </p>
          <p className="text-xs text-white/60 font-medium pt-1">
            info@plut.bulelengkab.go.id
          </p>
        </div>
      </div>

      {/* Bagian Hak Cipta */}
      {/* PERBAIKAN: border disesuaikan menjadi putih transparan agar menyatu dengan background biru */}
      <div className="w-full border-t border-white/10 py-4 text-center text-[10px] md:text-xs text-white/60 bg-black/10 font-medium">
        &copy; {new Date().getFullYear()} Buleleng Mall. All Rights Reserved.
      </div>
    </footer>
  );
}