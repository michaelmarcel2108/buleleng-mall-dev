"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import BrandCard from "./BrandCard";

interface HomeTabsProps {
  products: any[];
  businesses: any[];
}

export default function HomeTabs({ products, businesses }: HomeTabsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("terlaris");
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    if (activeTab === "incaran") {
      const existing = localStorage.getItem("recent_products");
      if (existing) {
        setRecentProducts(JSON.parse(existing));
      }
    }
  }, [activeTab]);

  if (!isMounted) return null;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* NAVIGASI TAB */}
      <div className="flex flex-row justify-center items-center gap-2 md:gap-6 pb-4 font-sans text-base md:text-l font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("terlaris")}
          className={`px-3 py-1 transition-all outline-none focus:outline-none border-none ring-0 ${
            activeTab === "terlaris"
              ? "bg-[#274a6a] text-white rounded-lg"
              : "text-[#274a6a] hover:opacity-80"
          }`}
        >
          Produk Terlaris
        </button>
        
        <span className="text-[#274a6a]/30 font-light">|</span>
        
        <button
          onClick={() => setActiveTab("brand")}
          className={`px-3 py-1 transition-all outline-none focus:outline-none border-none ring-0 ${
            activeTab === "brand"
              ? "bg-[#274a6a] text-white rounded-lg"
              : "text-[#274a6a] hover:opacity-80"
          }`}
        >
          Brand Lokal
        </button>
        
        <span className="text-[#274a6a]/30 font-light">|</span>
        
        <button
          onClick={() => setActiveTab("incaran")}
          className={`px-3 py-1 transition-all outline-none focus:outline-none border-none ring-0 ${
            activeTab === "incaran"
              ? "bg-[#274a6a] text-white rounded-lg"
              : "text-[#274a6a] hover:opacity-80"
          }`}
        >
          Incaran Anda
        </button>
      </div>

      {/* KONTEN TAB */}
      <div className="w-full">
        {activeTab === "terlaris" && (
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {activeTab === "brand" && (
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            {businesses.map((business) => (
              <BrandCard key={business.id} business={business} />
            ))}
          </div>
        )}

        {activeTab === "incaran" && (
          <div className="w-full">
            {recentProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentProducts.map((product, index) => (
                  <ProductCard key={`recent-${product.id}-${index}`} product={product} />
                ))}
              </div>
            ) : (
              <div className="w-full py-16 bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p>Belum ada produk yang kamu lihat terakhir ini.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}