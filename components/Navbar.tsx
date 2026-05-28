"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Category, Product } from "@/types";

export default function Navbar() {
  // Memoize the supabase client so it doesn't trigger unnecessary re-renders
  // when added to the useEffect dependency array.
  const supabase = useMemo(() => createClient(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    categories: Category[];
    // Use Partial<Product> because our search query only fetches a few fields, not the whole product
    products: Partial<Product>[];
  }>({ categories: [], products: [] });
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const keyword = searchQuery.trim();
    if (!keyword) return; // The clearing is now handled safely in the onChange handler!

    const delayDebounceFn = setTimeout(async () => {
      const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .ilike("name", `%${keyword}%`)
        .limit(3);

      const { data: products } = await supabase
        .from("products")
        .select("id, name, image_url, slug") // Added slug to prevent routing errors
        .ilike("name", `%${keyword}%`)
        .limit(5);

      setSuggestions({
        categories: categories || [],
        products: products || [],
      });
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, supabase]); // Added supabase to the dependency array

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    // Clear suggestions immediately and safely without triggering the useEffect warning
    if (!val.trim()) {
      setSuggestions({ categories: [], products: [] });
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setIsOpen(false);
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Replaced 'any' with a Partial union to satisfy TypeScript
  const handleSuggestionClick = (
    type: "category" | "product",
    item: { id?: string | number; name?: string; slug?: string }, // Clean, duck-typed properties
  ) => {
    setIsSearchFocused(false);
    setSearchQuery("");
    setIsOpen(false);

    if (type === "category") {
      router.push(`/catalog?category=${item.slug || item.name?.toLowerCase()}`);
    } else {
      router.push(`/product/${item.slug || item.id}`);
    }
  };

  return (
    <nav
      suppressHydrationWarning
      className="w-full bg-white/95 backdrop-blur-sm text-gray-800 px-4 md:px-16 py-3 md:py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-gray-100 gap-2 md:gap-4"
    >
      <Link
        href="/"
        className="font-display text-lg md:text-2xl font-bold tracking-wide text-[#274a6a] shrink-0"
      >
        Buleleng Mall
      </Link>

      <div ref={searchRef} className="flex-1 max-w-md mx-2 md:mx-8 relative">
        <form onSubmit={handleSearchSubmit} suppressHydrationWarning>
          <div className="absolute inset-y-0 left-2.5 md:left-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari produk atau kategori..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            autoComplete="off"
            suppressHydrationWarning
            className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 bg-gray-50 border border-gray-200 rounded-full text-xs md:text-sm focus:outline-none focus:border-[#274a6a] focus:bg-white focus:ring-2 focus:ring-[#274a6a]/20 transition-all text-gray-700 shadow-inner"
          />
        </form>

        {isSearchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
            {isSearching ? (
              <div className="px-4 py-4 text-xs text-gray-400 flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-[#274a6a]"
                  xmlns="http://www.w3.org/2000/svg"
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
                Mencari rekomendasi...
              </div>
            ) : suggestions.categories.length === 0 &&
              suggestions.products.length === 0 ? (
              <button
                onMouseDown={handleSearchSubmit}
                className="px-4 py-4 text-sm text-gray-600 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Cari{" "}
                <span className="font-bold text-[#274a6a]">
                  &quot;{searchQuery}&quot;
                </span>
              </button>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto">
                {/* Hasil Kategori */}
                {suggestions.categories.length > 0 && (
                  <div className="border-b border-gray-100 p-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase px-2 pb-1.5 tracking-wider">
                      Kategori Terkait
                    </p>
                    {suggestions.categories.map((cat) => (
                      <button
                        key={`cat-${cat.id}`}
                        onMouseDown={() =>
                          handleSuggestionClick("category", cat)
                        }
                        className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-[#274a6a]/5 rounded-lg text-gray-700 transition-colors text-left"
                      >
                        <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <svg
                            className="w-4 h-4 text-[#274a6a]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </span>
                        <span className="font-medium">
                          Kategori{" "}
                          <span className="text-[#274a6a]">
                            &quot;{cat.name}&quot;
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Hasil Produk */}
                {suggestions.products.length > 0 && (
                  <div className="p-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase px-2 pb-1.5 tracking-wider pt-1">
                      Produk Buleleng Mall
                    </p>
                    {suggestions.products.map((prod) => (
                      <button
                        key={`prod-${prod.id}`}
                        onMouseDown={() =>
                          handleSuggestionClick("product", prod)
                        }
                        className="w-full flex items-center gap-3 px-2 py-2 text-sm hover:bg-gray-50 rounded-lg text-gray-700 transition-colors text-left"
                      >
                        <span className="w-10 h-10 shrink-0 bg-gray-100 rounded-md border border-gray-200 overflow-hidden relative block">
                          {prod.image_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={prod.image_url}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              className="w-5 h-5 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="truncate font-medium flex-1">
                          {prod.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="hidden md:flex items-center gap-6 font-medium text-gray-600">
          <Link href="/" className="hover:text-[#274a6a] transition-colors">
            Home
          </Link>
          <Link
            href="/catalog"
            className="hover:text-[#274a6a] transition-colors"
          >
            Katalog
          </Link>
        </div>

        <div ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full hover:bg-gray-100 transition-all text-gray-700 focus:outline-none"
          >
            <span className="hidden md:inline text-sm font-medium text-gray-600">
              Menu
            </span>
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {isOpen && (
            <div className="absolute top-full right-4 md:right-16 mt-2 w-56 md:w-64 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-1 border-b border-gray-100 md:hidden text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1 md:mt-0">
                Navigasi
              </div>
              <div className="px-4 py-1 border-b border-gray-100 md:hidden mb-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block py-1.5 font-medium text-sm hover:text-[#274a6a]"
                >
                  Home
                </Link>
                <Link
                  href="/catalog"
                  onClick={() => setIsOpen(false)}
                  className="block py-1.5 font-medium text-sm hover:text-[#274a6a]"
                >
                  Katalog
                </Link>
              </div>
              <div className="px-4 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1 md:mt-0">
                Informasi
              </div>
              <Link
                href="/profile-koperasi"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 hover:text-[#274a6a] font-medium transition-colors"
              >
                Profile Koperasi
              </Link>
              <Link
                href="/profile-developer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 hover:text-[#274a6a] font-medium transition-colors"
              >
                Profile Developer
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
