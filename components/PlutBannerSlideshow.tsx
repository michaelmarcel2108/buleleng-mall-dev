"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

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

  // Swipe State
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("plut_banners")
        .select("*")
        .eq("active", true)
        .order("id", { ascending: true });

      if (error) {
        console.error("Gagal ambil banner:", error);
      } else {
        setBanners(data || []);
      }
      setIsLoading(false);
    };

    fetchBanners();
  }, [supabase]);

  // Auto-play interval
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Handler Swipe
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
      else setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    }
    setTouchStart(null);
  };

  if (isLoading) return <div className="w-full h-[300px] md:h-[500px] bg-neutral-200 animate-pulse rounded-xl" />;
  if (banners.length === 0) return null;

  return (
    <div
      className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-xl shadow-sm bg-neutral-900 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Mobile Image */}
          <Image
            fill
            src={banner.image_url_mobile}
            alt={banner.alt_text || "Banner PLUT Mobile"}
            className="object-cover block md:hidden"
            priority={index === 0}
            sizes="100vw"
          />
          {/* Desktop Image */}
          <Image
            fill
            src={banner.image_url_desktop}
            alt={banner.alt_text || "Banner PLUT Desktop"}
            className="object-cover hidden md:block"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}