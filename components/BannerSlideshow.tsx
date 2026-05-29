"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 

export default function BannerSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    setMounted(true);
    
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
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000); 
    
    return () => clearInterval(timer);
  }, [banners.length]);

  // --- FUNGSI DETEKSI SWIPE ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // Geser ke kiri (Next)
    const isRightSwipe = distance < -50; // Geser ke kanan (Prev)
    
    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    } else if (isRightSwipe) {
      setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    }
    
    // Reset koordinat sentuhan
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="w-full aspect-[430/288] md:aspect-[1920/500] bg-gray-200 animate-pulse rounded-xl flex items-center justify-center shadow-sm">
        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full aspect-[430/288] md:aspect-[1920/500] overflow-hidden rounded-xl shadow-sm group bg-gray-100"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {banner.image_url_mobile && (
            <img
              src={banner.image_url_mobile}
              alt={banner.title || "Promo Buleleng Mall"}
              className="w-full h-full object-cover block md:hidden"
              loading={index === 0 ? "eager" : "lazy"}
              draggable="false" 
            />
          )}

          {banner.image_url_desktop && (
            <img
              src={banner.image_url_desktop}
              alt={banner.title || "Promo Buleleng Mall"}
              className="w-full h-full object-cover hidden md:block"
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
            onClick={() => setCurrentIndex(prev => prev === 0 ? banners.length - 1 : prev - 1)}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#274a6a] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={() => setCurrentIndex(prev => prev === banners.length - 1 ? 0 : prev + 1)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#274a6a] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}
    </div>
  );
}