"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function PlutNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <Link href="/plut" className="flex items-center gap-3">
            <div className="relative w-15 h-15">
              <Image 
                src="/logo-plut.png" 
                alt="Logo PLUT" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-black text-[#0c353e] tracking-tight">PLUT BULELENG</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {["Berita", "Layanan", "Agenda", "Bank Data"].map((item) => (
              <Link 
                key={item} 
                href={`/plut/${item.toLowerCase().replace(" ", "-")}`} 
                className="text-sm font-semibold text-neutral-600 hover:text-[#0c353e] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            <div className="w-6 h-0.5 bg-neutral-600 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-neutral-600"></div>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-neutral-100 p-4 space-y-4">
           {["Berita", "Layanan", "Agenda", "Bank Data"].map((item) => (
              <Link 
                key={item} 
                href={`/plut/${item.toLowerCase().replace(" ", "-")}`} 
                className="block text-sm font-semibold text-neutral-600"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
        </div>
      )}
    </nav>
  );
}