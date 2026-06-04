"use client";

import { useState } from "react";

export default function ProductDescription({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const maxLength = 150; 
  const shouldTruncate = text.length > maxLength;

  if (!text) {
    return (
      <div className="text-gray-500 italic text-sm md:text-base mt-2">
        Tidak ada deskripsi untuk produk ini.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start mt-2">
      <div
        className={`text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line transition-all duration-300 ${
          isExpanded ? "" : "line-clamp-2"
        }`}
      >
        {text}
      </div>
      
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#274a6a] font-bold text-sm hover:underline mt-2 flex items-center gap-1"
        >
          {isExpanded ? "Tutup Deskripsi" : "Lihat Selengkapnya"}
        </button>
      )}
    </div>
  );
}