"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import TabToko from "@/components/admin/TabToko";
import TabProduk from "@/components/admin/TabProduk";
import TabKategori from "@/components/admin/TabKategori";
import TabBanner from "@/components/admin/TabBanner";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"toko" | "produk" | "kategori" | "banner">("toko");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { checkAuth(); }, [router]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) router.push("/admin/login");
    else setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleViewProducts = (businessName: string) => {
    setProductSearchQuery(businessName);
    setActiveTab("produk");
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-[#274a6a] font-medium">Memuat Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <header className="bg-[#274a6a] text-white px-6 md:px-12 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold font-display">Dashboard Admin</h1>
        <button onClick={handleLogout} className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">Keluar</button>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-12 py-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveTab("toko")} className={`pb-3 px-2 font-medium text-sm md:text-base transition-colors ${activeTab === "toko" ? "border-b-2 border-[#274a6a] text-[#274a6a]" : "text-gray-500 hover:text-gray-700"}`}>Kelola Toko</button>
          
          <button onClick={() => { setActiveTab("produk"); setProductSearchQuery(""); }} className={`pb-3 px-2 font-medium text-sm md:text-base transition-colors ${activeTab === "produk" ? "border-b-2 border-[#274a6a] text-[#274a6a]" : "text-gray-500 hover:text-gray-700"}`}>Kelola Produk</button>
          
          <button onClick={() => setActiveTab("kategori")} className={`pb-3 px-2 font-medium text-sm md:text-base transition-colors ${activeTab === "kategori" ? "border-b-2 border-[#274a6a] text-[#274a6a]" : "text-gray-500 hover:text-gray-700"}`}>Kelola Kategori</button>
          
          <button onClick={() => setActiveTab("banner")} className={`pb-3 px-2 font-medium text-sm md:text-base transition-colors ${activeTab === "banner" ? "border-b-2 border-[#274a6a] text-[#274a6a]" : "text-gray-500 hover:text-gray-700"}`}>Kelola Banner</button>
        </div>
        
        {activeTab === "toko" && <TabToko onViewProducts={handleViewProducts} />}
        {activeTab === "produk" && <TabProduk prefilledSearch={productSearchQuery} onSearchChange={setProductSearchQuery} />}
        {activeTab === "kategori" && <TabKategori />}
        {activeTab === "banner" && <TabBanner />}
      </main>
    </div>
  );
}