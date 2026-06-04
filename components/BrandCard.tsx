import Image from "next/image";
import Link from "next/link";
import { Business } from "@/types";

type ExtendedBusiness = Business & { rating?: number };

interface BrandCardProps {
  business: ExtendedBusiness; 
}

export default function BrandCard({ business }: BrandCardProps) {
  const ratingValue = business.rating || 5.0;

  return (
    <Link
      href={`/brand/${business.slug}`}
      className="w-full flex flex-col gap-2 rounded-lg p-2 md:p-4 hover:bg-gray-100 transition-colors cursor-pointer bg-white outline-2 outline-[#407d99] border-none ring-0 shadow-sm"
    >
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {business.image_url ? (
          <Image
            width={500}
            height={500}
            src={business.image_url}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-2xl">
            {business.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col grow">
        <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1 group-hover:text-[#274a6a] transition-colors">
          {business.name}
        </h3>
        
        <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mt-1">
          {business.desc || "Sentra produk UMKM Buleleng lokal terbaik."}
        </p>

        <div className="flex items-center gap-1 mt-auto pt-3">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star} 
                // Mewarnai kuning jika nilai star lebih kecil atau sama dengan hasil pembulatan rating
                className={`w-3.5 h-3.5 md:w-4 md:h-4 ${star <= Math.round(ratingValue) ? 'fill-current' : 'text-gray-300'}`} 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium ml-1">
            ({Number(ratingValue).toFixed(1)})
          </span>
        </div>

      </div>
    </Link>
  );
}