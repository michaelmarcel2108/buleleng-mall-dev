"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function TabProfileKoperasi() {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // State untuk Data
  const [about, setAbout] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [boxes, setBoxes] = useState<{ title: string; description: string }[]>([]);
  
  // State Sosial Media
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");

  const [bgUrl, setBgUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [bgFile, setBgFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const fetchProfileData = useCallback(async () => {
    const { data, error } = await supabase
      .from("koperasi_profile")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile data:", error);
    }

    return data;
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    fetchProfileData().then((data) => {
      if (isMounted) {
        if (data) {
          setAbout(data.about || "");
          setVision(data.vision || "");
          setMission(data.mission || "");
          setBoxes(data.extra_boxes || []);
          setInstagram(data.instagram_url || "");
          setTiktok(data.tiktok_url || "");
          setYoutube(data.youtube_url || "");
          setBgUrl(data.hero_bg_url || "");
          setLogoUrl(data.logo_url || "");
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fetchProfileData]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddBox = () => setBoxes([...boxes, { title: "", description: "" }]);

  const handleRemoveBox = (index: number) => {
    const newBoxes = [...boxes];
    newBoxes.splice(index, 1);
    setBoxes(newBoxes);
  };

  const handleBoxChange = (index: number, field: "title" | "description", value: string) => {
    const newBoxes = [...boxes];
    newBoxes[index][field] = value;
    setBoxes(newBoxes);
  };

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalBgUrl = bgUrl;
      let finalLogoUrl = logoUrl;

      // Proses Upload Background
      if (bgFile) {
        const fileExt = bgFile.name.split(".").pop();
        const fileName = `kop-bg-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("image")
          .upload(fileName, bgFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("image").getPublicUrl(fileName);
        finalBgUrl = data.publicUrl;
      }

      // Proses Upload Logo
      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop();
        const fileName = `kop-logo-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("image")
          .upload(fileName, logoFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("image").getPublicUrl(fileName);
        finalLogoUrl = data.publicUrl;
      }

      const payload = {
        id: 1,
        hero_bg_url: finalBgUrl,
        logo_url: finalLogoUrl,
        about,
        vision,
        mission,
        instagram_url: instagram,
        tiktok_url: tiktok,
        youtube_url: youtube,
        extra_boxes: boxes,
      };

      const { data: updatedData, error } = await supabase
        .from("koperasi_profile")
        .upsert(payload)
        .select();

      if (error) throw error;

      if (!updatedData || updatedData.length === 0) {
        throw new Error("Data gagal disimpan ke database. Mohon periksa RLS.");
      }

      setBgUrl(finalBgUrl);
      setLogoUrl(finalLogoUrl);
      setBgFile(null);
      setLogoFile(null);

      showToast("Profil Koperasi berhasil diperbarui!", "success");
    } catch (error: unknown) {
      const err = error as Error;
      showToast("Gagal menyimpan: " + err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <h2 className="font-bold text-gray-800">Manajemen Profil Koperasi</h2>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">Memuat data...</div>
      ) : (
        <form onSubmit={handleSaveData} className="p-4 md:p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Background Halaman (Hero)
              </label>
              <p className="text-xs text-gray-500 mb-3">Rekomendasi rasio landscape (1920x500).</p>
              {(bgUrl || bgFile) && (
                <Image
                  src={bgFile ? URL.createObjectURL(bgFile) : bgUrl}
                  alt="Background Preview"
                  width={800}
                  height={300}
                  unoptimized
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 mb-3 shadow-sm bg-white"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setBgFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-[#274a6a]/10 file:text-[#274a6a]"
              />
            </div>

            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Logo Koperasi (Bulat)
              </label>
              <p className="text-xs text-gray-500 mb-3">Disarankan rasio kotak 1:1 (500x500).</p>
              {(logoUrl || logoFile) && (
                <Image
                  src={logoFile ? URL.createObjectURL(logoFile) : logoUrl}
                  alt="Logo Preview"
                  width={96}
                  height={96}
                  unoptimized
                  className="w-24 h-24 object-cover rounded-full border-4 border-white mb-3 shadow-md bg-white mx-auto"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-[#274a6a]/10 file:text-[#274a6a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tentang Koperasi</label>
            <textarea
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tuliskan deskripsi utama tentang koperasi di sini..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Visi Koperasi</label>
              <textarea
                rows={4}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="Tuliskan Visi Koperasi..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Misi Koperasi</label>
              <textarea
                rows={4}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="Tuliskan Misi Koperasi..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none resize-none"
                required
              />
            </div>
          </div>

          {/* BAGIAN SOSIAL MEDIA BARU */}
          <div className="border border-gray-200 rounded-xl overflow-hidden p-4 bg-gray-50/50">
             <h3 className="font-bold text-gray-800 text-sm mb-4">Tautan Sosial Media (Opsional)</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Link Instagram</label>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Link TikTok</label>
                  <input
                    type="url"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="https://tiktok.com/@..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Link YouTube</label>
                  <input
                    type="url"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm"
                  />
                </div>
             </div>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Box Informasi Tambahan</h3>
                <p className="text-xs text-gray-500 mt-0.5">Opsi tambahan (misal: Nilai Inti, Tujuan, dll)</p>
              </div>
              <button
                type="button"
                onClick={handleAddBox}
                className="bg-[#274a6a]/10 text-[#274a6a] px-3 py-1.5 text-xs rounded-lg hover:bg-[#274a6a] hover:text-white transition-all font-medium whitespace-nowrap"
              >
                + Tambah Box
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4">
              {boxes.length === 0 ? (
                <p className="text-sm text-center text-gray-400 py-4">Belum ada box informasi tambahan.</p>
              ) : (
                boxes.map((box, index) => (
                  <div key={index} className="flex gap-4 items-start p-4 bg-white border border-gray-100 shadow-sm rounded-lg relative group">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Box</label>
                        <input
                          type="text"
                          value={box.title}
                          onChange={(e) => handleBoxChange(index, "title", e.target.value)}
                          placeholder="Misal: Tujuan Kami"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Box</label>
                        <textarea
                          rows={2}
                          value={box.description}
                          onChange={(e) => handleBoxChange(index, "description", e.target.value)}
                          placeholder="Isi penjelasan di sini..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm resize-none"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBox(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors mt-5"
                      title="Hapus Box"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#274a6a] hover:bg-[#1f3b54] rounded-lg transition-colors disabled:opacity-50 shadow-sm flex items-center gap-2"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan Profil"}
            </button>
          </div>
        </form>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white font-medium text-sm bg-gray-800">
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}