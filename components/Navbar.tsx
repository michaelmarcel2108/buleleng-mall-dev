"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() !== "") {
      router.push(`/catalog?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm px-4 md:px-16 py-4 flex flex-row items-center justify-between gap-4 sticky top-0 z-50">
      <Link href="/" className="font-display text-xl md:text-2xl font-bold tracking-tight text-blue-900 flex-shrink-0">
        Buleleng Mall
      </Link>

      <form onSubmit={handleSearch} className="flex-1 max-w-xs md:max-w-xl mx-2 md:mx-4 relative flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className="w-5 h-5 absolute left-3 text-gray-400"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

        <input
          type="text"
          placeholder="Cari produk lokal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-100 text-foreground pl-10 pr-4 py-2 rounded-full text-sm outline-none focus:bg-gray-200/70 focus:ring-2 focus:ring-blue-900/20 transition-all"
        />
      </form>

      <div className="flex-shrink-0">
        <button className="bg-primary text-foreground px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all flex flex-row items-center gap-2 outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <span className="hidden md:inline">Kategori</span>
        </button>
      </div>
    </header>
  );
}