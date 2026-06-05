"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function PlutSettingsPage() {
  const [heroUrl, setHeroUrl] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();

  // Ambil data gambar saat ini dari database
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("plut_settings")
        .select("*")
        .eq("id", 1)
        .single();
      
      if (data) {
        setHeroUrl(data.hero_image_url || "");
        setProfileUrl(data.profile_image_url || "");
      }
    };
    fetchSettings();
  }, [supabase]);

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newHeroUrl = heroUrl;
      let newProfileUrl = profileUrl;

      // 1. Upload Hero Image jika ada file baru
      if (heroFile) {
        const ext = heroFile.name.split(".").pop();
        const fileName = `hero-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("plut-public")
          .upload(`settings/${fileName}`, heroFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from("plut-public").getPublicUrl(`settings/${fileName}`);
        newHeroUrl = data.publicUrl;
      }

      // 2. Upload Profile Image jika ada file baru
      if (profileFile) {
        const ext = profileFile.name.split(".").pop();
        const fileName = `profile-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("plut-public")
          .upload(`settings/${fileName}`, profileFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from("plut-public").getPublicUrl(`settings/${fileName}`);
        newProfileUrl = data.publicUrl;
      }

      // 3. Simpan URL baru ke database
      const { error: updateError } = await supabase
        .from("plut_settings")
        .update({
          hero_image_url: newHeroUrl,
          profile_image_url: newProfileUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", 1);

      if (updateError) throw updateError;

      alert("Gambar halaman PLUT berhasil diperbarui!");
      setHeroUrl(newHeroUrl);
      setProfileUrl(newProfileUrl);
      setHeroFile(null);
      setProfileFile(null);

    } catch (error: any) {
      console.error("Error:", error.message);
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Pengaturan Tampilan PLUT</h1>
          <p className="text-neutral-500 text-sm">Ubah gambar banner utama dan profil di halaman portal publik PLUT.</p>
        </div>
        <Link href="/admin/plut" className="text-sm font-bold text-neutral-500 hover:text-[#FF3C00] transition-colors">
          &larr; Kembali ke Dashboard
        </Link>
      </div>

      <form onSubmit={handleUploadAndSave} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
        
        {/* HERO IMAGE SETTING */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-4 border-b pb-2">Gambar Banner Atas (Hero)</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-bold text-neutral-700 mb-2">Upload Gambar Baru</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF3C00]"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="block text-sm font-bold text-neutral-700 mb-2">Gambar Saat Ini:</p>
              <div className="relative w-full aspect-[21/9] bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200 shadow-inner">
                {heroUrl ? (
                  <Image src={heroUrl} alt="Hero" fill className="object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-neutral-400 text-sm font-semibold">Belum ada banner</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE IMAGE SETTING */}
        <div className="pt-4">
          <h2 className="text-lg font-bold text-neutral-900 mb-4 border-b pb-2">Gambar Profil Instansi</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-bold text-neutral-700 mb-2">Upload Gambar Baru</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF3C00]"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="block text-sm font-bold text-neutral-700 mb-2">Gambar Saat Ini:</p>
              <div className="relative w-48 h-64 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200 shadow-inner">
                {profileUrl ? (
                  <Image src={profileUrl} alt="Profile" fill className="object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-neutral-400 text-sm font-semibold text-center px-4">Belum ada foto profil</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-100">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-4 rounded-xl text-white font-bold text-lg transition-all shadow-md ${
              loading ? "bg-neutral-400 cursor-not-allowed" : "bg-[#FF3C00] hover:bg-[#d63200] transform hover:-translate-y-1"
            }`}
          >
            {loading ? "Menyimpan Perubahan..." : "Simpan Semua Gambar"}
          </button>
        </div>
      </form>
    </div>
  );
}