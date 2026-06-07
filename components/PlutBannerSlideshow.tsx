"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

// Definisi tipe data banner PLUT
interface PlutBanner {
  id: number;
  image_url_mobile: string;
  image_url_desktop: string;
  alt_text?: string;
}

export default function PlutBannerSlideshow() {
  const supabase = createClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState<PlutBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      // Mengambil dari tabel plut_banners
      const { data, error } = await supabase
        .from("plut_banners")
        .select("*")
        .eq("active", true) // Pastikan hanya ambil yang aktif
        .order("id", { ascending: true });

      if (error) console.error("Error fetching PLUT banners:", error);
      if (data) setBanners(data);
      setIsLoading(false);
    };

    fetchBanners();
  }, [supabase]);

  // Auto-play
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Fungsi Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    } else if (distance < -minSwipeDistance) {
      setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    }
  };

  if (isLoading) {
    return <div className="w-full h-[300px] md:h-[500px] bg-neutral-200 animate-pulse rounded-xl" />;
  }

  if (banners.length === 0) return null;

  return (
    <div
      className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-xl shadow-sm group bg-[#0c353e] touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Mobile Image */}
          <Image
            fill
            src={banner.image_url_mobile}
            alt={banner.alt_text || "Banner PLUT"}
            className="object-cover block md:hidden"
            loading={index === 0 ? "eager" : "lazy"}
            draggable="false"
          />
          {/* Desktop Image */}
          <Image
            fill
            src={banner.image_url_desktop}
            alt={banner.alt_text || "Banner PLUT"}
            className="object-cover hidden md:block"
            loading={index === 0 ? "eager" : "lazy"}
            draggable="false"
          />
        </div>
      ))}

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-8" : "bg-white/50 w-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}