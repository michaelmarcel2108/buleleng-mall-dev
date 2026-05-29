"use client";

import { useState, useEffect } from "react";

export default function ScrollHint() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    
    const autoScrollTimer = setTimeout(() => {
      if (window.scrollY < 10) {
        window.scrollBy({
          top: 150,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(autoScrollTimer);
    };
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 mt-8 transition-opacity duration-700 ease-in-out ${
        isScrolled ? "opacity-0 pointer-events-none" : "opacity-80 animate-bounce"
      }`}
    >
      <span className="text-sm font-medium text-white">Jelajahi Lebih Banyak</span>
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  );
}