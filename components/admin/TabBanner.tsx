"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TabBanner() {
  const [banners, setBanners] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedFileDesktop, setSelectedFileDesktop] = useState<File | null>(null);
  const [selectedFileMobile, setSelectedFileMobile] = useState<File | null>(null);
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => { fetchData(); }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    const { data } = await supabase.from("banners").select("*").order("id", { ascending: false });
    if (data) setBanners(data);
  };

  const filteredBanners = banners.filter(b => 
    (b.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedFileDesktop(null);
    setSelectedFileMobile(null);
    setEditingItem({ title: "", image_url_desktop: "", image_url_mobile: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditMode(true);
    setSelectedFileDesktop(null);
    setSelectedFileMobile(null);
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDeleteData = async (id: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus banner ini?`)) return;
    try {
      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) throw error;
      fetchData();
      showToast(`Banner berhasil dihapus!`, "success");
    } catch (error: any) {
      showToast("Gagal menghapus: " + error.message, "error");
    }
  };

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalDesktopUrl = editingItem.image_url_desktop || "";
      let finalMobileUrl = editingItem.image_url_mobile || "";

      if (selectedFileDesktop) {
        const fileExt = selectedFileDesktop.name.split(".").pop();
        const fileName = `banner-desktop-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("image").upload(fileName, selectedFileDesktop);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("image").getPublicUrl(fileName);
        finalDesktopUrl = data.publicUrl;
      }

      if (selectedFileMobile) {
        const fileExt = selectedFileMobile.name.split(".").pop();
        const fileName = `banner-mobile-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("image").upload(fileName, selectedFileMobile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("image").getPublicUrl(fileName);
        finalMobileUrl = data.publicUrl;
      }

      const payload = { 
        title: editingItem.title, 
        image_url_desktop: finalDesktopUrl,
        image_url_mobile: finalMobileUrl
      };

      if (isEditMode) {
        const { error } = await supabase.from("banners").update(payload).eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("banners").insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchData();
      showToast(`Banner berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`, "success");
    } catch (error: any) {
      showToast("Gagal menyimpan: " + error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <h2 className="font-bold text-gray-800">Daftar Banner (Hero Section)</h2>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Cari judul banner..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm" />
          </div>
          <button onClick={openAddModal} className="bg-[#274a6a] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#1f3b54] transition-all font-medium whitespace-nowrap">+ Tambah Banner</button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Banner Desktop</th>
              <th className="p-4 font-medium hidden sm:table-cell">Banner Mobile</th>
              <th className="p-4 font-medium">Judul Banner</th>
              <th className="p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {filteredBanners.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  {b.image_url_desktop ? <img src={b.image_url_desktop} alt={b.title} className="w-32 h-12 object-cover rounded-md bg-gray-100 border shadow-sm" /> : <div className="w-32 h-12 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400 border border-dashed">No Desktop</div>}
                </td>
                <td className="p-4 hidden sm:table-cell">
                  {/* PERBAIKAN PREVIEW: w-24 h-12 untuk rasio landscape */}
                  {b.image_url_mobile ? <img src={b.image_url_mobile} alt={b.title} className="w-24 h-12 object-cover rounded-md bg-gray-100 border shadow-sm" /> : <div className="w-24 h-12 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400 border border-dashed text-center">No Mobile</div>}
                </td>
                <td className="p-4 font-medium text-gray-800">{b.title || "-"}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(b)} className="text-[#274a6a] hover:bg-blue-50 font-medium text-xs border border-[#274a6a]/20 px-3 py-1.5 rounded transition-colors">Edit</button>
                    <button onClick={() => handleDeleteData(b.id)} className="text-red-600 hover:bg-red-50 font-medium text-xs border border-red-200 px-3 py-1.5 rounded transition-colors">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBanners.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Banner tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-[#274a6a] text-lg">{isEditMode ? "Edit" : "Tambah"} Banner</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold text-xl">&times;</button>
            </div>
            <form onSubmit={handleSaveData} className="p-5 flex flex-col gap-5 overflow-y-auto max-h-[80vh]">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Judul/Deskripsi Banner</label><input type="text" value={editingItem.title || ""} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} placeholder="Misal: Promo Akhir Tahun" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none" required /></div>
              
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                <label className="block text-sm font-bold text-gray-700 mb-1">Versi Desktop (1920 x 500 px)</label>
                {isEditMode && editingItem.image_url_desktop && !selectedFileDesktop && <img src={editingItem.image_url_desktop} alt="Desktop Preview" className="w-full h-24 object-cover rounded-lg border border-gray-200 mb-3 shadow-sm bg-white" />}
                <input type="file" accept="image/*" onChange={(e) => e.target.files && setSelectedFileDesktop(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-[#274a6a]/10 file:text-[#274a6a]" required={!isEditMode && !editingItem.image_url_desktop} />
              </div>

              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                {/* PERBAIKAN: Label menyesuaikan ke arah landscape */}
                <label className="block text-sm font-bold text-gray-700 mb-1">Versi Mobile (Landscape, misal: 430 x 288 px)</label>
                {/* PERBAIKAN PREVIEW MODAL: Class diubah agar memanjang (w-full h-auto aspect-[430/288]) */}
                {isEditMode && editingItem.image_url_mobile && !selectedFileMobile && <img src={editingItem.image_url_mobile} alt="Mobile Preview" className="w-full sm:w-64 h-auto aspect-[430/288] object-cover rounded-lg border border-gray-200 mb-3 shadow-sm bg-white" />}
                <input type="file" accept="image/*" onChange={(e) => e.target.files && setSelectedFileMobile(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-[#274a6a]/10 file:text-[#274a6a]" required={!isEditMode && !editingItem.image_url_mobile} />
              </div>

              <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Batal</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#274a6a] hover:bg-[#1f3b54] rounded-lg transition-colors disabled:opacity-50">{isSaving ? "Menyimpan..." : "Simpan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white font-medium text-sm bg-gray-800"><span>{toast.message}</span></div>}
    </div>
  );
}