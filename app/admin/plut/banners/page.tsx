"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function ManageBannersPage() {
  const supabase = createClient();
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // State untuk form
  const [altText, setAltText] = useState("");
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);

  const fetchBanners = async () => {
    const { data } = await supabase.from("plut_banners").select("*").order("id");
    setBanners(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileFile || !desktopFile) return alert("Pilih kedua gambar!");
    setUploading(true);

    try {
      const { data: mData } = await supabase.storage.from("plut-public").upload(`banners/${Date.now()}-m.jpg`, mobileFile);
      const { data: mUrl } = supabase.storage.from("plut-public").getPublicUrl(mData!.path);
      const { data: dData } = await supabase.storage.from("plut-public").upload(`banners/${Date.now()}-d.jpg`, desktopFile);
      const { data: dUrl } = supabase.storage.from("plut-public").getPublicUrl(dData!.path);

      await supabase.from("plut_banners").insert([{
        image_url_mobile: mUrl.publicUrl,
        image_url_desktop: dUrl.publicUrl,
        alt_text: altText
      }]);

      alert("Banner berhasil ditambah!");
      fetchBanners();
      setMobileFile(null); setDesktopFile(null); setAltText("");
    } catch (err) {
      console.error(err);
      alert("Gagal upload banner");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await supabase.from("plut_banners").delete().eq("id", id);
    fetchBanners();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kelola Banner Slideshow</h1>

      {/* Form Tambah Banner */}
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-xl border mb-8 space-y-4">
        <input type="text" placeholder="Alt Text (Contoh: Banner Pelatihan)" className="w-full p-2 border rounded" value={altText} onChange={(e) => setAltText(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold">Mobile (430x288)</label><input type="file" onChange={(e) => setMobileFile(e.target.files![0])} /></div>
          <div><label className="text-xs font-bold">Desktop (1920x500)</label><input type="file" onChange={(e) => setDesktopFile(e.target.files![0])} /></div>
        </div>
        <button disabled={uploading} className="bg-[#FF3C00] text-white px-6 py-2 rounded font-bold">
          {uploading ? "Mengunggah..." : "Tambah Banner"}
        </button>
      </form>

      {/* Daftar Banner */}
      <div className="grid grid-cols-1 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
            <div className="w-20 h-12 relative bg-gray-200"><Image src={b.image_url_desktop} alt="b" fill className="object-cover" /></div>
            <div className="flex-1 text-sm font-bold">{b.alt_text}</div>
            <button onClick={() => handleDelete(b.id)} className="text-red-500 font-bold text-sm">Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}