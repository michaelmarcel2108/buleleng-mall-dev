"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface Banner {
  id: number;
  image_url_desktop: string;
  image_url_mobile: string;
  active: boolean;
}

export default function PlutBannerSlideshow() {
  const supabase = createClient();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from("plut_banners")
        .select("*")
        .eq("active", true)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching banners:", error);
      } else {
        setBanners(data || []);
      }
      setIsLoading(false);
    };

    fetchBanners();
  }, [supabase]);

  // Logika Auto-Slide
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (isLoading) return <div className="w-full h-[350px] md:h-[450px] bg-neutral-200 animate-pulse" />;
  if (banners.length === 0) return null;

  return (
    <section className="relative w-full h-[350px] md:h-[450px] overflow-hidden bg-neutral-900 border-b-4 border-[#407d99]">
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
            alt="Banner Mobile"
            className="object-contain block md:hidden bg-black"
            priority={index === 0}
            sizes="100vw"
          />
          {/* Desktop Image */}
          <Image
            fill
            src={banner.image_url_desktop}
            alt="Banner Desktop"
            className="object-contain hidden md:block bg-black"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}
    </section>
  );
}