"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function BannerSlideshow({ banners }: { banners: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efek untuk memutar slide otomatis setiap 4 detik
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="w-full px-8 md:px-16 relative">
      <div className="w-full h-72 md:h-96 relative rounded-lg overflow-hidden shadow-sm bg-gray-200 outline outline-0 outline-[#274a6a]">
        
        <div 
          className="flex h-full w-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
              <Image
                src={banner.image_url}
                alt={banner.alt_text || "Promo Banner Buleleng Mall"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority={currentIndex === 0} // Load prioritas untuk gambar pertama
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-[#274a6a] w-6" : "bg-white/70 hover:bg-white"
              }`}
              aria-label={`Pergi ke slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}