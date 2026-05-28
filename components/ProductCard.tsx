"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price?: number;
    image_url: string | null;
    slug: string;
    businesses?: { name: string } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleSaveToRecent = () => {
    const existing = localStorage.getItem("recent_products");
    let recentList: any[] = existing ? JSON.parse(existing) : [];

    recentList = recentList.filter((item) => item.id !== product.id);
    recentList.unshift(product);

    if (recentList.length > 8) {
      recentList.pop();
    }

    localStorage.setItem("recent_products", JSON.stringify(recentList));
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={handleSaveToRecent}
      suppressHydrationWarning
      className="w-full flex flex-col gap-2 rounded-lg p-2 md:p-4 hover:bg-gray-100 transition-colors cursor-pointer bg-white outline-2 outline-[#407d99] border-none ring-0 shadow-sm block"
    >
      <div className="w-full aspect-square bg-gray-200 relative rounded-md overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-500">
            No Image
          </div>
        )}
      </div>
      
      <div className="flex flex-col">
        <div className="font-display text-lg font-medium line-clamp-1">
          {product.name}
        </div>
        
        {product.businesses && (
          <div className="text-sm text-gray-500 line-clamp-1">
            {product.businesses.name}
          </div>
        )}
        
        <div className="font-bold mt-1 text-[#caa74a]" suppressHydrationWarning>
          Rp{product.price ? product.price.toLocaleString("id-ID") : "0"}
        </div>
      </div>
    </Link>
  );
}