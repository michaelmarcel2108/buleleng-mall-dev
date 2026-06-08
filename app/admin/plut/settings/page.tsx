"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

interface Banner {
  id: number;
  image_url_desktop: string;
  image_url_mobile: string;
  active: boolean;
}

export default function PlutSettingsPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  
  const supabase = createClient();

  // 1. Ambil list banner yang ada
  const fetchBanners = async () => {
    const { data } = await supabase
      .from("plut_banners")
      .select("*")
      .order("id", { ascending: true });
    if (data) setBanners(data);
  };

  useEffect(() => {
    fetchBanners();
  }, [supabase]);

  // 2. Tambah Banner Baru
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desktopFile || !mobileFile) return alert("Pilih gambar desktop & mobile!");
    setLoading(true);

    try {
      const timestamp = Date.now();
      
      // Upload Desktop
      const { data: dData } = await supabase.storage
        .from("plut-public")
        .upload(`banners/d-${timestamp}`, desktopFile);
      
      // Upload Mobile
      const { data: mData } = await supabase.storage
        .from("plut-public")
        .upload(`banners/m-${timestamp}`, mobileFile);

      const desktopUrl = supabase.storage.from("plut-public").getPublicUrl(dData!.path).data.publicUrl;
      const mobileUrl = supabase.storage.from("plut-public").getPublicUrl(mData!.path).data.publicUrl;

      await supabase.from("plut_banners").insert({
        image_url_desktop: desktopUrl,
        image_url_mobile: mobileUrl,
        active: true
      });

      alert("Banner berhasil ditambah!");
      setDesktopFile(null);
      setMobileFile(null);
      fetchBanners();
    } catch (err: any) {
      alert("Gagal upload: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Hapus Banner
  const handleDelete = async (id: number) => {
    if (!confirm("Hapus banner ini?")) return;
    await supabase.from("plut_banners").delete().eq("id", id);
    fetchBanners();
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Kelola Banner Slideshow</h1>
          <p className="text-neutral-500 text-sm">Tambahkan atau hapus slide untuk tampilan utama.</p>
        </div>
        <Link href="/admin/plut" className="text-sm font-bold text-neutral-500 hover:text-[#407d99] transition-colors">
          &larr; Kembali
        </Link>
      </div>

      {/* LIST BANNER AKTIF */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="relative aspect-[16/9] w-full bg-neutral-100 rounded-xl overflow-hidden mb-4">
              <Image src={banner.image_url_desktop} alt="Banner" fill className="object-cover" />
            </div>
            <button 
              onClick={() => handleDelete(banner.id)}
              className="w-full py-2 bg-red-50 text-red-600 font-bold rounded-lg text-sm hover:bg-red-100 transition-colors"
            >
              Hapus Banner
            </button>
          </div>
        ))}
      </div>

      {/* FORM TAMBAH BARU */}
      <form onSubmit={handleAddBanner} className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
        <h2 className="text-lg font-bold mb-6">Tambah Banner Baru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">Gambar Desktop (16:9)</label>
            <input type="file" onChange={(e) => setDesktopFile(e.target.files?.[0] || null)} className="w-full p-3 bg-neutral-50 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Gambar Mobile (9:16)</label>
            <input type="file" onChange={(e) => setMobileFile(e.target.files?.[0] || null)} className="w-full p-3 bg-neutral-50 border rounded-xl" />
          </div>
        </div>
        <button 
          disabled={loading}
          className="mt-6 w-full py-4 bg-[#407d99] text-white font-bold rounded-xl hover:bg-[#326278] transition-colors disabled:bg-neutral-400"
        >
          {loading ? "Mengunggah..." : "Tambah ke Slideshow"}
        </button>
      </form>
    </div>
  );
}