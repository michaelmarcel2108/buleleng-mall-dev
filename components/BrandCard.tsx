import Image from "next/image";
import Link from "next/link";
import { Business } from "@/types";

// Menambahkan logo_url agar TypeScript membaca kolom dari database
type ExtendedBusiness = Business & { rating?: number; logo_url?: string };

interface BrandCardProps {
  business: ExtendedBusiness; 
}

export default function BrandCard({ business }: BrandCardProps) {
  const ratingValue = business.rating || 5.0;

  return (
    <Link
      href={`/brand/${business.slug}`}
      // Class box ini sudah 100% sama dengan ProductCard, ditambah 'group' untuk efek hover
      className="group w-full flex flex-col gap-2 rounded-lg p-2 md:p-4 hover:bg-gray-100 transition-colors cursor-pointer bg-white outline-2 outline-[#407d99] border-none ring-0 shadow-sm"
    >
      {/* KOTAK LOGO TOKO (Style kotak gambar disamakan dengan ProductCard) */}
      <div className="w-full aspect-square bg-gray-200 relative rounded-md overflow-hidden flex items-center justify-center">
        {business.logo_url ? (
          <Image
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            src={business.logo_url}
            alt={`Logo ${business.name}`}
            // Tetap menggunakan object-contain dan bg-white agar logo tidak terpotong dan tetap rapi di atas abu-abu
            className="object-contain p-4 bg-white group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-extrabold text-4xl bg-gray-300">
            {business.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* INFO TOKO */}
      <div className="pt-2 flex flex-col grow text-center items-center">
        <h3 className="font-display font-medium text-gray-900 text-base md:text-lg line-clamp-1 group-hover:text-[#407d99] transition-colors">
          {business.name}
        </h3>
        
        <p className="text-[11px] md:text-xs text-gray-500 line-clamp-2 mt-1 px-2">
          {business.desc || "Sentra produk UMKM Buleleng lokal terbaik."}
        </p>

        {/* RATING */}
        <div className="flex items-center justify-center gap-1 mt-auto pt-3">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star} 
                className={`w-3.5 h-3.5 md:w-4 md:h-4 ${star <= Math.round(ratingValue) ? 'fill-current' : 'text-gray-300'}`} 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-bold ml-1">
            {Number(ratingValue).toFixed(1)}
          </span>
        </div>

      </div>
    </Link>
  );
}