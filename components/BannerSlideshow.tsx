"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Banner } from "@/types";

export default function BannerSlideshow() {
  const supabase = createClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk mendeteksi gesekan jari (diubah menggunakan null agar tap biasa tidak error)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("id", { ascending: true });

      if (error) console.error("Error dari Supabase:", error);

      if (data && data.length > 0) {
        setBanners(data);
      }
      setIsLoading(false);
    };

    fetchBanners();
  }, [supabase]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // --- FUNGSI DETEKSI SWIPE YANG SUDAH DIPERBAIKI ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset nilai akhir setiap kali mulai menyentuh
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50; // Minimal jarak geser agar dianggap swipe (bukan cuma kesentuh dikit)

    if (distance > minSwipeDistance) {
      // Geser jari ke kiri (Next)
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    } else if (distance < -minSwipeDistance) {
      // Geser jari ke kanan (Prev)
      setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-[430/288] md:aspect-[1920/500] bg-white/5 animate-pulse rounded-xl flex items-center justify-center shadow-sm border border-white/10">
        {/* Animasi Bulatan Loading */}
        <svg
          className="animate-spin h-8 w-8 text-white/50"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div
      // class touch-pan-y ditambahkan di sini
      className="relative w-full aspect-[430/288] md:aspect-[1920/500] overflow-hidden rounded-xl shadow-sm group bg-gray-100 touch-pan-y"
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
          {banner.image_url_mobile && (
            <Image
              src={banner.image_url_mobile}
              alt={banner.title || "Promo Buleleng Mall"}
              className="w-full h-full object-cover block md:hidden pointer-events-none"
              loading={index === 0 ? "eager" : "lazy"}
              draggable="false"
            />
          )}

          {banner.image_url_desktop && (
            <Image
              src={banner.image_url_desktop}
              alt={banner.title || "Promo Buleleng Mall"}
              className="w-full h-full object-cover hidden md:block pointer-events-none"
              loading={index === 0 ? "eager" : "lazy"}
              draggable="false"
            />
          )}
        </div>
      ))}

      {banners.length > 1 && (
        <div className="absolute bottom-3 md:bottom-5 left-0 right-0 flex justify-center gap-1.5 md:gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#274a6a] w-6 md:w-8"
                  : "bg-white/70 hover:bg-white w-1.5 md:w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {banners.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? banners.length - 1 : prev - 1,
              )
            }
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#274a6a] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1,
              )
            }
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#274a6a] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
