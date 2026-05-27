"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Efek Debounce untuk pencarian otomatis
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const delayDebounceFn = setTimeout(() => {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    // PERBAIKAN 1: Tambahkan suppressHydrationWarning pada tag induk (nav)
    <nav suppressHydrationWarning className="w-full bg-white/95 backdrop-blur-sm text-gray-800 px-4 md:px-16 py-3 md:py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-gray-100 gap-2 md:gap-4">
      
      {/* Logo / Judul Platform */}
      <Link href="/" className="font-display text-lg md:text-2xl font-bold tracking-wide text-[#274a6a] shrink-0">
        Buleleng Mall
      </Link>

      {/* SEARCH BAR */}
      <div className="flex-1 max-w-md mx-2 md:mx-8 relative">
        {/* PERBAIKAN 2: Lindungi form dan input dari injeksi ekstensi browser */}
        <form onSubmit={handleSearch} suppressHydrationWarning>
          <div className="absolute inset-y-0 left-2.5 md:left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off" // Mencegah browser autofill memasukkan atribut tak terduga
            suppressHydrationWarning // Mematikan peringatan jika ekstensi mengubah input
            className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 bg-gray-50 border border-gray-200 rounded-full text-xs md:text-sm focus:outline-none focus:border-[#274a6a] focus:bg-white transition-all text-gray-700"
          />
        </form>
      </div>

      {/* Menu Navigasi & Tombol Hamburger */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="hidden md:flex items-center gap-6 font-medium text-gray-600">
          <Link href="/" className="hover:text-[#274a6a] transition-colors">Home</Link>
          <Link href="/catalog" className="hover:text-[#274a6a] transition-colors">Katalog</Link>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full hover:bg-gray-100 transition-all text-gray-700 focus:outline-none"
        >
          <span className="hidden md:inline text-sm font-medium text-gray-600">Menu</span>
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Dropdown Menu Box */}
      {isOpen && (
        <div className="absolute top-full right-4 md:right-16 mt-2 w-56 md:w-64 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          
          <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
            <form onSubmit={handleSearch} suppressHydrationWarning>
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                suppressHydrationWarning
                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#274a6a]"
              />
            </form>
          </div>

          <div className="px-4 py-1 border-b border-gray-100 md:hidden text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1 md:mt-0">
            Navigasi
          </div>
          <div className="px-4 py-1 border-b border-gray-100 md:hidden mb-1">
            <Link href="/" onClick={() => setIsOpen(false)} className="block py-1.5 font-medium text-sm hover:text-[#274a6a]">Home</Link>
            <Link href="/catalog" onClick={() => setIsOpen(false)} className="block py-1.5 font-medium text-sm hover:text-[#274a6a]">Katalog</Link>
          </div>

          <div className="px-4 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1 md:mt-0">
            Informasi
          </div>
          <Link href="/profile-koperasi" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 hover:text-[#274a6a] font-medium transition-colors">
            
            Profile Koperasi
          </Link>
          <Link href="/profile-developer" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 hover:text-[#274a6a] font-medium transition-colors">
            
            Profile Developer
          </Link>
        </div>
      )}
    </nav>
  );
}