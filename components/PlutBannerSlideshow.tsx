"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface Banner {
  id: number;
  image_url_desktop: string;
  image_url_mobile: string;
}

export default function PlutBannerSlideshow() {
  const supabase = createClient();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from("plut_banners")
        .select("*")
        .eq("active", true);

      if (error) {
        console.error("DEBUG BANNER ERROR:", error);
      } else {
        console.log("DEBUG BANNER DATA:", data); // Lihat di console browser
        setBanners(data || []);
      }
    };

    fetchBanners();
  }, [supabase]);

  // LOGIKA SLIDE SHOW
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % banners.length;
        console.log("Slide berpindah ke:", next); // Cek apakah interval jalan
        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

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
          <Image
            fill
            src={banner.image_url_mobile}
            alt="Banner Mobile"
            className="object-contain block md:hidden bg-black"
            priority={index === 0}
            sizes="100vw"
          />
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